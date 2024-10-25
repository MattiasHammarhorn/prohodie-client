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

  async initActivities() {
    try {
      const response = await this.dataSvc.getActivities();
      this.activities = await response.json();
      console.log(await response.json());
    } catch (error) {
      console.log(error);
    }
  }

  async deleteActivity(id: number) {
    try {
      const request = new Request("https://localhost:7173/api/activities/" + id, {
        method: "DELETE",
        body: JSON.stringify({
          'id': id
        }),
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await this.dataSvc.deleteActivity(request);
      console.log(response.json());
    } catch (error) {
      console.log(error);
    }
  }
}
