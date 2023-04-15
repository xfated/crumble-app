import { createContext, useContext } from "react";
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import { PlaceDetailRow } from "../services/places/interfaces";
import { placeService } from "../services/places/places";
import { createActionAlert } from "../components/ui_components/ActionAlert";
import * as Linking from 'expo-linking';
import { CategoryInfo, categories } from "../components/Categories/Categories";

enum QueryType {
    INIT,
    CREATE_GROUP,
    JOIN_GROUP
}

type PlacesContextType = {
    nearbyPlacesDetails: PlaceDetailRow[];
    location: Location.LocationObject | null;
    spinnerContent: string;
    reqLocPerms: (queryType: QueryType) => Promise<Location.LocationObject | null>;
    fetchNearbyPlaces: (nextPageToken: string, radius: number, category: string) => Promise<boolean>;
    isLoading: boolean,
    errorMessage: string,
    curPlaceIdx: number,
    resetPlaces: () => void,
    goNextPlace: () => Promise<void>,
    // for create group
    categoryInfo: CategoryInfo,
    handleCategorySelect: (categoryInfo: CategoryInfo) => void,

    // for group
    groupId: string | null,
    groupMatch: string | null,
    getGroupMatch: () => PlaceDetailRow | null,
    createGroup: (min_match: number, radius: number, category: string) => Promise<boolean>,
    joinGroup: (group_id: string) => Promise<boolean>,
    groupAddLike: (place_id: string) => Promise<boolean>,
    groupHasMatch: () => Promise<boolean>
}

interface PlacesContextProps {
    children?: React.ReactNode;
}

const delay = (ms: number) => new Promise(
    resolve => setTimeout(resolve, ms)
)

const PlaceContext = createContext<PlacesContextType>({
    nearbyPlacesDetails: [],
    location: null,
    spinnerContent: "",
    reqLocPerms: async () => {return null},
    fetchNearbyPlaces: async (nextPageToken: string, radius: number, category: string) => { return false },
    isLoading: false,
    errorMessage: "",
    curPlaceIdx: 0,
    resetPlaces: () => {},
    goNextPlace: async () => {},
    // for create group
    categoryInfo: categories.Food,
    handleCategorySelect: (cateyInfo: CategoryInfo) => {},

    // for group
    groupId: null,
    groupMatch: null,
    getGroupMatch: () => { return null },
    createGroup: async (min_match: number, radius: number, category: string) => { return false },
    joinGroup: async (group_id: string) => { return false },
    groupAddLike: async (place_id: string) => { return false },
    groupHasMatch: async () => { return false }
});

export const usePlace = () => useContext(PlaceContext);

