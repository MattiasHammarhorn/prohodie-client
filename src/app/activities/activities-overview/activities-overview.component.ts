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

  constructor(private dataSvc: ActivitiesService) {}

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

  deleteActivity(id: number): any {
    this.dataSvc.deleteActivity(id).subscribe({
      next: () => {
        var activityIndex = this.activities.findIndex(activity => activity.id == id);
        this.activities.splice(activityIndex, 1);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
    this.initActivities();
  }

  updateActivities(activity: Activity) {
    activity.timeSpan = (new Date(activity.endTime!).getTime() - new Date(activity.startTime).getTime()) / 1000;
    this.activities.unshift(activity);
  }
}
