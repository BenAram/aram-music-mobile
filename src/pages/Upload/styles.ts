import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',

        backgroundColor: '#3e3e3e'
    },

    header: {
        width: '100%',
        height: '10%',
        borderBottomWidth: 1,
        borderBottomColor: '#d9dadc',

        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },

    headerImage: {
        width: 55,
        height: 55
    },

    headerText: {
        fontFamily: 'Nunito600',
        fontSize: 18,
        color: '#d9dadc'
    },

    mainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },

    main: {
        width: '100%',
        height: '100%'
    },

    subtitle: {
        fontFamily: 'Nunito700',
        fontSize: 18,

        color: '#d9dadc'
    },

    inputContainer: {
        flexDirection: 'row'
    },

    input: {
        fontFamily: 'Nunito600',
        fontSize: 18,
        width: '70%',

        borderWidth: 1,
        borderColor: '#d9dadc',
        borderRadius: 5,
        backgroundColor: '#fff',

        paddingVertical: 5,
        paddingHorizontal: 10,
        marginLeft: 10,
        marginBottom: 15
    },

    buttonAddDocument: {
        borderWidth: 1,
        borderColor: '#d9dadc',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 10,

        maxWidth: '80%'
    },

    buttonAddDocumentText: {
        fontSize: 16,
        fontFamily: 'Nunito600',
        color: '#d9dadc'
    },

    radioItemsContainer: {
        width: '80%',
        marginBottom: 5
    },

    radioItems: {
        flexGrow: 1
    },
    
    radioItem: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10
    },

    radioText: {
        fontSize: 16,
        fontFamily: 'Nunito600'
    },

    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d9dadc',

        borderWidth: 1,
        borderColor: '#c82333',
        borderRadius: 10,

        padding: 10,
        marginVertical: 5
    },

    errorMessage: {
        color: '#c82333',
        fontSize: 17,
        fontFamily: 'Nunito400',

        marginLeft: 10
    },

    sucessContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d9dadc',

        borderWidth: 1,
        borderColor: '#28a745',
        borderRadius: 10,

        padding: 10,
        marginVertical: 5
    },

    sucessMessage: {
        color: '#28a745',
        fontSize: 17,
        fontFamily: 'Nunito400',

        marginLeft: 10
    },

    buttonSendMusic: {
        backgroundColor: '#4c43df',
        marginTop: 10,

        paddingVertical: 10,
        paddingHorizontal: 50,

        borderRadius: 10,
        borderRightWidth: 2,
        borderRightColor: '#1c13af',
        borderBottomWidth: 2,
        borderBottomColor: '#1c13af'
    },

    buttonSendMusicText: {
        color: '#d9dadc',
        fontFamily: 'Nunito600',
        fontSize: 18
    }
})

export default styles