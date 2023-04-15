import { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, Image, Dimensions, useWindowDimensions } from "react-native";
import { NavigationProp } from "@react-navigation/native"
import SelectDropdown from "react-native-select-dropdown";

import { Screens } from './constants';
import CustomButton from "./ui_components/CustomButton";
import { themeStyle } from "./styles";
import { usePlace } from '../contexts/PlacesContext';
import { createErrorAlert } from "./ui_components/ErrorAlert";
import Spinner from "react-native-loading-spinner-overlay";
import { placeService } from "../services/places/places";
import InvalidVersionModal from "./ui_components/InvalidVersionModal";

export interface HomeScreenProps {
    navigation: NavigationProp<any,any>
}

const RADIUS_OPTIONS = [100, 200, 300, 400, 500, 700, 1000, 2000, 3000, 5000]
const DEFAULT_RADIUS = 400
const CATEGORY_OPTIONS = ["food", "takeaway", "bars", "attractions"]
const CATEGORY_MAP: {[val:string]: string} = {
    "food": "restaurant",
    "takeaway": "meal_takeaway",
    "bars": "bar",
    "attractions": "tourist_attraction"
}
const DEFAULT_CATEGORY = "food"
const screenWidth = Dimensions.get('window').width;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const place = usePlace();
    const {fontScale} = useWindowDimensions()
    const styles = makeStyles(fontScale)

    // const handleSolo = async () => {
    //     place.resetPlaces();
    //     const success = await place.fetchNearbyPlaces("");
    //     if (success) {
    //         navigation.navigate(Screens.INDIVIDUAL);
    //     }
    // }

    // Check versioning
    const [versionIsValid, setVersionIsValid] = useState(true);
    useEffect(() => {
        (async () => {
            const response = await placeService.checkVersion()
            if (response.success && response.data !== null) {
                setVersionIsValid(response.data.result)
            }
        })();
    }, [])

    // Start Group
    const [minToMatch, setMinToMatch] = useState("")
    const [radius, setRadius] = useState(DEFAULT_RADIUS)
    const [category, setCategory] = useState(DEFAULT_CATEGORY)
    const handleStartGroup = async () => {
        if (minToMatch.length === 0) {
            createErrorAlert("Please specify number of people")
            return
        }
        place.resetPlaces()
        const success = await place.createGroup(parseInt(minToMatch), radius, CATEGORY_MAP[category])
        if (success) {
            navigation.navigate(Screens.GROUP)
        }
    }

    useEffect(() => {
        if (place.errorMessage !== "") {
            createErrorAlert(place.errorMessage)
        }
    }, [place.errorMessage])

    // Join Group
    const [joinGroupId, setJoinGroupId] = useState("")
    const handleJoinGroup = async () => {
        if (joinGroupId === place.groupId) {
            navigation.navigate(Screens.GROUP)
            return;
        }
        if (joinGroupId.length !== 6) {
            createErrorAlert("Invalid group ID")
            return
        }
        place.resetPlaces()
        const success = await place.joinGroup(joinGroupId)
        if (success) {
            navigation.navigate(Screens.GROUP)
        }
    }
    
    return (
        <View style={themeStyle.screenContainer}>
            <Spinner
                visible={place.isLoading}
                textContent={place.spinnerContent}
                overlayColor="rgba(25,25,25,0.5)"
                textStyle={styles.spinnerTextStyle}
            />
            <InvalidVersionModal isVisible={!versionIsValid} />
            <View>
                <View style={styles.inputContainer}>
                    {/* <View style={styles.soloContainer}>
                        <CustomButton title="Explore Solo"
                            onPress={handleSolo} />
                    </View> */}
                    <View style={styles.startGroupContainer}>
                        <View style={styles.inputBox}>
                            <View style={styles.inputWrapper}>
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
                            <View style={styles.inputWrapper}>
                                <View style={themeStyle.dropdownContainer}>
                                    <View style={{width: "50%"}}>
                                        <Text style={themeStyle.dropdownLabel}>Distance (m)</Text>
                                    </View>
                                    <View style={{width: "50%"}}>
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
                                </View>
                            </View>
                            <View style={styles.inputWrapper}>
                                <View style={themeStyle.dropdownContainer}>
                                    <View style={{width: "40%"}}>
                                        <Text style={themeStyle.dropdownLabel}>Category</Text>
                                    </View>
                                    <View style={{width: "60%"}}>
                                        <SelectDropdown data={CATEGORY_OPTIONS}
                                            onSelect={(selectedItem, idx) => {
                                                setCategory(selectedItem)
                                            }}
                                            defaultButtonText={DEFAULT_CATEGORY.toString()}
                                            buttonStyle={themeStyle.dropDownButton}
                                            buttonTextStyle={themeStyle.dropDownButtonText}
                                            rowStyle={themeStyle.dropDownOption}
                                            rowTextStyle={themeStyle.dropDownOptionText}
                                            selectedRowStyle={themeStyle.dropDownOption}
                                            />
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.buttonBox}>
                            <CustomButton title="Start a group" // TBD
                                onPress={handleStartGroup}/>
                        </View>
                    </View>
                    <View style={styles.joinGroupContainer}>
                        <View style={styles.inputBox}>
                            <View style={{width: "100%", height: "60%"}}>
                                <TextInput 
                                    style={themeStyle.textInput} 
                                    placeholder="Group ID" 
                                    placeholderTextColor={"grey"}
                                    onChangeText={(text) => {
                                        setJoinGroupId(text);
                                    }}
                                    value={joinGroupId} 
                                    />
                            </View>
                        </View>
                        <View style={styles.buttonBox}>
                            <CustomButton title="Join a group" // TBD
                                onPress={handleJoinGroup}/>
                        </View>
                    </View>
                </View>
                <View style={styles.infoContainer}>
                    <Image
                        style={styles.tutorialImage}
                        source={require('../assets/images/tutorial.png')}
                        resizeMode={"contain"}
                        />
                    {/* <View style={{backgroundColor: "rgba(255,0,0,0.2)"}}>
                        <Tutorial width={screenWidth} height={screenWidth}/>
                    </View> */}
                </View>
            </View>
        </View>
    )
}

export default HomeScreen;

const makeStyles = (fontScale: number) => StyleSheet.create({
    spinnerTextStyle: {
        color: 'white',
        borderRadius: 10,
        textAlign: "center",
        padding: 5,
    },
    inputContainer: {
        height: "40%",
        justifyContent: "center",
        alignItems: "center"
    },
    infoContainer: {
        width: screenWidth,
        height: "60%",
        justifyContent: "center",
        alignItems: "center",
    }, 
    // soloContainer: {
    //     flex: 1,
    //     width: "90%",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     borderBottomColor: "grey",
    //     borderBottomWidth: 2
    // },
    startGroupContainer: {
        flex: 2,
        width: "90%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        borderBottomColor: "grey",
        borderBottomWidth: 2,
    },
    joinGroupContainer: {
        flex: 1,
        width: "90%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    inputBox: {
        width: "60%",
        height: "100%",
        paddingTop: "2%",
        paddingBottom: "2%",
        justifyContent: "space-evenly",
        alignItems: "center"
    },
    inputWrapper: {
        flex: 1, 
        width: "100%", 
        paddingTop: 5,
        paddingBottom: 5,
    },
    buttonBox: {
        width: "40%"
    },
    tutorialImage: {
        height: "90%",
        maxHeight: screenWidth * 0.9,
        aspectRatio: 1,
        margin: 5,
        borderRadius: 5,
    }
})