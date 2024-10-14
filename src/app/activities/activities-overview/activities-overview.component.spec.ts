import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesOverviewComponent } from './activities-overview.component';

describe('ActivitiesOverviewComponent', () => {
  let component: ActivitiesOverviewComponent;
  let fixture: ComponentFixture<ActivitiesOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitiesOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivitiesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
