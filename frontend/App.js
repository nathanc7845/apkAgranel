import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './src/navigation/AppNavigator';
import { DemandProvider } from './src/context/DemandContext';
import { AuthProvider } from './src/context/AuthContext';
import 'react-native-gesture-handler';



SplashScreen.preventAutoHideAsync().catch(() => {

});

export default function App() {
    let [fontsLoaded, fontError] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold,
    });

    
    useEffect(() => {
        async function hideSplash() {
          
            if (fontsLoaded || fontError) {
                await SplashScreen.hideAsync();
            }
        }
        hideSplash();
    }, [fontsLoaded, fontError]);

   
    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <AuthProvider>
                <DemandProvider>
                    <View style={styles.container}>
                        <AppNavigator />
                    </View>
                </DemandProvider>
            </AuthProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});