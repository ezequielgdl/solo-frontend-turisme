import { Injectable, inject } from '@angular/core';
import * as L from 'leaflet';
import { NoiseData } from '../../../core/interfaces/tourism.interface';
import { NoiseServiceService } from '../../../core/services/noise-service.service';
import { DataFilterService } from '../../../core/services/data-filter.service';

@Injectable({
  providedIn: 'root'
})
export class NoiseLayerService {
  private noiseData: NoiseData[] = [];
  private monthlyNoiseData: { [key: string]: { [key: string]: NoiseData[] } } = {};
  private noiseHeatmapLayer: L.HeatLayer | null = null;
  private dataFilterService = inject(DataFilterService);
  private noiseService = inject(NoiseServiceService);

  loadNoiseData() {
    return this.noiseService.loadNoiseData().subscribe(data => {
      this.noiseData = data;
      this.monthlyNoiseData = this.dataFilterService.filterDataByMonthAndWeekday(this.noiseData);
    });
  }

  updateNoiseHeatmap(map: L.Map, showNoise: boolean, selectedMonth: string, selectedWeekday: string): void {
    if (this.noiseHeatmapLayer) {
      map.removeLayer(this.noiseHeatmapLayer);
    }
    
    if (showNoise) {
      const filteredNoiseData = this.dataFilterService.getFilteredData(
        this.monthlyNoiseData,
        selectedMonth,
        selectedWeekday,
        this.noiseData
      );

      const heatmapData = filteredNoiseData.map(point => [
        point.lat,
        point.lon,
        this.normalizeNoiseLevel(point.sound_level_mean)
      ] as L.HeatLatLngTuple);

      if (heatmapData.length > 0) {
        this.noiseHeatmapLayer = L.heatLayer(heatmapData, {
          radius: 20,
          blur: 25,
          maxZoom: 18,
          max: 1,
          minOpacity: 0.7,
          gradient: {0.4: 'purple', 0.5: 'magenta', 0.6: 'orange', 0.8: 'red', 1: 'darkred'}
        }).addTo(map);
      }
    }
  }

  private normalizeNoiseLevel(soundLevel: number): number {
    const minDecibels = 38;
    const maxDecibels = 81;
    return (soundLevel - minDecibels) / (maxDecibels - minDecibels);
  }

  clearLayer(map: L.Map): void {
    if (this.noiseHeatmapLayer) {
      map.removeLayer(this.noiseHeatmapLayer);
    }
  }
}