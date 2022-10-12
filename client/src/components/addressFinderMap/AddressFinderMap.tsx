import React, { useEffect, useRef } from "react";
import { useSetState } from "ahooks";
import { Map, View, MapBrowserEvent, Overlay } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import * as turf from "@turf/turf";
import axios from "axios";
import { AddressApiResult, StateFields } from "../../types";
import AddressPopup from "../addressPopup/AddressPopup";

import "./AddressFinderMap.css";

const AddressFinderMap = () => {
  const initialState: StateFields = {
    olMap: undefined,
    address: undefined,
    addressOverlay: undefined,
  };

  const [state, setState] = useSetState(initialState);

  const mapRef = useRef();
  const popupRef = useRef();

  useEffect(() => {
    const olMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    const addressOverlay = new Overlay({
      position: [],
      positioning: "center-center",
      element: popupRef.current,
      stopEvent: true,
    });

    olMap.addOverlay(addressOverlay);

    setState({
      olMap,
      addressOverlay,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reattach map click handler when olMap state changes
  useEffect(() => {
    if (state.olMap) {
      state.olMap.un("click", mapClickHandler);
      state.olMap.on("click", mapClickHandler);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.olMap]);

  //--------------------------------------------- Map Event Handlers ---------------------------------------------

  const mapClickHandler = async (event: MapBrowserEvent<any>) => {
    const { olMap, addressOverlay } = state;
    if (olMap) {
      // get mercatorCoordinates of the location when user clicks on map
      const mercatorCoordinates = olMap.getCoordinateFromPixel(event.pixel);

      // convert to wgs84Coordinates
      const pt = turf.point(mercatorCoordinates);
      const converted = turf.toWgs84(pt);
      const wgs84Coordinates = converted.geometry.coordinates;

      // get address from server
      const apiResult = await getAddress(wgs84Coordinates);

      if (apiResult.success) {
        setState({
          address: apiResult.address,
        });

        // open poup to show address details on map
        if (addressOverlay) {
          addressOverlay.setPosition(mercatorCoordinates);
        }
      }
    }
  };

  //--------------------------------------------- Util functions ---------------------------------------------------

  const getAddress = async (
    coordinates: Array<number>
  ): Promise<AddressApiResult> => {
    try {
      const response = await axios.get(
        `/api/address?lat=${coordinates[1]}&lon=${coordinates[0]}`
      );
      return {
        success: true,
        address: response.data,
      };
    } catch (error) {
      console.log("Error while getting address");
      return {
        success: false,
        address: undefined,
      };
    }
  };

  const handleAddressPopopClose = () => {
    const { addressOverlay } = state;

    setState({
      address: undefined,
    });

    if (addressOverlay) {
      addressOverlay.setPosition([]);
    }
  };

  return (
    <div className="map-container" ref={mapRef}>
      <div ref={popupRef}>
        {state.address && (
          <AddressPopup
            address={state.address}
            onClose={handleAddressPopopClose}
          />
        )}
      </div>
    </div>
  );
};

export default AddressFinderMap;
