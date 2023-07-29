import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';


export default function AppNavigation() {
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
        screenOptions={{
            headerShown: false
        }}
    >
        <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})