import { Component, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import proj4 from 'proj4';

import { DataFilterService } from '../../core/services/data-filter.service';
import { TourismPointsLayerService } from './services/tourism-points.service';
import { NoiseLayerService } from './services/noise-layer.service';
import { ConcentrationLayerService } from './services/concentration-layer.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private readonly dataFilterService = inject(DataFilterService);
  private readonly tourismPointsLayer = inject(TourismPointsLayerService);
  private readonly noiseLayer = inject(NoiseLayerService);
  private readonly concentrationLayer = inject(ConcentrationLayerService);

  private map!: Map;
  
  selectedCategory: string = 'Museu';
  isCollapsed = false;
  showPoints = true;
  showPlaces = true;
  showNoise = false;
  selectedMonth: string = '';
  selectedWeekday: string = '';
  readonly months: string[];
  readonly weekdays: string[];

  private isDragging = false;
  private currentX = 0;
  private currentY = 0;
  private initialX = 0;
  private initialY = 0;
  private xOffset = 0;
  private yOffset = 0;

  constructor() {
    this.months = this.dataFilterService.getMonths();
    this.weekdays = this.dataFilterService.getWeekdays();
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private initializeMap(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([2.1734, 41.3851]),
        zoom: 13
      })
    });
    this.initializeLayers();
  }

  private initializeLayers(): void {
    this.registerProj4Definitions();
    this.concentrationLayer.loadData().add(() => {
      this.updateAllLayers();
    });
    this.noiseLayer.loadNoiseData();
    
    if (this.showPoints) {
      this.tourismPointsLayer.addToMap(this.map, this.selectedCategory);
    }
  }

  // Event handlers
  onCategoryFilterChange(event: any): void {
    this.selectedCategory = event.target.value;
    this.updatePointsLayer();
  }

  onMonthSelect(): void {
    this.updateAllLayers();
  }

  onWeekdaySelect(): void {
    this.updateAllLayers();
  }

  // Toggle handlers
  toggleMarkers(): void {
    this.updatePointsLayer();
  }

  toggleHeatMap(): void {
    this.updateConcentrationLayer();
  }

  toggleNoiseHeatmap(): void {
    this.updateNoiseLayer();
  }

  // Private helper methods
  private updateAllLayers(): void {
    this.updateConcentrationLayer();
    this.updateNoiseLayer();
  }

  private updatePointsLayer(): void {
    if (!this.showPoints) {
      this.tourismPointsLayer.clearMarkers(this.map);
    } else {
      this.tourismPointsLayer.addToMap(this.map, this.selectedCategory);
    }
  }

  private updateConcentrationLayer(): void {
    if (!this.showPlaces) {
      this.concentrationLayer.clearLayer(this.map);
    } else {
      this.concentrationLayer.updateHeatmap(
        this.map,
        this.selectedMonth,
        this.selectedWeekday
      );
    }
  }

  private updateNoiseLayer(): void {
    if (!this.showNoise) {
      this.noiseLayer.clearLayer(this.map);
    } else {
      this.noiseLayer.updateNoiseHeatmap(
        this.map,
        this.showNoise,
        this.selectedMonth,
        this.selectedWeekday
      );
    }
  }

  private registerProj4Definitions(): void {
    proj4.defs('EPSG:25831', '+proj=utm +zone=31 +datum=WGS84 +units=m +no_defs +type=crs');
  }

  private bindGlobalMouseEvents(): void {
    window.addEventListener('mousemove', this.onDrag.bind(this));
    window.addEventListener('mouseup', this.onDragEnd.bind(this));
  }

  private unbindGlobalMouseEvents(): void {
    window.removeEventListener('mousemove', this.onDrag.bind(this));
    window.removeEventListener('mouseup', this.onDragEnd.bind(this));
  }

  onDragStart(event: MouseEvent): void {
    this.initialX = event.clientX - this.xOffset;
    this.initialY = event.clientY - this.yOffset;
    
    if (event.target instanceof HTMLElement && event.target.closest('.control-panel')) {
      this.isDragging = true;
      this.bindGlobalMouseEvents();
    }
  }

  onDrag(event: MouseEvent): void {
    if (this.isDragging) {
      event.preventDefault();
      
      this.currentX = event.clientX - this.initialX;
      this.currentY = event.clientY - this.initialY;

      this.xOffset = this.currentX;
      this.yOffset = this.currentY;

      const controlPanel = document.querySelector('.control-panel') as HTMLElement;
      if (controlPanel) {
        controlPanel.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0)`;
      }
    }
  }

  onDragEnd(): void {
    this.isDragging = false;
    this.unbindGlobalMouseEvents();
  }
}
