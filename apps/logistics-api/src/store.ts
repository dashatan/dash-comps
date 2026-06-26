import {
  createLogisticsDataStore,
  type LogisticsDataStore,
} from "@dash/logistics-seed";

let store: LogisticsDataStore | null = null;

export function getStore(): LogisticsDataStore {
  if (!store) {
    store = createLogisticsDataStore();
  }
  return store;
}
