import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapComponent } from './map.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { TourismDataService } from '../../core/services/tourism-data.service';
import { MapApiService } from '../../core/services/map-api.service';
import { DataFilterService } from '../../core/services/data-filter.service';
import { of } from 'rxjs';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapComponent],
      providers:[ HttpClient, HttpHandler]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
