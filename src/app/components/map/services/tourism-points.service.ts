import { Injectable } from '@angular/core';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Style, Icon } from 'ol/style';
import Overlay from 'ol/Overlay';
import Map from 'ol/Map';

import { TourismDataService } from '../../../core/services/tourism-data.service';
import { TourismPoint } from '../../../core/interfaces/tourism.interface';
  
@Injectable({
  providedIn: 'root'
})
export class TourismPointsLayerService {
  private vectorLayer: VectorLayer<VectorSource> | null = null;
  private vectorSource: VectorSource = new VectorSource();
  
  constructor(private tourismService: TourismDataService) {}

  addToMap(map: Map, category: string): void {
    this.clearMarkers(map);
    
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource
    });
    map.addLayer(this.vectorLayer);

    this.tourismService.getTourismData().subscribe((points: TourismPoint[]) => {
      points
        .filter(point => point.category === category || category === '')
        .forEach(point => {
          if (point.lat && point.lon) {
            const feature = new Feature({
              geometry: new Point(fromLonLat([point.lon, point.lat])),
              name: point.name,
              address: point.address
            });

            feature.setStyle(new Style({
              image: new Icon({
                // Add your marker icon configuration here
                src: 'path/to/marker-icon.png',
                scale: 1
              })
            }));

            this.vectorSource.addFeature(feature);
          }
        });
    });
  }

  clearMarkers(map: Map): void {
    if (this.vectorLayer) {
      map.removeLayer(this.vectorLayer);
      this.vectorSource.clear();
    }
  }
}