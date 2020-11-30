import React, { useEffect, useState, useRef } from 'react'
import {
    ScrollView,
    View,
    ImageBackground,
    Text,
    Image,
    Share,
    TouchableOpacity
} from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import { Feather, FontAwesome5 } from '@expo/vector-icons'
import AsyncStorage from '@react-native-community/async-storage'
import { Modalize } from 'react-native-modalize'
import { addEventListener, removeEventListener, EventType } from 'expo-linking'
import { useSelector, useDispatch } from 'react-redux'

import AudioController from '../../components/AudioController'
import Divider from '../../components/Divider'

import styles from './styles'

import api from '../../services/api'
import url from '../../services/url'

const initialState: Music = {
    access: 0,
    createdAt: '',
    description: '',
    id: 0,
    keywords: [],
    music_background: '',
    name: '',
    name_upload: '',
    type: '',
    user_owner: {
        name: '',
        avatar: '',
        id: 0
    }
}

function Music() {

    const route = useRoute() as any
    const navigation = useNavigation()

    const dispatch = useDispatch()
    const isLoaded: boolean = useSelector((state: any) => state.music.isLoaded)

    const [music, setMusic] = useState<Music>(initialState)
    const [playlists, setPlaylists] = useState<Array<Playlist>>([])

    const modalizeRef = useRef<Modalize>()

    function treatText(text: string): string {
        let finalText: string = ''
        for (let i = 0; i < text.length; i++) {
            if (i === 0) {
                finalText += (text[i].toUpperCase())
            } else {
                finalText += text[i]
            }
        }
        return finalText
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

    function handleGoBack(): void {
        navigation.goBack()
    }

    async function handleGoListenMusic(): Promise<void> {
        try {
            const email = await AsyncStorage.getItem('email')
            const token = await AsyncStorage.getItem('token')
            await api.get(`/audio/access/${music.name_upload}`, {
                headers: {
                    email,
                    token
                }
            })
            dispatch({ type: 'turn-off'})
            dispatch({ type: 'change-music', music: music })
            dispatch({ type: 'clean-playlist' })
            navigation.navigate('audio-player', { staysActive: false })
        } catch(err) {
            alert('Um erro ocorreu')
        }
    }

    function handleSeeOwner() {
        navigation.navigate('user', { id: music.user_owner.id })
    }

    function handleShare() {
        Share.share({ message: `http://music.benaram.com/app/music/${music.id}` })
    }

    function addToAPlaylist(): void {
        modalizeRef.current?.open()
    }

    function closeAddToAPlaylist(): void {
        modalizeRef.current?.close()
    }

    function addToPlaylist(playlistName: string): Function {
        return async function() {
            try {
                const { data } = await api.patch('/playlists/insert', {
                    name_upload: music.name_upload,
                    name: playlistName
                }, {
                    headers: {
                        email: await AsyncStorage.getItem('email'),
                        token: await AsyncStorage.getItem('token')
                    }
                })
                if (data.error) {
                    alert(data.message)
                } else {
                    closeAddToAPlaylist()
                    dispatch({ type: 'update-playlist' })
                    alert('Musica adicionada com sucesso.')
                }
            } catch(err) {
                alert('Não foi possível salvar a música na playlist.')
            }
        }
    }

    useEffect(() => {
        async function run() {
            try {
                const { data } = await api.get(`/music/${route.params.id}`)
                if (data.error) {
                    alert(data.message)
                } else {
                    setMusic(data)
                }
            } catch(err) {
                alert('Um erro ocorreu')
            }
            const { data: playlists } = await api.get('/playlists', {
                headers: {
                    email: await AsyncStorage.getItem('email'),
                    token: await AsyncStorage.getItem('token')
                }
            })
            setPlaylists(playlists)
        }
        async function checkUrl(event: EventType) {
            const url = event.url
            if (url.includes('http://music.benaram.com/app/music/') || url.includes('https://music.benaram.com/app/music/')) {
                const id = url.replace('http://music.benaram.com/app/music/', '').replace('https://music.benaram.com/app/music/', '')
                try {
                    const { data } = await api.get(`/music/${id}`)
                    if (data.error) {
                        alert(data.message)
                    } else {
                        setMusic(data)
                    }
                } catch(err) {
                    alert('Um erro ocorreu')
                }
            }
        }
        run()
        addEventListener('url', checkUrl)
        return () => {
            removeEventListener('url', checkUrl)
        }
    }, [route.params])

    return <View
        style={styles.container}
    >
        <View
            style={styles.header}
        >
            <RectButton onPress={handleGoBack}>
                <Feather
                    name="arrow-left"
                    color="#d9dadc"
                    size={40}
                />
            </RectButton>
        </View>
        <ScrollView
            contentContainerStyle={{
                justifyContent: 'flex-start',
                alignItems: 'flex-start'
            }}
            style={styles.main}
        >
            <ImageBackground
                style={styles.musicBackground}
                source={{ uri: `${url}/music-bg/${music.music_background}` }}
            >
                <Text
                    style={styles.typeText}
                >{treatText(music.type)}</Text>
                <RectButton
                    onPress={handleGoListenMusic}
                    style={styles.playButton}
                >
                    <Feather
                        name="play"
                        color="#d9dadc"
                        size={30}
                    />
                </RectButton>
            </ImageBackground>
            <Text
                style={styles.text}
            >{music.name}</Text>
            <Text
                style={styles.title}
            >Descrição:</Text>
            <Text
                style={styles.text}
            >{music.description}</Text>
            <Text
                style={styles.title}
            >Palavras-chaves:</Text>
            <Text
                style={styles.text}
            >{music.keywords.join(', ')}</Text>
            <Text
                style={styles.title}
            >
                Acessos:{' '}<Text
                    style={styles.text}
                >{music.access}</Text>
            </Text>
            <Text
                style={styles.title}
            >Data de envio:</Text>
            <Text
                style={styles.text}
            >{treatDate(music.createdAt)}</Text>
            <Divider style={{ alignSelf: 'center' }}/>
            <View
                style={styles.footer}
            >
                <TouchableOpacity
                    onPress={handleSeeOwner}
                    style={styles.userOwnerContainer}
                >
                    <Image
                        style={styles.avatar}
                        source={{ uri: `${url}/avatar/${music.user_owner.avatar}` }}
                    />
                    <Text
                        style={styles.text}
                    >{music.user_owner.name}</Text>
                </TouchableOpacity>
                <RectButton
                    onPress={handleShare}
                    style={styles.shareButton}
                >
                    <Feather
                        name="share"
                        size={20}
                        color="#d9dadc"
                    />
                </RectButton>
            </View>
            <RectButton
                onPress={addToAPlaylist}
                style={styles.addPlaylistButton}
            >
                <Text
                    style={styles.addPlaylistButtonText}
                >Adicionar á uma playlist</Text>
                <Feather
                    name="plus"
                    size={26}
                    color="#d9dadc"
                />
            </RectButton>
        </ScrollView>
        <Modalize
            ref={modalizeRef}
            snapPoint={600}
            modalHeight={600}
        >
            <View
                style={styles.addToAPlaylistContainer}
            >
                <View
                    style={styles.addToAPlaylistHeader}
                >
                    <Text
                        style={styles.addToAPlaylistHeaderText}
                    >Adicionar á música em uma playlist.</Text>
                    <RectButton
                        onPress={closeAddToAPlaylist}
                    >
                        <Feather
                            name="x"
                            color="#000"
                            size={30}
                        />
                    </RectButton>
                </View>
            </View>
            <ScrollView>
                {playlists ? playlists.map(playlist => <RectButton
                        key={playlist.name}
                        onPress={addToPlaylist(playlist.name) as any}
                        style={styles.addToAPlaylistButton}
                    >
                        <View
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                        >
                            <FontAwesome5
                                name={playlist.public ? 'globe-americas' : 'lock'}
                                size={26}
                                color="#000"
                            />
                            <Text
                                style={styles.addToAPlaylistButtonText}
                            >{playlist.name}</Text>
                        </View>
                        <Feather
                            name="plus"
                            color="#000"
                            size={26}
                        />
                    </RectButton>
                ) : null}
            </ScrollView>
        </Modalize>
        {isLoaded ? <AudioController /> : null}
    </View>
}

export default Music