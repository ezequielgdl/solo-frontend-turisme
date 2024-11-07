import { inject, Injectable } from '@angular/core';
import { NoiseData } from '../interfaces/tourism.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NoiseServiceService {
  private http = inject(HttpClient);
  private jsonUrl = 'assets/soroll.json';
  // private jsonUrl = 'http://localhost:8080/api/noise/all';

  loadNoiseData(): Observable<NoiseData[]> {
    return this.http.get<NoiseData[]>(this.jsonUrl);
  }
}
