import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import ForPass from '../screens/ForPass';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForPass: undefined;
}
const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigation() {
  return (
    <Stack.Navigator
        screenOptions={{
            headerShown: false
        }}
    >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="ForPass" component={ForPass} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})