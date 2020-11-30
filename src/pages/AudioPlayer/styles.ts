import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3e3e3e'
    },

    header: {
        width: '100%',
        height: '7%',
        paddingHorizontal: 15,
        paddingVertical: 10,

        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    musicInfo: {
        width: '100%',
        height: '85%',

        justifyContent: 'space-around',
        alignItems: 'center'
    },

    musicBackgroundContainer: {
        width: '80%',
        height: '50%'
    },

    playlistName: {
        fontFamily: 'Nunito400',
        fontSize: 16,
        color: '#d9dadc',

        textAlign: 'center',
        marginBottom: 10
    },

    playlistNameText: {
        fontFamily: 'Nunito700'
    },

    musicBackground: {
        flex: 1,
        borderRadius: 30
    },

    musicName: {
        fontFamily: 'Nunito600',
        fontSize: 16,
        color: '#e6e6e6',
        textAlign: 'center',
        marginTop: 10
    },

    sliderContainer: {
        width: '100%',
        transform: [
            {
                translateY: 30
            }
        ]
    },

    sliderContainerWithText: {
        flexDirection: 'row'
    },

    time: {
        width: '85%',
        height: 30,
        marginLeft: '7.5%',

        flexDirection: 'row'
    },

    timeText: {
        color: '#4c43df',
        fontFamily: 'Nunito600'
    },

    slider: {
        width: '85%'
    },

    ownerInfo: {
        flexDirection: 'row'
    },

    authorImage: {
        width: 40,
        height: 40,
        borderRadius: 50,

        marginRight: 10
    },

    authorContainer: {
        alignItems: 'center'
    },

    sentText: {
        fontFamily: 'Nunito600',
        fontSize: 16,
        color: '#4c43df'
    },

    authorText: {
        fontFamily: 'Nunito600',
        fontSize: 16,
        color: '#e6e6e6'
    },

    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',

        width: '100%',
        height: '8%',
        backgroundColor: 'black'
    }
})

export default styles