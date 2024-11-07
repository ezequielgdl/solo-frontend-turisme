import { Injectable, inject } from '@angular/core';
import { Feature } from 'ol';
import { Geometry, Point } from 'ol/geom';
import Heatmap from 'ol/layer/Heatmap';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import { NoiseData } from '../../../core/interfaces/tourism.interface';
import { NoiseServiceService } from '../../../core/services/noise-service.service';
import { DataFilterService } from '../../../core/services/data-filter.service';

@Injectable({
  providedIn: 'root'
})
export class NoiseLayerService {
  private noiseData: NoiseData[] = [];
  private monthlyNoiseData: { [key: string]: { [key: string]: NoiseData[] } } = {};
  private noiseHeatmapLayer: Heatmap | null = null;
  private dataFilterService = inject(DataFilterService);
  private noiseService = inject(NoiseServiceService);

  loadNoiseData() {
    return this.noiseService.loadNoiseData().subscribe(data => {
      this.noiseData = data;
      this.monthlyNoiseData = this.dataFilterService.filterDataByMonthAndWeekday(this.noiseData);
    });
  }

  updateNoiseHeatmap(map: Map, showNoise: boolean, selectedMonth: string, selectedWeekday: string): void {
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

      const features = filteredNoiseData.map(point => {
        const feature = new Feature({
          geometry: new Point([point.lon, point.lat]),
          weight: this.normalizeNoiseLevel(point.sound_level_mean)
        });
        return feature;
      });

      const vectorSource = new VectorSource<Feature<Geometry>>({
        features: features
      });

      this.noiseHeatmapLayer = new Heatmap({
        source: vectorSource,
        blur: 25,
        radius: 20,
        weight: (feature) => feature.get('weight'),
        gradient: ['purple', 'magenta', 'orange', 'red', 'darkred']
      });

      map.addLayer(this.noiseHeatmapLayer);
    }
  }

  private normalizeNoiseLevel(soundLevel: number): number {
    const minDecibels = 38;
    const maxDecibels = 81;
    return (soundLevel - minDecibels) / (maxDecibels - minDecibels);
  }

  clearLayer(map: Map): void {
    if (this.noiseHeatmapLayer) {
      map.removeLayer(this.noiseHeatmapLayer);
    }
  }
}