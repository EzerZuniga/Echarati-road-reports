import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgIconsModule } from '@ng-icons/core';
import {
  heroBoltSolid,
  heroChartBarSquareSolid,
  heroMegaphoneSolid,
  heroShieldCheckSolid,
  heroSparklesSolid,
  heroUserGroupSolid,
} from '@ng-icons/heroicons/solid';
import { LandingComponent } from './landing.component';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgIconsModule.withIcons({
          heroBoltSolid,
          heroChartBarSquareSolid,
          heroMegaphoneSolid,
          heroShieldCheckSolid,
          heroSparklesSolid,
          heroUserGroupSolid,
        }),
      ],
      declarations: [LandingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
