import { Component, signal } from '@angular/core';
import { MapComponent } from './map/map'

@Component({
  selector: 'app-root',
  imports: [MapComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('os-benchmarks-map');
}
