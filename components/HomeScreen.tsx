import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, Image, Dimensions, useWindowDimensions, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
import { NavigationProp } from "@react-navigation/native"

import { Screens } from './constants';
import CustomButton from "./ui_components/CustomButton";
import { themeStyle } from "./styles";
import { usePlace } from '../contexts/PlacesContext';
import { createErrorAlert } from "./ui_components/ErrorAlert";
import Spinner from "react-native-loading-spinner-overlay";
import { checkVersion } from "../services/supabase";
import InvalidVersionModal from "./ui_components/InvalidVersionModal";
import { CategoryInfo, categories } from "./Categories/Categories";
import { RenderCategory } from "./Categories/RenderCategory";

export interface HomeScreenProps {
    navigation: NavigationProp<any,any>
}

const screenWidth = Dimensions.get('window').width;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const place = usePlace();
    const {fontScale} = useWindowDimensions()
    const styles = makeStyles(fontScale)

    // const handleSolo = async () => {
    //     place.resetPlaces();
    //     const success = await place.fetchNearbyPlaces("");
    //     if (success) {
    //         navigation.navigate(Screens.INDIVIDUAL);
    //     }
    // }
    const handleSelectCategory = (categoryInfo: CategoryInfo) => {
        place.handleCategorySelect(categoryInfo)
        navigation.navigate(Screens.CREATE_GROUP)
    }
    // Check versioning
    const [versionIsValid, setVersionIsValid] = useState(true);
    useEffect(() => {
        (async () => {
            const response = await checkVersion()
            if (response.success && response.data !== null) {
                setVersionIsValid(response.data.result)
            }
        })();
    }, [])

    useEffect(() => {
        if (place.errorMessage !== "") {
            createErrorAlert(place.errorMessage)
        }
    }, [place.errorMessage])

    // Join Group
    const [joinGroupId, setJoinGroupId] = useState("")
    const handleJoinGroup = async () => {
        if (joinGroupId === place.groupId) {
            navigation.navigate(Screens.GROUP)
            return;
        }
        if (joinGroupId.length !== 6) {
            createErrorAlert("Invalid group ID")
            return
        }
        place.resetPlaces()
        const success = await place.joinGroup(joinGroupId)
        if (success) {
            navigation.navigate(Screens.GROUP)
        }
    }
    
    return (
        <SafeAreaView style={themeStyle.screenContainer}>
            <Spinner
                visible={place.isLoading}
                textContent={place.spinnerContent}
                overlayColor="rgba(25,25,25,0.5)"
                textStyle={themeStyle.spinnerTextStyle}
            />
            <InvalidVersionModal isVisible={!versionIsValid} />
            <View>
                <View style={styles.inputContainer}>
                    {/* <View style={styles.soloContainer}>
                        <CustomButton title="Explore Solo"
                            onPress={handleSolo} />
                    </View> */}
                    <View style={styles.startGroupContainer}>
                        <View style={styles.sectionHeaderWrapper}>
                            <Text style={styles.sectionHeader}>Create a group</Text>
                        </View>
                        <View style={styles.sectionDescWrapper}>
                            <Text style={styles.sectionDesc}>What are you looking for near you ?</Text>
                        </View>
                        <View style={styles.inputBox}>
                            <View style={styles.inputWrapper}>
                                <View style={{height: "90%"}}> 
                                    <FlatList data={Object.values(categories)}
                                        horizontal
                                        keyExtractor={(item: CategoryInfo, index: number) => item.displayName}
                                        alwaysBounceHorizontal={false}
                                        renderItem={({item}) => {
                                            return (
                                                <TouchableOpacity onPress={() => handleSelectCategory(item)}>
                                                    <RenderCategory categoryInfo={item}/>
                                                </TouchableOpacity>
                                            )
                                        }}
                                    />
                                </View>
                                {/* <View style={themeStyle.dropdownContainer}>
                                    <View style={{width: "40%"}}>
                                        <Text style={themeStyle.dropdownLabel}>Category</Text>
                                    </View>
                                    <View style={{width: "60%"}}>
                                        <SelectDropdown data={CATEGORY_OPTIONS}
                                            onSelect={(selectedItem, idx) => {
                                                setCategory(selectedItem)
                                            }}
                                            defaultButtonText={DEFAULT_CATEGORY.toString()}
                                            buttonStyle={themeStyle.dropDownButton}
                                            buttonTextStyle={themeStyle.dropDownButtonText}
                                            rowStyle={themeStyle.dropDownOption}
                                            rowTextStyle={themeStyle.dropDownOptionText}
                                            selectedRowStyle={themeStyle.dropDownOption}
                                            />
                                    </View>
                                </View> */}
                            </View>
                        </View>
                    </View>
                    <View style={styles.joinGroupContainer}>
                        <View style={styles.sectionHeaderWrapper}>
                            <Text style={styles.sectionHeader}>Join a group</Text>
                        </View>
                        <View style={styles.sectionDescWrapper}>
                            <Text style={styles.sectionDesc}>Get the ID from your friend</Text>
                        </View>
                        <View style={styles.inputBox}>
                            <View style={{width: "50%", height: "75%"}}>
                                <TextInput 
                                    style={themeStyle.textInput} 
                                    placeholder="Group ID" 
                                    placeholderTextColor={"grey"}
                                    onChangeText={(text) => {
                                        setJoinGroupId(text);
                                    }}
                                    value={joinGroupId} 
                                    />
                            </View>
                            <View style={{width: "40%", height: "70%"}}>
                                <CustomButton title="Join"
                                    onPress={handleJoinGroup}/>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.infoContainer}>
                    <View style={styles.infoWrapper}>
                        <View style={styles.sectionHeaderWrapper}>
                            <Text style={styles.tutorialHeader}>How it works</Text>
                        </View>
                        <Image
                            style={styles.tutorialImage}
                            source={require('../assets/images/tutorial.png')}
                            resizeMode={"contain"}
                            />
                        {/* <View style={{backgroundColor: "rgba(255,0,0,0.2)"}}>
                            <Tutorial width={screenWidth} height={screenWidth}/>
                        </View> */}
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen;

