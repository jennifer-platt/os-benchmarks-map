import { Component, Input, ViewContainerRef } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { UpdateFound } from '../update-found/update-found';

@Component({
  selector: 'app-benchmark-record',
  imports: [MatButtonModule],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  templateUrl: './benchmark-record.html',
  styleUrl: './benchmark-record.scss'
})
export class BenchmarkRecord {
  @Input() description!: string;
  @Input() type!: string;
  @Input() status!: string;
  @Input() year!: string;
  @Input() imageFilename!: string;
  @Input() dateFound!: string;
  @Input() heightAboveGround!: string;
  @Input() comments!: string;

  isOpen = false;

  constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef) {}

  openOverlay() {
    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      positionStrategy: this.overlay.position()
        .global()
        .centerHorizontally()
        .centerVertically()
    });

    overlayRef.attach(new ComponentPortal(UpdateFound, this.viewContainerRef));

    overlayRef.backdropClick().subscribe(() => overlayRef.dispose());
  }


//   ngOnChanges(changes: SimpleChanges) {
//     // Optional: respond to input changes
//   }
}
