import { StyleSheet, Dimensions } from 'react-native'

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#3e3e3e'
    },

    header: {
        width: '100%',
        height: '8%',

        borderBottomWidth: 1,
        borderBottomColor: '#d9dadc',

        padding: 10,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    headerProfileContainer: {
        width: '50%',
        height: '100%',

        flexDirection: 'row',
        alignItems: 'flex-start'
    },

    headerProfileImage: {
        width: 40,
        height: 40,
        borderRadius: 20
    },

    headerProfileName: {
        color: '#d9dadc',
        fontSize: 16,
        fontFamily: 'Nunito400',

        marginLeft: 10
    },

    headerChatView: {
        width: 15,
        height: 15,
        borderRadius: 7.5,

        marginLeft: 5
    },

    main: {
        width: '100%',

        paddingHorizontal: 10
    },

    mainMessageContainer: {
        flexDirection: 'row'
    },

    mainMessageAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20
    },

    mainMessageNameContainer: {
        marginHorizontal: 5
    },

    mainMessageName: {
        color: '#d9dadc',
        fontSize: 16,
        fontFamily: 'Nunito700'
    },

    mainMessageDate: {
        color: 'rgba(255, 255, 255, 0.2)',
        fontSize: 16,
        fontFamily: 'Nunito400'
    },

    mainMessageContentContainer: {
        position: 'absolute',
        top: 20,
        left: 45
    },

    mainMessageContent: {
        color: '#d9dadc',
        fontSize: 16,
        fontFamily: 'Nunito400'
    },

    mainMessageContentAfter: {
        color: '#d9dadc',
        fontSize: 16,
        fontFamily: 'Nunito400',

        marginLeft: 45
    },
    
    footer: {
        width: '100%',
        height: '8%',

        borderTopWidth: 1,
        borderTopColor: '#d9dadc',

        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 7
    },

    footerInput: {
        flex: 1,
        height: '65%',
        borderRadius: 20,

        backgroundColor: 'rgba(0, 0, 0, 0.2)',

        fontSize: 16,
        fontFamily: 'Nunito400',
        color: '#d9dadc'
    },

    footerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,

        backgroundColor: '#4c43df',

        marginLeft: 15,

        justifyContent: 'center',
        alignItems: 'center'
    },

    modalizeContainer: {
        flex: 1,
        backgroundColor: '#3e3e3e',

        padding: 10
    },

    modalizeButton: {
        width: '100%',
        height: 40,

        flexDirection: 'row',
        alignItems: 'center'
    },

    modalizeButtonDivider: {
        width: 3,
        height: '100%',
        backgroundColor: '#d9dadc',

        marginHorizontal: 10
    },

    modalizeButtonText: {
        color: '#d9dadc',
        fontSize: 16,
        fontFamily: 'Nunito400'
    }
})

export default styles