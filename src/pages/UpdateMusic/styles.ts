import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: '#3e3e3e'
    },

    containerStyle: {
        alignItems: 'center'
    },

    returnButtonContainer: {
        width: '100%',
        height: 30,
        justifyContent: 'flex-end',
        alignItems: 'flex-start'
    },

    returnButton: {
        width: 26,
        height: 26,
        marginLeft: 10
    },

    image: {
        width: 340,
        height: 170,
        marginVertical: 20
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },

    input: {
        backgroundColor: '#d9dadc',
        width: '65%',
        borderRadius: 10,
        marginLeft: 10,
        padding: 10,

        fontFamily: 'Nunito600',
        fontSize: 14
    },

    sucessContainer: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 10
    },

    sucessText: {
        color: '#d9dadc'
    },

    saveButton: {
        backgroundColor: '#28a745',
        paddingHorizontal: 35,
        paddingVertical: 15,
        borderRadius: 10
    },

    saveButtonText: {
        fontFamily: 'Nunito600',
        fontSize: 14,
        color: '#d9dadc'
    }
})

export default styles