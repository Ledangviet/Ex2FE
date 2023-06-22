import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeinfoComponent } from './nodeinfo.component';

describe('NodeinfoComponent', () => {
  let component: NodeinfoComponent;
  let fixture: ComponentFixture<NodeinfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NodeinfoComponent]
    });
    fixture = TestBed.createComponent(NodeinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
