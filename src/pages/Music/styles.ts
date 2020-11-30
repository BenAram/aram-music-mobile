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

        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

        padding: 20
    },

    main: {
        width: '100%',
        height: '92%',

        padding: 20
    },

    musicBackground: {
        width: '100%',
        height: 200,

        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },

    typeText: {
        backgroundColor: '#4c43df',
        color: '#d9dadc',

        borderRadius: 10,

        justifyContent: 'center',
        alignItems: 'center',

        paddingVertical: 5,
        paddingHorizontal: 10,

        marginBottom: 27
    },

    playButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#4c43df',

        justifyContent: 'center',
        alignItems: 'center',

        marginHorizontal: 10,
        marginVertical: 20
    },

    title: {
        color: '#d9dadc',

        fontWeight: 'bold',
        fontSize: 16,

        marginTop: 5
    },

    text: {
        color: '#d9dadc',
        fontWeight: 'normal',
        fontSize: 16,
        marginBottom: 10
    },

    footer: {
        width: '100%',

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    userOwnerContainer: {
        flexDirection: 'row',
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,

        marginRight: 10
    },

    shareButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#4c43df',
        
        width: 40,
        height: 40,
        borderRadius: 20
    },

    addPlaylistButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#4c43df',
        
        width: 230,
        paddingVertical: 10,
        borderRadius: 10,
    },

    addPlaylistButtonText: {
        fontFamily: 'Nunito400',
        fontSize: 16,
        color: '#d9dadc'
    },

    addToAPlaylistContainer: {
        backgroundColor: '#d9dadc',
        width: '100%'
    },

    addToAPlaylistHeader: {
        width: '100%',
        height: 70,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'black',

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    addToAPlaylistHeaderText: {
        fontFamily: 'Nunito400',
        fontSize: 16
    },

    addToAPlaylistButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',

        width: '100%',
        paddingHorizontal: 10,
        marginVertical: 5
    },

    addToAPlaylistButtonText: {
        fontFamily: 'Nunito400',
        fontSize: 16,

        marginLeft: 5
    }
})

export default styles