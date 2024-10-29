import { Component } from '@angular/core';
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
export class ActivitiesCreateComponent {
  timeInterval: any;
  timePassed: string = "00:00:00";
  seconds: number = 0;
  
  currentActivity: Activity | null = null;
  activityStarted: boolean = false;
  statusIconClass: string = this.activityStarted ? "bootstrapPlayCircle" : "bootstrapPauseCircle";
  activityForm = new FormGroup({
    name: new FormControl(''),
    activityCategoryId: new FormControl(0),
    startDate: new FormControl(new Date),
    endDate: new FormControl()
  });

  constructor(private dataSvc: ActivitiesService) {}

  toggleActivity() {
    console.log("activityStarted: " + this.activityStarted);
    console.log("statusIconClass: " + this.statusIconClass);
    this.activityStarted = !this.activityStarted;
    
    if (this.activityStarted) {
      this.postActivity();
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

    } else {
      clearInterval(this.timeInterval);
      this.updateActivity();
      this.seconds = 0;
      this.timePassed = "00:00:00";
    }
  }

  postActivity() {
    console.log("postActivity");
    if (this.activityForm.valid) {
      this.currentActivity = {
        id: 0,
        name: this.activityForm.value.name ?? '',
        activityCategoryId: this.activityForm.value.activityCategoryId  ?? 0,
        startTime: this.activityForm.value.startDate ?? new Date,
        endTime: this.activityForm.value.endDate ?? null
      };

      this.dataSvc.postActivity(this.currentActivity).subscribe({
        next: (data) => {this.currentActivity = data},
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
        startTime: this.activityForm.value.startDate ?? new Date,
        endTime: endTime
      }
      
      this.dataSvc.updateActivity(activity).subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (err) => {console.log(err)}
      });
    }
  }
}
