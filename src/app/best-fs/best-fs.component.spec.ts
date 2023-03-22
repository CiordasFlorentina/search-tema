import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestFsComponent } from './best-fs.component';

describe('BestFsComponent', () => {
  let component: BestFsComponent;
  let fixture: ComponentFixture<BestFsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BestFsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BestFsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
