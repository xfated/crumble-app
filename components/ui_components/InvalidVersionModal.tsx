import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, Text, Modal, useWindowDimensions } from "react-native";
import { themeStyle } from "../styles";

interface InvalidVersionModalProps {
    isVisible: boolean;
}

const InvalidVersionModal = (props: InvalidVersionModalProps) => {
    const {fontScale} = useWindowDimensions()

    return (
        <Modal visible={props.isVisible} animationType="slide">
            <StatusBar style="dark"/>
            <View style={themeStyle.screenContainer}>
                <View style={styles.modalWrapper}>
                    <Text style={{fontSize: 20 / fontScale}}>
                        App is outdated
                    </Text>
                    <Text style={{fontSize: 20 / fontScale}}>
                        Please update your App in the App store!
                    </Text>
                </View>
            </View>
        </Modal>
    )
}

export default InvalidVersionModal;

const styles = StyleSheet.create({
    modalWrapper: {
        height: "100%",
        width: "100%",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 70,
        backgroundColor: "rgba(20,20,20,0.2)"
    },
    cancelButton: {
        position: "absolute",
        padding: 20,
        top: 30,
        right: 0,
        zIndex: 20,
    }
})