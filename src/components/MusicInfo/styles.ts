import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 400,
        backgroundColor: '#3e3e3e'
    },

    imageBackground: {
        width: '100%',
        height: 200,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },

    nameText: {
        fontFamily: 'Nunito700',
        fontSize: 17,

        color: '#d9dadc',

        marginLeft: 15,
        marginBottom: 15
    },

    playButton: {
        backgroundColor: '#4c43df',
        width: 46,

        padding: 10,

        marginRight: 15,
        marginBottom: 15,

        borderRadius: 40,

        justifyContent: 'center',
        alignItems: 'center'
    },

    title: {
        fontSize: 18,
        fontFamily: 'Nunito700',

        color: '#4c43df',

        marginLeft: 10
    },

    text: {
        fontSize: 15,
        fontFamily: 'Nunito400',

        color: '#d9dadc',

        marginLeft: 10,
        marginBottom: 15
    },

    divider: {
        marginLeft: 40
    },

    keywordList: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },

    keywordItem: {
        marginLeft: 10,
        marginBottom: 10,

        fontSize: 15,
        fontFamily: 'Nunito400',

        color: '#d9dadc',
        backgroundColor: '#4c43df',

        padding: 8,
        borderRadius: 5
    },

    ownerInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',

        width: '100%',
        height: 40
    },

    ownerAccount: {
        flexDirection: 'row'
    },

    ownerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20
    },

    ownerName: {
        fontFamily: 'Nunito600',
        fontSize: 16,
        color: '#d9dadc',

        marginLeft: 10
    },

    seeMusicButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#4c43df',
        
        width: 230,
        paddingVertical: 10,
        borderRadius: 10,
    },

    seeMusicButtonText: {
        fontFamily: 'Nunito400',
        fontSize: 16,
        color: '#d9dadc'
    },
})

export default styles