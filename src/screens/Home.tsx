import React from 'react'
import { useAuthContext } from '../AuthContext';
import { getAuth, signOut } from 'firebase/auth';
import { FirebaseApp } from '../../Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { countries } from '../components/countries';

const options = ['Select Application', 'CWC', 'DPM', 'ThingWorx', 'Other'];


const FormSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  companyName: Yup.string().required('Company Name is required'),
  country: Yup.string().notOneOf(['Select Country'], 'Please select a valid Country').required('Country is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  mobileNumber: Yup.string()
    .matches(/^[0-9]+$/, 'Must be a valid phone number')
    .required('Mobile Number is required'),
  application: Yup.string().notOneOf(['Select Application'], 'Please select a valid application').required('Application is required'),
  businessCase: Yup.string().required('Business Case is required'),
  applicationValue: Yup.string().test(
    'applicationValue',
    'Other Application is required',
    function (value) {
      const { application } = this.parent;
      if (application === 'Other' && !value) {
        return false;
      }
      return true;
    }
  )
});

interface FormValues {
  name: string;
  companyName: string;
  country: string;
  email: string;
  mobileNumber: string;
  businessCase: string;
  application: string;
  applicationValue: string;
}




export default function Home() {
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [showFailureModal, setShowFailureModal] = React.useState(false);
  const { setIsAuthenticated } = useAuthContext();
  const auth = getAuth(FirebaseApp);

  const handleLogout = () => {
    signOut(auth).then(() => {
      AsyncStorage.removeItem('userEmail');
      setIsAuthenticated(false);
      // console.log('Logout')
    }).catch((error) => {
      // console.log(error)
    });
  };

  const FormSubmit = (values: FormValues, { setSubmitting, resetForm }: any) => {
    
    let url = '';  //  TODO: Add your google sheet url here ***************

    axios.post(url, {
      sheet1: {
        name: values.name,
        companyName: values.companyName,
        country: values.country,
        email: values.email,
        mobileNumber: values.mobileNumber,
        businessCase: values.businessCase,
        application: values.application,
        applicationValue: values.applicationValue,
      },
    })
      .then(function (response) {
        // console.log(response);
        setShowSuccessModal(true);
        setSubmitting(false);
        resetForm();
      }
      )
      .catch(function (error) {
        // console.log(error);
        setShowFailureModal(true);
        setSubmitting(false);
      }
      );
  };
  return (
    <ScrollView>
      <View style={styles.homeinputContainer}>
        <Text style={styles.headingText}>Unlock Opportunities with Us</Text>
        <Text style={styles.subHeadingText}>
          Complete the form below to share your details and explore potential
          collaborations.
        </Text>
        <Formik
          enableReinitialize={true}
          initialValues={{
            name: '',
            companyName: '',
            country: '',
            email: '',
            mobileNumber: '',
            businessCase: '',
            application: '',
            applicationValue: '',
          }}
          validationSchema={FormSchema}
          onSubmit={FormSubmit}
        >
          {({
            values,
            handleChange,
            handleSubmit,
            handleBlur,
            isSubmitting,
            errors,
            touched,
          }) => (
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  placeholder="Enter your name"
                  placeholderTextColor={'#ccc'}
                />
                {touched.name && errors.name && (
                  <Text style={styles.error}>{errors.name}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Company Name *</Text>
                <TextInput
                  style={styles.input}
                  value={values.companyName}
                  onChangeText={handleChange('companyName')}
                  onBlur={handleBlur('companyName')}
                  placeholder="Enter your company name"
                  placeholderTextColor={'#ccc'}
                />
                {touched.companyName && errors.companyName && (
                  <Text style={styles.error}>{errors.companyName}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Country *</Text>
                <View style={styles.input}>
                  <Picker
                    selectedValue={values.country}
                    onValueChange={handleChange('country')}
                    style={styles.input}
                    dropdownIconColor="#bbb"
                    dropdownIconRippleColor="#bbb"
                  >
                    {countries.map((option, index) => (
                      <Picker.Item key={index} label={option} value={option} />
                    ))}
                  </Picker>
                </View>
                {/* <TextInput
                style={styles.input}
                value={values.country}
                onChangeText={handleChange('country')}
                onBlur={handleBlur('country')}
                placeholder="Enter your Country"
                placeholderTextColor={'#ccc'}
              /> */}

                {touched.country && errors.country && (
                  <Text style={styles.error}>{errors.country}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  placeholder="Enter your email"
                  placeholderTextColor={'#ccc'}
                />
                {touched.email && errors.email && (
                  <Text style={styles.error}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Mobile Number *</Text>
                <TextInput
                  style={styles.input}
                  value={values.mobileNumber}
                  onChangeText={handleChange('mobileNumber')}
                  onBlur={handleBlur('mobileNumber')}
                  placeholder="Enter your mobile number"
                  keyboardType="phone-pad"
                  placeholderTextColor={'#ccc'}
                />
                {touched.mobileNumber && errors.mobileNumber && (
                  <Text style={styles.error}>{errors.mobileNumber}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Application *</Text>
                <View style={styles.input}>
                  <Picker
                    selectedValue={values.application}
                    onValueChange={handleChange('application')}
                    style={styles.input}
                    dropdownIconColor="#bbb"
                    dropdownIconRippleColor="#bbb"
                  >
                    {options.map((option, index) => (
                      <Picker.Item key={index} label={option} value={option} />
                    ))}
                  </Picker>
                </View>
                {touched.application && errors.application && (
                  <Text style={styles.error}>{errors.application}</Text>
                )}
              </View>

              {values.application === 'Other' && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Other Application *</Text>
                  <TextInput
                    style={styles.input}
                    value={values.applicationValue}
                    onChangeText={handleChange('applicationValue')}
                    onBlur={handleBlur('applicationValue')}
                    placeholder="Enter other application"
                    placeholderTextColor={'#ccc'}
                  />
                  {touched.applicationValue && errors.applicationValue && (
                    <Text style={styles.error}>{errors.applicationValue}</Text>
                  )}
                </View>
              )}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Business Case *</Text>
                <TextInput
                  multiline={true}
                  numberOfLines={6}
                  style={styles.inputArea}
                  value={values.businessCase}
                  onChangeText={handleChange('businessCase')}
                  onBlur={handleBlur('businessCase')}
                  placeholder="Enter your Business case"
                  placeholderTextColor={'#ccc'}
                />
                {touched.businessCase && errors.businessCase && (
                  <Text style={styles.error}>{errors.businessCase}</Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit as any}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.buttonText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        {/* Success and Failure Modals */}
        <Modal
          visible={showSuccessModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.imageConatiner}>
                <Image
                  source={require('../images/tick.webp')}
                  style={styles.image}
                />
              </View>
              <Text style={styles.successMessage}>Form submitted successfully!</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowSuccessModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showFailureModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowFailureModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent2}>
              <View style={styles.imageConatiner2}>
                <Image
                  source={require('../images/cross.webp')}
                  style={styles.image2}
                />
              </View>
              <Text style={styles.failureMessage}>
                Form submission failed. Please try again.
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowFailureModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutbutton}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>

  )
}

const styles = StyleSheet.create({
  homeinputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 10,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#122',
    borderRadius: 10,
    padding: 10,
  },
  headingText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ddd',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  subHeadingText: {
    fontSize: 22,
    color: '#999',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  inputContainer: {
    padding: 10,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    paddingLeft: 4,
    color: '#fff',
  },
  input: {
    height: 48,
    width: 300,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
  inputArea: {
    height: 120,
    width: 300,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    lineHeight: 20,
    textAlignVertical: 'top',
    color: '#fff',
  },
  error: {
    color: 'red',
    marginTop: 4,
    paddingLeft: 4,
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
    marginVertical: 10,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalContent: {
    width: 300,
    height: 280,
    borderRadius: 10,
    padding: 20,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  modalContent2: {
    width: 300,
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 20,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageConatiner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'green',
  },
  imageConatiner2: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'red',
  },
  image: {
    width: 80,
    height: 80,
  },
  image2: {
    width: 65,
    height: 65,
  },
  successMessage: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  failureMessage: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    alignSelf: 'center',
    width: 100,
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutbutton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    alignSelf: 'center',
    width: 200,
    marginVertical: 20,
  },
})