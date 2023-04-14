import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, Text, Modal, Pressable } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { PlaceDetailRow } from "../../services/places/interfaces";
import { themeStyle } from "../styles";
import { LocationObject } from 'expo-location';
import PlaceCard from "./PlaceCard";

interface PlacesMatchModalProps {
    place: PlaceDetailRow | null;
    isVisible: boolean;
    toggleModal: () => void;
    userLoc: LocationObject | null;
}

const PlacesMatchModal = (props: PlacesMatchModalProps) => {

    return (
        <Modal visible={props.isVisible} animationType="slide">
            <StatusBar style="dark"/>
            <View style={themeStyle.screenContainer}>
                <View style={styles.modalWrapper}>
                    <Pressable style={styles.cancelButton} onPress={props.toggleModal}>
                        <MaterialCommunityIcons name="close-thick" size={30} color="#900" />
                    </Pressable>
                    <Pressable onPress={props.toggleModal}>
                        <Text style={{fontSize: 30, fontWeight: "600", color:"#b08205"}}>You found a match!</Text>
                    </Pressable>
                    { props.place ? 
                        <PlaceCard
                            place={props.place}
                            userLoc={props.userLoc}/>
                        :
                        <Text>No Match Yet</Text>
                    }
                </View>
            </View>
        </Modal>
    )
}

export default PlacesMatchModal;

const styles = StyleSheet.create({
    modalWrapper: {
        height: "100%",
        width: "100%",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 70,
    },
    cancelButton: {
        position: "absolute",
        padding: 20,
        top: 30,
        right: 0,
        zIndex: 20,
    }
})