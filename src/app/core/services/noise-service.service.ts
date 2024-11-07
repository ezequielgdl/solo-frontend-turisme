import { inject, Injectable } from '@angular/core';
import { NoiseData } from '../interfaces/tourism.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NoiseServiceService {
  private http = inject(HttpClient);
  // private jsonUrl = 'assets/soroll.json';
  private jsonUrl = 'https://backendtouristtrapp-production.up.railway.app/api/noise/all';

  loadNoiseData(): Observable<NoiseData[]> {
    return this.http.get<NoiseData[]>(this.jsonUrl);
  }
}
