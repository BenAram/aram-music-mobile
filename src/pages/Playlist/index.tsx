import React, { useState, useEffect } from 'react'
import {
    ActivityIndicator,
    View,
    Image,
    Text,
    Share,
    ScrollView,
    TouchableOpacity
} from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage'
import { RectButton } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import { addEventListener, removeEventListener, EventType } from 'expo-linking'
import { useSelector, useDispatch } from 'react-redux'

import styles from './styles'

import AudioController from '../../components/AudioController'

import api from '../../services/api'
import url from '../../services/url'

const initialState: Playlist = {
    musics: [],
    name: '',
    public: false,
    id: 0,
    editable: false,
    owner: '',
    owner_id: 0
}

function Playlist(): JSX.Element {

    const route = useRoute() as any
    const navigation = useNavigation()

    const [didMount, setDidMount] = useState<boolean>(false)
    const [playlist, setPlaylist] = useState<Playlist>(initialState)

    const dispatch = useDispatch()
    const isLoaded = useSelector((state: any) => state.music.isLoaded)

    function handleGoBack() {
        navigation.goBack()
    }

    function handleSharePlaylist() {
        Share.share({ message: `http://music.benaram.com/app/playlist/${route.params.id}` })
    }

    function handlePlayPlaylist() {
        dispatch({ type: 'active-playlist', musics: playlist.musics, name: playlist.name })
        navigation.navigate('audio-player', { staysActive: false })
    }

    function handleSeeMusic(id: number): Function {
        return function() {
            navigation.navigate('music', { id })
        }
    }

    useEffect(() => {
        const { id } = route.params
        async function run() {
            try {
                const { data } = await api.get(`/playlists/${id}`, {
                    headers: {
                        email: await AsyncStorage.getItem('email'),
                        token: await AsyncStorage.getItem('token')
                    }
                })
                if (data.error) {
                    alert(data.message)
                } else {
                    setPlaylist(data)
                }
            } catch(err) {
                alert('Um erro ocorreu')
            }
            setDidMount(true)
        }
        run()
        async function checkUrl(event: EventType) {
            try {
                const url = event.url
                if (url.includes('http://music.benaram.com/app/playlist/') || url.includes('https://music.benaram.com/app/playlist/')) {
                    setDidMount(false)
                    const id = url.replace('http://music.benaram.com/app/playlist/', '').replace('https://music.benaram.com/app/playlist/', '')
                    const { data } = await api.get(`/playlists/${id}`, {
                        headers: {
                            email: await AsyncStorage.getItem('email'),
                            token: await AsyncStorage.getItem('token')
                        }
                    })
                    if (data.error) {
                        alert(data.message)
                    } else {
                        setPlaylist(data)
                    }
                }
            } catch(err) {
                alert('Um erro ocorreu')
            }
            setDidMount(true)
        }
        addEventListener('url', checkUrl)
        return () => {
            removeEventListener('url', checkUrl)
        }
    }, [route.params])

    if (!didMount) {
        return <View
            style={styles.container}
        >
            <ActivityIndicator
                size="large"
                color="#4c43df"
            />
        </View>
    }

    return <View
        style={styles.container}
    >
        <View
            style={styles.header}
        >
            <RectButton
                onPress={handleGoBack}
            >
                <Feather
                    name="arrow-left"
                    color="#d9dadc"
                    size={26}
                />
            </RectButton>
        </View>
        <View
            style={styles.playlistInfoView}
        >
            <View
                style={styles.playlistInfoContainer}
            >
                {playlist.musics[0] ? <Image
                    style={styles.playlistInfoImage}
                    source={{ uri: `${url}/music-bg/${playlist.musics[0].music_background}` }}
                /> : <View
                    style={styles.playlistInfoImage}
                />}
                <Text
                    style={styles.playlistInfoName}
                >{playlist.name}</Text>
                <Text
                    style={styles.playlistInfoText}
                >{playlist.musics.length} Música{playlist.musics.length > 1 ? 's' : ''}</Text>
                <Text
                    style={styles.playlistInfoText}
                >
                    Feita por: {playlist.owner}
                </Text>
            </View>
            <View
                style={styles.playlistPlayButtonContainer}
            >
                {playlist.public ? <RectButton
                    style={styles.playlistPlayButton}
                    onPress={handleSharePlaylist}
                >
                    <Feather
                        name="share"
                        size={26}
                        color="#d9dadc"
                    />
                </RectButton> : null}
                {playlist.musics.length > 0 ? <RectButton
                    style={styles.playlistPlayButton}
                    onPress={handlePlayPlaylist}
                >
                    <Feather
                        name="play"
                        size={26}
                        color="#d9dadc"
                    />
                </RectButton> : null}
            </View>
        </View>
        <ScrollView
            style={[
                styles.main,
                { height: isLoaded ? '62%' : '70%', marginBottom: isLoaded ? '15.5%' : 0 }
            ]}
        >
            {playlist.musics.map((music, index) => <TouchableOpacity
                style={styles.musicItem}
                key={index}
                onPress={handleSeeMusic(music.id) as any}
            >
                <Image
                    style={styles.musicItemImage}
                    source={{ uri: `${url}/music-bg/${music.music_background}` }}
                />
                <View
                    style={styles.musicItemNameContainer}
                >
                    <Text
                        style={styles.musicItemText}
                    >{music.name}</Text>
                    <Text
                        style={styles.musicItemText}
                    >{music.access} acessos</Text>
                </View>
            </TouchableOpacity>)}
        </ScrollView>
        {isLoaded ? <AudioController/> : null}
    </View>
}

export default Playlist