import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 40,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    musicBackground: {
        width: 40,
        height: 30
    },

    text: {
        fontFamily: 'Nunito400',
        fontSize: 14,
        color: '#d9dadc',

        marginLeft: 10
    }
})

export default styles