import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConcentrationData } from '../interfaces/tourism.interface';

@Injectable({
  providedIn: 'root'
})
export class MapApiService {
  private http = inject(HttpClient);
  // private jsonUrl = 'assets/concentration-data.json';
  private jsonUrl = 'https://backendtouristtrapp-production.up.railway.app/api/touristConcentration/all';

  loadConcentrationData(): Observable<ConcentrationData[]> {
    return this.http.get<ConcentrationData[]>(this.jsonUrl);
  }

}
