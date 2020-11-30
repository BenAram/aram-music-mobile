import {
    StyleSheet,
} from 'react-native'

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'space-between',

        backgroundColor: '#e6e6e6',
        paddingBottom: 30,
        paddingTop: 40
    },

    logo: {
        marginBottom: 50
    },

    inputsContainer: {
        width: '100%',
        alignItems: 'center'
    },

    inputLabel: {
        fontFamily: 'Nunito600',
        fontSize: 20
    },

    inputContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },

    input: {
        width: '75%',
        padding: 10,
        marginLeft: 10,
        fontFamily: 'Nunito600',

        borderWidth: 1,
        borderColor: '#d9dadc',
        backgroundColor: '#fff'
    },

    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',

        borderWidth: 1,
        borderColor: '#c82333',
        borderRadius: 10,

        padding: 10,
        marginBottom: 5
    },

    errorMessage: {
        color: '#c82333',
        fontSize: 17,
        fontFamily: 'Nunito400',

        marginLeft: 10
    },

    confirmContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    rememberMeText: {
        fontFamily: 'Nunito400',
        fontSize: 18,
        marginRight: 25
    },

    loginButton: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        backgroundColor: '#4c43df',
        borderRadius: 10
    },

    loginText: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Nunito400',
    },

    question: {
        fontSize: 24,
        fontFamily: 'Nunito700'
    },

    createAccountButton: {
        borderWidth: 1,
        borderColor: '#3e3e3e',
        borderRadius: 10,
        backgroundColor: '#fff',

        paddingVertical: 10,
        paddingHorizontal: 25
    },

    createAccountText: {
        fontFamily: 'Nunito400'
    }
})

export default styles