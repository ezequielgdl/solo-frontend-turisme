
import { Injectable } from '@angular/core';
import * as L from 'leaflet';

import { TourismDataService } from '../../../core/services/tourism-data.service';
import { TourismPoint } from '../../../core/interfaces/tourism.interface';
  
@Injectable({
  providedIn: 'root'
})
export class TourismPointsLayerService {
  private markers: L.Marker[] = [];
  
  constructor(private tourismService: TourismDataService) {}

  addToMap(map: L.Map, category: string): void {
    this.clearMarkers(map);
    
    this.tourismService.getTourismData().subscribe((points: TourismPoint[]) => {
      points
        .filter(point => point.category === category || category === '')
        .forEach(point => {
          if (point.lat && point.lon) {
            const marker = L.marker([point.lat, point.lon])
              .addTo(map)
              .bindPopup(`<strong>${point.name}</strong><br>${point.address}`);
            this.markers.push(marker);
          }
        });
    });
  }

  clearMarkers(map: L.Map): void {
    this.markers.forEach(marker => map.removeLayer(marker));
    this.markers = [];
  }
}