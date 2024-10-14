import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor() {}

  async GetActivities() {
    return await fetch("https://localhost:7173/api/activities");
  }
}
