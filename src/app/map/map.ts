import { Component } from '@angular/core';
import * as L from 'leaflet';
import { BenchmarkService, Benchmark } from '../benchmark-service'
import { ComponentFactoryResolver, Injector, ApplicationRef } from '@angular/core';
import { BenchmarkRecord } from '../benchmark-record/benchmark-record';

@Component({
  selector: 'app-map',
  templateUrl: './map.html',
  styleUrls: ['./map.scss']
})
export class MapComponent {
  private map: L.Map | any;
  benchmarks: Benchmark[] = [];
  defaultZoomLevel = 15;

  counters: Record<string, number> = {
    not_found: 0,
    found: 0,
    lost: 0,
    inaccessible: 0
  };

  toBeFoundCount = 0;
  foundCount = 0;
  lostCount = 0;
  inaccessibleCount = 0;

  constructor (
      private benchmarkService: BenchmarkService,
        private resolver: ComponentFactoryResolver,
        private injector: Injector,
        private appRef: ApplicationRef
    ) {}

  private initMap(): void {

    this.map = L.map('map').setView([53.96201, -1.08368], this.defaultZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  }

  ngOnInit() {

    this.benchmarkService.getBenchmarks().subscribe(data => {
      this.benchmarks = data;
      this.initMap();

      for (const benchmark of this.benchmarks) {
        let icon = this.determineIcon(benchmark.status);
        if (benchmark.status in this.counters) {
          this.counters[benchmark.status]++;
        }
        const marker = L.marker([benchmark.lat, benchmark.lon], { icon: icon }).addTo(this.map).bindPopup(fl => this.createPopupComponentWithMessage(
          benchmark
        ));

        marker.on('click', () => {
          const latLng = marker.getLatLng();

          const zoom = this.map.getZoom(); // Get current zoom level
          const baseOffset = 0.0025;  // Offset at default zoom level

          // Scale offset: halve it for each zoom level above default
          const scaledOffset = baseOffset * Math.pow(0.5, zoom - this.defaultZoomLevel);
          const offsetLatLng = L.latLng(latLng.lat + scaledOffset, latLng.lng);
          this.map.setView(offsetLatLng, zoom);
        });

      }

      this.addLegend();

    });
  }

  determineIcon(status: string) {
    switch (status) {
      case 'found':
        return MapIcon.setIcon('green');
      case 'lost':
        return MapIcon.setIcon('black');
      case 'inaccessible':
        return MapIcon.setIcon('orange');
      default:
        return MapIcon.setIcon('red');
    }
  }

  addLegend(): void {
    const legend = new L.Control({ position: 'bottomleft' });

    legend.onAdd = (map: L.Map) => {
      let div = L.DomUtil.create('div', 'info legend');
      div.innerHTML += '<center><b>Key</b></center><br/>';

      div.innerHTML += `
        <img src="${MapIcon.setIcon('red').options.iconUrl}" style="vertical-align: middle; width: 25px; height: 41px; padding:5px" />
        <span>To be found: <b>${this.counters["not_found"]}</b></span><br/>
      `;

      div.innerHTML += `
        <img src="${MapIcon.setIcon('green').options.iconUrl}" style="vertical-align: middle; width: 25px; height: 41px; padding:5px" />
        <span>Found: <b>${this.counters["found"]}</b></span><br/>
      `;

      div.innerHTML += `
        <img src="${MapIcon.setIcon('black').options.iconUrl}" style="vertical-align: middle; width: 25px; height: 41px; padding:5px" />
        <span>Lost: <b>${this.counters["lost"]}</b></span><br/>
      `;

      div.innerHTML += `
        <img src="${MapIcon.setIcon('orange').options.iconUrl}" style="vertical-align: middle; width: 25px; height: 41px; padding:5px" />
        <span>Inaccessible: <b>${this.counters["inaccessible"]}</b></span><br/>
      `;

     return div;
    };

    legend.addTo(this.map);
  }

  createPopupComponentWithMessage(benchmark: Benchmark): HTMLElement {
    const factory = this.resolver.resolveComponentFactory(BenchmarkRecord);
    const componentRef = factory.create(this.injector);

    componentRef.setInput('description', benchmark.description);
    componentRef.setInput('type', benchmark.markType);
    componentRef.setInput('status', benchmark.status);
    componentRef.setInput('dateFound', benchmark.dateFound)
    componentRef.setInput('heightAboveGround', benchmark.heightAboveGround);
    componentRef.setInput('imageFilename', benchmark.imageFilename);
    componentRef.setInput('comments', benchmark.comments);

    const year = benchmark.levellingYear ? benchmark.levellingYear : benchmark.verifiedYear
    componentRef.setInput('year', year);

    this.appRef.attachView(componentRef.hostView);
    const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;

    // Clean up when popup closes
    domElem.addEventListener('closed', () => {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    });

    return domElem;
  }

}

export class MapIcon {
  static setIcon(colour: string): L.Icon {
    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${colour}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }
}

