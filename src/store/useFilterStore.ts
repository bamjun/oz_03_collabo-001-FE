/* eslint-disable no-unused-vars */
import { create } from 'zustand';

interface FilterState {
  regionId: number | null;
  subCategoryId: number | null;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;

  setRegionId: (id: number | null) => void;
  setSubCategoryId: (id: number | null) => void;
  setLatitude: (lat: number | null) => void;
  setLongitude: (long: number | null) => void;
  setIsActive: (active: boolean) => void;
}

const useFilterStore = create<FilterState>((set) => ({
  regionId: null,
  subCategoryId: null,
  latitude: null,
  longitude: null,
  isActive: false,

  setRegionId: (id) => set({ regionId: id }),
  setSubCategoryId: (id) => set({ subCategoryId: id }),
  setLatitude: (lat) => set({ latitude: lat }),
  setLongitude: (long) => set({ longitude: long }),
  setIsActive: (active) => set({ isActive: active }),
}));

export default useFilterStore;
