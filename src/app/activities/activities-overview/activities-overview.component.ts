import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Activity } from '../../models/activity';
import { ActivitiesService } from '../../services/activities.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapTrashFill } from '@ng-icons/bootstrap-icons';
import { Subject } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormControlName, FormGroup, FormGroupName, ReactiveFormsModule } from '@angular/forms';
import { TimeSpanPipe } from "../../pipes/time-span.pipe";

@Component({
  selector: 'app-activities-overview',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent, TimeSpanPipe],
  templateUrl: './activities-overview.component.html',
  styleUrl: './activities-overview.component.css',
  providers: [provideIcons({bootstrapTrashFill})]
})
export class ActivitiesOverviewComponent implements OnInit {
  @Input() newItem: Activity | null = null;
  @Input('clickSubject') clickSubject!: Subject<any>;

  activities: Activity[] = [];
  activityForm: FormGroup = new FormGroup({});

  constructor(private dataSvc: ActivitiesService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initActivities();
    this.clickSubject.subscribe(e => {
      this.updateActivities(e);
    });

    this.activityForm = this.formBuilder.group({
      activityArray: this.formBuilder.array([])
    });
  }

  get activityArrayControls(): FormArray {
    return this.activityForm.controls['activityArray'] as FormArray;
  }

  initActivities() {
      this.dataSvc.getActivities().subscribe({
      next: (data) => {
        let activityArray = this.activityArrayControls;

        data.forEach( (activity) => {
          if(activity.endTime != null) {
            var timeSpan = (new Date(activity.endTime).getTime() - new Date(activity.startTime).getTime()) / 1000;
            
            let formActivities = this.formBuilder.group({
              id: new FormControl(activity.id),
              name: new FormControl(activity.name!),
              activityCategoryId: new FormControl(activity.activityCategoryId),
              startTime: new FormControl(new Date(activity.startTime)),
              endTime: new FormControl(new Date(activity.endTime) ?? null),
              timeSpan: new FormControl(timeSpan)
            })
            activityArray.push(formActivities);
          }
          this.activities.push(activity);
        });
      },
      error: (err) => { console.log(err) }
    });
  }

  deleteActivity(index: number): any {
    let formGroup = this.activityArrayControls.controls.at(index);
    if (formGroup !== undefined) {
      let activityId = formGroup.get('id')?.value;
      if (activityId !== undefined || activityId !==null) {
        this.dataSvc.deleteActivity(activityId).subscribe({
          next: () => {
            this.activityArrayControls.removeAt(index);
          },
          error: (err: any) => {
            console.log(err);
          }
        });
        this.initActivities();
      }
    }
  }

  updateActivities(activity: Activity) {
    let formGroup = this.formBuilder.group({
      id: activity.id,
      startTime: activity.startTime,
      endTime: activity.endTime,
      name: activity.name,
      timeSpan: (new Date(activity.endTime!).getTime() - new Date(activity.startTime).getTime()) / 1000
    });
    this.activityArrayControls.insert(0,formGroup);
  }

  onBlur(index: any) {
    let activityForm = this.activityArrayControls.controls.at(index);
    if (activityForm !== undefined) {
      if(activityForm.valid) {
        var patchDoc = [];
        
        var activityId = activityForm.get('id')!.getRawValue();

        if (activityForm.get('name')!.dirty)
          patchDoc.push({ op: "replace", path: "/name", value: activityForm.get('name')!.value });

        if (activityForm.get('startTime')!.dirty) {
          var startTime = new Date(activityForm.get('startTime')!.value);
          patchDoc.push({ op: "replace", path: "/startTime", value: startTime });
        }
        if (activityForm.get('endTime')!.dirty) {
          var endTime = new Date(activityForm.get('endTime')!.value);
          patchDoc.push({ op: "replace", path: "/endTime", value: endTime });
        }

        if (activityForm.get('activityCategoryId')!.dirty)
          patchDoc.push({ op: "replace", path: "/activityCategoryId", value: new Date(activityForm.get('activityCategoryId')!.value) });
        
        this.updateActivity(activityId, patchDoc);
      }
    }
  }

  updateActivity(id: number, patchDoc: any) {
    console.log("Updating activity from ActivityOverview...");
    this.dataSvc.patchActivity(id, patchDoc).subscribe({
      next: (data) => {
        console.log("Activity successfully updated from ActivityOverview!");
        console.log(data);
      },
      error: (err) => { console.log() }
    })
  }
}
