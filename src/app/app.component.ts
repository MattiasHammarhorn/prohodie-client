import { Component, HostListener, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginFormComponent } from "./auth/login-form/login-form.component";
import { ActivitiesOverviewComponent } from "./activities/activities-overview/activities-overview.component";
import { ActivitiesCreateComponent } from "./activities/activities-create/activities-create.component";
import { Activity } from './models/activity';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginFormComponent, ActivitiesOverviewComponent, ActivitiesCreateComponent],
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
    this.focusSubject.next(event);
  }

  logValue(event: Activity) {
    this.currentItem = event;
    this.clickSubject.next(this.currentItem);
  }
}
