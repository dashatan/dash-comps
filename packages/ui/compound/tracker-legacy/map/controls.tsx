import React from "react";
import { Compass, Maximize, Minus, Plus } from "lucide-react";
import maplibregl from "maplibre-gl";
import { createRoot, Root } from "react-dom/client";

interface CustomControlProps {
  map: maplibregl.Map;
}

export const CustomControl: React.FC<CustomControlProps> = ({ map }) => {
  return (
    <div className="maplibregl-ctrl m-0! flex flex-col p-4">
      <CustomControlButton
        onClick={() => map.zoomIn()}
        className="rounded-b-none"
      >
        <Plus size={20} />
      </CustomControlButton>
      <CustomControlButton
        onClick={() => map.zoomOut()}
        className="rounded-t-none"
      >
        <Minus size={20} />
      </CustomControlButton>
      <CustomControlButton onClick={() => map.resetNorth()} className="mt-2">
        <Compass size={20} className="rotate-180" />
      </CustomControlButton>
      <CustomControlButton
        onClick={() => {
          const el = document.getElementById("maplibre-map");
          if (!el) return;
          if (!document.fullscreenElement) el.requestFullscreen();
          else document.exitFullscreen();
        }}
        className="mt-2"
      >
        <Maximize size={20} />
      </CustomControlButton>
    </div>
  );
};

function CustomControlButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <div
      className={`flex size-10 cursor-pointer items-center justify-center rounded-md border bg-card/70 transition-all duration-300 hover:bg-card/80 ${className}`}
      aria-label="Reset North"
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function createMapControl<T extends { map: maplibregl.Map }>(
  Component: React.ComponentType<T>,
  props?: Omit<T, "map">,
) {
  class MapControl implements maplibregl.IControl {
    _map?: maplibregl.Map;
    _container!: HTMLDivElement;
    _root!: Root;
    onAdd(map: maplibregl.Map) {
      this._map = map;
      this._container = document.createElement("div");
      this._root = createRoot(this._container);
      this._root.render(
        React.createElement(Component, { ...(props as T), map }),
      );
      return this._container;
    }
    onRemove() {
      if (this._root) this._root.unmount();
      if (this._container.parentNode)
        this._container.parentNode.removeChild(this._container);
      this._map = undefined;
    }
  }
  return new MapControl();
}
