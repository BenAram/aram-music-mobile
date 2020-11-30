import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3e3e3e',

        justifyContent: 'center',
        alignItems: 'center'
    },

    header: {
        width: '100%',
        height: '5%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',

        justifyContent: 'center',
        alignItems: 'flex-start',

        padding: 10
    },

    playlistInfoView: {
        width: '100%',
        height: '25%',
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },

    playlistInfoContainer: {
        width: '50%',
        height: '100%',

        justifyContent: 'center',
        alignItems: 'flex-start'
    },

    playlistInfoImage: {
        width: 160,
        height: 80
    },

    playlistInfoName: {
        color: '#d9dadc',
        fontSize: 16,
        fontWeight: 'bold'
    },

    playlistInfoText: {
        color: '#d9dadc',
        fontSize: 16
    },

    playlistPlayButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    playlistPlayButton: {
        width: 40,
        height: 40,
        backgroundColor: '#4c43df',
        borderRadius: 20,

        marginBottom: 10,
        marginRight: 10,

        justifyContent: 'center',
        alignItems: 'center'
    },

    main: {
        width: '100%',
        padding: 10
    },

    musicItem: {
        width: '100%',
        height: 37.5,

        marginVertical: 5
    },

    musicItemImage: {
        width: 37.5,
        height: 37.5
    },

    musicItemNameContainer: {
        width: 350,
        height: '120%',

        marginLeft: 45,
        transform: [
            {
                translateY: -40
            }
        ]
    },

    musicItemText: {
        color: '#d9dadc'
    }
})

export default styles