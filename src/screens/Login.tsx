import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image, ScrollView,Dimensions, KeyboardAvoidingView } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useAuthContext } from '../AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../routes/AuthStack';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseApp } from '../../Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
const screenHeight = Dimensions.get('window').height;
type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

interface LoginValues {
  email: string;
  password: string;
}

const Login = ({ navigation }: LoginScreenProps) => {
  const [error, setError] = React.useState('');
  const { setIsAuthenticated } = useAuthContext();
  const auth = getAuth(FirebaseApp);
  useEffect(() => {
    setTimeout(() => {  
      setError('')
    }, 3000);
}, [error])

  const setEmailinLocalStorage = async (email: string) => {
    try {
      await AsyncStorage.setItem('userEmail', email);
    } catch (error) {
      console.log('Error saving to local storage:', error);
    } 
  };
  
  const loginFunc = async (values: LoginValues,{resetForm}:any) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password)
      await setEmailinLocalStorage(values.email);
      await userCredential.user ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (error: any) {
      resetForm();
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Invalid email address format.');
          break;
        case 'auth/user-disabled':
          setError('User account is disabled.');
          break;
        case 'auth/user-not-found':
          setError('User account not found.');
          break;
        case 'auth/wrong-password':
          setError('Invalid password.');
          break;
        default:
          setError('Login failed. Please try again later.');
          break;
      }
    }
  }

  return (
    <ScrollView>
      <View style={styles.loginContainer}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.roundImage}
          source={require('../images/logo.jpeg')}
          resizeMode="contain"
        />
      </View>
      <View >
        <Text style={styles.headingText}>
          PSPTechHub Thingworx Solutions
        </Text>
      </View>
      <View>
        {/* <Text style={styles.subHeadingText}>Welcome back, you've been missed!</Text> */}
      </View>
      {error && <View>
        <Text style={[styles.error,styles.custom]}>{error}</Text>
      </View>}
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={loginFunc as any}
        style={styles.formContainer}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              autoCapitalize='none'
              placeholder='Email'
              placeholderTextColor={'#ccc'}
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <TextInput
              style={styles.input}
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              placeholder='Password'
              placeholderTextColor={'#ccc'}
            />
            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

            <TouchableOpacity style={styles.button}
              onPress={handleSubmit as any}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

          </View>
        )}
      </Formik>
      <TouchableOpacity
        onPress={() => navigation.navigate('ForPass')}
        style={styles.links}
      >
        <Text style={styles.linkText}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Signup')}
        style={styles.links}
      >
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    minHeight: screenHeight,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 50,
    backgroundColor: '#000',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: 180,
    height: 180,
    borderRadius: 150,
    borderWidth: 2,
    borderColor: '#444',
    overflow: 'hidden',
    marginBottom: 20,
  },
  roundImage: {
    width: '100%',
    height: '100%',
  },
  headingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ddd',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#999',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 30,
  },
  container: {
    padding: 16,
    backgroundColor: '#000',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    height: 48,
    width: 300,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    color: '#fff',
  },
  error: {
    color: 'red',
    marginTop: -10,
    marginBottom: 16,
    fontSize: 14,
  },
  custom: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    alignSelf: 'center',
    width: 300,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  links: {
    marginTop: 10,
    marginBottom: 10,
    color: '#fff',
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Login;
