import { Component, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivitiesService } from '../../services/activities.service';
import { Activity } from '../../models/activity';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapPauseCircle, bootstrapPlayCircle } from '@ng-icons/bootstrap-icons';
import { TimeSpanPipe } from "../../pipes/time-span.pipe";

@Component({
  selector: 'app-activities-create',
  standalone: true,
  imports: [ReactiveFormsModule, NgIconComponent, TimeSpanPipe],
  templateUrl: './activities-create.component.html',
  styleUrl: './activities-create.component.css',
  providers: [provideIcons({bootstrapPlayCircle, bootstrapPauseCircle})]
})
export class ActivitiesCreateComponent implements OnInit {
  timeInterval: any;
  seconds: number = 0;
  
  currentActivity: Activity | null = null;
  activityStarted: boolean = false;
  statusIconClass: string = this.activityStarted ? "bootstrapPauseCircle" : "bootstrapPlayCircle";
  activityForm = new FormGroup({
    name: new FormControl(''),
    activityCategoryId: new FormControl(0),
    startTime: new FormControl(new Date),
    endTime: new FormControl()
  });
  
  onActivityUpdated = output<Activity>();

  constructor(private dataSvc: ActivitiesService) {}

  ngOnInit() {
    this.getOngoingActivity();
  }

  getOngoingActivity() {
    console.log("getOngoingActivity()");
    this.dataSvc.getOngoingActivity().subscribe({
      next: (data) => {
        if(data != null) {
          this.currentActivity = data;
          this.activityForm.setValue({
            name: this.currentActivity.name,
            activityCategoryId: this.currentActivity.activityCategoryId,
            startTime: this.currentActivity.startTime,
            endTime: this.currentActivity.endTime,
          });
          this.seconds = new Date(this.currentActivity!.startTime).getSeconds() + new Date().getSeconds();
          this.activityStarted = true;
          this.statusIconClass = "bootstrapPauseCircle";
          console.log("activityStarted: " + this.activityStarted);
          console.log("statusIconClass: " + this.statusIconClass);
          this.updateTimer();
        }},
      error: (err) => { console.log(err) }
    });
  }

  toggleActivity() {
    console.log("toggleActivity()");
    this.activityStarted = !this.activityStarted;
    console.log("activityStarted: " + this.activityStarted);
    
    if (this.activityStarted) {
      this.postActivity();
      this.updateTimer();
      this.statusIconClass = "bootstrapPauseCircle";
    } else {
      clearInterval(this.timeInterval);
      this.updateActivity();
      this.seconds = 0;
      this.statusIconClass = "bootstrapPlayCircle";
    }
    console.log("activityStarted: " + this.activityStarted);
    console.log("statusIconClass: " + this.statusIconClass);
  }

  updateTimer() {
    this.timeInterval = setInterval(() => {
      this.seconds++;
    }, 1000);
  }

  postActivity() {
    console.log("Posting activity...");
    if (this.activityForm.valid) {
      this.currentActivity = {
        id: 0,
        name: this.activityForm.value.name ?? '',
        activityCategoryId: this.activityForm.value.activityCategoryId  ?? 0,
        startTime: this.activityForm.value.startTime ?? new Date,
        endTime: this.activityForm.value.endTime ?? null
      };

      this.dataSvc.postActivity(this.currentActivity).subscribe({
        next: (data) => {
          console.log("Post successful!");
          this.currentActivity = data;
        },
        error: (err) => {console.log(err)}
      });
    }
  }

  updateActivity() {
    console.log("Updating activity...");
    if (this.activityForm.valid) {
      const startTime = new Date().getDate();
      console.log(this.currentActivity);
      
      const endTime = new Date();
      
      let activity: Activity = {
        id: this.currentActivity!.id,
        name: this.activityForm.value.name ?? '',
        activityCategoryId: this.activityForm.value.activityCategoryId  ?? 0,
        startTime: this.activityForm.value.startTime ?? new Date,
        endTime: endTime
      }
      
      this.dataSvc.updateActivity(activity.id, activity).subscribe({
        next: (data) => {
          console.log("Update successful!");
          this.activityForm.setValue({
            name: '',
            activityCategoryId: 0,
            startTime: new Date,
            endTime: null
          });
          this.activityStarted = false;
          this.onActivityUpdated.emit(activity);
        },
        error: (err) => {console.log(err)}
      });
    }
  }
}
