import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmiesListComponent } from './armies-list.component';

describe('ArmiesListComponent', () => {
  let component: ArmiesListComponent;
  let fixture: ComponentFixture<ArmiesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArmiesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArmiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
