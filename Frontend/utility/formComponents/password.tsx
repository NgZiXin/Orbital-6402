import { globalStyles } from '../../styles/global';
import { Text, TextInput, TouchableOpacity, StyleSheet, View} from 'react-native'; 
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react'; 

export default function passwordField({formikProps} : any) {
    const [visible, setVisibility] = useState(false);

    return (
        <>
             <View style={{position: 'relative', bottom: 9}}>
                <Text style={[globalStyles.para, globalStyles.label, {top: 15}]}>Password:</Text>
                <View style={[globalStyles.input, globalStyles.label, styles.extra]}>
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
        </>
    )
}

const styles = StyleSheet.create({
    extra: {
        flexDirection: 'row',
        alignItems: 'center'
      },
})
        
    