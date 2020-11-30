import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3e3e3e',
        padding: 20
    },

    section: {
        width: '100%',
        height: 250
    },

    sectionButton: {
        marginHorizontal: 10
    },

    sectionTitle: {
        fontFamily: 'Nunito700',
        fontSize: 18,
        color: '#d9dadc',

        marginBottom: 15
    },

    sectionList: {
        width: '100%',
        height: '85%'
    },

    sectionImage: {
        width: 170,
        height: 170,
        borderRadius: 20
    },

    sectionName: {
        fontFamily: 'Nunito600',
        fontSize: 14,
        color: '#d9dadc'
    },

    sectionAccess: {
        fontFamily: 'Nunito400',
        fontSize: 12,
        color: '#d9dadc'
    }
})

export default styles