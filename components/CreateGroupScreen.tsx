import { useState, memo } from 'react';
import { usePlace } from "../contexts/PlacesContext";
import { View, Text, StyleSheet, SafeAreaView, useWindowDimensions, TextInput } from "react-native";
import { themeStyle } from "./styles";
import { createErrorAlert } from './ui_components/ErrorAlert';
import { NavigationProp } from '@react-navigation/native';
import { Screens } from './constants';
import SelectDropdown from 'react-native-select-dropdown';
import CustomButton from './ui_components/CustomButton';
import { RenderCategory } from './Categories/RenderCategory';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import PlaceAutocompleteInput from './ui_components/PlaceAutocomplete';

const RADIUS_OPTIONS = [100, 200, 300, 400, 500, 700, 1000, 2000, 3000, 5000]
const DEFAULT_RADIUS = 400

interface CreateGroupScreenProps {
    navigation: NavigationProp<any,any>,
}

const CreateGroupScreen: React.FC<CreateGroupScreenProps> = ({ navigation }) => {
    const place = usePlace()
    const {fontScale} = useWindowDimensions()
    const styles = makeStyles(fontScale)

    // Start Group
    const [minToMatch, setMinToMatch] = useState("")
    const [radius, setRadius] = useState(DEFAULT_RADIUS)
    const [targetLoc, setTargetLoc] = useState<null | { lat: number; lng: number;}>(null) // stores location to find nearby places
    const updateTargetLoc = (lat?: number, lng?: number) => {
        if (!(lat && lng)) {
            setTargetLoc(null)
            return
        }
        setTargetLoc(
            {
                lat,
                lng
            }
        )
    }
    const handleStartGroup = async () => {
        if (minToMatch.length === 0) {
            createErrorAlert("Please specify number of people")
            return
        }
        place.resetPlaces()

        // Get location for search
        if (!targetLoc) {
            createErrorAlert("Unable to get location")
            return
        }
        
        // Create group
        console.log(targetLoc)
        const success = await place.createGroup(targetLoc.lat, targetLoc.lng, parseInt(minToMatch), radius, place.categoryInfo.searchType)
        if (success) {
            navigation.navigate(Screens.GROUP)
        }
    }
    
    
    return (
        <SafeAreaView style={themeStyle.screenContainer}>
            <Spinner
                visible={place.isLoading}
                textContent={place.spinnerContent}
                overlayColor="rgba(25,25,25,0.5)"
                textStyle={themeStyle.spinnerTextStyle}
            />
            {/* <View style={styles.topWrapper}>
                <MaterialCommunityIcons name={"arrow-left-thick"} size={25} color={"black"} />
                <Text style={{fontSize: 14 / fontScale}}>Back</Text>
            </View> */}
            <View style={styles.contentContainer}>
                <View style={styles.contentWrapper}>
                    <View style={styles.headerWrapper}>
                        <RenderCategory 
                            categoryInfo={place.categoryInfo}
                            />
                    </View>
                    <View style={styles.inputWrapper}>
                        <View style={{
                            ...styles.inputSection,
                            zIndex: 100
                            }}>
                            <View style={{height: "100%"}}>
                                <PlaceAutocompleteInput 
                                    getCurrentLocation={place.getCurrentLocation}
                                    
                                    updateTargetLoc={updateTargetLoc}/>
                            </View>
                        </View>
                        <View style={styles.inputSection}>
                            <View style={{height: "100%"}}>
                                <TextInput 
                                    style={themeStyle.textInput} 
                                    placeholder="Number of People" 
                                    placeholderTextColor={"grey"}
                                    onChangeText={(text) => {
                                        setMinToMatch(text.replace(/[^0-9]/g, ''));
                                    }}
                                    value={minToMatch} 
                                    />
                            </View>
                        </View>
                        <View style={styles.inputSection}>
                            <View style={{height: "100%"}}>
                                <View style={themeStyle.dropdownContainer}>
                                    <View style={{width: "60%"}}>
                                        <Text style={themeStyle.dropdownLabel}>
                                            {"Distance from location"}
                                        </Text>
                                    </View>
                                    <View style={{height: "80%", width: "30%"}}>
                                        <SelectDropdown data={RADIUS_OPTIONS}
                                            onSelect={(selectedItem, idx) => {
                                                setRadius(selectedItem)
                                            }}
                                            defaultButtonText={DEFAULT_RADIUS.toString()}
                                            buttonStyle={themeStyle.dropDownButton}
                                            buttonTextStyle={themeStyle.dropDownButtonText}
                                            rowStyle={themeStyle.dropDownOption}
                                            rowTextStyle={themeStyle.dropDownOptionText}
                                            selectedRowStyle={themeStyle.dropDownOption}
                                            />
                                    </View>
                                    <View style={{width: "10%"}}>
                                        <Text style={themeStyle.dropdownLabel}>
                                            m
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.buttonWrapper}>
                        { !(targetLoc && minToMatch) && 
                            <Text style={{
                                width: "100%",
                                color: "red",
                                padding: 5,
                                fontSize: 14 / fontScale,
                                textAlign: "center",
                            }}>
                                Select location and number of people
                            </Text>
                        }
                        <View style={styles.buttonBox}>
                            {
                                <CustomButton 
                                    title="Start a group" // TBD
                                    disabled={!targetLoc}
                                    onPress={handleStartGroup}/>
                            }
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default memo(CreateGroupScreen);

const makeStyles = (fontScale: number) => StyleSheet.create({
    topWrapper: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 10
    },
    contentContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    contentWrapper: {
        height: "80%",
        paddingLeft: "5%",
        paddingRight: "5%",
        justifyContent: "center",
        alignItems: "center"  
    },
    headerWrapper: {
        height: "20%"
    },
    inputWrapper: {
        height: 200,
        zIndex: 100
    },
    inputSection: {
        padding: 10,
        flex: 1,    
    },
    buttonWrapper: {
        height: "20%",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonBox: {
        height: "40%",
        aspectRatio: 3
    }
})