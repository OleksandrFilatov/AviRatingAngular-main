import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPostComponent } from './customer-post.component';

describe('CustomerPostComponent', () => {
  let component: CustomerPostComponent;
  let fixture: ComponentFixture<CustomerPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
