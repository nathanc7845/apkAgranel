import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DemanderScreen from '../screens/DemanderScreen';
import TechnicianScreen from '../screens/TechnicianScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false,
                    animation: 'fade',
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="Demander" component={DemanderScreen} />
                <Stack.Screen name="Technician" component={TechnicianScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