const makeStyles = (fontScale: number) => StyleSheet.create({
    inputContainer: {
        height: "50%",
        justifyContent: "center",
        alignItems: "center"
    },
    infoContainer: {
        width: screenWidth,
        height: "50%",
        paddingTop: 10,
        justifyContent: "center",
        alignItems: "center",
    }, 
    infoWrapper: {
        borderColor: "#4f2f23",
        borderWidth: 2,
        borderRadius: 20,
        padding: 5,
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 10,
    },
    // soloContainer: {
    //     flex: 1,
    //     width: "90%",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     borderBottomColor: "grey",
    //     borderBottomWidth: 2
    // },
    sectionHeaderWrapper: {
        width: "100%",
        justifyContent: "flex-start",
        alignContent: "center"
    },
    sectionHeader: {
        fontSize: 20 / fontScale,
        padding: 10,
        fontWeight: "800",
        alignSelf: "flex-start"
    },
    sectionDescWrapper: {
        paddingTop: 5,
        paddingBottom: 0
    },
    sectionDesc: {
        fontSize: 16 / fontScale,
    },
    startGroupContainer: {
        flex: 3,
        width: "90%",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
        borderBottomColor: "grey",
        borderBottomWidth: 2,
    },
    joinGroupContainer: {
        flex: 2,
        width: "90%",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    inputBox: {
        width: "100%",
        flex: 1,
        paddingTop: "2%",
        paddingBottom: "2%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    inputWrapper: {
        flex: 1, 
        width: "100%", 
        paddingTop: 5,
        paddingBottom: 5,
    },
    tutorialHeader: {
        padding: 5,
        color: "#4f2f23",
        alignSelf: "center", 
        fontSize: 16 / fontScale,
        fontWeight: "900",
    },
    tutorialImage: {
        flex: 1,
        maxHeight: screenWidth * 0.9,
        aspectRatio: 1,
        padding: 5,
    }
})