import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewSugGroupComponent } from './preview-sug-group.component';

describe('PreviewSugGroupComponent', () => {
  let component: PreviewSugGroupComponent;
  let fixture: ComponentFixture<PreviewSugGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewSugGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewSugGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
