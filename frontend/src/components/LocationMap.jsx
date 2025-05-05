import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useRef, useCallback } from 'react';

const mapContainerStyle = {
  height: '400px',
  width: '100%',
};

const LocationMap = ({ locations }) => {
  const mapRef = useRef(null);

  const onLoad = useCallback((map) => {
    mapRef.current = map;

    if (window.google && locations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      locations.forEach((loc) => {
        if (loc.lat && loc.lng) {
          bounds.extend({ lat: loc.lat, lng: loc.lng });
        }
      });
      map.fitBounds(bounds);
    }
  }, [locations]);

  return (
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        onLoad={onLoad}
      >
        {locations.map((loc, index) => (
          <Marker
            key={index}
            position={{ lat: loc.lat, lng: loc.lng }}
            title={loc.name}
          />
        ))}
      </GoogleMap>
  );
};

export default LocationMap;
