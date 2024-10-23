import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ActivitiesOverviewComponent } from "./activities/activities-overview/activities-overview.component";
import { ActivitiesCreateComponent } from "./activities/activities-create/activities-create.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ActivitiesOverviewComponent, ActivitiesCreateComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'prohodie-client';
}
