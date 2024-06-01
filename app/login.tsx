import { Keyboard, KeyboardAvoidingView, Platform, TextInput, Text, View, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { globalStyles } from '@/styles/global';
import { Formik } from 'formik';
import { useNavigation } from 'expo-router';

export default function Login() {
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
                            initialValues={{name: '', password: ''}}
                            onSubmit={(values, actions) => {
                                actions.resetForm();
                                navigation.navigate('(tabs)'); 
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
                                        
                                        {/* For now, the login button directs straight into profile page*/}
                                        <TouchableOpacity onPress={() => formikProps.handleSubmit()} style={styles.submit}>
                                            <Text style={{ ...globalStyles.para, textAlign: 'center', fontSize: 14}}>Log In</Text>
                                        </TouchableOpacity> 
                                        
                                        <TouchableOpacity onPress={() => navigation.navigate('sign-up')} style={styles.submit}>
                                            <Text style={{ ...globalStyles.para, textAlign: 'center', fontSize: 14}}>Sign Up</Text>
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