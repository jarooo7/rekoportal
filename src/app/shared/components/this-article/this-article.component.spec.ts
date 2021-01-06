import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThisArticleComponent } from './this-article.component';

describe('ThisArticleComponent', () => {
  let component: ThisArticleComponent;
  let fixture: ComponentFixture<ThisArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThisArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThisArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
