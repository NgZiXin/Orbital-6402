import { Alert, Keyboard, KeyboardAvoidingView, Platform, TextInput, Text, View, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { globalStyles } from '../styles/global';
import { Formik, FormikHelpers } from 'formik';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { setItem } from '../utility/asyncStorage';

export default function Login() {
    const [visible, setVisibility] = useState(false);
    const navigation: any = useNavigation();

    interface LoginValues {
        username: string;
        password: string;
    }
    const handleSubmit = async (values: LoginValues, actions: FormikHelpers<LoginValues>) => {
        try {
            const response = await fetch('http://192.168.50.37:8000/accounts/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            const token: string = data['token']; 
            
            // stores the user (session-based) token string 
            setItem('token', token);
    
            // Handle successful login (navigate to profile page)
            actions.resetForm();
            navigation.navigate('(tabs)');
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            Alert.alert('Login Failed', 'Please check your information and try again.');
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
                            initialValues={{username: '', password: ''}}
                            onSubmit={handleSubmit}>
                            {/* Function that generates the required JSX/TSX */}
                            {(formikProps) => (
                                <View>
                                    <Text style={globalStyles.header}>🧙  Welcome!  🧙</Text>
                                    <ScrollView style={{position: 'relative', bottom: 15}}>
                                        <View>
                                            <Text style={[globalStyles.para, styles.label]}>Name:</Text>
                                            <TextInput 
                                                style={globalStyles.input}
                                                placeholder='John Cena'                                    
                                                onChangeText={formikProps.handleChange('name')}
                                                value={formikProps.values.username}/>
                                        </View>
                                        
                                        <View style={{position: 'relative', bottom: 9}}>
                                            <Text style={[globalStyles.para, styles.label, {top: 15}]}>Password:</Text>
                                            <View style={[globalStyles.input, styles.label, styles.extra]}>
                                                <TextInput 
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
                                        
                                        {/* For now, the login button directs straight into profile page*/}
                                        <TouchableOpacity onPress={() => formikProps.handleSubmit()} style={styles.submit}>
                                            <Text style={{ ...globalStyles.header, textAlign: 'center', fontSize: 12}}>Log In</Text>
                                        </TouchableOpacity> 
                                        
                                        <TouchableOpacity onPress={() => navigation.navigate('sign-up')} style={styles.submit}>
                                            <Text style={{ ...globalStyles.header, textAlign: 'center', fontSize: 12}}>Sign Up</Text>
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