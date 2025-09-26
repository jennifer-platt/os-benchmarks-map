import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenchmarkRecord } from './benchmark-record';

describe('BenchmarkRecord', () => {
  let component: BenchmarkRecord;
  let fixture: ComponentFixture<BenchmarkRecord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BenchmarkRecord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BenchmarkRecord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
