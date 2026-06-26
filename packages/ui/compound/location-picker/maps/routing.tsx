"use client";



import { useCallback, useEffect, useMemo, useState } from "react";

import {

  createDestinationIcon,

  createDeviceIcon,

  createOriginIcon,

  LeafletMap,

  MapClickPlacement,

  MapDeviceCluster,

  MapFitBounds,

  MapPolyline,

  MapZoomControls,

} from "@/components/common/map";

import { useLazyGetRoutingQuery } from "@/features/traffic/services/traffic";

import { useLocationPickerStore } from "@/components/compound/location-picker/context";

import { MAP_CONFIG } from "@/components/compound/tracker-legacy/map/config/constants";

import useResources from "@/features/resources/utils/useResources";

import { Device } from "@/features/resources/types";

import {

  buildNameLookup,

  enrichDevices,

} from "@/components/compound/location-picker/lib/enrich-devices";

import { RouteEndpointMarker } from "@/components/compound/location-picker/maps/route-endpoint-marker";

import { getMapTileUrl, useLanguage } from "@/lib";

import { toast } from "sonner";

import { useTheme } from "next-themes";



type RouteAlternative = {

  points: Point[];

  devices: number[];

};



export default function RoutingMap() {

  const { t } = useLanguage();

  const { routing, setRouting, setDraftField } = useLocationPickerStore();

  const [getRoutingRequest, { isLoading, isFetching }] = useLazyGetRoutingQuery();

  const [routeAlternatives, setRouteAlternatives] = useState<RouteAlternative[]>([]);



  const originLatLng = routing.originLatLng;

  const destinationLatLng = routing.destinationLatLng;

  const addingOrigin = routing.addingOrigin;

  const addingDestination = routing.addingDestination;

  const selectedRoute = routing.selectedRoute;



  const { resolvedTheme } = useTheme();

  const tileUrl = getMapTileUrl(resolvedTheme);



  const { devices, provinces, roads, sources } = useResources();

  const enrichedDevices = useMemo(() => {

    const lookup = buildNameLookup({ provinces, roads, sources });

    return enrichDevices(devices, lookup);

  }, [devices, provinces, roads, sources]);



  const originIcon = useMemo(() => createOriginIcon(), []);

  const destinationIcon = useMemo(() => createDestinationIcon(), []);

  const deviceIcon = useMemo(() => createDeviceIcon(), []);



  const activeRouteIndex = selectedRoute ?? 0;

  const activeAlternative = routeAlternatives[activeRouteIndex];

  const routePoints = activeAlternative?.points ?? [];



  const routeDevices = useMemo(() => {

    const ids = activeAlternative?.devices ?? [];

    return enrichedDevices?.filter((device) => ids.includes(device.id)) ?? [];

  }, [activeAlternative?.devices, enrichedDevices]);



  const fitBounds = useMemo(() => {

    if (!routePoints.length) {

      if (!originLatLng || !destinationLatLng) return [];

      return [originLatLng, destinationLatLng];

    }

    return routePoints;

  }, [routePoints, originLatLng, destinationLatLng]);



  useEffect(() => {

    setRouting({ isLoading: isLoading || isFetching });

  }, [isLoading, isFetching, setRouting]);



  const getRouteName = useCallback(

    (

      matchedDevices: Device[],

      latlngs: { lat1: number; lng1: number; lat2: number; lng2: number },

    ) => {

      const originDevice = matchedDevices[0];

      const destinationDevice = matchedDevices[matchedDevices.length - 1];

      const originName =

        originDevice?.name ||

        t("locationPicker.coordinates", {

          coords: `${latlngs.lat1.toFixed(2)},${latlngs.lng1.toFixed(2)}`,

        });

      const destinationName =

        destinationDevice?.name ||

        t("locationPicker.coordinates", {

          coords: `${latlngs.lat2.toFixed(2)},${latlngs.lng2.toFixed(2)}`,

        });

      return { originName, destinationName };

    },

    [t],

  );



  const handleOriginPlace = useCallback(

    (position: Point) => setRouting({ originLatLng: position, addingOrigin: false }),

    [setRouting],

  );



  const handleDestinationPlace = useCallback(

    (position: Point) =>

      setRouting({ destinationLatLng: position, addingDestination: false }),

    [setRouting],

  );



  const handleOriginMove = useCallback(

    (position: Point) => setRouting({ originLatLng: position }),

    [setRouting],

  );



  const handleDestinationMove = useCallback(

    (position: Point) => setRouting({ destinationLatLng: position }),

    [setRouting],

  );



  const fetchRoute = useCallback(

    (params: { lat1: number; lng1: number; lat2: number; lng2: number }) => {

      getRoutingRequest({ ...params, devices: enrichedDevices ?? [] }, true)

        .unwrap()

        .then((res) => {

          const alternatives: RouteAlternative[] = res.alternatives.map((alt) => ({

            points: alt.geometry.map(([lng, lat]) => [lat, lng] as Point),

            devices: alt.devices,

          }));



          setRouteAlternatives(alternatives);

          setRouting({ selectedRoute: undefined });



          const firstAlternative = alternatives[0];

          const firstDevices =

            enrichedDevices?.filter((device) =>

              firstAlternative?.devices.includes(device.id),

            ) ?? [];



          const { destinationName, originName } = getRouteName(firstDevices, params);

          setRouting({

            routes: res.alternatives.map((alt, index) => {

              const leg = alt.legs[0];

              return {

                index,

                distance: leg?.distance ?? 0,

                duration: leg?.duration ?? 0,

                title: t("locationPicker.routeTitle", { index: String(index + 1) }),

                devices: alt.devices,

                destinationName,

                originName,

                summary: leg?.summary,

              };

            }),

          });

          setDraftField("devices", firstAlternative?.devices);

        })

        .catch((error) => {

          console.log(error);

          toast.error(t("locationPicker.routeFetchError"));

        });

    },

    [enrichedDevices, getRouteName, getRoutingRequest, setDraftField, setRouting, t],

  );



  useEffect(() => {

    if (!originLatLng || !destinationLatLng) {

      setRouteAlternatives([]);

      return;

    }



    const [lat1, lng1] = originLatLng;

    const [lat2, lng2] = destinationLatLng;

    fetchRoute({ lat1, lng1, lat2, lng2 });

  }, [originLatLng, destinationLatLng, fetchRoute]);



  useEffect(() => {

    if (selectedRoute == null || !routeAlternatives[selectedRoute]) return;

    setDraftField("devices", routeAlternatives[selectedRoute].devices);

  }, [selectedRoute, routeAlternatives, setDraftField]);



  return (

    <LeafletMap

      tileUrl={tileUrl}

      center={MAP_CONFIG.CENTER_COORD}

      zoom={7}

      maxZoom={19}

      zoomControl={false}

      className="z-2 size-full p-4"

    >

      <MapZoomControls />

      <MapClickPlacement

        active={addingOrigin}

        icon={originIcon}

        onPlace={handleOriginPlace}

      />

      <MapClickPlacement

        active={addingDestination}

        icon={destinationIcon}

        onPlace={handleDestinationPlace}

      />

      {originLatLng && !addingOrigin ? (

        <RouteEndpointMarker

          position={originLatLng}

          icon={originIcon}

          onMove={handleOriginMove}

        />

      ) : null}

      {destinationLatLng && !addingDestination ? (

        <RouteEndpointMarker

          position={destinationLatLng}

          icon={destinationIcon}

          onMove={handleDestinationMove}

        />

      ) : null}

      <MapPolyline points={routePoints} className="stroke-primary" />

      <MapDeviceCluster devices={routeDevices} icon={deviceIcon} />

      <MapFitBounds bounds={fitBounds} enabled={fitBounds.length >= 2} />

    </LeafletMap>

  );

}

