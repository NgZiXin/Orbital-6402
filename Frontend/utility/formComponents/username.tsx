import { globalStyles } from '../../styles/global';
import { Text, TextInput, View } from 'react-native'; 


export default function UsernameField( {formikProps}: any ) {
    return ( 
        <>
            <View>
                <Text style={[globalStyles.para, globalStyles.label]}>Name:</Text>
                <TextInput 
                    style={globalStyles.input}
                    placeholder='John Cena'                                    
                    onChangeText={formikProps.handleChange('username')}
                    value={formikProps.values.username}/>
            </View>
        </>
    ); 
}


