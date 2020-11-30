import React, { useState, useEffect, useRef, memo } from 'react'
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator
} from 'react-native'
import { Modalize } from 'react-native-modalize'
import { useSelector } from 'react-redux'

import MusicInfo from '../../components/MusicInfo'
import SearchHeader from '../../components/SearchHeader'

import AudioController from '../../components/AudioController'
import ButtonMusic from '../../components/ButtonMusic'

import styles from './styles'

import api from '../../services/api'

interface Data {
    musicsName: Array<Music>
    musicsDescription: Array<Music>
    musicsKeywords: Array<Music>
}

function ListMusics(props: any): JSX.Element | null {
    const isLoaded: boolean = useSelector((state: any) => state.music.isLoaded)
    const search: any = useSelector((state: any) => state.actualSearch)

    const modalizeRef = useRef<Modalize>(null)

    const [didMount, setDidMount] = useState<boolean>(false)
    const [musicList, setMusicList] = useState<Array<Music> | null>()
    const [actualMusic, setActualMusic] = useState<Music>()
    const [noMusic, setNoMusic] = useState<boolean>(false)

    function setMusic(item: Music): Function {
        return function() {
            setActualMusic(item)
            modalizeRef.current?.open()
        }
    }

    function initialize(): void {
        const { type, value } = search
        if (type === 'type') {
            api.get(`/audio/type/${value || 'axe'}`).then(({ data }) => {
                if (data) {
                    if (data.error) {
                        setNoMusic(true)
                    } else {
                        setMusicList(data)
                    }
                } else {
                    setNoMusic(true)
                }
            }).catch(() => {
                setNoMusic(true)
            })
        } else if (type === 'search') {
            api.get(`/audio?q=${value}`).then(({ data }) => {
                if (data.error) {
                    setNoMusic(true)
                } else {
                    const { musicsName, musicsDescription, musicsKeywords } = data as Data
                    const finalArray: Array<Music> = []
                    let index: number = musicsName.length
                    if (index < musicsDescription.length) {
                        index = musicsDescription.length
                    }
                    if (index < musicsKeywords.length) {
                        index = musicsKeywords.length
                    }
                    for (let i = 0; i < index; i++) {
                        if (musicsName[i]) {
                            let exists: boolean = false
                            for (let j = 0; j < finalArray.length; j++) {
                                if (musicsName[i].name_upload === finalArray[j].name_upload) {
                                    exists = true
                                }
                            }
                            if (!exists) {
                                finalArray.push(musicsName[i])
                            }
                        }
                        if (musicsDescription[i]) {
                            let exists: boolean = false
                            for (let j = 0; j < finalArray.length; j++) {
                                if (musicsDescription[i].name_upload === finalArray[j].name_upload) {
                                    exists = true
                                }
                            }
                            if (!exists) {
                                finalArray.push(musicsDescription[i])
                            }
                        }
                        if (musicsKeywords[i]) {
                            let exists: boolean = false
                            for (let j = 0; j < finalArray.length; j++) {
                                if (musicsKeywords[i].name_upload === finalArray[j].name_upload) {
                                    exists = true
                                }
                            }
                            if (!exists) {
                                finalArray.push(musicsKeywords[i])
                            }
                        }
                    }
                    setNoMusic(false)
                    setMusicList(finalArray)
                }
            }).catch(() => {
                setNoMusic(true)
            })
        } else {
            setNoMusic(true)
        }
    }

    useEffect(() => {
        initialize()
        setDidMount(true)
        return () => {
            setDidMount(false)
            setMusicList(null)
        }
    }, [search.value])

    if (!didMount) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#4c43df" size="large" />
    </View>
    }

    return <View
        style={styles.container}
    >
        <SearchHeader goBackButton />
        <ScrollView>
            {musicList ? musicList.map(item => <ButtonMusic
                key={item.name_upload}
                onPress={setMusic(item)}
                musicBackground={item.music_background}
                name={item.name}
                access={item.access}
            />) : null}
            {noMusic ? <Text
                    style={[styles.musicListItemTextType, { color: '#d9dadc' }]}
                >Não há música.</Text> : null}
        </ScrollView>
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
        {isLoaded ? <AudioController /> : null}
    </View>
}

export default memo(ListMusics)