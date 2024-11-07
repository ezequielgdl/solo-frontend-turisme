import { Injectable } from '@angular/core';
import { ConcentrationData, NoiseData } from '../interfaces/tourism.interface';

@Injectable({
  providedIn: 'root'
})
export class DataFilterService {
  private weekdays: string[] = ['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte'];
  private months = [
    'Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny',
    'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'
  ];

  getWeekdays(): string[] {
    return this.weekdays;
  }

  getMonths(): string[] {
    return this.months;
  }

  filterDataByMonthAndWeekday<T extends { date: string }>(data: T[]): { [key: string]: { [key: string]: T[] } } {
    const monthlyData: { [key: string]: { [key: string]: T[] } } = {};
    data.forEach(point => {
      const pointDate = new Date(point.date);
      const monthKey = (pointDate.getMonth() + 1).toString().padStart(2, '0');
      const weekday = this.weekdays[pointDate.getDay()];
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {};
      }
      if (!monthlyData[monthKey][weekday]) {
        monthlyData[monthKey][weekday] = [];
      }
      monthlyData[monthKey][weekday].push(point);
    });
    return monthlyData;
  }

  getFilteredData<T>(
    monthlyData: { [key: string]: { [key: string]: T[] } },
    selectedMonth: string,
    selectedWeekday: string,
    allData: T[]
  ): T[] {
    if (selectedMonth && selectedWeekday) {
      return monthlyData[selectedMonth]?.[selectedWeekday] || [];
    } else if (selectedMonth) {
      return Object.values(monthlyData[selectedMonth] || {}).flat();
    } else if (selectedWeekday) {
      return Object.values(monthlyData)
        .flatMap(monthData => monthData[selectedWeekday] || []);
    } else {
      return allData;
    }
  }
}
