import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { useAuthContext } from '../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Welcome() {
  const { setIsAuthenticated } = useAuthContext();
  const getEmailFromLocalStorage = async () => {
    try {
      const localEmail = await AsyncStorage.getItem('userEmail');
      // console.log(localEmail)
      localEmail === null ? setIsAuthenticated(false):setIsAuthenticated(true)
    } catch (error) {
      console.log('Error reading from local storage:', error);
    }
  };
  React.useEffect(() => {
    getEmailFromLocalStorage();
  }, [])
 
  return (
    <View style={styles.welcomeContainer}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.roundImage}
          source={require('../images/logo.jpeg')}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.name}>PSPTechHub Thingworx Solutions</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  imageContainer: {
    width: 280,
    height: 280,
    borderRadius: 150,
    overflow: 'hidden',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 60,
    elevation: 15, // Android shadow
  },
  roundImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    marginTop: 25,
    fontSize: 32,
    color: 'lightgray',
    fontWeight: 'bold',
    textAlign: 'center',
  },
})