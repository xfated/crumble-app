import { Image, StyleSheet } from 'react-native';

const PlaceholderFoodImage = () => {
    return (
        <Image style={styles.templateImage}
            blurRadius={30}
            source={require('../../assets/images/placePlaceholder.jpg')} />
    )
}

export default PlaceholderFoodImage;

const styles = StyleSheet.create({
    templateImage: {
        height: "90%",
        aspectRatio: 1,
        borderRadius: 5,
    }
})