import { View, StyleSheet, Text, Pressable } from "react-native";
import { PlaceDetailRow } from "../../../services/places/interfaces";
import { themeStyle } from "../styles";

import PlaceCard from "./PlaceCard";

interface PlacesRenderProps {
    places: PlaceDetailRow[];
    curIdx: number;
    handleLike: () => void;
    handleDislike: () => void;
}

const PlacesRender = (props: PlacesRenderProps) => {
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
                            <Pressable style={styles.dislikeButton} onPress={props.handleDislike}>
                                <Text>Dislike</Text>
                            </Pressable>
                        </View>
                        <View>
                            <Pressable style={styles.likeButton} onPress={props.handleLike}>
                                <Text>Like</Text>
                            </Pressable>
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
        height: "80%",
        backgroundColor: "red",
    },
    inputContainer: {
        width: "100%",
        height: "20%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: "grey",
    },
    likeButton: {
        backgroundColor: "#a7ebad",
        justifyContent: "center",
        alignItems: "center",
        width: 120,
        aspectRatio: 1,
        borderRadius: 60,
    },
    dislikeButton: {
        backgroundColor: "#e86b6b",
        justifyContent: "center",
        alignItems: "center",
        width: 120,
        aspectRatio: 1,
        borderRadius: 60,
    }
})