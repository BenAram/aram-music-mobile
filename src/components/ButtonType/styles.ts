import { StyleSheet, Dimensions } from 'react-native'
const size = Dimensions.get('screen').width - 30

const styles = StyleSheet.create({
    buttonType: {
        paddingVertical: 10,

        width: size / 3,
        height: size / 3,

        marginHorizontal: 15,
        marginBottom: 10,

        borderRadius: 10
    },

    linearGradientContainerButton: {
        flex: 1,

        width: size / 3,
        height: size / 3,

        borderRadius: 7,

        justifyContent: 'space-between'
    },

    buttonText: {
        color: '#d9dadc',

        fontFamily: 'Nunito600',
        fontSize: 16,

        textAlign: 'left',

        marginLeft: 10
    },

    imageBackgroundButton: {
        width: 40,
        height: 40,
        transform: [
            {
                translateX: size / 5.7
            },
            {
                translateY: -12
            },
            {
                rotate: '35deg'
            }
        ]
    }
})

export default styles