import { Component, HostListener, Output } from '@angular/core';
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
  focusSubject:Subject<any> = new Subject();
  title = 'prohodie-client';
  
  @HostListener('window:focus', ['$event'])
  onFocus(event: FocusEvent): any {
    console.log("focus:");
    console.log(event);
    this.focusSubject.next(event);
    // this.focusSubject.next(@event);
  }

  logValue($event: Activity) {
    console.log("logValue fired from app-component with value:");
    console.log($event);
    this.currentItem = $event;
    this.clickSubject.next(this.currentItem);
  }
}
