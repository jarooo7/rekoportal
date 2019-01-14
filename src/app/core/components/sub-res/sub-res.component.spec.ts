import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubResComponent } from './sub-res.component';

describe('SubResComponent', () => {
  let component: SubResComponent;
  let fixture: ComponentFixture<SubResComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubResComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubResComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
