import React, { useState, useEffect, useRef } from 'react'
import {
    View,
    Image,
    Text
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { Audio } from 'expo-av'
import { RectButton } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'

import styles from './styles'

import url from '../../services/url'

interface AudioControllerProps {
    tab?: boolean
}

function AudioController(props: AudioControllerProps): JSX.Element | null {

    const swipeableRef = useRef<Swipeable>()

    const navigation = useNavigation()

    const dispatch = useDispatch()
    const audio: Audio.Sound = useSelector((state: any) => state.music.sound)
    const actualMusic: Music = useSelector((state: any) => state.music.actualMusic)
    const playlist: StoreStatePlaylist = useSelector((state: any) => state.playlist)

    const [didMount, setDidMount] = useState<boolean>(false)
    const [status, setStatus] = useState<AVPlaybackStatus>()

    function goToMusic(): void {
        navigation.navigate('audio-player', { staysActive: true })
    }

    function toggleMusicStatus(): void {
        if (status?.isPlaying) {
            audio.pauseAsync().then(() => null).catch(() => null)
        } else {
            audio.playAsync().then(() => null).catch(() => null)
        }
    }

    function closeSwipeable(): void {
        audio.unloadAsync().then(() => null).catch(() => null)
        dispatch({ type: 'turn-off' })
        dispatch({ type: 'clean-playlist' })
        swipeableRef.current?.close()
    }

    function rightCloseButton(): JSX.Element {
        return <RectButton
            onPress={closeSwipeable}
            style={styles.rightCloseButton}
        >
            <Feather
                name="x"
                size={40}
                color="#d9dadc"
            />
        </RectButton>
    }
    useEffect(() => {
        audio.setOnPlaybackStatusUpdate(setStatus)
        setDidMount(true)
        return () => {
            setDidMount(false)
        }
    }, [])

    useEffect(() => {
        if (status?.didJustFinish && playlist.isPlaylist) {
            if (playlist.musics.length - 1 > playlist.index) {
                dispatch({ type: 'up-playlist' })
                audio.unloadAsync().then(() => null).catch(() => null)
                const source = {
                    uri: ''
                }
                const config = {
                    volume: 1,
                    shouldPlay: true
                }
                source.uri = `${url}/audio/${playlist.musics[playlist.index + 1].name_upload}`
                audio.setOnPlaybackStatusUpdate(setStatus)
                audio.loadAsync(source, config, false).then(() => null)
                .catch(() => null)
            }
        }
    }, [status?.didJustFinish])

    if (!didMount) {
        return null
    }

    return <Swipeable
        ref={swipeableRef as any}
        containerStyle={[styles.container, { top: props.tab ? '86%' : '92%' }]}
        childrenContainerStyle={{ flex: 1 }}
        leftThreshold={40}
        onSwipeableLeftOpen={closeSwipeable}
        renderLeftActions={() => <View style={{ flex: 1, backgroundColor: 'black' }}/>}
        renderRightActions={rightCloseButton}
    >
        <LinearGradient
            colors={['black', '#4c43df']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.linearGradient}
        >
            <RectButton
                style={styles.musicInfo}
                onPress={goToMusic}
            >
                {playlist.isPlaylist ? <Image
                    source={{ uri: `${url}/music-bg/${playlist.musics[playlist.index].music_background}` }}
                    style={styles.image}
                /> : <Image
                    source={{ uri: `${url}/music-bg/${actualMusic.music_background}` }}
                    style={styles.image}
                />}
                <View>
                    {playlist.isPlaylist ? <Text
                        style={styles.name}
                    >{playlist.musics[playlist.index].name}</Text> : <Text
                        style={styles.name}
                    >{actualMusic.name}</Text>}
                    {playlist.isPlaylist ? <Text
                        style={styles.playlistName}
                    >
                        Tocando: <Text
                            style={styles.playlistNameText}
                        >
                            {playlist.name}
                        </Text>
                    </Text> : null}
                </View>
            </RectButton>
            {status?.isPlaying ? <RectButton
                onPress={toggleMusicStatus}
            >
                <Feather
                    name="pause"
                    size={40}
                    color="#d9dadc"
                />
            </RectButton> : <RectButton
                onPress={toggleMusicStatus}
            >
                <Feather
                    name="play"
                    size={40}
                    color="#d9dadc"
                />
            </RectButton>}
        </LinearGradient>
    </Swipeable>
}

export default AudioController