import { createContext, useContext } from "react";
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import { PlaceDetailRow } from "../services/places/interfaces";
import { getNearbyPlaces } from "../services/places/places";

type PlacesContextType = {
    nearbyPlacesDetails: PlaceDetailRow[];
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

const PlaceContext = createContext<PlacesContextType>({
    nearbyPlacesDetails: [],
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
    const [nearbyPlacesDetails, setNearbyPlacesDetails] = useState<PlaceDetailRow[]>([])
    const [nextPageToken, setNextPageToken] = useState("");
    const updateNearbyPlacesDetails = (places: PlaceDetailRow[]) => {
        setNearbyPlacesDetails(prev => [...prev, ...places])
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
                        updateNearbyPlacesDetails(res.results)
                        setNextPageToken(res.next_page_token ?? "")
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
        if (curPlaceIdx === nearbyPlacesDetails.length - 10 && nextPageToken !== "") { // fetch more
            await fetchNearbyPlaces(nextPageToken);
        }
    }


    const resetPlaces = () => {
        setCurPlaceIdx(0);
        setNearbyPlacesDetails([]);
        setNextPageToken("");
    }

    return (
        <PlaceContext.Provider
            value={{
                nearbyPlacesDetails,
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