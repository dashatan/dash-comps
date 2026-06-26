import {
  createLogisticsDataStore,
  type LogisticsDataStore,
} from "@dash/logistics-seed";
import { ensureSeeded } from "./db";

let store: LogisticsDataStore | null = null;

export function getStore(): LogisticsDataStore {
  if (!store) {
    ensureSeeded();
    store = createLogisticsDataStore();
  }
  return store;
}
