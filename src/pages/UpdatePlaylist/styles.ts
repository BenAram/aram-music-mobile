import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3e3e3e'
    },

    header: {
        width: '100%',
        height: '10%',
        padding: 20,

        borderBottomWidth: 1,
        borderBottomColor: '#d9dadc',

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    headerText: {
        fontFamily: 'Nunito400',
        fontSize: 16,
        color: '#d9dadc'
    },

    headerTextName: {
        fontFamily: 'Nunito700'
    },

    musics: {
        width: '100%'
    },

    interface: {
        width: '100%',
        height: '10%',
        position: 'absolute',
        padding: 10,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    inputContainer: {
        width: '60%'
    },

    input: {
        width: '100%',

        fontFamily: 'Nunito400',
        fontSize: 14,
        color: '#000',
        backgroundColor: '#d9dadc',

        borderRadius: 10
    },

    text: {
        fontFamily: 'Nunito400',
        fontSize: 14,
        color: '#d9dadc'
    },

    saveButton: {
        backgroundColor: '#4c43df',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 10
    }
})

export default styles