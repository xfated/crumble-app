import { memo } from "react";
import { View, Text, StyleSheet, FlatList, Linking, Pressable, Image, Dimensions, useWindowDimensions } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { PlaceDetailRow } from "../../services/places/interfaces";
import PlaceholderFoodImage from "./PlaceholderFoodImage";
import { calcDist } from "../../services/dist_utils";
import { LocationObject } from "expo-location";

interface PlaceCardProps {
    place: PlaceDetailRow,
    userLoc: LocationObject | null
}

const screenWidth = Dimensions.get('window').width;

const PlaceCard: React.FC<PlaceCardProps> = (props) => {
    const {fontScale} = useWindowDimensions()
    const styles = makeStyles(fontScale)

    const handlePlaceUrlPress = async () => {
        await Linking.openURL(props.place.url)
    }

    const getDistText = () => {
        if (props.userLoc?.coords.longitude && props.userLoc?.coords.longitude) {
            const dist = calcDist(
                props.place.lat, 
                props.place.long, 
                props.userLoc.coords.latitude, 
                props.userLoc.coords.longitude)
            if (dist < 1) {
                return `Get Directions (${(dist * 1000).toFixed(0)}m away)`
            }
            return `GetDirections (${dist.toFixed(1)}km away)`
        }
        return ""
    }

    return (
        <View style={styles.placeCardContainer}>
            <View style={styles.imageContainer}>
                { props.place.photos.length > 0 ?
                    <FlatList data={props.place.photos}
                        horizontal
                        keyExtractor={(item, index) => index.toString()}
                        alwaysBounceHorizontal={false}
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
                            fontSize: ((props.place.name.length > 80) ? 13 : 16) / fontScale,
                            fontWeight: "bold"
                        }}>{props.place.name}</Text>
                    </View>
                    <View style={styles.address}>
                        {/* <Text style={{ flex: 1, fontSize: 12 / fontScale, textAlign: "center"}}>{props.place.vicinity}</Text> */}
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
                                flexDirection: "row",
                                alignItems: "center",
                                columnGap: 5,
                            }}>
                            <Text style={{fontSize: 14 / fontScale, fontWeight: "600"}}>
                                {`${getDistText()}`}
                            </Text>
                            <MaterialCommunityIcons name="map-search" size={25} color="#900" />
                        </Pressable>
                    </View>
                </View>
                <View style={styles.info}>
                    <View style={{ flexDirection: "row" }}>
                        { props.place.price_level &&
                            <Text style={{fontSize: 14 / fontScale}}>Price:{` `}
                                <Text style={{fontSize: 18 / fontScale, fontWeight: "bold" }}>{"$".repeat(props.place.price_level)}</Text>
                            </Text>
                        }
                    </View>
                    <View>
                        { (props.place.rating && props.place.user_ratings_total) &&
                            <Text style={{fontSize: 14 / fontScale}}>Rated{` `}
                                <Text style={{fontSize: 24 / fontScale, fontWeight: "600", color: `${props.place.rating > 3 ? "#23611f" : "#ab5b00"}`}}>
                                    {props.place.rating}/5
                                </Text>
                                {` `}by{` `}
                                <Text style={{fontSize: 18 / fontScale}}>{props.place.user_ratings_total}</Text>
                            </Text>
                        }
                    </View>
                </View>
                <View style={styles.reviews}>
                    <View style={{width: "90%", alignSelf: "flex-start", paddingLeft: "2%"}}>
                        <Text style={{
                            color: "#423e3c",
                            fontSize: 16 / fontScale
                        }}>{props.place.reviews.length > 0 ? "Recent reviews:" : "No reviews found"}</Text>
                    </View>
                    <FlatList data={props.place.reviews}
                        keyExtractor={(item, index) => item.id.toString()}
                        alwaysBounceVertical={false}
                        renderItem={({item}) => {
                            return (
                                <View style={styles.reviewContainer}>
                                    <View style={{
                                        width: "10%",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <Text
                                            style={{
                                                fontSize: 30 / fontScale,
                                                color: item.rating > 3 ? "#23611f" : "#ab5b00",
                                                fontWeight: "700"
                                            }}>
                                            {item.rating}
                                        </Text>
                                    </View>
                                    <View style={{
                                        width: "85%",
                                        justifyContent: "flex-start",
                                        alignItems: "center"
                                    }}>
                                        <Text style={{
                                            fontSize: 14 / fontScale
                                        }}>
                                            {item.text}
                                        </Text>
                                        <View style={{
                                            width: "100%",
                                            justifyContent: "flex-end",
                                            alignItems: "flex-end"
                                        }}>
                                            <Text style={{
                                                color: "#424241",
                                                fontSize: 12 / fontScale,
                                            }}>
                                                {`Reviewed ${item.relative_time_description}`}
                                            </Text>
                                        </View>
                                    </View>
                                    {/* <View style={styles.reviewInfoContainer}>
                                        <Text>Rating:{` `}
                                            <Text style={{fontWeight:"600", fontSize: 16 / fontScale}}>{item.rating}</Text>
                                        </Text>
                                        <Text style={{
                                            fontSize: 12 / fontScale,
                                            color: "grey",
                                            fontStyle: "italic"
                                        }}>{item.relative_time_description}</Text>
                                    </View>
                                    <Text style={styles.reviewText}>{item.text}</Text> */}
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
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    header: {
        height: "25%",
        justifyContent: "center",
        alignItems: "center"
    },  
    title: {
        alignItems: "center",
        paddingRight: 10, 
        paddingLeft: 10
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
        alignItems: "flex-end",
        paddingBottom: 10,
        width: screenWidth * 0.95
    },

    // Reviews
    reviews: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    reviewContainer: {
        width: screenWidth * 0.95,
        borderRadius: 5,
        backgroundColor: "#fcd5b3",
        paddingTop: 7,
        paddingBottom: 7,
        marginTop: 2,
        marginBottom: 2,
        flexDirection: "row",
        alignItems: "flex-start",
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