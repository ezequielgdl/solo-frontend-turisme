export interface TourismPoint {
  id: number;
  name: string;
  category: string;
  address: string;
  lat: number;
  lon: number;
}

export interface ConcentrationData {
  id: string;
  date: string;
  lat: string;
  lon: string;
}

export interface NoiseData {
  Id_Instal?: number;
  date: string;
  sound_level_mean: number;
  lat: number;
  lon: number;
}
