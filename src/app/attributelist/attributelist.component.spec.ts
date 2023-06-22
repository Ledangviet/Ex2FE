import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributelistComponent } from './attributelist.component';

describe('AttributelistComponent', () => {
  let component: AttributelistComponent;
  let fixture: ComponentFixture<AttributelistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttributelistComponent]
    });
    fixture = TestBed.createComponent(AttributelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
