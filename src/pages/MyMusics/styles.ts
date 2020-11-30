import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#3e3e3e',
        paddingHorizontal: 20
    },

    container: {
        flex: 1
    },

    section: {
        marginVertical: 20
    },

    sectionTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },

    sectionTitle: {
        fontFamily: 'Nunito700',
        fontSize: 18,
        color: '#d9dadc'
    },

    sectionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',

        marginBottom: 5
    },

    sectionButtonMusic: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    sectionName: {
        fontFamily: 'Nunito600',
        fontSize: 16,
        color: '#d9dadc'
    },

    sectionAccess: {
        fontFamily: 'Nunito400',
        fontSize: 14,
        color: '#d9dadc'
    },

    sectionImage: {
        width: 40,
        height: 40,
        marginRight: 10
    },

    sectionButtonsContainer: {
        flexDirection: 'row'
    },

    sectionPlaylistName: {
        fontFamily: 'Nunito600',
        fontSize: 16,
        color: '#d9dadc',

        marginRight: 5
    },

    sectionPlaylistMusics: {
        fontFamily: 'Nunito400',
        fontSize: 13,
        color: '#d9dadc'
    },

    containerModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },

    modal: {
        width: '80%',
        height: '20%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#d9dadc',
        justifyContent: 'space-between'
    },

    modalTextInput: {
        backgroundColor: 'white',
        paddingHorizontal: 5,
        borderRadius: 10,
        marginTop: 10
    },

    modalButtonContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-end'
    },

    modalButtonCancel: {
        backgroundColor: '#dc3545',
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 7
    },

    modalConfirmButton: {
        backgroundColor: '#4c43df',
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 7
    },

    modalButtonText: {
        color: '#d9dadc'
    }
})

export default styles