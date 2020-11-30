import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '8%',
        backgroundColor: '#4c43df',
        position: 'absolute',

        flexDirection: 'row',
        alignItems: 'center'
    },

    linearGradient: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    musicInfo: {
        width: '80%',
        height: '100%',

        padding: 20,

        flexDirection: 'row',
        alignItems: 'center'
    },

    image: {
        width: 50,
        height: 50
    },

    name: {
        fontFamily: 'Nunito600',
        fontSize: 18,
        color: '#d9dadc',

        marginLeft: 10
    },

    playlistName: {
        fontFamily: 'Nunito400',
        fontSize: 16,
        color: '#d9dadc',

        marginLeft: 10
    },

    playlistNameText: {
        fontFamily: 'Nunito700'
    },

    rightCloseButton: {
        width: 60,
        height: '100%',
        backgroundColor: '#c82333',

        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default styles