export const PlaceContextProvider: React.FC<PlacesContextProps> = ({ children }) => {
    // LOCATION UTILS
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const reqLocPerms = async (queryType: QueryType): Promise<Location.LocationObject | null> => {
        let { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
        if (queryType === QueryType.CREATE_GROUP && status !== 'granted') {
            if (!canAskAgain) {
                createActionAlert("Error", 
                    "Location required to find places near you to start a group.",
                    () => { Linking.openSettings() } 
                )
            }
            return null;
        }
        if (status === 'granted') {
            let locObj = await Location.getCurrentPositionAsync({});
            setLocation(locObj);
            return locObj
        }
        return null
    }

    useEffect(() => { // Try to get on start up
        reqLocPerms(QueryType.INIT)
    }, []);

    // SELECT CATEGORY  utils
    const [categoryInfo, setCategoryInfo] = useState<CategoryInfo>(categories.Food)
    const handleCategorySelect = (categoryInfo: CategoryInfo) => {
        setCategoryInfo(categoryInfo)
    }

    // NEARBY PLACES UTILS
    const [isLoading, setIsLoading] = useState(false);
    const [spinnerContent, setSpinnerContent] = useState("Loading...")
    const [errorMessage, setErrorMessage] = useState("");
    const [nearbyPlacesDetails, setNearbyPlacesDetails] = useState<PlaceDetailRow[]>([])
    const [nextPageToken, setNextPageToken] = useState<string | null>("");
    const updateNearbyPlacesDetails = (places: PlaceDetailRow[]) => {
        setNearbyPlacesDetails(prev => [...prev, ...places])
    }
    const fetchNearbyPlaces = async (next_page_token: string, radius: number, category: string): Promise<boolean> => {
        let locRes = null
        setIsLoading(true);
        locRes = await reqLocPerms(QueryType.CREATE_GROUP);
        setIsLoading(false);
        let locationObj = locRes ?? location
        if (locationObj === null) {
            return false
        }
        const latitude = locationObj?.coords.latitude ? locationObj.coords.latitude : null;
        const longitude = locationObj?.coords.longitude ? locationObj.coords.longitude : null;
        if (latitude && longitude) {
            setIsLoading(true);
            const response = await placeService.getNearbyPlaces(category, latitude, longitude, radius, next_page_token)
            if (response.success && response.data !== null) {
                const res = response.data
                updateNearbyPlacesDetails(res.results)
                setNextPageToken(res.next_page_token ?? null)
                setErrorMessage("")
            } else {
                console.log(response.message)
                setErrorMessage("Unable to fetch nearby places, please try again later");
                setIsLoading(false);
                return false
            }
            setIsLoading(false);
        }
        return true;
    }

    // Group Utils
    const [groupId, setGroupId] = useState<string | null>(null)
    const [groupMatch, setGroupMatch] = useState<string | null>(null)
    const getGroupMatch = (): PlaceDetailRow | null => {
        if (!groupMatch) {
            return null
        }
        const filteredPlaces = nearbyPlacesDetails.filter(x => x.place_id === groupMatch)
        if (filteredPlaces.length === 0) {
            return null
        }
        return filteredPlaces[0]
    }
    const createGroup = async (min_match: number, radius: number, category: string): Promise<boolean> => {
        let locRes = null
        setIsLoading(true);
        setSpinnerContent("Getting your location")
        locRes = await reqLocPerms(QueryType.CREATE_GROUP);
        setIsLoading(false);
        let locationObj = locRes ?? location
        if (locationObj === null) {
            return false
        }
        const latitude = locationObj?.coords.latitude ? locationObj.coords.latitude : null;
        const longitude = locationObj?.coords.longitude ? locationObj.coords.longitude : null;
        if (latitude && longitude) {
            setIsLoading(true);
            setSpinnerContent("Getting places and Creating group ...")
            const response = await placeService.createGroup(category, min_match, latitude, longitude, radius)        
            if (response.success && response.data !== null) {
                const res = response.data    
                updateNearbyPlacesDetails(res.results)
                setNextPageToken(res.next_page_token ?? null)
                setGroupId(res.group_id)
                setErrorMessage("")
            } else {
                console.log(response.message)
                setErrorMessage("Server is facing too many requests. Please try again later");
                setIsLoading(false);
                return false;
            }
            setIsLoading(false);
        }
        return true;
    }
    const joinGroup = async (group_id: string): Promise<boolean> => {
        setIsLoading(true);
        setSpinnerContent("Looking for group ...")
        // Get cur location data for rendering distance
        await reqLocPerms(QueryType.JOIN_GROUP);
        const response = await placeService.joinGroup(group_id)
        if (response.success && response.data !== null) {
            const res = response.data
            updateNearbyPlacesDetails(res.results)
            setNextPageToken(res.next_page_token ?? null)
            setGroupId(res.group_id)

            if (res.place_id) {
                setGroupMatch(res.place_id)
            }
            setErrorMessage("")
        } else {
            setErrorMessage("Unable to join/find group. Please check the group id")
            setIsLoading(false);
            return false;
        }
        setIsLoading(false);
        return true
    }
    const groupGetNearbyPlaces = async (): Promise<boolean> => {
        if (nextPageToken === null) {
            return false;
        }
        if (groupId === null) {
            return false;
        }
        // setIsLoading(true);
        const response = await placeService.groupGetNearbyPlaces(groupId, nextPageToken)
        if (response.success && response.data !== null) {
            const res = response.data
            const newResults = res.results.filter(result => !nearbyPlacesDetails.map(x => x.place_id)
                                                                .includes(result.place_id))
            updateNearbyPlacesDetails(newResults)
            setNextPageToken(res.next_page_token ?? null)
            setErrorMessage("")
        } else {
            console.log(response.message);
            setErrorMessage("Unable to fetch new places. Please try again later")
            setIsLoading(false);
            return false
        }
        // setIsLoading(false);
        
        return true
    }
    const groupAddLike = async (place_id: string): Promise<boolean> => {
        if (groupId === null) {
            setErrorMessage("No group id found")
            return false;
        }
        // setIsLoading(true);
        const response = await placeService.groupAddLike(groupId, place_id)
        if (response.success && response.data !== null) {
            const res = response.data
            if (res !== null) {
                if (res.place_id) {
                    setGroupMatch(res.place_id)
                }
            }
            setErrorMessage("")
        } else {
            console.log(response.message);
            setErrorMessage("Unable to add like. Please try again later")
            setIsLoading(false);
            return false
        }
        // setIsLoading(false);
        
        return true
    }
    const groupHasMatch = async (): Promise<boolean> => {
        if (groupId === null) {
            setErrorMessage("No group id found")
            return false;
        }
        if (groupMatch !== null) {
            return true;
        }
        const response = await placeService.groupHasMatch(groupId)
        if (response.success && response.data !== null) {
            const res = response.data
            if (res.place_id) {
                setGroupMatch(res.place_id)
            }
            setErrorMessage("")
        } else {
            console.log(response.message);
            // setErrorMessage("Unable to check for match. Please try again later")
            return false
        } {
            setErrorMessage("");
        }
        return true
    }

    // Navigation
    const [curPlaceIdx, setCurPlaceIdx] = useState(0);
    const goNextPlace = async () => {
        setCurPlaceIdx(prev => prev + 1);
        if (curPlaceIdx === nearbyPlacesDetails.length - 15 && nextPageToken !== null) { // fetch more
            if (groupId !== null) { // if is in group
                await groupGetNearbyPlaces();
            } else {
                await fetchNearbyPlaces(nextPageToken, 0, "");
            }
        }
    }

    const resetPlaces = () => {
        setCurPlaceIdx(0);
        setErrorMessage("");
        setNearbyPlacesDetails([]);
        setNextPageToken("");
        setGroupId(null);
        setGroupMatch(null);
    }

    return (
        <PlaceContext.Provider
            value={{
                nearbyPlacesDetails,
                location,
                spinnerContent,
                reqLocPerms,
                fetchNearbyPlaces,
                isLoading,
                errorMessage,
                curPlaceIdx,
                resetPlaces,
                goNextPlace,
                // For create group
                categoryInfo,
                handleCategorySelect,
                // For groups
                groupId,
                groupMatch,
                getGroupMatch,
                createGroup,
                joinGroup,
                groupAddLike,
                groupHasMatch
            }}
        >
            {children}
        </PlaceContext.Provider>
    )
}