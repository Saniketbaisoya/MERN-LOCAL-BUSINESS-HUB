import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'
import { useEffect, useState } from 'react'

export default function GoogleMapComponent({address, requireAuthForAction}) {
    const [coordinates, setCoordinates] = useState(null);
    const {isLoaded} = useLoadScript({
        googleMapsApiKey : import.meta.env.VITE_MAP_JAVASCRIPT_API_KEY,
    });

    useEffect(()=> {
        const fetchCoordinates = async () => {
            try {
                const res = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                    address
                    )}&key=${import.meta.env.VITE_GEOLOCATION_API_KEY}`
                );
                const data = await res.json();
                console.log(data);
                if(data.results && data.results[0]) {
                    setCoordinates(data.results[0].geometry.location)
                }
            } catch (error) {
                console.log("GeoCoding Failed : ", error);
            }
        };
        if(address) fetchCoordinates();
    },[address]);
    console.log(coordinates);

    if (!isLoaded) return <p>Loading map library...</p>;
    if (!coordinates) return <p>Finding location...</p>;

  return (
    <div className=' mt-4 flex flex-col flex-wrap border-black'>
        <GoogleMap
            center={coordinates}
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "300px", borderRadius: "12px" }}
        >
            <Marker  position={coordinates}/>
        </GoogleMap>

        <button
            onClick={()=> 
                requireAuthForAction(()=> {
                    window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`,
                    "_blank"
                )
                })
                
            }
            className='mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition'
        >
            Get Directions
        </button>
    </div>
  )
}
