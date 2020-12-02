import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontFamily: 'Nunito700',
        color: '#d9dadc'
    },

    container: {
        flex: 1,
        backgroundColor: '#3e3e3e'
    },

    header: {
        width: '100%',
        height: '8%',

        borderBottomWidth: 1,
        borderBottomColor: '#d9dadc',

        paddingHorizontal: 10,

        justifyContent: 'center',
        alignItems: 'flex-start'
    },

    main: {
        width: '100%',
        height: '92%',

        justifyContent: 'center',
        alignItems: 'center'
    },

    mainNoFriendsRequests: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    mainNoFriendsRequestsText: {
        color: '#d9dadc',
        fontSize: 16,
        fontFamily: 'Nunito400'
    },

    mainScrollView: {
        flex: 1,
        width: '100%',

        padding: 10
    },

    mainUserContainer: {
        width: '100%',
        height: 60,

        marginVertical: 10,
        
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    mainUserInfoContainer: {
        width: '50%',
        height: '100%',

        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },

    mainUserAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25
    },

    mainUserName: {
        color: '#d9dadc',
        fontSize: 16,
        fontFamily: 'Nunito400',

        marginLeft: 10
    }
})

export default styles