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
