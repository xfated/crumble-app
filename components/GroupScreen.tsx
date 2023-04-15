import { useEffect, useState, memo } from 'react';
import { usePlace } from "../contexts/PlacesContext";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, useWindowDimensions } from "react-native";
import * as Clipboard from 'expo-clipboard';
import PlacesRender from "./PlacesRender/PlacesRender";
import { themeStyle } from "./styles";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import PlacesMatchDisplay from './PlacesRender/PlacesMatchDisplay';

const GroupScreen = () => {
    const places = usePlace()
    const {fontScale} = useWindowDimensions()
    const styles = makeStyles(fontScale)

    const handleLike = async () => {
        await places.groupAddLike(places.nearbyPlacesDetails[places.curPlaceIdx].place_id)
        places.goNextPlace();
    };
    const handleDislike = async() => {
        places.goNextPlace();
    }
    
    const copyGroupIdToClipboard = async () => {
        if (places.groupId !== null) {
            await Clipboard.setStringAsync(places.groupId)
            Toast.show({
                text1: "Copied to clipboard"
            })
        }
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
        <SafeAreaView style={themeStyle.screenContainer}>
            <View style={{ zIndex: 20}}>
                <Toast 
                    type="info"
                    position="top"
                    visibilityTime={500}
                    />
            </View>
            <View style={styles.groupInfoContainer}>
                <TouchableOpacity onPress={copyGroupIdToClipboard}>
                    <Text style={{fontSize: 14 / fontScale, fontWeight: "500"}}>
                        Group ID:{' '}
                        <Text style={{fontSize: 20 / fontScale, fontWeight: "800", color: "#0f3a3d",
                            }}>{places.groupId}</Text>
                        {` `}
                        <MaterialCommunityIcons name="content-copy" size={20} color="black" />
                    </Text>
                </TouchableOpacity>
                {/* { places.groupMatch ? 
                    <Pressable style={{backgroundColor: "#092729", borderRadius: 4, padding: 7}}
                        onPress={toggleModal}>
                        <Text style={{color: "#fff"}}>
                            View Match
                        </Text>
                    </Pressable>
                    : <Text></Text>
                } */}
            </View>
            <View style={styles.placesContainer}>
                { places.groupMatch ?
                    <PlacesMatchDisplay
                        place={places.getGroupMatch()}
                        userLoc={places.location}
                    />
                    :
                    <PlacesRender
                        places={places.nearbyPlacesDetails}
                        curIdx={places.curPlaceIdx}
                        handleLike={handleLike}
                        handleDislike={handleDislike} 
                        userLoc={places.location}/>
                }
            </View>
        </SafeAreaView>
    )
}

export default memo(GroupScreen);

const makeStyles = (fontScale: number) => StyleSheet.create({
    groupInfoContainer: {
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 10,
        paddingRight: 10,
    },
    placesContainer: {
        flex: 1
    }
})