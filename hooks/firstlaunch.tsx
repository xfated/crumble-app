import { useState, useEffect } from 'react';
import { storage } from '../services/async_storage'

const useLaunchState = () => {
    const [hasLaunched, setHasLaunched] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkFirstLaunch = async () => {
        const firstLaunch = await storage.getData("HAS_LAUNCH");
        if (firstLaunch !== null) {
            setHasLaunched(true);
        } else {
            await storage.storeData("HAS_LAUNCH", 'true');
        }
        setIsLoading(false);
    }

    useEffect(() => {
        checkFirstLaunch();     
    }, [])

    return {
        isLoading,
        hasLaunched
    }
}

export default useLaunchState;