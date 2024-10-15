import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { Activity } from '../../models/activity';
import { ActivitiesService } from '../../services/activities.service';

@Component({
  selector: 'app-activities-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activities-overview.component.html',
  styleUrl: './activities-overview.component.css'
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
}
