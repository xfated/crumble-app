import { useState } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { usePlace } from '../../contexts/PlacesContext';
import { NavigationProp } from "@react-navigation/native"
import { Screens } from './constants';
import CustomButton from "../ui_components/CustomButton";
import { themeStyle } from "./styles";

export interface HomeScreenProps {
    navigation: NavigationProp<any,any>
}

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

    // Join Group
    const [joinGroupId, setJoinGroupId] = useState("")

    return (
        <View style={themeStyle.screenContainer}>
            { !place.isLoading ?
                <View>
                    <View style={styles.pictureContainer}>
                        <Text>Placeholder Image</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={styles.soloContainer}>
                            <CustomButton title="Explore Solo"
                                onPress={handleSolo} />
                        </View>
                        <View style={styles.startGroupContainer}>
                            <View>
                                <TextInput 
                                    style={themeStyle.textInput} 
                                    placeholder="Number of People" 
                                    onChangeText={(text) => {
                                        setMinToMatch(text.replace(/[^0-9]/g, ''));
                                    }}
                                    value={minToMatch} 
                                    />
                            </View>
                            <CustomButton title="Start a group" // TBD
                                onPress={() => {}}/>
                        </View>
                        <View style={styles.joinGroupContainer}>
                            <View>
                                <TextInput 
                                    style={themeStyle.textInput} 
                                    placeholder="Number of People" 
                                    onChangeText={(text) => {
                                        setMinToMatch(text.replace(/[^0-9]/g, ''));
                                    }}
                                    value={minToMatch} 
                                    />
                            </View>
                            <CustomButton title="Join a group" // TBD
                                onPress={() => {}}/>
                        </View>
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
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    inputContainer: {
        flex: 3,
        justifyContent: "center",
        alignItems: "center"
    },
    soloContainer: {
        flex: 1,
        width: "90%",
        justifyContent: "center",
        alignItems: "center",
        borderBottomColor: "grey",
        borderBottomWidth: 2
    },
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
    }
})