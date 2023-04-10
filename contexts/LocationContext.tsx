import { createContext, useContext } from "react";
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

type LocationContextType = {
    location: Location.LocationObject | null;
    reqLocPerms: () => Promise<void>;
}

interface LocationContextProps {
    children?: React.ReactNode;
}

const LocationContext = createContext<LocationContextType | null>(null);

export const useLocation = () => useContext(LocationContext);

export const LocationContextProvider: React.FC<LocationContextProps> = ({ children }) => {

    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    const reqLocPerms = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
    }

    useEffect(() => {
        reqLocPerms()
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <LocationContext.Provider
            value={{
                location,
                reqLocPerms
            }}
        >
            {children}
        </LocationContext.Provider>
    )
}