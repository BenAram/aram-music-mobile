import React, { memo } from 'react'
import {
    Text,
    Image
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { RectButton } from 'react-native-gesture-handler'

import styles from './styles'

import url from '../../services/url'

interface ButtonTypeProps {
    onPress: Function
    color?: string
    label: string
    img?: string
}

function ButtonType(props: ButtonTypeProps): JSX.Element {
    return <RectButton
        style={styles.buttonType}
        onPress={props.onPress as any}
    >
        <LinearGradient
            colors={[props.color || '#4c43df', 'black']}
            start={{ x: 1, y: 1 }}
            end={{ x: -0.75, y: -0.75 }}
            style={styles.linearGradientContainerButton}
        >
            <Text
                style={styles.buttonText}
            >{props.label}</Text>
            {props.img ? <Image
                source={{ uri: `${url}/types-img/${props.img}` }}
                style={styles.imageBackgroundButton}
            /> : null }
        </LinearGradient>
    </RectButton>
}

export default memo(ButtonType)