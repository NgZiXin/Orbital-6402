import { Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, TextInput, Text, View, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { globalStyles } from '../styles/global';
import { Formik, FormikHelpers } from 'formik';
import { useNavigation } from 'expo-router';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

export default function SignUp () {
  const [showPicker, setShowPicker] = useState(false);
  const [visible, setVisibility] = useState(false);

  const datePlaceholder = new Date();
  const navigation: any = useNavigation(); 

  const [maleButton, setMaleButton] = useState(false); 
  const [femaleButton, setFemaleButton] = useState(false); 

  const maleButtonHandler = (formikProps: any) => {
    formikProps.setFieldValue('gender', 'M');
    setMaleButton(!maleButton);
    setFemaleButton(false);
  };

  const femaleButtonHandler = (formikProps: any) => {
    formikProps.setFieldValue('gender', 'F');
    setFemaleButton(!femaleButton);
    setMaleButton(false);
  };

  interface SignUpValues {
    username: string;
    password: string;
    height: string;
    weight: string;
    birthday: Date;
    gender: string
  };
  
  const handleSubmit = async (values: SignUpValues, actions: FormikHelpers<SignUpValues>) => {
    try {
        // Custom serialization
        const body = {
            ...values,
            birthday: values.birthday.toISOString().split('T')[0] // Convert date to 'YYYY-MM-DD' format
        };
        const response = await fetch('http://192.168.18.5:8000/accounts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Handle successful signup (navigate to login screen)
        actions.resetForm();
        navigation.navigate('login');
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        Alert.alert('Signup Failed', 'Please check your information and try again.');
    }
  };
    
  return (
    <View style={globalStyles.container}>
      {/* This is to account for keyboard potentially blocking view of input fields*/}
      <KeyboardAvoidingView 
      style={globalStyles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}    
      behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{flex: 1, padding: 20, justifyContent: 'center'}}>
                  <Formik 
                      style={{flex: 1}}
                      initialValues={{username: '', password: '', height: '', weight: '', birthday: new Date(), gender: ''}}
                      onSubmit={handleSubmit}>
                      {/* Function that generates the required JSX/TSX */}
                      {(formikProps) => (
                          <View>
                              <Text style={globalStyles.header}>🧙  Welcome!  🧙</Text>
                              <ScrollView style={{position: 'relative', bottom: 10}}>
                                <View style={{position: 'relative', bottom: 5}}>
                                    <View>
                                      <Text style={[globalStyles.para, styles.label]}>Name:</Text>
                                      <TextInput 
                                          style={globalStyles.input}
                                          placeholder='John Cena'
                                          onChangeText={formikProps.handleChange('name')}
                                          value={formikProps.values.username}/>
                                    </View>

                                    <View>
                                        <Text style={[globalStyles.para, styles.label]}>Gender:</Text>
                                        <View style={{ width: '95%', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <TouchableOpacity
                                                style={[styles.genderOption, maleButton ? styles.selectedGender : undefined]}
                                                onPress={() => maleButtonHandler(formikProps)}>
                                                <Text style={{fontSize: 12, fontFamily: 'inter-regular'}}>Male</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.genderOption, femaleButton ? styles.selectedGender : undefined]}
                                                onPress={() => femaleButtonHandler(formikProps)}>
                                                <Text style={{fontSize: 12, fontFamily: 'inter-regular'}}>Female</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>            
                                  
                                  <View style={{position: 'relative', bottom: 9}}>
                                      <Text style={[globalStyles.para, styles.label, {top: 15}]}>Password:</Text>
                                      <View style={[globalStyles.input, styles.label, styles.extra]}>
                                            <TextInput 
                                                // trick where child (TextInput) just matches the borderRadius
                                                // let parent (View) extend fully
                                                style={{borderRadius: 6, width: '90%', height: '100%'}}
                                                placeholder='youCantSeeMe69'
                                                onChangeText={formikProps.handleChange('password')}
                                                value={formikProps.values.password}
                                                secureTextEntry={!visible}/>
                                            
                                            {visible && (
                                                <TouchableOpacity onPress={() => setVisibility(false)}>
                                                    <Ionicons name='eye-off-outline' size={20} style={{
                                                        position: 'relative', top: 2}}/>
                                                </TouchableOpacity>
                                            )}

                                            {!visible && (
                                                <TouchableOpacity onPress={() => setVisibility(true)}>
                                                    <Ionicons name='eye-outline' size={20} style={{
                                                    position: 'relative', top: 2}}/>
                                                </TouchableOpacity>
                                            )}
                                      </View>
                                  </View>
                                  
                                  <View>
                                        <Text style={[globalStyles.para, styles.label]}>Height (in metres):</Text>
                                        <TextInput 
                                            style={globalStyles.input}
                                            placeholder='1.80'
                                            onChangeText={formikProps.handleChange('height')}
                                            value={formikProps.values.height}
                                            keyboardType='numeric'/>
                                    </View>
                                    
                                    <View>
                                        <Text style={[globalStyles.para, styles.label]}>Weight (in kg):</Text>
                                        <TextInput 
                                            style={globalStyles.input}
                                            placeholder='69'
                                            onChangeText={formikProps.handleChange('weight')}
                                            value={formikProps.values.weight}
                                            keyboardType='numeric'/>
                                    </View>
                                    
                                    {/* TODO: Find a way to remove the flashing when click OK on DTP popup */}
                                    <View>
                                        <Text style={[globalStyles.para, styles.label]}>Birthday:</Text>
                                        {showPicker && (
                                            <DateTimePicker
                                                mode='date'
                                                display='spinner'
                                                value={formikProps.values.birthday}
                                                onChange={({ type }, selectedDate) => {
                                                    if (type == 'set') { // set event
                                                        formikProps.setFieldValue('birthday', selectedDate || formikProps.values.birthday);
                                                        setShowPicker(false);
                                                    } else { // dismiss event
                                                        setShowPicker(false);
                                                    }}}
                                                maximumDate={new Date('2025-1-1')}/>
                                        )}
                                        
                                        {!showPicker && (
                                            <Pressable onPress={() => setShowPicker(true)}>
                                            <TextInput 
                                                style={globalStyles.input}
                                                placeholder={datePlaceholder.toDateString()}
                                                onChangeText={formikProps.handleChange('birthday')}
                                                value={formikProps.values.birthday.toLocaleDateString()}
                                                editable={false}
                                                onPressIn={() => setShowPicker(true)}/>
                                            </Pressable>
                                        )}
                                    </View>                        

                                    <TouchableOpacity onPress={() => navigation.navigate('login')} style={styles.submit}>
                                        <Text style={{ ...globalStyles.header, textAlign: 'center', fontSize: 12}}>Create Account</Text>
                                    </TouchableOpacity> 
                                </View>
                              </ScrollView>
                          </View>
                      )}
                  </Formik>
              </View>
          </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
      position: 'relative',
      top: 7
  },

  extra: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  submit: {
      width: '100%',
      backgroundColor: '#F5BABA',
      borderRadius: 10,
      marginTop: 15
  },

  genderOption: {
    width: '48%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
  },

  selectedGender: {
    borderColor: 'red'
  },
})