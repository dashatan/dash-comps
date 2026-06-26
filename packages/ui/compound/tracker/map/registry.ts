import type { Coordinate, FitBoundsOptions, MapEngine, MapEngineConfig, MapEngineHandle } from "@/components/compound/tracker/map/types";

export type MapEngineFactory = () => Promise<MapEngine>;

const registry: Record<string, MapEngineFactory> = {};

export function registerMapEngine(id: string, factory: MapEngineFactory) {
  registry[id] = factory;
}

export async function loadMapEngine(id: string): Promise<MapEngine> {
  const factory = registry[id];
  if (!factory) throw new Error(`Map engine "${id}" is not registered`);
  return factory();
}

export async function mountMapEngine(
  engine: MapEngine,
  container: HTMLElement,
  config: MapEngineConfig,
): Promise<MapEngineHandle> {
  return engine.mount(container, config);
}

export type { Coordinate, FitBoundsOptions };
