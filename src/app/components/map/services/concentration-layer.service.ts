import { Injectable, inject } from '@angular/core';
import * as L from 'leaflet';
import { ConcentrationData } from '../../../core/interfaces/tourism.interface';
import { MapApiService } from '../../../core/services/map-api.service';
import { DataFilterService } from '../../../core/services/data-filter.service';

@Injectable({
  providedIn: 'root'
})
export class ConcentrationLayerService {
  private data: ConcentrationData[] = [];
  private heatmapData: L.HeatLatLngTuple[] = [];
  private heatmapLayer: L.HeatLayer | null = null;
  private monthlyData: { [key: string]: { [key: string]: ConcentrationData[] } } = {};

  private mapService = inject(MapApiService);
  private dataFilterService = inject(DataFilterService);

  loadData() {
    return this.mapService.loadConcentrationData().subscribe(data => {
      this.data = data;
      this.monthlyData = this.dataFilterService.filterDataByMonthAndWeekday(this.data);
      return this.data;
    });
  }

  updateHeatmap(map: L.Map, selectedMonth: string, selectedWeekday: string) {
    if (this.heatmapLayer) {
      map.removeLayer(this.heatmapLayer);
    }

    const filteredData = this.dataFilterService.getFilteredData(
      this.monthlyData,
      selectedMonth,
      selectedWeekday,
      this.data
    );

    this.heatmapData = filteredData.map(point => [
      parseFloat(point.lat),
      parseFloat(point.lon),
      0.7
    ] as L.HeatLatLngTuple);

    if (this.heatmapData.length > 0) {
      const maxIntensity = Math.max(...this.heatmapData.map(point => point[2]));
      const radius = this.heatmapData.length > 1000 ? 10 : 25;
      const blur = this.heatmapData.length > 1000 ? 15 : 30;

      this.heatmapLayer = L.heatLayer(this.heatmapData, {
        radius: radius,
        blur: blur,
        maxZoom: 18,
        max: maxIntensity,
        minOpacity: 0.4,
        gradient: {0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1: 'red'}
      }).addTo(map);
    }
  }

  clearLayer(map: L.Map): void {
    if (this.heatmapLayer) {
      map.removeLayer(this.heatmapLayer);
    }
  }
}