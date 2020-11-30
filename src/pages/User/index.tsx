import React, { useState, useEffect } from 'react'
import {
    ActivityIndicator,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Share
} from 'react-native'
import { useRoute } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage'
import { RectButton } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { addEventListener, removeEventListener, EventType } from 'expo-linking'
import { useSelector } from 'react-redux'

import AudioController from '../../components/AudioController'

import styles from './styles'

import api from '../../services/api'
import url from '../../services/url'

import logo from '../../images/logo.png'

interface PublicUser {
    name: string
    avatar: string
    playlists: Array<{
        name: string
        public: boolean
        id: number
        musics: Array<{
            music_background: string
            name: string
            id: number
        }>
    }>
    id: number
    friends: Array<{
        name: string
        avatar: string
        id: number
    }>
    musics: Array<{
        id: number
        name: string
        music_background: string
    }>
    online: boolean
    type?: string
    addable: boolean
    createdAt: string
}

const initialState: PublicUser = {
    addable: false,
    avatar: '',
    friends: [],
    id: 0,
    name: '',
    online: false,
    playlists: [],
    musics: [],
    createdAt: ''
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

function User(): JSX.Element {

    const route = useRoute() as any
    const navigation = useNavigation()

    const isLoaded: boolean = useSelector((state: any) => state.music.isLoaded)

    const [id, setId] = useState<number>(0)
    const [user, setUser] = useState<PublicUser>(initialState)

    const [didMount, setDidMount] = useState<boolean>(false)

    function handleGoBack() {
        navigation.goBack()
    }

    function handleShareUser() {
        Share.share({ message: `http://music.benaram.com/app/user/${user.id}` })
    }

    async function handleSendFriendRequest() {
        try {
            const { data } = await api.post('/friends/send', {
                id: user.id
            }, {
                headers: {
                    email: await AsyncStorage.getItem('email'),
                    token: await AsyncStorage.getItem('token')
                }
            })
            if (data.error) {
                alert(data.message)
            } else {
                setUser({...user, addable: false})
            }
        } catch(err) {
            alert('Um erro ocorreu')
        }
    }

    function handleSeeMusic(id: number): Function {
        return function() {
            navigation.navigate('music', { id })
        }
    }

    function handleSeePlaylist(id: number): Function {
        return function() {
            navigation.navigate('playlist', { id })
        }
    }

    function handleSeeFriend(id: number): Function {
        return function() {
            setId(id)
        }
    }

    useEffect(() => {
        async function run() {
            setDidMount(false)
            try {
                const { data } = await api.get(`/user/${id}`, {
                    headers: {
                        email: await AsyncStorage.getItem('email'),
                        token: await AsyncStorage.getItem('token')
                    }
                })
                if (data.error) {
                    alert(data.message)
                } else {
                    setUser(data)
                }
            } catch(err) {
                alert('Um erro ocorreu')
            }
            setDidMount(true)
        }
        if (id) {
            run()
        }
    }, [id])

    useEffect(() => {
        setId(route.params.id)
        function checkUrl(evt: EventType) {
            const { url } = evt
            if (url.includes('http://music.benaram.com/app/user/') || url.includes('https://music.benaram.com/app/user/')) {
                const id = url.replace('http://music.benaram.com/app/user/', '').replace('https://music.benaram.com/app/user/', '')
                setId((id as any) * 1)
            }
        }
        addEventListener('url', checkUrl)
        return () => {
            removeEventListener('url', checkUrl)
        }
    }, [route.params])

    if (!didMount) {
        <View style={[
            styles.container,
            {
                justifyContent: 'center',
                alignItems: 'center'
            }
        ]}>
            <ActivityIndicator
                size="large"
                color="#4c43df"
            />
        </View>
    }

    return <View style={styles.container}>
        <View style={styles.header}>
            <RectButton onPress={handleGoBack}>
                <Feather
                    name="arrow-left"
                    size={30}
                    color="#d9dadc"
                />
            </RectButton>
        </View>
        <View style={styles.userInfoContainer}>
            <View style={styles.userInfoImageContainer}>
                <Image
                    style={styles.userInfoImage}
                    source={user.avatar ? { uri: `${url}/avatar/${user.avatar}` } : logo}
                />
                <View style={styles.userInfoNameContainer}>
                    <Text style={styles.userInfoName}>{user.name}</Text>
                    {user.online && user?.type === 'android' ? <Feather
                        name="smartphone"
                        size={20}
                        color="#28a745"
                    /> : <View
                        style={[
                            styles.userInfoStatus,
                            {
                                backgroundColor: user.online ? '#28a745' : 'rgba(255, 255, 255, 0.2)'
                            }
                        ]}
                    />}
                </View>
            </View>
            <View style={styles.userInfoActionsContainer}>
                <RectButton onPress={handleShareUser} style={styles.userInfoShareButton}>
                    <Feather
                        name="share"
                        size={26}
                        color="#d9dadc"
                    />
                </RectButton>
                {user.addable ? <RectButton onPress={handleSendFriendRequest}>
                    <Feather
                        name="user-plus"
                        size={26}
                        color="#d9dadc"
                    />
                </RectButton> : null}
            </View>
        </View>
        <ScrollView style={styles.main}>
            <View style={styles.mainInfoItem}>
                <Text style={styles.mainInfoTitle}>{user.musics.length} Música{user.musics.length > 1 ? 's' : ''}</Text>
                <ScrollView
                    horizontal
                    pagingEnabled
                    style={styles.mainInfoScroll}
                >
                    {user.musics.map(music => <TouchableOpacity
                        style={styles.mainInfoScrollItem}
                        key={music.id}
                        onPress={handleSeeMusic(music.id) as any}
                        >
                        <Image
                            style={styles.mainInfoScrollImage}
                            source={{ uri: `${url}/music-bg/${music.music_background}` }}
                        />
                        <Text style={styles.mainInfoScrollName}>{music.name}</Text>
                    </TouchableOpacity>)}
                </ScrollView>
            </View>
            <View style={styles.mainInfoItem}>
                <Text style={styles.mainInfoTitle}>{user.playlists.length} Playlist{user.playlists.length > 1 ? 's' : ''}</Text>
                <ScrollView
                    horizontal
                    pagingEnabled
                    style={styles.mainInfoScroll}
                >
                    {user.playlists.map(playlist => <TouchableOpacity
                        style={styles.mainInfoScrollItem}
                        key={playlist.id}
                        onPress={handleSeePlaylist(playlist.id) as any}
                    >
                        {playlist.musics[0] ? <Image
                            style={styles.mainInfoScrollImage}
                            source={{ uri: `${url}/music-bg/${playlist.musics[0].music_background}` }}
                        /> : <View
                            style={styles.mainInfoScrollImage}
                        />}
                        <Text style={styles.mainInfoScrollName}>{playlist.name}</Text>
                    </TouchableOpacity>)}
                </ScrollView>
            </View>
            <View style={styles.mainInfoItem}>
                <Text style={styles.mainInfoTitle}>{user.friends.length} Amigo{user.friends.length > 1 ? 's' : ''}</Text>
                <ScrollView
                    horizontal
                    pagingEnabled
                    style={styles.mainInfoScroll}
                >
                    {user.friends.map(friend => <TouchableOpacity
                        key={friend.id}
                        style={styles.mainInfoScrollItem}
                        onPress={handleSeeFriend(friend.id) as any}
                    >
                        <Image
                            style={styles.mainInfoScrollAvatar}
                            source={friend.avatar ? { uri: `${url}/avatar/${friend.avatar}` } : logo}
                        />
                        <Text style={styles.mainInfoScrollName}>{friend.name}</Text>
                    </TouchableOpacity>)}
                </ScrollView>
            </View>
        </ScrollView>
        <View style={styles.footer}>
            <Text style={styles.footerText}>Conta criada em: {treatDate(user.createdAt)}</Text>
        </View>
        {isLoaded ? <AudioController /> : null}
    </View>
}

export default User