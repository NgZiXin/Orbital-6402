import React, { useState } from 'react';
import { ScrollView, StyleSheet, KeyboardAvoidingView, TextInput, View, Text, Platform, Pressable, TouchableOpacity} from 'react-native';
import { globalStyles } from '../styles/global';
import { Formik } from 'formik';
import DateTimePicker from '@react-native-community/datetimepicker'; 

export default function EditForm({submitHandler}: any) {
    const [showPicker, setShowPicker] = useState(false)
    const datePlaceholder = new Date();

    // TODO: add a way to change password in future!  CCB! 
    return (
        <View style={globalStyles.container}>
            {/* This is to account for keyboard potentially blocking view of input fields*/}
            {/* Not really sure how to solve form being cut+overflow instead of shifting issue*/}
            <KeyboardAvoidingView 
            style={globalStyles.container}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}    
            behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <View style={{flex: 1}}>
                    <Formik 
                        style={{flex: 1}}
                        initialValues={{name: '', height: '', weight: '', birthday: new Date()}}
                        onSubmit={(values, actions) => {
                            // TODO: make this link to the data displayed on profile page 
                            actions.resetForm();
                            submitHandler()
                        }}>
                        {/* Function that generates the required JSX/TSX */}
                        {(formikProps) => (
                            <View>
                                <ScrollView style={{position: 'relative', bottom: 5}}>
                                    <View>
                                        <Text style={[globalStyles.para, styles.label]}>Name:</Text>
                                        <TextInput 
                                            style={globalStyles.input}
                                            placeholder='John Cena'
                                            // onChangeText, this function runs
                                            // updating the associated value for 'name' input field
                                            onChangeText={formikProps.handleChange('name')}

                                            // grabs the updated value
                                            value={formikProps.values.name}/>
                                    </View>
                                    
                                    <View>
                                        <Text style={[globalStyles.para, styles.label]}>Height (in metres)</Text>
                                        <TextInput 
                                            style={globalStyles.input}
                                            placeholder='1.80'
                                            // updating the associated value for 'height' input field
                                            onChangeText={formikProps.handleChange('height')}

                                            // grabs the updated value
                                            value={formikProps.values.height}
                                            keyboardType='numeric'/>
                                    </View>
                                    
                                    <View>
                                        <Text style={[globalStyles.para, styles.label]}>Weight (in kg)</Text>
                                        <TextInput 
                                        style={globalStyles.input}
                                        placeholder='69'
                                        // updating the associated value for 'weight' input field
                                        onChangeText={formikProps.handleChange('weight')}

                                        // grabs the updated value
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
                                            // updating the associated value for 'birthday' input field
                                            onChangeText={formikProps.handleChange('birthday')}

                                            // grabs the updated value
                                            value={formikProps.values.birthday.toLocaleDateString()}
                                            editable={false}
                                            onPressIn={() => setShowPicker(true)}/>
                                        </Pressable>}
                                    </View>                        
                                    
                                    <TouchableOpacity onPress={() => formikProps.handleSubmit()} style={styles.submit}>
                                        <Text style={{ ...globalStyles.para, textAlign: 'center', fontSize: 14}}>Submit</Text>
                                    </TouchableOpacity> 
                                </ScrollView>
                            </View>
                        )}
                    </Formik>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
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