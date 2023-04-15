import { useState, memo } from 'react';
import { usePlace } from "../contexts/PlacesContext";
import { View, Text, StyleSheet, SafeAreaView, useWindowDimensions, Dimensions, TextInput, Modal } from "react-native";
import { themeStyle } from "./styles";
import { createErrorAlert } from './ui_components/ErrorAlert';
import { NavigationProp } from '@react-navigation/native';
import { Screens } from './constants';
import SelectDropdown from 'react-native-select-dropdown';
import CustomButton from './ui_components/CustomButton';
import { RenderCategory } from './Categories/RenderCategory';
import Spinner from 'react-native-loading-spinner-overlay/lib';

const RADIUS_OPTIONS = [100, 200, 300, 400, 500, 700, 1000, 2000, 3000, 5000]
const DEFAULT_RADIUS = 400

interface CreateGroupScreenProps {
    navigation: NavigationProp<any,any>,
}

const CreateGroupScreen: React.FC<CreateGroupScreenProps> = ({ navigation }) => {
    const place = usePlace()
    const {fontScale} = useWindowDimensions()
    const styles = makeStyles(fontScale)

    // Start Group
    const [minToMatch, setMinToMatch] = useState("")
    const [radius, setRadius] = useState(DEFAULT_RADIUS)
    
    const handleStartGroup = async () => {
        if (minToMatch.length === 0) {
            createErrorAlert("Please specify number of people")
            return
        }
        place.resetPlaces()
        const success = await place.createGroup(parseInt(minToMatch), radius, place.categoryInfo.searchType)
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
            {/* <View style={styles.topWrapper}>
                <MaterialCommunityIcons name={"arrow-left-thick"} size={25} color={"black"} />
                <Text style={{fontSize: 14 / fontScale}}>Back</Text>
            </View> */}
            <View style={styles.contentContainer}>
                <View style={styles.contentWrapper}>
                    <View style={styles.headerWrapper}>
                        <RenderCategory 
                            categoryInfo={place.categoryInfo}
                            />
                    </View>
                    <View style={styles.inputWrapper}>
                        <View style={styles.inputSection}>
                            <View style={{height: "100%"}}>
                                <TextInput 
                                    style={themeStyle.textInput} 
                                    placeholder="Number of People" 
                                    placeholderTextColor={"grey"}
                                    onChangeText={(text) => {
                                        setMinToMatch(text.replace(/[^0-9]/g, ''));
                                    }}
                                    value={minToMatch} 
                                    />
                            </View>
                        </View>
                        <View style={styles.inputSection}>
                            <View style={{height: "100%"}}>
                                <View style={themeStyle.dropdownContainer}>
                                    <View style={{width: "60%"}}>
                                        <Text style={themeStyle.dropdownLabel}>
                                            {"How far are you willing to travel?"}
                                        </Text>
                                    </View>
                                    <View style={{height: "80%", width: "30%"}}>
                                        <SelectDropdown data={RADIUS_OPTIONS}
                                            onSelect={(selectedItem, idx) => {
                                                setRadius(selectedItem)
                                            }}
                                            defaultButtonText={DEFAULT_RADIUS.toString()}
                                            buttonStyle={themeStyle.dropDownButton}
                                            buttonTextStyle={themeStyle.dropDownButtonText}
                                            rowStyle={themeStyle.dropDownOption}
                                            rowTextStyle={themeStyle.dropDownOptionText}
                                            selectedRowStyle={themeStyle.dropDownOption}
                                            />
                                    </View>
                                    <View style={{width: "10%"}}>
                                        <Text style={themeStyle.dropdownLabel}>
                                            m
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.buttonWrapper}>
                        <View style={styles.buttonBox}>
                            <CustomButton title="Start a group" // TBD
                                onPress={handleStartGroup}/>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default memo(CreateGroupScreen);

const makeStyles = (fontScale: number) => StyleSheet.create({
    topWrapper: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 10
    },
    contentContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    contentWrapper: {
        height: "70%",
        paddingLeft: "5%",
        paddingRight: "5%",
        justifyContent: "center",
        alignItems: "center"  
    },
    headerWrapper: {
        height: "20%"
    },
    inputWrapper: {
        height: 180
    },
    inputSection: {
        padding: 10,
        flex: 1,    
    },
    buttonWrapper: {
        height: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonBox: {
        height: "50%",
        aspectRatio: 3
    }
})