import { useState, useEffect, useRef, useMemo, memo } from 'react';
import { themeStyle } from '../styles';
import { View} from 'react-native';
import { LocationObject } from 'expo-location';
import { SearchBar } from '@rneui/themed';
import { debounce } from 'lodash';

import { geocoding } from '../../services/places/geocoding';
import { autocomplete } from '../../services/places/autocomplete';
import CustomButton from './CustomButton';

interface AutocompleteProps {
    getCurrentLocation: () => Promise<LocationObject | null>
    updateTargetLoc: (lat: number, lng: number) => void;
}

const PlaceAutocompleteInput: React.FC<AutocompleteProps> = (props) => {

    const [inputText, setInputText] = useState("")

    // Handle predictions
    const [predictionsLoading, setPredictionsLoading] = useState(false)
    const [predictions, setPredictions] = useState<string[]>([])
    const predictionRef: any = useRef();
    const getPredictions = async () => {
        if (inputText.length > 0) {
            setPredictionsLoading(true)
            const predictions = await autocomplete.autocompleteAddress(inputText)
            setPredictionsLoading(false)
            setPredictions(predictions.data?.predictions ?? [])
            console.log(predictions)
        }
    }
    useEffect(() => {
        predictionRef.current = getPredictions
    }, [getPredictions])
    const getPredictionsWithDebounce = useMemo(() => {
        const callback = () => predictionRef.current?.()
        return debounce(callback, 500)
    }, []);

    // Handle location
    const useCurrentLocation = async () => {
        const currentLoc = await props.getCurrentLocation();
        // set lat long
        if (currentLoc?.coords.latitude && currentLoc.coords.longitude) {
            props.updateTargetLoc(currentLoc.coords.latitude, currentLoc.coords.longitude)
        }
        // get address for text

    }
    

    return (
        <View style={themeStyle.dropdownContainer}>
            <View style={{width: "60%"}}>
                <SearchBar 
                    placeholder="Select Location"
                    showLoading={predictionsLoading}
                    onChangeText={(text) => {
                        getPredictionsWithDebounce();
                        setInputText(text);
                    }}
                    value={inputText}
                />
            </View>
            <View style={{width: "40%"}}>
                <CustomButton title="Use current location" // TBD
                    onPress={useCurrentLocation}/>
            </View>
        </View>
    )
}

export default memo(PlaceAutocompleteInput);
