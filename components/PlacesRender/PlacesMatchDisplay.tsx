import { View, StyleSheet, Text, Linking, useWindowDimensions, TouchableOpacity } from "react-native";
import { PlaceDetailRow } from "../../services/places/interfaces";
import { LocationObject } from 'expo-location';
import PlaceCard from "./PlaceCard";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FeedbackModal from "../ui_components/FeedbackPopup";

interface PlacesMatchDisplayProps {
    place: PlaceDetailRow | null;
    userLoc: LocationObject | null;
}

const PlacesMatchDisplay = (props: PlacesMatchDisplayProps) => {
    const {fontScale} = useWindowDimensions()
    const styles = makeStyles(fontScale)

    const handlePlaceUrlPress = async () => {
        if (props.place !== null) {
            await Linking.openURL(props.place.url)
        }
    }

    return (
        <View style={styles.displayWrapper}>
            <View style={styles.headerWrapper}>
                <Text style={{fontSize: 24 / fontScale, fontWeight: "600", color:"#b08205"}}>You found a match!</Text>
                {/* <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.getDirectionsButtonWrapper}onPress={() => handlePlaceUrlPress()}>
                        <Text style={styles.getDirectionsButton}>Get Directions</Text>
                        <MaterialCommunityIcons name="directions" size={30} color="black" />
                    </TouchableOpacity>
                </View> */}
            </View>
            <View style={styles.cardWrapper}>
                { props.place ? 
                    <PlaceCard
                        place={props.place}
                        userLoc={props.userLoc}/>
                    :
                    <Text>No Match Yet</Text>
                }
            </View>
            <FeedbackModal />
        </View>
    )
}

export default PlacesMatchDisplay;

const makeStyles = (fontScale: number) => StyleSheet.create({
    displayWrapper: {
        height: "100%",
        width: "100%",
        position: "relative",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    headerWrapper: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        height: "8%",
    },
    cardWrapper: {
        height: "80%"
    },
    buttonContainer: {
        height: "100%",
    },
    getDirectionsButtonWrapper: {
        height: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#a5e8ad",
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 5,
    },
    getDirectionsButton: {
        color: "black",
        fontSize: 18 / fontScale,
        fontWeight: "600"
    }
})