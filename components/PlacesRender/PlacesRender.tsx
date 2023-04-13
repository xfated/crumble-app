import { View, StyleSheet, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { PlaceDetailRow } from "../../services/places/interfaces";
import { themeStyle } from "../styles";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import PlaceCard from "./PlaceCard";

interface PlacesRenderProps {
    places: PlaceDetailRow[];
    curIdx: number;
    handleLike: () => void;
    handleDislike: () => void;
}

const PlacesRender = (props: PlacesRenderProps) => {
    const {fontScale} = useWindowDimensions()
    
    if (props.curIdx >= props.places.length) {
        return (
            <View style={themeStyle.fitContainer}>
                <Text style={{fontSize: 30 / fontScale, fontWeight: "800"}}>{"Out of options"}</Text>
                <MaterialCommunityIcons name="store-off" size={100 / fontScale} color="brown" />
            </View>
        )
    }
    return (
        <View>
            { props.places[props.curIdx] ? 
                <View style={themeStyle.fitContainer}>
                    <View style={styles.placeContainer}>
                        <PlaceCard
                            place={props.places[props.curIdx]}/>
                    </View>
                    <View style={styles.inputContainer}>
                        <View>
                            <TouchableOpacity style={styles.dislikeButton} onPress={props.handleDislike}>
                                <MaterialCommunityIcons name="close-outline" size={40} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity style={styles.likeButton} onPress={props.handleLike}>
                                <MaterialCommunityIcons name="heart-outline" size={40} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>            
                </View>
                :
                <Text>Loading...</Text>
            }
        </View>
    )
}

export default PlacesRender;

const styles = StyleSheet.create({
    placeContainer: {
        height: "83%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    inputContainer: {
        width: "100%",
        height: "17%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    likeButton: {
        backgroundColor: "#23611f",
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        aspectRatio: 1,
        borderRadius: 40,
    },
    dislikeButton: {
        backgroundColor: "#750e17",
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        aspectRatio: 1,
        borderRadius: 40,
    }
})