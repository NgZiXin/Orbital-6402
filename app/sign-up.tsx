import { Keyboard, KeyboardAvoidingView, Platform, Pressable, TextInput, Text, View, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { globalStyles } from '@/styles/global';
import { Formik } from 'formik';
import { useNavigation } from 'expo-router';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

export default function SignUp () {
  const [showPicker, setShowPicker] = useState(false);
  const [visible, setVisibility] = useState(false);

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
                              <ScrollView style={{position: 'relative', bottom: 10}}>
                                  <View>
                                      <Text style={[globalStyles.para, styles.label]}>Name:</Text>
                                      <TextInput 
                                          style={globalStyles.input}
                                          placeholder='John Cena'
                                          onChangeText={formikProps.handleChange('name')}
                                          value={formikProps.values.name}/>
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
                                            
                                            {visible &&
                                            <TouchableOpacity onPress={() => setVisibility(false)}>
                                                <Ionicons name='eye-off-outline' size={20} style={{
                                                    position: 'relative', top: 2}}/>
                                            </TouchableOpacity>}

                                            {!visible &&
                                            <TouchableOpacity onPress={() => setVisibility(true)}>
                                                <Ionicons name='eye-outline' size={20} style={{
                                                    position: 'relative', top: 2}}/>
                                            </TouchableOpacity>}
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

                                    <View>
                                        <Text style={[globalStyles.para, styles.label]}>Birthday:</Text>
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
                                      <Text style={{ ...globalStyles.header, textAlign: 'center', fontSize: 12}}>Create Account</Text>
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
})