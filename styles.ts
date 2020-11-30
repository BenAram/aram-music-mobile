import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },

    newsContainer: {
        backgroundColor: '#d9dadc',
        width: '75%',
        height: '50%',

        borderRadius: 15
    },

    newsHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        padding: 10,
        
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    newsItem: {
        marginVertical: 10
    },

    newsTitle: {
        fontFamily: 'Nunito700',
        fontSize: 16
    },

    listItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    listMarker: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#000',
        
        marginRight: 5
    },

    downloadButtonText: {
        textAlign: 'center',
        padding: 10,
        
        color: '#4c43df',
        textDecorationLine: 'underline'
    }
})

export default styles