import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SugGroupsListComponent } from './sug-groups-list.component';

describe('SugGroupsListComponent', () => {
  let component: SugGroupsListComponent;
  let fixture: ComponentFixture<SugGroupsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SugGroupsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SugGroupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
