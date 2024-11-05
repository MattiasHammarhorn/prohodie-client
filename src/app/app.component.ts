import { Component, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ActivitiesOverviewComponent } from "./activities/activities-overview/activities-overview.component";
import { ActivitiesCreateComponent } from "./activities/activities-create/activities-create.component";
import { Activity } from './models/activity';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ActivitiesOverviewComponent, ActivitiesCreateComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @Output() currentItem: Activity | null = null;
  clickSubject:Subject<any> = new Subject();
  title = 'prohodie-client';

  logValue($event: Activity) {
    console.log("logValue fired from app-component with value:");
    console.log($event);
    this.currentItem = $event;
    this.clickSubject.next(this.currentItem);
  }
}
