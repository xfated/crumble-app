import { usePlace } from "../../contexts/PlacesContext";
import { View, Button, Text, FlatList, StyleSheet } from "react-native";
import PlacesRender from "./PlacesRender/PlacesRender";
import { themeStyle } from "./styles";

const IndividualSearchScreen = () => {
    const places = usePlace()

    const handleLike = () => {
        console.log("Like");
        places.goNextPlace();
    };
    const handleDislike = () => {
        console.log("Dislike");
        places.goNextPlace();
    }
    
    return (
        <View style={themeStyle.screenContainer}>
            <PlacesRender
                places={places.nearbyPlacesDetails}
                curIdx={places.curPlaceIdx}
                handleLike={handleLike}
                handleDislike={handleDislike} />
        </View>
    )
}

export default IndividualSearchScreen;

const styles = StyleSheet.create({
})