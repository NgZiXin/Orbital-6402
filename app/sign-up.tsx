import { Keyboard, KeyboardAvoidingView, Platform, Pressable, TextInput, Text, View, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { globalStyles } from '@/styles/global';
import { Formik } from 'formik';
import { useNavigation } from 'expo-router';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function SignUp () {
  const [showPicker, setShowPicker] = useState(false)
  const datePlaceholder = new Date();
  const navigation: any = useNavigation(); 

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
                      initialValues={{name: '', password: '', height: '', weight: '', birthday: new Date()}}
                      onSubmit={(values, actions) => {
                          actions.resetForm();
                          navigation.navigate('login'); 
                      }}>
                      {/* Function that generates the required JSX/TSX */}
                      {(formikProps) => (
                          <View>
                              <Text style={globalStyles.header}>🧙  Welcome!  🧙</Text>
                              <ScrollView style={{position: 'relative', bottom: 5}}>
                                  <View>
                                      <Text style={[globalStyles.para, styles.label]}>Name:</Text>
                                      <TextInput 
                                          style={globalStyles.input}
                                          placeholder='John Cena'
                                          onChangeText={formikProps.handleChange('name')}
                                          value={formikProps.values.name}/>
                                  </View>
                                  
                                  <View>
                                      <Text style={[globalStyles.para, styles.label]}>Password:</Text>
                                      <TextInput 
                                          style={globalStyles.input}
                                          placeholder='youCantSeeMe69'
                                          onChangeText={formikProps.handleChange('password')}
                                          value={formikProps.values.password}
                                          // TODO: add icon to toggle password visible/hidden
                                          secureTextEntry={true}/>
                                  </View>
                                  
                                  <View>
                                        <Text style={[globalStyles.para, styles.label]}>Height (in metres)</Text>
                                        <TextInput 
                                            style={globalStyles.input}
                                            placeholder='1.80'
                                            onChangeText={formikProps.handleChange('height')}
                                            value={formikProps.values.height}
                                            keyboardType='numeric'/>
                                    </View>
                                    
                                    <View>
                                        <Text style={[globalStyles.para, styles.label]}>Weight (in kg)</Text>
                                        <TextInput 
                                        style={globalStyles.input}
                                        placeholder='69'
                                        onChangeText={formikProps.handleChange('weight')}
                                        value={formikProps.values.weight}
                                        keyboardType='numeric'/>
                                    </View>

                                    <View>
                                        <Text style={[globalStyles.para, styles.label]}>Birthday</Text>
                                        {showPicker &&
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
                                                }
                                            }}
                                            maximumDate={new Date('2025-1-1')}
                                        />}

                                        {!showPicker &&
                                        <Pressable onPress={() => setShowPicker(true)}>
                                            <TextInput 
                                            style={globalStyles.input}
                                            placeholder={datePlaceholder.toDateString()}
                                            onChangeText={formikProps.handleChange('birthday')}
                                            value={formikProps.values.birthday.toLocaleDateString()}
                                            editable={false}
                                            onPressIn={() => setShowPicker(true)}/>
                                        </Pressable>}
                                    </View>                        

                                  <TouchableOpacity onPress={() => navigation.navigate('login')} style={styles.submit}>
                                      <Text style={{ ...globalStyles.para, textAlign: 'center', fontSize: 14}}>Create Account</Text>
                                  </TouchableOpacity> 
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

  submit: {
      width: '100%',
      backgroundColor: '#F5BABA',
      borderRadius: 10,
      marginTop: 15
  },
})