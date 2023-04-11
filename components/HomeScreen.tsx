import { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { NavigationProp } from "@react-navigation/native"
import SelectDropdown from "react-native-select-dropdown";

import { Screens } from './constants';
import CustomButton from "./ui_components/CustomButton";
import { themeStyle } from "./styles";
import { usePlace } from '../contexts/PlacesContext';
import { createErrorAlert } from "./ui_components/ErrorAlert";

export interface HomeScreenProps {
    navigation: NavigationProp<any,any>
}

const RADIUS_OPTIONS = [100, 200, 300, 400, 500]
const DEFAULT_RADIUS = 300

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    
    const place = usePlace();
    const handleSolo = async () => {
        place.resetPlaces();
        const success = await place.fetchNearbyPlaces("");
        if (success) {
            navigation.navigate(Screens.INDIVIDUAL);
        }
    }

    // Start Group
    const [minToMatch, setMinToMatch] = useState("")
    const [radius, setRadius] = useState(DEFAULT_RADIUS)
    const handleStartGroup = async () => {
        place.resetPlaces()
        const success = await place.createGroup(parseInt(minToMatch), radius)
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
        place.resetPlaces()
        const success = await place.joinGroup(joinGroupId)
        if (success) {
            navigation.navigate(Screens.GROUP)
        } else {
            createErrorAlert(place.errorMessage)
        }
    }

    useEffect(() => {
        console.log(place.errorMessage)
    }, [place.errorMessage]
    )
    return (
        <View style={themeStyle.screenContainer}>
            { !place.isLoading ?
                <View>
                    <View style={styles.inputContainer}>
                        {/* <View style={styles.soloContainer}>
                            <CustomButton title="Explore Solo"
                                onPress={handleSolo} />
                        </View> */}
                        <View style={styles.startGroupContainer}>
                            <View style={styles.inputBox}>
                                <TextInput 
                                    style={themeStyle.textInput} 
                                    placeholder="Number of People" 
                                    onChangeText={(text) => {
                                        setMinToMatch(text.replace(/[^0-9]/g, ''));
                                    }}
                                    value={minToMatch} 
                                    />
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
                            <View style={styles.buttonBox}>
                                <CustomButton title="Start a group" // TBD
                                    onPress={handleStartGroup}/>
                            </View>
                        </View>
                        <View style={styles.joinGroupContainer}>
                            <View style={styles.inputBox}>
                                <TextInput 
                                    style={themeStyle.textInput} 
                                    placeholder="Group ID" 
                                    onChangeText={(text) => {
                                        setJoinGroupId(text);
                                    }}
                                    value={joinGroupId} 
                                    />
                            </View>
                            <View style={styles.buttonBox}>
                                <CustomButton title="Join a group" // TBD
                                    onPress={handleJoinGroup}/>
                            </View>
                        </View>
                    </View>
                    <View style={styles.pictureContainer}>
                        <Text>Placeholder Image</Text>
                    </View>
                </View>
                :
                <Text>Loading</Text>
            }
        </View>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    pictureContainer: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center"
    },
    inputContainer: {
        flex: 3,
        justifyContent: "center",
        alignItems: "center"
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
        flex: 1,
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
        width: "50%",
        height: "60%",
        justifyContent: "space-around",
        alignItems: "center"
    },
    buttonBox: {
        width: "50%"
    }
})