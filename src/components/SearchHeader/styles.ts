import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    searchContainer: {
        width: '100%',
        height: '12%',

        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',

        borderBottomWidth: 1,
        borderBottomColor: '#d9dadc'
    },

    goBackButton: {
        transform: [
            {
                translateX: -30
            }
        ]
    },

    input: {
        fontFamily: 'Nunito400',
        marginRight: 10,
        backgroundColor: '#d9dadc',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5
    }
})

export default styles