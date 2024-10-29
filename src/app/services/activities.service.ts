import { Injectable } from '@angular/core';
import { Activity } from '../models/activity';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  endPoint: string = "https://localhost:7173/api/activities";
  constructor(private http: HttpClient) {}

  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.endPoint);
  }

  postActivity(activity: Activity): Observable<Activity> {
    return this.http.post<Activity>(this.endPoint, activity);
  }

  updateActivity(activity: Activity) {
    return this.http.put<Activity>(this.endPoint, activity);
  }

  deleteActivity(id: number): any {
    this.http.delete(this.endPoint + "/" + id, {params: {id: id}});
  }
}
