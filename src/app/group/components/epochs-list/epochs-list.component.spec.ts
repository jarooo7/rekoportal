import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpochsListComponent } from './epochs-list.component';

describe('EpochsListComponent', () => {
  let component: EpochsListComponent;
  let fixture: ComponentFixture<EpochsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpochsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpochsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
