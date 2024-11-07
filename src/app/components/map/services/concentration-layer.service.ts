import { Injectable, inject } from '@angular/core';
import { Feature } from 'ol';
import { Geometry, Point } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import { Heatmap as HeatmapLayer } from 'ol/layer';
import { Map } from 'ol';
import { ConcentrationData } from '../../../core/interfaces/tourism.interface';
import { MapApiService } from '../../../core/services/map-api.service';
import { DataFilterService } from '../../../core/services/data-filter.service';
import { fromLonLat } from 'ol/proj';

@Injectable({
  providedIn: 'root'
})
export class ConcentrationLayerService {
  private data: ConcentrationData[] = [];
  private heatmapLayer: HeatmapLayer | null = null;
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

  updateHeatmap(map: Map, selectedMonth: string, selectedWeekday: string) {
    if (this.heatmapLayer) {
      map.removeLayer(this.heatmapLayer);
    }

    const filteredData = this.dataFilterService.getFilteredData(
      this.monthlyData,
      selectedMonth,
      selectedWeekday,
      this.data
    );

    const features = filteredData.map(point => {
      const coordinates = fromLonLat([parseFloat(point.lon), parseFloat(point.lat)]);
      return new Feature({
        geometry: new Point(coordinates),
        weight: 0.7
      });
    });

    const vectorSource = new VectorSource<Feature<Geometry>>({
      features: features
    });

    this.heatmapLayer = new HeatmapLayer({
      source: vectorSource,
      blur: filteredData.length > 1000 ? 15 : 30,
      radius: filteredData.length > 1000 ? 10 : 25,
      weight: (feature) => feature.get('weight'),
      gradient: ['#0000ff', '#00ffff', '#00ff00', '#ffff00', '#ff0000']
    });

    map.addLayer(this.heatmapLayer);
  }

  clearLayer(map: Map): void {
    if (this.heatmapLayer) {
      map.removeLayer(this.heatmapLayer);
    }
  }
}