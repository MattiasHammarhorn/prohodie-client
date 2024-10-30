import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { Activity } from '../../models/activity';
import { ActivitiesService } from '../../services/activities.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapTrashFill } from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'app-activities-overview',
  standalone: true,
  imports: [CommonModule,NgIconComponent],
  templateUrl: './activities-overview.component.html',
  styleUrl: './activities-overview.component.css',
  providers: [provideIcons({bootstrapTrashFill})]
})
export class ActivitiesOverviewComponent implements OnInit {
  activities: Activity[] = [];

  constructor(private dataSvc: ActivitiesService) {}

  ngOnInit() {
    this.initActivities();
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
}
