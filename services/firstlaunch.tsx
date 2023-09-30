import { useState } from 'react';
import { storage } from './async_storage'

const useLaunchState = () => {
    const [hasLaunched, setHasLaunched] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkFirstLaunch = async () => {
        const firstLaunch = await storage.getData("HAS_LAUNCH");
        if (firstLaunch != null) {
            setHasLaunched(true);
        } else {
            await storage.storeData("HAS_LAUNCH", 'true');
        }
        setIsLoading(false);
    }

    return {
        isLoading,
        hasLaunched,
        checkFirstLaunch
    }
}

export default useLaunchState;