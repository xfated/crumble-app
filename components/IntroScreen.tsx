import { useEffect, useState, memo } from 'react';
import { View, Text, Image, StyleSheet, PixelRatio, StatusBar, ScrollView, SafeAreaView, useWindowDimensions, Platform } from "react-native";
import { NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Screens } from './constants';
import CustomButton from './ui_components/CustomButton';

interface IntroScreenProps {
    navigation: NavigationProp<any,any>,
}

const IntroScreen: React.FC<IntroScreenProps> = ({ navigation }) => {
    const [sliderState, setSliderState] = useState({ currentPage: 0 });
    const { width, height, fontScale } = useWindowDimensions();
    const styles = makeStyles(fontScale);

    const setSliderPage = (event: any) => {
        const { currentPage } = sliderState;
        const { x } = event.nativeEvent.contentOffset;
        const indexOfNextScreen = Math.floor(x / width);
        if (indexOfNextScreen !== currentPage) {
        setSliderState({
            ...sliderState,
            currentPage: indexOfNextScreen,
        });
        }
    };

    const clearAsyncStorage = async() => {
        console.log(await AsyncStorage.removeItem("FIRST_LAUNCH"));
    }

    const handleGoNext = () => {
        navigation.navigate(Screens.HOME);
    }

    const { currentPage: pageIndex } = sliderState;

    return (
        <>
        <StatusBar barStyle="dark-content" />

        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
            style={{ flex: 1 }}
            horizontal={true}
            scrollEventThrottle={16}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            onScroll={(event: any) => {
                setSliderPage(event);
            }}
            >
            <View style={{ width, height }}>
                <Image
                    source={require('../assets/images/intro1.png')} 
                    style={styles.imageStyle}
                    />
                <View style={styles.wrapper}>
                <Text style={styles.header}>Discover Ideal Dining</Text>
                <Text style={styles.paragraph}>... with Friends!</Text>
                </View>
            </View>
            <View style={{ width, height }}>
                <Image
                source={require('../assets/images/intro2.png')}
                style={styles.imageStyle}
                />
                <View style={styles.wrapper}>
                <Text style={styles.header}>Everyone has a say</Text>
                <Text style={styles.paragraph}>... no one is overlooked</Text>
                </View>
            </View>
            <View style={{ width, height }}>
                <Image
                source={require('../assets/images/intro3.png')}
                style={styles.imageStyle}
                />
                <View style={styles.wrapper}>
                <Text style={styles.header}>Enjoy!</Text>
                </View>
                <View style={styles.buttonBox}>
                    {
                        <CustomButton
                        title="Let's Go"
                        onPress={handleGoNext}/>
                    }
                </View>
            </View>
            </ScrollView>
            <View style={styles.paginationWrapper}>
            {Array.from(Array(3).keys()).map((key, index) => (
                <View style={[styles.paginationDots, { opacity: pageIndex === index ? 1 : 0.2 }]} key={index} />
            ))}
            </View>
        </SafeAreaView>
        </>
    );
};

export default IntroScreen;

const makeStyles = (fontScale: number) => StyleSheet.create({
    imageStyle: {
        height: PixelRatio.getPixelSizeForLayoutSize(135),
        width: '100%',
    },
    wrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 30,
    },
    header: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        marginLeft: 40,
        marginRight: 40,
    },
    paragraph: {
        fontSize: 17,
    },
    paginationWrapper: {
        position: 'absolute',
        ...Platform.select({
            ios: {
                bottom: 200,
            },
            android: {
                bottom: 100,
            },
            default: {
                bottom: 200
            },
        }),
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    paginationDots: {
        height: 10,
        width: 10,
        borderRadius: 10 / 2,
        backgroundColor: '#0898A0',
        marginLeft: 10,
    },
    buttonBox: {
        height: "5%",
        justifyContent: "center",
        alignItems: "center",
    },
})