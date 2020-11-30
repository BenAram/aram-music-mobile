import React, { useState, memo } from 'react'
import {
    View,
    Image,
    Text
} from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Checkbox } from 'react-native-paper'
import { Feather } from '@expo/vector-icons'

import url from '../../services/url'

import styles from './styles'

interface MusicItemProps {
    music: Music
    onPress: Function
    index: number
    length: number
    onMovePress: Function
}

function MusicItem(props: MusicItemProps): JSX.Element {
    const [checked, setChecked] = useState<boolean>(true)

    function toggleChecked(): void {
        setChecked(!checked)
        props.onPress(props.index)
    }

    function goUp(): void {
        props.onMovePress('up', props.index)
    }

    function goDown(): void {
        props.onMovePress('down', props.index)
    }

    return <View
        style={styles.container}
    >
        <View
            style={{ flexDirection: 'row', alignItems: 'center' }}
        >
            <Checkbox
                status={checked ? 'checked' : 'unchecked'}
                uncheckedColor="#d9dadc"
                color="#4c43df"
                onPress={toggleChecked}
            />
            <RectButton
                onPress={toggleChecked}
            >
                <Image
                    style={styles.musicBackground}
                    source={{ uri: `${url}/music-bg/${props.music.music_background}` }}
                />
            </RectButton>
            <RectButton
                onPress={toggleChecked}
            >
                <Text
                    style={styles.text}
                >
                    {props.music.name}
                </Text>
            </RectButton>
        </View>
        <View
            style={{ flexDirection: 'row', alignItems: 'center' }}
        >
            {props.index > 0 ? <RectButton
                onPress={goUp}
            >
                <Feather
                    name="arrow-up"
                    size={26}
                    color="#d9dadc"
                />
            </RectButton> : null}
            {props.length - 1 <= props.index ? null : <RectButton
                onPress={goDown}
            >
                <Feather
                    name="arrow-down"
                    size={26}
                    color="#d9dadc"
                />
            </RectButton>}
        </View>
    </View>
}

export default memo(MusicItem)