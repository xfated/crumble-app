import { Image, StyleSheet } from 'react-native';

const PlaceholderFoodImage = () => {
    return (
        <Image style={styles.templateImage}
            // blurRadius={30}
            resizeMode={"contain"}
            source={require('../../assets/images/noImagePlaceholder.png')} />
    )
}

export default PlaceholderFoodImage;

const styles = StyleSheet.create({
    templateImage: {
        height: "90%",
        aspectRatio: 1,
    }
})