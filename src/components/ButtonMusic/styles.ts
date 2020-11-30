import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    musicListItem: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,

        marginBottom: 15
    },

    musicListItemImage: {
        width: 40,
        height: 40,
        borderRadius: 10,

        marginRight: 10
    },

    musicListItemText: {
        fontFamily: 'Nunito600',
        fontSize: 16,
        color: '#d9dadc',
        textAlign: 'center',

        flexGrow: 1
    },

    musicListItemAccess: {
        fontFamily: 'Nunito600',
        fontSize: 13,
        color: '#d9dadc',
        textAlign: 'left',
    }
})

export default styles