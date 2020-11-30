import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',

        paddingVertical: 50,
        backgroundColor: '#3e3e3e'
    },

    accountContainer: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    avatarContainer: {
        backgroundColor: '#d9dadc',
        borderRadius: 60,
        width: 80,
        height: 80,
        marginBottom: 20,

        justifyContent: 'center',
        alignItems: 'center'
    },

    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35
    },

    input: {
        backgroundColor: '#d9dadc',
        fontSize: 16,
        fontFamily: 'Nunito600',
        width: '80%',
        marginBottom: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10
    },

    warningText: {
        color: '#d9dadc',
        fontSize: 16,
        fontFamily: 'Nunito600',
        width: '70%'
    },

    saveButton: {
        backgroundColor: '#28a745',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10
    },

    saveButtonText: {
        color: '#d9dadc'
    },

    errorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#d9dadc',
        paddingVertical: 5,
        paddingHorizontal: 10,

        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#c82333'
    },

    errorText: {
        color: '#c82333',
        fontFamily: 'Nunito600',
        fontSize: 16
    },

    sucessContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#d9dadc',
        paddingVertical: 5,
        paddingHorizontal: 10,

        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#28a745'
    },

    sucessText: {
        color: '#28a745',
        fontFamily: 'Nunito600',
        fontSize: 16
    },

    accountConfig: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',

        width: '75%'
    },

    buttonLeave: {
        backgroundColor: '#4c43df',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5
    },

    buttonLeaveText: {
        color: '#d9dadc',
        fontFamily: 'Nunito600'
    },

    buttonDelete: {
        backgroundColor: '#c82333',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5
    },

    buttonDeleteText: {
        color: '#d9dadc',
        fontFamily: 'Nunito600'
    }
})

export default styles