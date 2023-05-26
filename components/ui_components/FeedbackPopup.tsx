import { useState, memo} from "react"
import { View, Text, TextInput, TouchableOpacity, useWindowDimensions, StyleSheet } from "react-native"
import CustomButton from "./CustomButton"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { themeStyle } from "../styles"

import { addFeedback } from "../../services/places/feedback"

const FeedbackPopup = () => {
    const {height, width, fontScale} = useWindowDimensions()
    const styles = makeStyles(height, width, fontScale)
     
    // Form display
    const [showForm, setShowForm] = useState(true)
    const toggleShowForm = () => {
        setShowForm(prev => !prev)
    }

    // Feedback
    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState("")

    return (
        <View style={styles.feedbackContainer}>
            <View style={styles.feedbackContentWrapper}>
                <TouchableOpacity style={styles.feedbackIcon} onPress={toggleShowForm}>
                    <MaterialCommunityIcons name={"message-alert"} size={50} color="black" /> 
                    <Text>Feedback</Text>
                </TouchableOpacity>
                <View style={[
                    styles.feedbackInputContainer,
                    showForm ? {} : styles.hide
                ]}>
                    <View style={styles.feedbackFormHeader}>
                        <Text style={styles.feedbackFormHeaderText}>How is the experience?</Text>
                        <TouchableOpacity style={styles.cancelButton} onPress={toggleShowForm}>
                            <MaterialCommunityIcons name={"close"} size={20} color="black" /> 
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.fullWidth, styles.feedbackFormBody]}>
                        <View style={[styles.fullWidth, styles.feedbackFormRating]}>
                            {
                                [1, 2, 3, 4, 5].map(val => {
                                    return (
                                        <TouchableOpacity key={val} onPress={() => setRating(val)}>
                                            { (val <= rating) ? 
                                                <MaterialCommunityIcons name={"star"} size={25} color="orange" />
                                                :
                                                <MaterialCommunityIcons name={"star-outline"} size={25} color="black" />
                                            }
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                        <View style={[styles.fullWidth, styles.feedbackFormDescription]}>
                            <TextInput 
                                style={[themeStyle.textInput, styles.feedbackFormDescriptionText]} 
                                placeholder="Feedback (if any)" 
                                placeholderTextColor={"grey"}
                                onChangeText={(text) => {setDescription(text)}}
                                multiline
                                value={description} 
                                />
                        </View>
                        <View style={[styles.fullWidth, styles.feedbackFormSubmit]}>
                            { (rating > 0) &&
                                <CustomButton 
                                    title="Submit"
                                    onPress={() => {
                                        addFeedback(rating, description);
                                        setShowForm(false);
                                    }}/>
                            }
                        </View>
                    </View>
                </View>
            </View>
        </View>
     )
}

export default memo(FeedbackPopup)

const makeStyles = (windowHeight: number, windowWidth: number, fontScale: number) => StyleSheet.create({
    feedbackContainer: {
        position: "absolute",
        bottom: "2%",
        right: "7%",
    },
    feedbackContentWrapper: {
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    feedbackIcon: {
        height: "100%",
        width: "100%",
        alignItems: "center"
    },
    feedbackInputContainer: {
        position: "absolute",
        padding: 10,
        bottom: 0,
        right: 0,
        height: 200,
        width: 250,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "white",
        justifyContent: "space-evenly"
    },
    feedbackFormHeader: {
        padding: 5,
        flexDirection: "row",
        justifyContent: "center",
        position: "relative"
    },  
    feedbackFormHeaderText: {
        fontWeight: "bold",
        fontSize: 16 / fontScale
    },
    feedbackFormBody: {
    },
    feedbackFormRating: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%"
    },
    feedbackFormDescription: {
        height: "50%",
        padding: 5,
    },
    feedbackFormDescriptionText: {
        textAlignVertical: "top"
    },
    feedbackFormSubmit: {
        alignSelf: "center",
        width: 100,
        height: 40,
        justifyContent: "center",
    },
    hide: {
        display: "none"
    },
    fullWidth: {
        width: "100%"
    },
    cancelButton: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 20,
    }
})