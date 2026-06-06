export type Source = {
  id: number;
  name: string;
};

export type Province = {
  id: number;
  name: string;
  source?: number[];
};

export type Road = {
  id: number;
  name: string;
  province?: number;
  source?: number;
};

export type Device = {
  id: number;
  name: string;
  lat: string;
  long: string;
  province?: number;
  road?: number;
  source?: number;
  device_type?: number;
  provinceName?: string;
  roadName?: string;
  sourceName?: string;
};
