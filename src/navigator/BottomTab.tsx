import React, { useState, useEffect } from 'react'
import {
    View
} from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { getInitialURL, addEventListener } from 'expo-linking'

import AudioController from '../components/AudioController'

import ChatContainer from '../pages/ChatContainer'
import Home from '../pages/Home'
import MyMusics from '../pages/MyMusics'
import MusicSearch from '../pages/MusicSearch'
import Me from '../pages/Me'

function BottomTab(): JSX.Element | null {
    const { Navigator, Screen } = createBottomTabNavigator()

    const navigation = useNavigation()

    const isLoaded: boolean = useSelector((state: any) => state.music.isLoaded)

    const [didFocus, setDidFocus] = useState<boolean>(false)
    const [url, setUrl] = useState<string>('')

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setDidFocus(false)
        })
        navigation.addListener('focus', () => {
            setDidFocus(true)
        })
        return unsubscribe
    }, [navigation])

    useEffect(() => {
        if (url?.includes('http://music.benaram.com/app/music/') || url?.includes('https://music.benaram.com/app/music/')) {
            const id = url.replace('http://music.benaram.com/app/music/', '').replace('https://music.benaram.com/app/music/', '')
            navigation.navigate('music', { id })
        }
        if (url?.includes('http://music.benaram.com/app/playlist/') || url?.includes('https://music.benaram.com/app/playlist/')) {
            const id = url.replace('http://music.benaram.com/app/playlist/', '').replace('https://music.benaram.com/app/playlist/', '')
            navigation.navigate('playlist', { id })
        }
        if (url?.includes('http://music.benaram.com/app/user/') || url?.includes('https://music.benaram.com/app/user/')) {
            const id = url.replace('http://music.benaram.com/app/user/', '').replace('https://music.benaram.com/app/user/', '')
            navigation.navigate('user', { id })
        }
        if (url?.includes('http://music.benaram.com/app/upload') || url?.includes('https://music.benaram.com/app/upload')) {
            navigation.navigate('upload')
        }
    }, [url])

    useEffect(() => {
        async function run() {
            const initialUrl = await getInitialURL()
            setUrl(`${initialUrl}`)
        }
        run()
        addEventListener('url', newUrl => {
            setUrl(newUrl.url)
        })
    }, [])

    return <View style={{ flex: 1 }}>
        <Navigator
        initialRouteName="home"
        tabBarOptions={{
            activeTintColor: '#4c43df',
            inactiveTintColor: '#3e3e3e',
            activeBackgroundColor: '#e6e6e6',
            inactiveBackgroundColor: '#e6e6e6',

            showLabel: false,

            keyboardHidesTabBar: true,
            style: {
                height: '6%'
            }
        }}
        screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
                let iconName: string = ''
                let finalSize: number = size - 3
                switch (route.name) {
                    case 'home':
                        iconName = 'home'
                        break
                    case 'music-search':
                        iconName = 'search'
                        break
                    case 'upload':
                        iconName = 'upload'
                        break
                    case 'my-musics':
                        iconName = 'music'
                        break
                    case 'chat-container':
                        iconName = 'message-circle'
                        break
                    case 'me':
                        iconName = 'user'
                        break
                    default:
                        iconName = 'user'
                }
                if (color === '#4c43df') {
                    finalSize += 7
                }
                return <Feather
                    name={iconName}
                    size={finalSize}
                    color={color}
                />
            }
        })}
    >
        <Screen
            name="home"
            component={Home}
        />
        <Screen
            name="music-search"
            component={MusicSearch}
        />
        <Screen
            name="chat-container"
            component={ChatContainer}
        />
        <Screen
            name="my-musics"
            component={MyMusics}
        />
        <Screen
            name="me"
            component={Me}
        />
    </Navigator>
    {didFocus && isLoaded ? <AudioController tab /> : null}
    </View>
}

export default BottomTab