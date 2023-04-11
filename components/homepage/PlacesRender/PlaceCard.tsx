import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Linking, Pressable, Image } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

import { PlaceDetailRow } from "../../../services/places/interfaces";
import { themeStyle } from "../styles";

interface PlaceCardProps {
    place: PlaceDetailRow
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
    const [placeUrlValid, setPlaceUrlValid] = useState(false)
    useEffect(() => {
        (async () => {
            const isValid = await Linking.canOpenURL(place.url)
            setPlaceUrlValid(isValid)
        })();
    }, [place.url])
    const handlePlaceUrlPress = async () => {
        if (placeUrlValid) {
            await Linking.openURL(place.url)
        }
    }

    return (
        <View style={styles.placeCardContainer}>
            <View style={styles.imageContainer}>
                <Image style={styles.templateImage}
                    blurRadius={30}
                    source={require('../../../assets/images/placePlaceholder.jpg')} />
            </View>
            <View style={styles.descriptionContainer}>
                <View style={styles.title}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: "bold"
                    }}>{place.name}</Text>
                </View>
                <View style={styles.address}>
                    { placeUrlValid &&
                        <Pressable onPress={handlePlaceUrlPress}
                            style={{
                                padding: 5,
                                margin: 5,
                                borderColor: "#30757a",
                                borderRadius: 5,
                                borderWidth: 1,
                            }}>
                            <Icon name="map" size={25} color="#900" />
                        </Pressable>
                    }
                    <Text style={{ flex: 1 }}>{place.vicinity}</Text>
                </View>
                <View style={styles.info}>
                    <View style={{ flexDirection: "row" }}>
                        { place.price_level &&
                            <Text>Price:{` `}
                                <Text style={{ fontWeight: "bold" }}>{"$".repeat(place.price_level)}</Text>
                            </Text>
                        }
                    </View>
                    <View>
                        { (place.rating && place.user_ratings_total) &&
                            <Text>Rated{` `}
                                <Text style={themeStyle.boldText}>{place.rating}</Text>
                                {` `}by{` `}
                                <Text style={themeStyle.boldText}>{place.user_ratings_total}</Text>
                            </Text>
                        }
                    </View>
                </View>
                <View style={styles.reviews}>
                    <Text style={{
                        color: "#423e3c",
                    }}>Recent reviews:</Text>
                    <FlatList data={place.reviews}
                        keyExtractor={(item, index) => item.id.toString()}
                        alwaysBounceVertical={false}
                        renderItem={({item}) => {
                            return (
                                <View style={styles.reviewContainer}>
                                    <View style={styles.reviewInfoContainer}>
                                        <Text>{`Rating: ${item.rating}`}</Text>
                                        <Text style={{
                                            fontSize: 12,
                                            color: "grey",
                                            fontStyle: "italic"
                                        }}>{item.relative_time_description}</Text>
                                    </View>
                                    <Text style={styles.reviewText}>{item.text}</Text>
                                </View>
                            )        
                        }}
                        />
                </View>
            </View>
        </View>
    )
}

export default PlaceCard;

const styles = StyleSheet.create({
    placeCardContainer: {
        height: "97%",
        width: "97%",
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
        padding: 10,
        borderRadius: 20,
        borderColor: "#de603a",
        borderWidth: 2
    }, 
    imageContainer: {
        height: "30%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    templateImage: {
        height: "90%",
        aspectRatio: 1,
        borderRadius: 5,
    },
    descriptionContainer: {
        height: "70%",
        width: "100%"
    },
    title: {
        alignItems: "center"
    },
    address: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    info: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 10,
    },

    // Reviews
    reviews: {
        flex: 1,
    },
    reviewContainer: {
        borderRadius: 10,
        backgroundColor: "#f7ffc7",
        paddingTop: 7,
        paddingBottom: 7,
        marginTop: 2,
        marginBottom: 2,
    },
    reviewInfoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: "rgba(10,10,10,0.2)",
        borderBottomWidth: 1,
        padding: 4
    },
    reviewText: {
        paddingLeft: 4,
        margin: 6,
    }
})