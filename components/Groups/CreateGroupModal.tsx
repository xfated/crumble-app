import { useState, memo } from 'react';
import { usePlace } from "../../contexts/PlacesContext";
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, SafeAreaView, useWindowDimensions, Dimensions, TextInput, Modal } from "react-native";
import { themeStyle } from "../styles";
import { createErrorAlert } from '../ui_components/ErrorAlert';
import { NavigationProp } from '@react-navigation/native';
import { Screens } from '../constants';
import SelectDropdown from 'react-native-select-dropdown';
import CustomButton from '../ui_components/CustomButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CategoryInfo } from '../Categories/Categories';
import { RenderCategory } from '../Categories/RenderCategory';

const RADIUS_OPTIONS = [100, 200, 300, 400, 500, 700, 1000, 2000, 3000, 5000]
const DEFAULT_RADIUS = 400
const screenWidth = Dimensions.get('window').width;

interface CreateGroupModalProps {
    modalIsVisible: boolean,
    categoryInfo: CategoryInfo,
    navigation: NavigationProp<any,any>,
}

const GroupScreen: React.FC<CreateGroupModalProps> = (props) => {
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
        console.log("Pressed")
        place.resetPlaces()
        console.log("Pressed2")
        const success = await place.createGroup(parseInt(minToMatch), radius, props.categoryInfo.searchType)
        console.log("Pressed3")
        if (success) {
            props.navigation.navigate(Screens.GROUP)
        }
    }
    
    
    return (
        <Modal visible={props.modalIsVisible} animationType="fade">
            <SafeAreaView style={themeStyle.screenContainer}>
                <View style={styles.topWrapper}>
                    <MaterialCommunityIcons name={"arrow-left-thick"} size={25} color={"black"} />
                    <Text style={{fontSize: 14 / fontScale}}>Back</Text>
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.contentWrapper}>
                        <View style={styles.headerWrapper}>
                            <RenderCategory 
                                categoryInfo={props.categoryInfo}
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
        </Modal>
    )
}

export default memo(GroupScreen);

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