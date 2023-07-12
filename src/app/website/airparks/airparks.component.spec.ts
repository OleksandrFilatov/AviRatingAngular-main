import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AirparksComponent } from './airparks.component';

describe('AirparksComponent', () => {
  let component: AirparksComponent;
  let fixture: ComponentFixture<AirparksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirparksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirparksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
