import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, TextInput, View, Text, Pressable, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import { globalStyles } from '../styles/global';
import { Formik, FormikHelpers } from 'formik';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { getItem } from './asyncStorage';

interface SignUpValues {
    username: string;
    password: string;
    height: string;
    weight: string;
    birthday: Date;
    gender: string
};

export default function EditForm({submitHandler}: any) {
    const [showPicker, setShowPicker] = useState(false)
    const [visible, setVisibility] = useState(false); 
    const datePlaceholder = new Date();

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
    
    // IMPORTANT!! 
    // does this overwrite the same id? if not this is wrong! 
    const formSubmitHandler = async (values: SignUpValues, actions: FormikHelpers<SignUpValues>) => {
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

        // const data = await response.json();

        // Handle successful signup (close the edit modal) 
        actions.resetForm();
        submitHandler();
    };
    
    return (
        <View style={globalStyles.container}>
            {/* This is to account for keyboard potentially blocking view of input fields */}
            {/* Not really sure how to solve form being cut+overflow instead of shifting issue */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{flex: 1}}>
                    <Formik 
                        style={{flex: 1}}
                        initialValues={{username: '', password: '', height: '', weight: '', birthday: new Date(), gender: ''}}
                        onSubmit={formSubmitHandler}>
                        {/* Function that generates the required JSX/TSX */}
                        {(formikProps) => (
                            <View>
                                <ScrollView style={{position: 'relative', bottom: 10}}>
                                    <View style={{position: 'relative', bottom: 5}}>
                                        <View>
                                            <Text style={[globalStyles.para, styles.label]}>Name:</Text>
                                            <TextInput 
                                                style={globalStyles.input}
                                                placeholder='John Cena'
                                                // onChangeText, this function runs
                                                // updating the associated value for 'name' input field
                                                onChangeText={formikProps.handleChange('name')}

                                                // grabs the updated value
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

                                                    // updating the associated value for 'password' input field
                                                    onChangeText={formikProps.handleChange('password')}

                                                    // grabs the updated value
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
                                                // updating the associated value for 'height' input field
                                                onChangeText={formikProps.handleChange('height')}

                                                // grabs the updated value
                                                value={formikProps.values.height}
                                                keyboardType='numeric'/>
                                        </View>
                                    
                                        <View>
                                            <Text style={[globalStyles.para, styles.label]}>Weight (in kg):</Text>
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
                                                        // updating the associated value for 'birthday' input field
                                                        onChangeText={formikProps.handleChange('birthday')}

                                                        // grabs the updated value
                                                        value={formikProps.values.birthday.toLocaleDateString()}
                                                        editable={false}
                                                        onPressIn={() => setShowPicker(true)}/>
                                                </Pressable>
                                            )}
                                        </View>                        
                                    
                                        <TouchableOpacity onPress={() => formikProps.handleSubmit()} style={styles.submit}>
                                            <Text style={{ ...globalStyles.header, textAlign: 'center', fontSize: 12}}>Submit</Text>
                                        </TouchableOpacity> 
                                    </View>
                                </ScrollView>
                            </View>
                        )}
                    </Formik>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
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