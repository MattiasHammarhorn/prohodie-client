import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Activity } from '../../models/activity';
import { ActivitiesService } from '../../services/activities.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapTrashFill } from '@ng-icons/bootstrap-icons';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-activities-overview',
  standalone: true,
  imports: [CommonModule,NgIconComponent],
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
      console.log("clickSubject.subscribe");
      console.log(e);
      this.updateActivities(e);
    });
  }

  initActivities() {
    this.dataSvc.getActivities().subscribe({
      next: (data) => {
        console.log(data);
        this.activities = data;
        data.forEach( (activity) => {
          if(activity.endTime != null) {
            console.log("startTime: " + new Date(activity.startTime).getTime());
            console.log("endTime: " + new Date(activity.endTime).getTime());
            let totalTimeSpan = (new Date(activity.endTime).getTime() - new Date(activity.startTime).getTime()) / 1000;
            console.log(totalTimeSpan);
            
            let seconds = Math.round(totalTimeSpan % 60);
            let minutes = Math.floor((totalTimeSpan / 60) % 60);
            let hours = Math.floor(totalTimeSpan / (60 * 60));

            let secondsDisplay = seconds < 10 ? `0${seconds}` : `${seconds}`;
            let minutesDisplay = minutes < 10 ? `0${minutes}` : `${minutes}`;
            let hoursDisplay = hours < 10 ? `0${hours}` : `${hours}`;

            activity.timeSpan = `${hoursDisplay}:${minutesDisplay}:${secondsDisplay}`;
          }
          this.activities.push(activity);
          console.log(this.activities);
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
        alert(err);
      }
    });
    this.initActivities();
  }

  updateActivities(activity: Activity) {
    console.log("updateActivities called!");
    this.activities.unshift(activity);
    console.log(this.activities);
  }
}
