import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringProfilesComponent } from './hiring-profiles.component';

describe('HiringProfilesComponent', () => {
  let component: HiringProfilesComponent;
  let fixture: ComponentFixture<HiringProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiringProfilesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HiringProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
