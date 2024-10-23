import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivitiesService } from '../../services/activities.service';
import { Activity } from '../../models/activity';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapPauseCircle, bootstrapPlayCircle } from '@ng-icons/bootstrap-icons';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';

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
  seconds: number = 3585;
  
  currentActivity: Activity | null = null;
  activityStarted: boolean = false;
  statusIconClass: string = this.activityStarted ? "bootstrapPlayCircle" : "bootstrapPauseCircle";
  activityForm = new FormGroup({
    name: new FormControl(''),
    activityCategoryId: new FormControl(0),
    startDate: new FormControl(new Date),
    endDate: new FormControl(new Date)
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
        //3780 % (600) / 60
        this.seconds++;

        let seconds = Math.round(this.seconds % 60);
        let minutes = Math.floor((this.seconds / 60) % 60);
        let hours = Math.floor(this.seconds / (60 * 60));
        console.log("seconds: " + seconds);
        console.log("minutes: " + minutes);
        console.log("hours: " + hours);

        let secondsa = seconds < 10 ? `0${seconds}` : `${seconds}`;
        let minutesa = minutes < 10 ? `0${minutes}` : `${minutes}`;
        let hoursa = hours < 10 ? `0${hours}` : `${hours}`;
          
        this.timePassed = `${hoursa.toString()}:${minutesa.toString()}:${secondsa}`;
        console.log("updateTimer(): " + this.seconds);
      }, 1000);

    } else {
      this.seconds = 0;
      this.timePassed = "00:00:00";
      clearInterval(this.timeInterval);
      this.updateActivity();
    }
  }

  async postActivity() {
    console.log("postActivity");
    if (this.activityForm.valid) {
      this.currentActivity = {
        id: 0,
        name: this.activityForm.value.name ?? '',
        activityCategoryId: this.activityForm.value.activityCategoryId  ?? 0,
        startTime: this.activityForm.value.startDate ?? new Date,
        endTime: this.activityForm.value.endDate ?? new Date
      };

      const request = new Request("https://localhost:7173/api/activities", {
        method: "POST",
        body: JSON.stringify({
          id: this.currentActivity.id,
          name: this.currentActivity.name,
          startTime: this.currentActivity.startTime,
          endTime: this.currentActivity.endTime
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      // await this.dataSvc.postActivity(request);
      await this.dataSvc.postActivity(request)
      .then((response) => {
        var x = response.json().then((r) => {
          console.log(r);
          this.currentActivity!.id = r.id
        });
      })
    }
  }

  async updateActivity() {
    console.log("updateActivity");
    if (this.activityForm.valid) {
      const startTime = new Date().getDate();
      console.log(this.currentActivity);
      
      const endTime = new Date(this.activityForm.value.startDate!.setSeconds(this.seconds));
      console.log("endTime: " + endTime);
      let activity: Activity = {
        id: this.currentActivity!.id,
        name: this.activityForm.value.name ?? '',
        activityCategoryId: this.activityForm.value.activityCategoryId  ?? 0,
        startTime: this.activityForm.value.startDate ?? new Date,
        // endTime: this.activityForm.value.endDate ?? new Date
        endTime: endTime!
      }
      console.log(activity);

      const request = new Request("https://localhost:7173/api/activities/" + activity.id, {
        method: "PUT",
        body: JSON.stringify({
          id: activity.id,
          name: activity.name,
          startTime: activity.startTime,
          endTime: activity.endTime
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
    }
  }
}
