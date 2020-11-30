import React, { useState, useEffect } from 'react'
import {
    View,
    ScrollView,
    ActivityIndicator
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'

import ButtonType from '../../components/ButtonType'
import SearchHeader from '../../components/SearchHeader'

import styles from './styles'

import api from '../../services/api'

interface MusicType {
    label: string
    value: string
    img?: string
    color?: string
}

function User(): JSX.Element | null {
    const navigation = useNavigation()

    const dispatch = useDispatch()

    const [didMount, setDidMount] = useState<boolean>(false)
    const [musicTypes, setMusicTypes] = useState<Array<MusicType>>()

    function navigateTypes(type: string): Function {
        return async function(){
            dispatch({ type: 'change-search', actualSearch: {
                type: 'type',
                value: type
            } })
            navigation.navigate('list-musics')
        }
    }

    useEffect(() => {
        api.get('/music-types').then(({ data }) => {
            setMusicTypes(data)
            setDidMount(true)
        }).catch()
        return () => {
            setMusicTypes(undefined)
            setDidMount(false)
        }
    }, [])

    if (!didMount) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color="#4c43df" size="large" />
        </View>
    }

    return <View style={styles.container}>
        <SearchHeader />
        <ScrollView contentContainerStyle={styles.musicsList}>
            {musicTypes ? musicTypes.map(item => <ButtonType
                key={item.value}
                onPress={navigateTypes(item.value)}
                color={item.color}
                img={item.img}
                label={item.label}
            />) : null}
        </ScrollView>
    </View>
}

export default User