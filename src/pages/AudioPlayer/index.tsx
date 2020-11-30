import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native'
import { AppLoading } from 'expo'
import { Feather, FontAwesome } from '@expo/vector-icons'
import { Audio, AVPlaybackStatusToSet } from 'expo-av'
import Slider from '@react-native-community/slider'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'

import styles from './styles'

import url from '../../services/url'
import logo from '../../images/logo.png'

function AudioPlayer(): JSX.Element {
    
    const audio: Audio.Sound = useSelector((state: any) => state.music.sound) as Audio.Sound
    const actualMusic: Music = useSelector((state: any) => state.music.actualMusic)
    const playlist: StoreStatePlaylist = useSelector((state: any) => state.playlist)

    const dispatch = useDispatch()

    const navigation = useNavigation()
    const route = useRoute() as any

    const [loaded, setLoaded] = useState<boolean>(false)
    const [didMount, setDidMount] = useState<boolean>(false)
    const [status, setStatus] = useState<AVPlaybackStatus>()

    function replaySound(): void {
        if (playlist.isPlaylist) {
            if (playlist.index !== 0) {
                dispatch({ type: 'down-playlist' })
                initialize(true)
            }
        } else {
            audio?.replayAsync().then(() => null).catch(() => null)
        }
    }

    function returnSeconds(): void {
        audio?.setPositionAsync((status?.positionMillis || 1) - 10000).then(() => null).catch(() => null)
    }

    function alternateIsPlaying(): void {
        if (!status?.isPlaying) {
            audio.playAsync().then(() => null).catch(() => null)
        } else {
            audio.pauseAsync().then(() => null).catch(() => null)
        }
    }

    function advanceSeconds(): void {
        audio?.setPositionAsync((status?.positionMillis || 1) + 10000).then(() => null).catch(() => null)
    }

    function skipSound(): void {
        audio?.setPositionAsync(status?.durationMillis || 1).then(() => null).catch(() => null)
    }

    function changeSoundMillie(millie: number): void {
        audio?.setPositionAsync(millie).then(() => null).catch(() => null)
    }

    function changeRepeatMusic(): void {
        audio?.setIsLoopingAsync(!status?.isLooping).then(() => null).catch(() => null)
    }

    function getMusicTime(): string {
        if (status?.durationMillis) {
            const timeInSeconds: number = status.durationMillis / 1000
            const minutes: number = Math.floor(timeInSeconds / 60)
            const minutesTreated: number = minutes * 1
            const seconds: number = timeInSeconds - (minutesTreated * 60)
            const secondsTreated: string = seconds < 10 ? `0${seconds.toFixed(0)}` : `${seconds.toFixed(0)}`
            return `${minutesTreated}:${secondsTreated}`
        } else {
            return '0:00'
        }
    }

    function getActualMusicTime(): string {
        if (status?.positionMillis) {
            const timeInSeconds: number = status.positionMillis / 1000
            const minutes: number = Math.floor(timeInSeconds / 60)
            const minutesTreated: number = minutes * 1
            const seconds: number = timeInSeconds - (minutesTreated * 60)
            const secondsTreated: string = Math.abs(seconds) < 10 ? `0${Math.abs(seconds.toFixed(0) as any)}` : `${Math.abs(seconds.toFixed(0) as any)}`
            return `${minutesTreated}:${secondsTreated}`
        } else {
            return ''
        }
    }

    function getActualMusicTimePosition(): number {
        if (status?.positionMillis) {
            interface Music {
                position: number
                duration: number
            }

            const width = Dimensions.get('screen').width * 0.77
            const width1 = width / 100
            const music: Music = {
                position: status.positionMillis,
                duration: status.durationMillis
            } as Music
            const percentMusic1: number = music.duration / 100
            const percentMusic: number = music.position / percentMusic1
            return width1 * percentMusic
        } else {
            return 0
        }
    }

    function goBack(): void {
        dispatch({ type: 'turn-on' })
        navigation.goBack()
    }

    function goBackAndStop(): void {
        audio.unloadAsync().then(() => null).catch(() => null)
        navigation.goBack()
        dispatch({ type: 'clean-playlist' })
    }

    function initialize(back?: boolean) {
        audio.unloadAsync().then(() => null).catch(() => null)
        const source = {
            uri: ''
        }
        const config: AVPlaybackStatusToSet = {
            volume: 1,
            shouldPlay: true
        }
        if (playlist.isPlaylist) {
            if (back) {
                source.uri = `${url}/audio/${playlist.musics[Math.max(playlist.index - 1, 0)].name_upload}`
            } else {
                source.uri = `${url}/audio/${playlist.musics[loaded ? playlist.index + 1 : playlist.index].name_upload}`
            }
        } else {
            source.uri = `${url}/audio/${actualMusic.name_upload}`
        }
        audio.setOnPlaybackStatusUpdate(setStatus)
        audio.loadAsync(source, config, false).then(() => null)
            .catch(() => null)
    }

    function getOwnerAvatar() {
        if (playlist.isPlaylist) {
            return playlist.musics[playlist.index].user_owner.avatar ? { uri: `${url}/avatar/${playlist.musics[0].user_owner.avatar}` } : logo
        } else {
            return actualMusic.user_owner.avatar ? { uri: `${url}/avatar/${actualMusic.user_owner.avatar}` } : logo
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setDidMount(false)
        })
        navigation.addListener('focus', () => {
            setDidMount(true)
        })
        if (status?.didJustFinish && playlist.isPlaylist) {
            if (playlist.musics.length - 1 > playlist.index) {
                dispatch({ type: 'up-playlist' })
                initialize()
            }
        }
        if (!loaded) {
            dispatch({ type: 'turn-off' })
            if (route.params.staysActive) {
                audio.setOnPlaybackStatusUpdate(setStatus)
            } else {
                initialize()
            }
        }
        setLoaded(true)
        return unsubscribe
    }, [navigation, status?.didJustFinish])

    if (!didMount) {
        return <AppLoading />
    }

    return <View
        style={styles.container}
    >
        <View style={styles.header}>
            <TouchableOpacity
                onPress={goBack}
            >
                <Feather
                    name="arrow-left"
                    color="#4c43df"
                    size={50}
                />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={goBackAndStop}
            >
                <Feather
                    name="x"
                    color="#4c43df"
                    size={50}
                />
            </TouchableOpacity>
        </View>
        <View style={styles.musicInfo}>
            <View
                style={styles.musicBackgroundContainer}
            >
                {playlist.isPlaylist ? <Text
                    style={styles.playlistName}
                >
                    Tocando:
                    <Text
                        style={styles.playlistNameText}
                    >{'  ' + playlist.name}</Text>
                </Text> : null}
                <Image
                    source={{ uri: `${url}/music-bg/${playlist.isPlaylist ? playlist.musics[playlist.index].music_background : actualMusic.music_background}` }}
                    style={styles.musicBackground}
                />
                <Text
                    style={styles.musicName}
                >{playlist.isPlaylist ? playlist.musics[playlist.index].name : actualMusic.name}</Text>
            </View>
            <View
                style={styles.sliderContainer}
            >
                <View
                    style={styles.time}
                >
                    <Text
                        style={[styles.timeText, {
                            transform: [
                                {
                                    translateX: getActualMusicTimePosition()
                                }
                            ]
                        }]}
                    >{getActualMusicTime()}</Text>
                </View>
                <View
                    style={styles.sliderContainerWithText}
                >
                    <Text
                        style={styles.timeText}
                    >0:00</Text>
                    <Slider
                        style={styles.slider}
                        step={1000}
                        minimumValue={0}
                        maximumValue={status?.durationMillis || 1}
                        minimumTrackTintColor="#4c43df"
                        maximumTrackTintColor="#e6e6e6"
                        thumbTintColor="#4c43df"
                        value={status?.positionMillis ? status?.positionMillis : 1}
                        onValueChange={changeSoundMillie}
                    />
                    <Text
                        style={styles.timeText}
                    >{getMusicTime()}</Text>
                </View>
            </View>
           <View
            style={styles.ownerInfo}
           >
            <Image
                    source={getOwnerAvatar()}
                    style={styles.authorImage}
                />
                <View
                    style={styles.authorContainer}
                >
                    <Text
                        style={styles.sentText}
                    >
                        Enviado por:
                    </Text>
                    <Text
                    style={styles.authorText}
                >{playlist.isPlaylist ? (playlist.musics[playlist.index].user_owner.name || 'Desconhecido') : (actualMusic.user_owner.name || 'Desconhecido')}</Text>
                </View>
           </View>
        </View>
        <View
            style={styles.buttonsContainer}
        >
            <TouchableOpacity
                onPress={replaySound}
            >
                <Feather
                    name="rewind"
                    size={30}
                    color="#d9dadc"
                />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={returnSeconds}
            >
                <Feather
                    name="skip-back"
                    size={30}
                    color="#d9dadc"
                />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={alternateIsPlaying}
            >
                <Feather
                    name={status?.isPlaying ? 'pause' : 'play'}
                    size={30}
                    color="#d9dadc"
                />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={advanceSeconds}
            >
                <Feather
                    name="skip-forward"
                    size={30}
                    color="#d9dadc"
                />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={skipSound}
            >
                <Feather
                    name="fast-forward"
                    size={30}
                    color="#d9dadc"
                />
            </TouchableOpacity>
            {playlist.isPlaylist ? null : <TouchableOpacity
                onPress={changeRepeatMusic}
            >
                <FontAwesome
                    name="repeat"
                    size={30}
                    color={status?.isLooping ? '#4c43df' : '#d9dadc'}
                />
            </TouchableOpacity>}
        </View>
    </View>
}

export default AudioPlayer