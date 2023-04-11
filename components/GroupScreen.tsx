import { useEffect, useState } from 'react';
import { usePlace } from "../contexts/PlacesContext";
import { View, Text, StyleSheet, Pressable } from "react-native";
import PlacesRender from "./PlacesRender/PlacesRender";
import { themeStyle } from "./styles";
import PlacesMatchModal from './PlacesRender/PlacesMatchModal';

const GroupScreen = () => {
    const places = usePlace()

    const handleLike = () => {
        places.groupAddLike(places.nearbyPlacesDetails[places.curPlaceIdx].place_id)
        places.goNextPlace();
    };
    const handleDislike = () => {
        places.goNextPlace();
    }
    
    // Poll for match
    useEffect(() => {
        const intervalId = setInterval(() => {
            places.groupHasMatch();
        }, 1000)
        return () => {
            clearInterval(intervalId)
        }
    }, [])

    // Modal to display match
    const [modalIsVisible, setModalIsVisible] = useState(false)
    const toggleModal = () => {
        setModalIsVisible(prevState => !prevState);
    }
    useEffect(() => {
        if (places.groupMatch !== null && places.groupMatch.length > 0) {
            setModalIsVisible(true)
        }
    }, [places.groupMatch])
    
    return (
        <View style={themeStyle.screenContainer}>
            <PlacesMatchModal 
                place={places.getGroupMatch()}
                toggleModal={toggleModal}
                isVisible={modalIsVisible}
            />
            <View style={styles.groupInfoContainer}>
                <Text style={{fontSize: 14, fontWeight: "500"}}>
                    Group ID:{'   '}
                    <Text style={{fontSize: 20, fontWeight: "800", color: "#0f3a3d"
                        }}>{places.groupId}</Text>
                </Text>
                { places.groupMatch ? 
                    <Pressable style={{backgroundColor: "#092729", borderRadius: 4, padding: 7}}
                        onPress={toggleModal}>
                        <Text style={{color: "#fff"}}>
                            View Match
                        </Text>
                    </Pressable>
                    : <Text></Text>
                }
            </View>
            <View style={styles.placesContainer}>
                <PlacesRender
                    places={places.nearbyPlacesDetails}
                    curIdx={places.curPlaceIdx}
                    handleLike={handleLike}
                    handleDislike={handleDislike} />
            </View>
        </View>
    )
}

export default GroupScreen;

const styles = StyleSheet.create({
    groupInfoContainer: {
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        paddingTop: 6,
        paddingLeft: 20,
        paddingRight: 20,
    },
    placesContainer: {
        flex: 1
    }
})