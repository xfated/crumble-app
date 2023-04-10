import { createContext, useContext } from "react";
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import { Place, PlaceDetailRow } from "../services/places/interfaces";
import { getNearbyPlaces, getPlaceDetails } from "../services/places/places";

type PlacesContextType = {
    nearbyPlaceDetails: PlaceDetailRow[];
    location: Location.LocationObject | null;
    reqLocPerms: () => Promise<void>;
    fetchNearbyPlaces: (nextPageToken: string) => Promise<boolean>;
    isLoading: boolean,
    errorMessage: string,
    nextPageToken: string,
    curPlaceIdx: number,
    resetPlaces: () => void,
    goNextPlace: () => Promise<void>
}

interface PlacesContextProps {
    children?: React.ReactNode;
}

const PLACE_DETAIL_FETCH_BUFFER = 5

const PlaceContext = createContext<PlacesContextType>({
    nearbyPlaceDetails: [],
    location: null,
    reqLocPerms: async () => {},
    fetchNearbyPlaces: async (nextPageToken: string) => { return false},
    isLoading: false,
    errorMessage: "",
    nextPageToken: "",
    curPlaceIdx: 0,
    resetPlaces: () => {},
    goNextPlace: async () => {}
});

export const usePlace = () => useContext(PlaceContext);

export const PlaceContextProvider: React.FC<PlacesContextProps> = ({ children }) => {
    // LOCATION UTILS
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const reqLocPerms = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
    }

    useEffect(() => { // Try to get on start up
        reqLocPerms()
    }, []);

    // NEARBY PLACES UTILS
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
    const [nearbyPlaceDetails, setNearbyPlaceDetails] = useState<PlaceDetailRow[]>([])
    const [nextPageToken, setNextPageToken] = useState("");
    const updateNearbyPlaces = (places: Place[]) => {
        console.log(nearbyPlaces.map(x => x.place_id))
        console.log(places.map(x => x.place_id))
        setNearbyPlaces(prev => [...prev, ...places])
    }
    const fetchNearbyPlaces = async (nextPageToken: string): Promise<boolean> => {
        if (!location) {
            console.error("No location perms");
            await reqLocPerms();
            return false;
        }
        const latitude = location?.coords.latitude ? location.coords.latitude : null;
        const longitude = location?.coords.longitude ? location.coords.longitude : null;
        if (latitude && longitude) {
            setIsLoading(true);
            await getNearbyPlaces("restaurant", latitude, longitude, 500, nextPageToken)
                .then((res) => {
                    if (res !== null) {
                        updateNearbyPlaces(res.results)
                        setNextPageToken(res.next_page_token ?? "")
                        
                        // start populating nearbyPlaceDetails
                        fetchPlaceDetails(res.results)
                    }
                })
                .catch((err: unknown) => {
                    if (err instanceof Error) {
                        console.log(err.message);
                        setErrorMessage(err.message);
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                    setErrorMessage("");
                })  
        }
        return true;
    }

    // Navigation
    const [curPlaceIdx, setCurPlaceIdx] = useState(0);
    const goNextPlace = async () => {
        setCurPlaceIdx(prev => prev + 1);
        if (curPlaceIdx >= nearbyPlaces.length - 10 && nextPageToken !== "") { // fetch more
            await fetchNearbyPlaces(nextPageToken);
        }
    }

    // Fetch nearby place details when required
    const fetchPlaceDetails = async (places: Place[]) => {
        let newPlaceDetails: PlaceDetailRow[] = []
        // console.log("fetchPlaceDetails for", places.map(x => x.place_id))
        for (const place of places) {
            const placeDetail = await getPlaceDetails(place.place_id)
            if (placeDetail && !nearbyPlaceDetails.some(e => e.place_id === placeDetail.place_id)) { // if is not already inside
                newPlaceDetails.push(placeDetail)
            }
        }
        setNearbyPlaceDetails(prev => [...prev, ...newPlaceDetails])
    }
    // useEffect(() => {
    //     if (curPlaceIdx > 0 && nearbyPlaces.length > 0) {
    //         const nextVal = curPlaceIdx + PLACE_DETAIL_FETCH_BUFFER
    //         fetchPlaceDetails(nearbyPlaces.slice(nearbyPlaceDetails.length, nextVal + 1))
    //     }
    // }, [curPlaceIdx, nearbyPlaces])

    const resetPlaces = () => {
        setCurPlaceIdx(0);
        setNearbyPlaces([]);
        setNearbyPlaceDetails([]);
        setNextPageToken("");
    }

    return (
        <PlaceContext.Provider
            value={{
                nearbyPlaceDetails,
                location,
                reqLocPerms,
                fetchNearbyPlaces,
                isLoading,
                errorMessage,
                nextPageToken,
                curPlaceIdx,
                resetPlaces,
                goNextPlace
            }}
        >
            {children}
        </PlaceContext.Provider>
    )
}