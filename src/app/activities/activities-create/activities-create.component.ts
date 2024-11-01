import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivitiesService } from '../../services/activities.service';
import { Activity } from '../../models/activity';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapPauseCircle, bootstrapPlayCircle } from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'app-activities-create',
  standalone: true,
  imports: [ReactiveFormsModule, NgIconComponent],
  templateUrl: './activities-create.component.html',
  styleUrl: './activities-create.component.css',
  providers: [provideIcons({bootstrapPlayCircle, bootstrapPauseCircle})]
})
export class ActivitiesCreateComponent implements OnInit {
  timeInterval: any;
  timePassed: string = "00:00:00";
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
    console.log("activityStarted: " + this.activityStarted);
    this.activityStarted = !this.activityStarted;
    
    if (this.activityStarted) {
      this.postActivity();
      this.updateTimer();
      this.statusIconClass = "bootstrapPlayCircle";
    } else {
      clearInterval(this.timeInterval);
      this.updateActivity();
      this.seconds = 0;
      this.timePassed = "00:00:00";
      this.statusIconClass = "bootstrapPauseCircle";
    }
    console.log("activityStarted: " + this.activityStarted);
    console.log("statusIconClass: " + this.statusIconClass);
  }

  updateTimer() {
    console.log("updateTimer(): " + this.seconds);
    this.timeInterval = setInterval(() => {
      this.seconds++;

      let seconds = Math.round(this.seconds % 60);
      let minutes = Math.floor((this.seconds / 60) % 60);
      let hours = Math.floor(this.seconds / (60 * 60));

      let secondsDisplay = seconds < 10 ? `0${seconds}` : `${seconds}`;
      let minutesDisplay = minutes < 10 ? `0${minutes}` : `${minutes}`;
      let hoursDisplay = hours < 10 ? `0${hours}` : `${hours}`;
          
      this.timePassed = `${hoursDisplay.toString()}:${minutesDisplay.toString()}:${secondsDisplay}`;
      console.log("updateTimer(): " + this.seconds);
    }, 1000);
  }

  postActivity() {
    console.log("postActivity");
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
          this.currentActivity = data;
          this.activityStarted = false;
        },
        error: (err) => {console.log(err)}
      });
    }
  }

  updateActivity() {
    console.log("updateActivity");
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
          console.log(data);
          this.activityForm.setValue({
            name: '',
            activityCategoryId: 0,
            startTime: new Date,
            endTime: null
          });
          this.activityStarted = false;
          this.statusIconClass = "bootstrapPauseCircle";
        },
        error: (err) => {console.log(err)}
      });
    }
  }
}
