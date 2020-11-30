import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3e3e3e'
    },

    header: {
        width: '100%',
        height: '8%',

        borderBottomWidth: 1,
        borderBottomColor: '#d9dadc',

        paddingHorizontal: 15,

        justifyContent: 'center',
        alignItems: 'flex-start'
    },

    userInfoContainer: {
        width: '100%',
        height: '20%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',

        padding: 15,

        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    userInfoImageContainer: {
        flexDirection: 'row'
    },

    userInfoImage: {
        width: 60,
        height: 60,
        borderRadius: 30
    },

    userInfoNameContainer: {
        marginLeft: 10
    },

    userInfoName: {
        color: '#d9dadc',
        fontSize: 16,
        fontFamily: 'Nunito600'
    },

    userInfoStatus: {
        width: 20,
        height: 20,
        borderRadius: 10
    },

    userInfoActionsContainer: {
        width: 100,
        height: 50,

        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },

    userInfoShareButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4c43df',

        justifyContent: 'center',
        alignItems: 'center'
    },

    main: {
        width: '100%',
        height: '64%',

        padding: 10
    },

    mainInfoItem: {
        width: '100%',
        height: 150,

        marginBottom: 20
    },

    mainInfoTitle: {
        color: '#d9dadc',
        fontSize: 16,
        fontFamily: 'Nunito700',

        marginLeft: 10
    },

    mainInfoScroll: {
        width: '100%',
        height: '90%'
    },

    mainInfoScrollItem: {
        width: 80,
        height: '100%',
        marginHorizontal: 10
    },

    mainInfoScrollImage: {
        width: 80,
        height: 80
    },

    mainInfoScrollAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40
    },

    mainInfoScrollName: {
        color: '#d9dadc',
        fontFamily: 'Nunito400',
        fontSize: 16
    },

    footer: {
        width: '100%',
        height: '8%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',

        justifyContent: 'center',
        alignItems: 'center'
    },

    footerText: {
        color: '#d9dadc',
        fontSize: 16,
        fontFamily: 'Nunito400'
    }
})

export default styles