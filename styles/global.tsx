import { StyleSheet } from 'react-native';

// globalStyles for common components! 
export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    titleText: {
        fontFamily: 'inter-bold',
        fontSize: 18, 
    },

    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 6,
        width: '95%'
    },

    header: {
        fontFamily: 'inter-semibold',
        fontSize: 14,
        marginVertical: 8,
        lineHeight: 20
    },

    para: {
        fontFamily: 'inter-regular',
        fontSize: 12,
        marginVertical: 8,
        lineHeight: 20
    }
})