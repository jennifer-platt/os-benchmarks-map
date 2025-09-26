import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFound } from './update-found';

describe('UpdateFound', () => {
  let component: UpdateFound;
  let fixture: ComponentFixture<UpdateFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateFound]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateFound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
