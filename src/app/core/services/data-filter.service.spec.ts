import { TestBed } from '@angular/core/testing';

import { DataFilterService } from './data-filter.service';

import { ConcentrationData } from '../interfaces/tourism.interface';

describe('DataFilterService', () => {
  let service: DataFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [DataFilterService]
    });
    service = TestBed.inject(DataFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return weekdays', () => {
    const weekdays = service.getWeekdays();
    expect(weekdays).toEqual(['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte']);
  });

  it('should return months', () => {
    const months = service.getMonths();
    expect(months).toEqual(['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny','Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre']);

  })

  it('should filter data by month and weekday correctly', () => {
    const mockData: ConcentrationData[] = [
      { id: '1', date: '2019-10-10', lat: '41.0', lon: '2.0' }, // Dijous
      { id: '2', date: '2019-08-07', lat: '42.0', lon: '3.0' }, // Dimecres
      { id: '3', date: '2019-08-28', lat: '43.0', lon: '4.0' }, // Dimecres
      { id: '4', date: '2019-10-05', lat: '44.0', lon: '5.0' }  // Dissabte
    ];

    const filtered = service.filterDataByMonthAndWeekday(mockData);

    
    expect(Object.keys(filtered)).toEqual(['10', '08']); // October, Agost
    expect(Object.keys(filtered['08'])).toEqual(['Dimecres']); 
    expect(filtered['08']['Dimecres'].length).toBe(2); 

    expect(Object.keys(filtered['10'])).toEqual(['Dijous', 'Dissabte']); 
    expect(filtered['10']['Dijous'].length).toBe(1);
    expect(filtered['10']['Dissabte'].length).toBe(1);
  });

  it('should get filtered data correctly based on month and weekday', () => {
    const mockData: ConcentrationData[] = [
      { id: '1', date: '2019-10-10', lat: '41.0', lon: '2.0' }, // Dijous
      { id: '2', date: '2019-08-07', lat: '42.0', lon: '3.0' }, // Dimecres
      { id: '3', date: '2019-08-28', lat: '43.0', lon: '4.0' }, // Dimecres
      { id: '4', date: '2019-10-05', lat: '44.0', lon: '5.0' }  // Dissabte
    ];

    const monthlyData = service.filterDataByMonthAndWeekday(mockData);

    // month and weekday
    let result = service.getFilteredData(monthlyData, '08', 'Dimecres', mockData);
    expect(result.length).toBe(2);

   // only month
    result = service.getFilteredData(monthlyData, '08', '', mockData);
    expect(result.length).toBe(2); 

// only week   day 
    result = service.getFilteredData(monthlyData, '', 'Dimecres', mockData);
    expect(result.length).toBe(2);

// no filter
    result = service.getFilteredData(monthlyData, '', '', mockData);
    expect(result.length).toBe(4); 
});

});
