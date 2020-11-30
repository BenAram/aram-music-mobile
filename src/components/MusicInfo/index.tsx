import React, { useState, useEffect, useRef } from 'react'
import {
    View,
    Text,
    ImageBackground,
    Image,
    ScrollView
} from 'react-native'
import { FontAwesome5, Feather, FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage'
import { useDispatch } from 'react-redux'

import Divider from '../../components/Divider'

import api from '../../services/api'
import url from '../../services/url'

import logo from '../../images/logo.png'

import styles from './styles'

interface MusicInfoProps {
    music: Music
}

function treatTime(time: number): string {
    return time > 9 ? `${time}` : `0${time}`
}

function treatDate(time: string): string {
    const date = new Date(time)

    const hours = treatTime(date.getHours())
    const minutes = treatTime(date.getMinutes())

    const day = treatTime(date.getDate())
    const month = treatTime(date.getMonth())
    const year = treatTime(date.getFullYear())

    return `${hours}:${minutes} - ${day}/${month}/${year}`
}

function MusicInfo(props: MusicInfoProps): JSX.Element {
    const navigation = useNavigation()

    const dispatch = useDispatch()

    async function goListenMusic(): Promise<void> {
        try {
            const email = await AsyncStorage.getItem('email')
            const token = await AsyncStorage.getItem('token')
            await api.get(`/audio/access/${props.music.name_upload}`, {
                headers: {
                    email,
                    token
                }
            })
            dispatch({ type: 'turn-off'})
            dispatch({ type: 'change-music', music: props.music })
            dispatch({ type: 'clean-playlist' })
            navigation.navigate('audio-player', { staysActive: false })
        } catch(err) {
            alert('Um erro ocorreu')
        }
    }

    function handleSeeMusic() {
        navigation.navigate('music', { id: props.music.id })
    }

    const image = props.music.user_owner.avatar ? { uri: `${url}/avatar/${props.music.user_owner.avatar}` } : logo

    return <View style={styles.container}>
        <ImageBackground
            style={styles.imageBackground}
            source={props.music.music_background ? { uri: `${url}/music-bg/${props.music.music_background}` } : logo}
        >
            <Text style={styles.nameText}>{props.music.name}</Text>
            <RectButton
                style={styles.playButton}
                onPress={goListenMusic}
            >
                <FontAwesome
                    name="play"
                    size={26}
                    color="#d9dadc"
                />
            </RectButton>
        </ImageBackground>
        <Text
            style={styles.title}
        >Descrição:</Text>
        <Text
            style={styles.text}
        >{props.music.description}</Text>
        <Divider style={styles.divider} />
        <RectButton
            onPress={handleSeeMusic}
            style={styles.seeMusicButton}
        >
            <Feather
                name="eye"
                size={26}
                color="#d9dadc"
            />
            <Text
                style={styles.seeMusicButtonText}
            >Ver mais sobre</Text>
        </RectButton>
    </View>
}

export default MusicInfo