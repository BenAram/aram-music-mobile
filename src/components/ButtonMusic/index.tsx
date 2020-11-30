import React, { memo } from 'react'
import {
    View,
    Image,
    Text
} from 'react-native'
import { RectButton } from 'react-native-gesture-handler'

interface ButtonMusicProps {
    onPress: Function
    musicBackground: string
    name: string
    access: number
}

import styles from './styles'

import logo from '../../images/logo.png'

import url from '../../services/url'

function ButtonMusic(props: ButtonMusicProps): JSX.Element {
    return <RectButton
        style={styles.musicListItem}
        onPress={props.onPress as any}
    >
        <Image
            source={props.musicBackground ? { uri: `${url}/music-bg/${props.musicBackground}` } : logo}
            style={styles.musicListItemImage}
        />
        <View>
            <Text
                style={styles.musicListItemText}
            >{props.name}</Text>
            <Text
                style={styles.musicListItemAccess}
            >Acessos: {props.access}</Text>
        </View>
    </RectButton>
}

export default memo(ButtonMusic)