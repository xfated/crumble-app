import { useState, useEffect, useRef, useMemo, memo } from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';
import { LocationObject } from 'expo-location';
import { SearchBar } from '@rneui/themed';
import { debounce } from 'lodash';

import { geocoding } from '../../services/places/geocoding';
import { autocomplete } from '../../services/places/autocomplete';
import { themeStyle } from "../styles";
import CustomButton from './CustomButton';
import { createErrorAlert } from './ErrorAlert';

interface AutocompleteProps {
    getCurrentLocation: () => Promise<LocationObject | null>
    updateTargetLoc: (lat: number, lng: number) => void;
}

const PlaceAutocompleteInput: React.FC<AutocompleteProps> = (props) => {
    const {fontScale} = useWindowDimensions()
    const styles = makeStyle(fontScale)

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
        if (!(currentLoc?.coords.latitude && currentLoc.coords.longitude)) {
            createErrorAlert("Unable to get your location")
            return
        }
        props.updateTargetLoc(currentLoc.coords.latitude, currentLoc.coords.longitude)
        
        // get address for text
        const geocodingRes = await geocoding.LatLngToAddress(currentLoc.coords.latitude, currentLoc.coords.longitude)
        const currentAddress = geocodingRes.data?.formatted_address
        if (!currentAddress) {
            createErrorAlert("Unable to get your location")
            return
        }
        setInputText(currentAddress)   
    }

    return (
        <View style={styles.containerWrapper}>
            <View style={{width: "65%"}}>
                <SearchBar 
                    platform="default"
                    lightTheme={true}
                    placeholder="Select Location"
                    showLoading={predictionsLoading}
                    onChangeText={(text) => {
                        getPredictionsWithDebounce();
                        setInputText(text);
                    }}
                    containerStyle={styles.containerStyle}
                    inputContainerStyle={styles.inputContainerStyle}
                    inputStyle={styles.inputStyle}
                    value={inputText}
                />
            </View>
            <View style={{width: "30%"}}>
                <CustomButton title="Use current location" // TBD
                    onPress={useCurrentLocation}/>
            </View>
        </View>
    )
}

export default memo(PlaceAutocompleteInput);

const makeStyle = (fontScale: number) => StyleSheet.create({
    containerWrapper: {
        width: "100%",
        height: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    containerStyle: {
        padding: 0,
        borderRadius: 4,
        backgroundColor: 'rgba(242, 237, 194, 0.5)',
        borderColor: '#d19f2a',
        borderWidth: 1,

        // overwrite preset
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: '#d19f2a',
        borderBottomColor: '#d19f2a'
    },
    inputContainerStyle: {
        backgroundColor: "transparent",
    },
    inputStyle: {
        color: "black"
    },
})