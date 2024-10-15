import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor() {}

  async getActivities() {
    return await fetch("https://localhost:7173/api/activities");
  }

  async postActivity(request: Request) {
    return await fetch(request);
  }
}
