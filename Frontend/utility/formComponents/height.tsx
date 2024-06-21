import { Text, TextInput, View } from 'react-native'
import { globalStyles } from '../../styles/global';

export default function HeightField({ formikProps }: any) {
    return (
        <>
            <View>
                <Text style={[globalStyles.para, globalStyles.label]}>Height (in metres):</Text>
                <TextInput 
                    style={globalStyles.input}
                    placeholder='1.80'
                    onChangeText={formikProps.handleChange('height')}
                    value={formikProps.values.height}
                    keyboardType='numeric'/>
            </View>
        </>
    )
}