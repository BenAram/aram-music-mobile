import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { AppLoading } from 'expo'
import AsyncStorage from '@react-native-community/async-storage'
import { useDispatch } from 'react-redux'

import AudioPlayer from '../pages/AudioPlayer'
import BottomTab from './BottomTab'
import Landing from '../pages/Landing'
import ListMusics from '../pages/ListMusics'
import Music from '../pages/Music'
import Playlist from '../pages/Playlist'
import UpdateMusic from '../pages/UpdateMusic'
import UpdatePlaylist from '../pages/UpdatePlaylist'
import Upload from '../pages/Upload'
import User from '../pages/User'

function Routes(): JSX.Element {
    const dispatch = useDispatch()

    const { Navigator, Screen } = createStackNavigator()

    const [didMount, setDidMount] = useState<boolean>(false)
    const [initialRouteName, setInitialRouteName] = useState<string>('')

    useEffect(() => {
        async function run() {
            try {
                const rememberme = await AsyncStorage.getItem('rememberme')
                const email = await AsyncStorage.getItem('email')
                const token = await AsyncStorage.getItem('token')
                if (rememberme && email && token) {
                    dispatch({ type: 'active-did-mount' })
                    setInitialRouteName('app')
                } else {
                    setInitialRouteName('landing')
                }
            } catch(err) {
                setInitialRouteName('landing')
            }
            setDidMount(true)
        }

        run()
    }, [])

    if (!didMount) {
        return <AppLoading />
    }

    return <NavigationContainer>
        <Navigator
            headerMode="none"
            initialRouteName={initialRouteName}
        >
            <Screen name="landing" component={Landing} />
            <Screen name="app" component={BottomTab} />
            <Screen name="audio-player" component={AudioPlayer} />
            <Screen name="list-musics" component={ListMusics} />
            <Screen name="music" component={Music} />
            <Screen name="update-music" component={UpdateMusic} />
            <Screen name="update-playlist" component={UpdatePlaylist} />
            <Screen name="upload" component={Upload} />
            <Screen name="playlist" component={Playlist} />
            <Screen name="user" component={User} />
        </Navigator>
    </NavigationContainer>
}

export default Routes