import React, { useState, useEffect, useRef } from 'react'
import {
    View,
    Text,
    Alert,
    Image,
    ScrollView
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import { Modalize } from 'react-native-modalize'
import { getInitialURL, addEventListener } from 'expo-linking'
import { useSelector } from 'react-redux'

import MusicInfo from '../../components/MusicInfo'

import styles from './styles'

import api from '../../services/api'
import link from '../../services/url'

function Home(): JSX.Element {

    const navigation = useNavigation()

    const musicToEdit = useSelector((state: any) => state.musicToEdit)

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [actualMusic, setActualMusic] = useState<Music>()
    const [musics, setMusics] = useState<Array<Music>>()

    const [url, setUrl] = useState<string>('')

    const modalizeRef = useRef<Modalize>()

    function setMusic(Music: Music): Function {
        return function(): void {
            modalizeRef.current?.open()
            setActualMusic(Music)
        }
    }

    useEffect(() => {
        async function run() {
            function sortMusic(music1: Music, music2: Music): number {
                if (music1.access > music2.access) {
                    return -1
                }
                if (music1.access < music2.access) {
                    return 1
                }
                if (music1.access === music2.access) {
                    return 0
                }
                return 0
            }
            try {

                const { data } = await api.get('/music/recents')
                if (!data.error) {
                    const divider = data.length / 5

                    let musics1: Array<Music> = data.slice(0, divider)
                    let musics2: Array<Music> = data.slice(divider, divider * 2)
                    let musics3: Array<Music> = data.slice(divider * 2, divider * 3)
                    let musics4: Array<Music> = data.slice(divider * 3, divider * 4)
                    let musics5: Array<Music> = data.slice(divider * 4, data.length)

                    musics1 = musics1.sort(sortMusic)
                    musics2 = musics2.sort(sortMusic)
                    musics3 = musics3.sort(sortMusic)
                    musics4 = musics4.sort(sortMusic)
                    musics5 = musics5.sort(sortMusic)

                    setMusics([...musics1, ...musics2, ...musics3, ...musics4, ...musics5])
                }
            } catch(err) {
                Alert.alert('Um erro ocorreu')
            }
            setIsLoading(false)
        }
        run()
    }, [musicToEdit])

    useEffect(() => {
        if (url?.includes('http://music.benaram.com/app/search') || url?.includes('https://music.benaram.com/app/search')) {
            navigation.navigate('music-search')
        }
        if (url?.includes('http://music.benaram.com/app/my-musics') || url?.includes('https://music.benaram.com/app/my-musics')) {
            navigation.navigate('my-musics')
        }
        if (url?.includes('http://music.benaram.com/app/user') || url?.includes('https://music.benaram.com/app/user')) {
            navigation.navigate('user')
        }
    }, [url])

    useEffect(() => {
        async function run() {
            const newUrl = getInitialURL()
            setUrl(`${newUrl}`)
        }
        run()
        addEventListener('url', evt => {
            setUrl(evt.url)
        })
    }, [])

    return <ScrollView
        contentContainerStyle={styles.container}
    >
        <View style={styles.section}>
            <Text
                style={styles.sectionTitle}
            >{isLoading ? 'Carregando ' : ''}Músicas recentes{isLoading ? '...' : ''}</Text>
            <ScrollView
                horizontal
                style={styles.sectionList}
            >
                {musics ? musics.map(item => <RectButton
                    style={styles.sectionButton}
                    key={item.name_upload}
                    onPress={setMusic(item) as any}
                >
                    <Image
                        source={{ uri: `${link}/music-bg/${item.music_background}` }}
                        style={styles.sectionImage}
                    />
                    <Text
                        style={styles.sectionName}
                    >{item.name}</Text>
                    <Text
                        style={styles.sectionAccess}
                    >Acessos: {item.access}</Text>
                </RectButton>) : null}
            </ScrollView>
        </View>
        <Modalize
            ref={modalizeRef}
            snapPoint={200}
            modalHeight={400}
            modalStyle={{
                backgroundColor: '#3e3e3e'
            }}
        >
            <MusicInfo
                music={actualMusic as Music}
            />
        </Modalize>
    </ScrollView>
}

export default Home