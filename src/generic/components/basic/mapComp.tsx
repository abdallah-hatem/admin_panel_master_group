import { Autocomplete, GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface MapsProps {
  center: {
    lat: number;
    lng: number;
  };
  setMarkers?: (data: any) => void;
  markers?: {
    lat: number;
    lng: number;
  }[];
  style?: React.CSSProperties;
  handleMarkerClick?: (data: any) => void;
  onMarkerSet?: (data: any) => void;
  allowSearch?: boolean;
}

const MapComp = ({
  center,
  markers,
  setMarkers,
  style,
  handleMarkerClick,
  onMarkerSet,
  allowSearch = false,
}: MapsProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState(center);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    setMapCenter(center);
    mapRef.current?.setZoom(15);
  }, [center]);
  const googleMapsApiKey = import.meta.env.DEV
    ? 'AIzaSyCuTilAfnGfkZtIx0T3qf-eOmWZ_N2LpoY'
    : 'AIzaSyB4MWIxfQV8hVDSyzoZijnY25Q0aizZYGA';

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    // googleMapsApiKey: 'AIzaSyCuTilAfnGfkZtIx0T3qf-eOmWZ_N2LpoY', // dev
    // googleMapsApiKey: 'AIzaSyAiXRLddC53YrmqhX_FNX62e2SQN6TiP3M', // dev
    // googleMapsApiKey: 'AIzaSyBPq8l_d9x4C8jmw6TL_KYjtQv3lyBbRRU', // prod
    googleMapsApiKey: 'AIzaSyB4MWIxfQV8hVDSyzoZijnY25Q0aizZYGA', // prod 2
    // googleMapsApiKey,
    libraries: ['places'], // Add the places library
  });

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
  };

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      setMarkers && setMarkers((prev: any) => [...prev, { lat, lng, id: `${lat}-${lng}` }]);
      setMapCenter({ lat, lng });

      mapRef?.current?.panTo({ lat, lng });

      onMarkerSet && onMarkerSet({ lat, lng });
    }
  };

  const onAutocompleteLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();

      if (place.geometry) {
        const lat = place.geometry.location?.lat();
        const lng = place.geometry.location?.lng();

        if (lat && lng) {
          setMapCenter({ lat, lng });
          setMarkers && setMarkers((prev: any) => [...prev, { lat, lng, id: `${lat}-${lng}` }]);
          mapRef?.current?.panTo({ lat, lng });
        }
      }
    }
  };

  const containerStyle = style ?? {
    width: '100%',
    height: '450px',
    borderRadius: '10px',
    marginTop: '40px',
  };

  return isLoaded ? (
    <>
      {allowSearch && (
        <div className="search-container mb-4">
          <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={onPlaceChanged}>
            <input
              type="text"
              placeholder="Search a place"
              className="border p-2 w-full"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </Autocomplete>
        </div>
      )}

      <GoogleMap
        id="google-map-script"
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={10}
        onUnmount={onUnmount}
        onLoad={onLoad}
        onClick={handleMapClick}
        options={mapOptions}
      >
        {markers?.map((el: any, index) => (
          <Marker
            key={index}
            position={{ lat: el.lat, lng: el.lng }}
            options={{ opacity: mapCenter?.lat === el.lat && mapCenter?.lng === el.lng ? 1 : 0.5 }}
            onClick={() => handleMarkerClick && handleMarkerClick(el)}
          />
        ))}
      </GoogleMap>
    </>
  ) : (
    <></>
  );
};

export default React.memo(MapComp);
