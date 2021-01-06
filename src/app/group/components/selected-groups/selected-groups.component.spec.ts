import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedGroupsComponent } from './selected-groups.component';

describe('SelectedGroupsComponent', () => {
  let component: SelectedGroupsComponent;
  let fixture: ComponentFixture<SelectedGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
