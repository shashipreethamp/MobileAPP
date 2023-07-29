import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView,Image, Dimensions } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../routes/AuthStack';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { FirebaseApp } from '../../Firebase';
const screenHeight = Dimensions.get('window').height;

type ForPassScreenProps = NativeStackScreenProps<AuthStackParamList, 'ForPass'>;

const ForPassSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required')
});

interface ForPassValues {
  email: string;
}

const ForPass = ({ navigation }: ForPassScreenProps) => {

  const [sentEmail, setSentEmail] = React.useState(false);
  const [error, setError] = React.useState('');
  const auth = getAuth(FirebaseApp);

  useEffect(() => {
    setTimeout(() => {  
      setError('')
    }, 3000);
  }
    , [error])

  const ForPassFunc = async (values: ForPassValues,{resetForm}:any) => {
    try {
      setError('')
      await sendPasswordResetEmail(auth, values.email)
      setTimeout(() => {
        setSentEmail(true)
      }, 1000);
      setTimeout(() => {
        setSentEmail(false);
        navigation.navigate('Login');
      }, 3000);
    } catch (error: any) {
      resetForm();
      switch (error.code) {
        case 'auth/user-not-found':
          setError('User account not found.');
          break;
        default:
          setError('Error sending email. Please try again later.');
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
        {/* <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Forgot Password</Text> */}
        <Text style={styles.subHeadingText}>Enter your email address below and we'll send you a link to reset your password.</Text>
      </View>
      {error && <View>
        <Text style={[styles.error,styles.custom]}>{error}</Text>
      </View>}
      {sentEmail && <View>
        <Text style={{ fontSize: 16, marginBottom: 20, color:'green' }}>Email sent successfully!</Text>
      </View>}
      
      <Formik
        initialValues={{ email: '' }}
        validationSchema={ForPassSchema}
        onSubmit={ForPassFunc}
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
              placeholderTextColor='#ccc'
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <TouchableOpacity style={styles.button}
              onPress={handleSubmit as any}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.buttonText}>Send Email</Text>
              )}
            </TouchableOpacity>

          </View>
        )}
      </Formik>
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
    paddingVertical: 60,
    paddingBottom: 80,
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
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginBottom: 10,
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
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ForPass;
