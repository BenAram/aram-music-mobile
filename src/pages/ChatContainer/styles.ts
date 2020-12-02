import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    removeFriendButton: {
        maxWidth: 50,
        backgroundColor: '#c82333',

        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    text: {
        color: '#d9dadc',
        fontSize: 18,
        fontFamily: 'Nunito400'
    },

    container: {
        backgroundColor: '#3e3e3e'
    },

    header: {
        width: '100%',
        height: '8%',
        borderBottomColor: '#d9dadc',
        borderBottomWidth: 1,

        paddingHorizontal: 10,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    headerActionsContainer: {
        width: '25%',
        height: '100%',

        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },

    headerFriendsRequestsText: {
        width: 20,

        color: '#d9dadc',
        fontFamily: 'Nunito400',
        fontSize: 16,

        position: 'absolute',
        left: 15,
        top: 22
    },

    main: {
        width: '100%',
        height: '92%'
    },

    noFriendsContainer: {
        width: '65%',
        height: 200,

        alignSelf: 'center',
        marginTop: 20,

        justifyContent: 'center',
        alignItems: 'center'
    },

    noFriendsImage: {
        width: 100,
        height: 100,

        marginVertical: 5
    },

    addFriendContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',

        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    addFriendView: {
        width: 350,
        height: 200,
        borderRadius: 15,
        backgroundColor: '#d9dadc',

        alignItems: 'center'
    },

    addFriendHeader: {
        width: '100%',
        height: 35,
        paddingHorizontal: 10,

        justifyContent: 'center',
        alignItems: 'flex-end'
    },

    addFriendTitle: {
        fontFamily: 'Nunito400',
        fontSize: 16
    },

    addFriendInput: {
        width: '80%',
        height: 30,
        paddingHorizontal: 5,
        
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 10,

        fontSize: 16,
        fontFamily: 'Nunito400'
    },

    addFriendSuccessContainer: {
        backgroundColor: '#28a745',

        paddingHorizontal: 5,
        paddingVertical: 10,
        borderRadius: 5,

        marginTop: 5,

        maxWidth: '80%'
    },

    addFriendErrorContainer: {
        backgroundColor: '#c82333',

        paddingHorizontal: 5,
        paddingVertical: 10,
        borderRadius: 5,

        marginTop: 5,

        maxWidth: '80%'
    },
    
    addFriendButton: {
        backgroundColor: '#4c43df',
        paddingHorizontal: 15,
        paddingVertical: 7.5,

        borderRadius: 10,

        alignSelf: 'flex-end',

        marginTop: 10,
        marginRight: 15
    },

    friendsSwipeable: {
        width: '100%',
        height: 50
    },

    friendsButtons: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 10
    },

    friendsImages: {
        width: 40,
        height: 40,
        borderRadius: 20,

        marginRight: 10
    },

    friendsChatContainer: {
        
    },

    friendsChatTextContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    friendsChatView: {
        width: 15,
        height: 15,
        borderRadius: 7.5,

        marginLeft: 5
    },

    friendsChatText: {
        color: '#d9dadc',
        fontFamily: 'Nunito700',
        fontSize: 16
    },

    friendsChatMessageContainer: {
        flexDirection: 'row'
    },

    friendsChatMessage: {
        color: '#d9dadc',
        fontFamily: 'Nunito400'
    },

    friendsChatDate: {
        color: 'rgba(255, 255, 255, 0.2)',
        fontFamily: 'Nunito400',

        marginLeft: 10
    },

    friendsChatNewMessages: {
        color: '#d9dadc',
        fontFamily: 'Nunito400',
        textAlign: 'center',

        backgroundColor: '#F17F42',
        height: 18,
        paddingHorizontal: 5,
        borderRadius: 18,

        marginLeft: 5
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