import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthNavigation from './AuthStack';
import AppNavigation from './AppStack';
import { useAuthContext } from '../AuthContext';

export default function Route():JSX.Element {
  const { isAuthenticated } = useAuthContext();
 
  return (
    <NavigationContainer>
        {isAuthenticated ? <AppNavigation /> : <AuthNavigation />}
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({})