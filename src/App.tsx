import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Route from './routes/Route';
import Welcome from './screens/Welcome';
import { AuthProvider } from './AuthContext';

export default function App() {
  const [displayWelcome,setDisplayWelcome] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setDisplayWelcome(false);
    },2000);
  }, [])

  return (
    <AuthProvider>
      {displayWelcome ? <Welcome /> : <Route />}
    </AuthProvider>
  )
}

const styles = StyleSheet.create({})