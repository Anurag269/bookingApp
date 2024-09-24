import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainModelComponent } from './main-model.component';

describe('MainModelComponent', () => {
  let component: MainModelComponent;
  let fixture: ComponentFixture<MainModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainModelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
