import { useState, useEffect, memo } from "react";
import { View, Text, StyleSheet, FlatList, Linking, Pressable, Image, Dimensions, useWindowDimensions } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { PlaceDetailRow } from "../../services/places/interfaces";
import PlaceholderFoodImage from "./PlaceholderFoodImage";

interface PlaceCardProps {
    place: PlaceDetailRow
}

const screenWidth = Dimensions.get('window').width;

const PlaceCard: React.FC<PlaceCardProps> = (props) => {
    const {fontScale} = useWindowDimensions()
    const styles = makeStyles(fontScale)

    const [placeUrlValid, setPlaceUrlValid] = useState(false)
    useEffect(() => {
        (async () => {
            const isValid = await Linking.canOpenURL(props.place.url)
            setPlaceUrlValid(isValid)
        })();
    }, [props.place.url])
    const handlePlaceUrlPress = async () => {
        if (placeUrlValid) {
            await Linking.openURL(props.place.url)
        }
    }

    return (
        <View style={styles.placeCardContainer}>
            <View style={styles.imageContainer}>
                { props.place.photos.length > 0 ?
                    <FlatList data={props.place.photos}
                        horizontal
                        keyExtractor={(item, index) => index.toString()}
                        alwaysBounceVertical={false}
                        renderItem={({item}) => {
                            return (
                                <View style={styles.imageItemWrapper}>
                                    <Image
                                        style={styles.image}
                                            source={{uri: item.data_url}}
                                            resizeMode={"cover"}
                                            />
                                </View>
                            )        
                        }}
                    />
                    :
                    <PlaceholderFoodImage />
                }
            </View>
            <View style={styles.descriptionContainer}>
                <View style={styles.header}>
                    <View style={styles.title}>
                        <Text style={{
                            fontSize: 16 / fontScale,
                            fontWeight: "bold"
                        }}>{props.place.name}</Text>
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
                                    backgroundColor: "#f2da96",
                                    shadowColor: "#000",
                                    shadowOffset: {width: 0, height: 1},
                                    shadowOpacity: 0.8,
                                    shadowRadius: 2,
                                    elevation: 5,
                                }}>
                                <MaterialCommunityIcons name="map" size={30} color="#900" />
                            </Pressable>
                        }
                        <Text style={{ flex: 1 }}>{props.place.vicinity}</Text>
                    </View>
                </View>
                <View style={styles.info}>
                    <View style={{ flexDirection: "row" }}>
                        { props.place.price_level &&
                            <Text>Price:{` `}
                                <Text style={{ fontWeight: "bold" }}>{"$".repeat(props.place.price_level)}</Text>
                            </Text>
                        }
                    </View>
                    <View>
                        { (props.place.rating && props.place.user_ratings_total) &&
                            <Text style={{fontSize: 12 / fontScale}}>Rated{` `}
                                <Text style={{fontSize: 24 / fontScale, fontWeight: "600", color: `${props.place.rating > 3 ? "#23611f" : "#ab5b00"}`}}>
                                    {props.place.rating}
                                </Text>
                                {` `}by{` `}
                                <Text style={{fontSize: 16 / fontScale}}>{props.place.user_ratings_total}</Text>
                            </Text>
                        }
                    </View>
                </View>
                <View style={styles.reviews}>
                    <View style={{width: "90%", justifyContent: "flex-start"}}>
                        <Text style={{
                            color: "#423e3c",
                        }}>{props.place.reviews.length > 0 ? "Recent reviews:" : "No reviews found"}</Text>
                    </View>
                    <FlatList data={props.place.reviews}
                        keyExtractor={(item, index) => item.id.toString()}
                        alwaysBounceVertical={false}
                        renderItem={({item}) => {
                            return (
                                <View style={styles.reviewContainer}>
                                    <View style={styles.reviewInfoContainer}>
                                        <Text>Rating:{` `}
                                            <Text style={{fontWeight:"600", fontSize: 16 / fontScale}}>{item.rating}</Text>
                                        </Text>
                                        <Text style={{
                                            fontSize: 12 / fontScale,
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

export default memo(PlaceCard);

const makeStyles = (fontScale: number) => StyleSheet.create({
    placeCardContainer: {
        height: "100%",
        width: "100%",
        justifyContent: "flex-end",
        alignItems: "center",
        margin: 10,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        position: "relative"
        // borderRadius: 20,
        // borderColor: "#de603a",
        // borderWidth: 2
    }, 
    imageContainer: {
        position: "absolute",
        top: 0,
        height: "40%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "grey",
        width: screenWidth,
    },
    imageItemWrapper: {
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        height: "80%",
        margin: 5,
        aspectRatio: 1,
        borderRadius: 5,
    },
    descriptionContainer: {
        height: "60%",
        width: "100%"
    },
    header: {
        height: "25%",
        justifyContent: "center",
        alignItems: "center"
    },  
    title: {
        alignItems: "center"
    },
    address: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10,
    },
    info: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 10,
        width: screenWidth * 0.95
    },

    // Reviews
    reviews: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    reviewContainer: {
        width: screenWidth * 0.95,
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