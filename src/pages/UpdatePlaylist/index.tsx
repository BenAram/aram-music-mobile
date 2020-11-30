import React, { useState, useEffect } from 'react'
import {
    View,
    ScrollView,
    TextInput,
    Text,
    Alert,
    TouchableOpacity,
    Dimensions
} from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Checkbox } from 'react-native-paper'
import AsyncStorage from '@react-native-community/async-storage'
import { useSelector, useDispatch } from 'react-redux'

import AudioController from '../../components/AudioController'
import MusicItem from '../../components/MusicItem'

import styles from './styles'

import api from '../../services/api'

interface MoveMusic {
    index: number
    newIndex: number
}

function UpdatePlaylist(): JSX.Element {

    const dispatch = useDispatch()
    const playlistToEdit: Playlist = useSelector((state: any) => state.playlistToEdit)
    const isLoaded: boolean = useSelector((state: any) => state.music.isLoaded)

    const navigation = useNavigation()

    const [name, setName] = useState<string>('')
    const [musicsToRemove, setMusicsToRemove] = useState<Array<number>>([])
    const [musicsToMove, setMusicsToMove] = useState<Array<MoveMusic>>([])
    const [publicPlaylist, setPublicPlaylist] = useState<boolean>(false)
    const [playlist, setPlaylist] = useState<Playlist>()
    const [musics, setMusics] = useState<Array<Music>>([])

    function goBack(): void {
        dispatch({ type: 'clean-playlist-to-edit' })
        navigation.goBack()
    }

    function togglePublicPlaylist(): void {
        setPublicPlaylist(!publicPlaylist)
    }

    async function handleDeletePlaylist() {
        try {
            const { data } = await api.delete('/playlists', {
                headers: {
                    email: await AsyncStorage.getItem('email'),
                    token: await AsyncStorage.getItem('token'),
                    name
                }
            })
            if (data.error) {
                Alert.alert(data.message)
            } else {
                Alert.alert('Playlist deletada.')
                dispatch({ type: 'clean-playlist-to-edit' })
                navigation.goBack()
            }
        } catch(err) {
            Alert.alert('Um erro ocorreu ao deletar a playlist.')
        }
    }

    function removeMusic(index: number): void {
        if (musicsToRemove.includes(index)) {
            const index2: number = musicsToRemove.indexOf(index)
            const newMusicsToRemove = [...musicsToRemove]
            newMusicsToRemove.splice(index2, 1)
            setMusicsToRemove(newMusicsToRemove)
        } else {
            const newMusicsToRemove = [...musicsToRemove]
            newMusicsToRemove.push(index)
            setMusicsToRemove([0])
        }
    }

    function moveMusic(type: string, index: number): void {
        const music = musics[index]
        let index2: number = -1
        for (let i = 0; i < musicsToMove.length; i++) {
            if (musicsToMove[i].newIndex === index) {
                index2 = i
            }
        }
        const musicsArray = [...musics]
        const musicsArray2 = [...musicsToMove]

        musicsArray.splice(index, 1)
        switch (type) {
            case 'up':
                if (index2 === -1) {
                    musicsArray.splice(index - 1, 0, music)
                    
                    musicsArray2.push({
                        index,
                        newIndex: index - 1
                    })
                } else {
                    musicsArray.splice(index - 1, 0, music)

                    musicsArray2[index2].newIndex = index - 1
                    if (musicsArray2[index2].index === index - 1) {
                        musicsArray2.splice(index2, 1)
                    }
                }
                break
            case 'down':
                if (index2 === -1) {
                    musicsArray.splice(index + 1, 0, music)

                    musicsArray2.push({
                        index,
                        newIndex: index - 1
                    })
                } else {
                    musicsArray.splice(index + 1, 0, music)

                    musicsArray2[index2].newIndex = index + 1
                    if (musicsArray2[index2].index === index + 1) {
                        musicsArray2.splice(index2, 1)
                    }
                }
        }
        setMusics(musicsArray)
        setMusicsToMove(musicsArray2)
    }

    function canSave(): boolean {
        if (name !== playlist?.name) {
            return false
        }
        if (publicPlaylist !== playlist?.public) {
            return false
        }
        if (musicsToRemove[0] !== undefined) {
            return false
        }
        if (musicsToMove[0]) {
            return false
        }
        return true
    }

    async function saveChanges() {
        try {
            const email = await AsyncStorage.getItem('email')
            const token = await AsyncStorage.getItem('token')
            if (publicPlaylist !== playlist?.public) {
                const { data } = await api.patch('/playlists/change-public', {
                    public_playlist: publicPlaylist,
                    name: playlist?.name
                }, {
                    headers: {
                        email,
                        token
                    }
                })
                if (data.error) {
                    Alert.alert(data.message)
                    return
                }
            }
            if (musicsToMove[0] !== undefined) {
                for (let movement of musicsToMove) {
                    const { data } = await api.patch('/playlists/move', {
                        index: movement.index,
                        newIndex: movement.newIndex,
                        name: playlist?.name
                    }, {
                        headers: {
                            email,
                            token
                        }
                    })
                    if (data.error) {
                        Alert.alert(data.message)
                    }
                }
            }
            if (musicsToRemove[0] !== undefined) {
                for (let index of musicsToRemove) {
                    const { data } = await api.patch('/playlists/delete', {
                        index,
                        name: playlist?.name
                    }, {
                        headers: {
                            email,
                            token
                        }
                    })
                    if (data.error) {
                        Alert.alert(data.message)
                    }
                }
            }
            if (name !== playlist?.name) {
                const { data } = await api.patch('/playlists/rename', {
                    name: playlist?.name,
                    newName: name
                }, {
                    headers: {
                        email,
                        token
                    }
                })
                if (data.error) {
                    Alert.alert(data.message)
                    return
                }
            }
            Alert.alert('Alterações feitas com sucesso.')
            dispatch({ type: 'clean-playlist-to-edit' })
            dispatch({ type: 'update-playlist' })
            navigation.goBack()
        } catch(err) {
            Alert.alert('Um erro ocorreu.')
        }
    }

    useEffect(() => {
        setPlaylist(playlistToEdit)
        setName(playlistToEdit.name)
        setPublicPlaylist(playlistToEdit.public)
        setMusics(playlistToEdit.musics)
        return () => {
            setPlaylist(undefined)
        }
    }, [])

    return <View
        style={styles.container}
    >
        <View
            style={styles.header}
        >
            <RectButton
                onPress={goBack}
            >
                <Feather
                    name="arrow-left"
                    color="#d9dadc"
                    size={30}
                />
            </RectButton>
            <Text
                style={styles.headerText}
            >Editando: <Text
                style={styles.headerTextName}
            >{playlist?.name}</Text></Text>
            <RectButton
                onPress={handleDeletePlaylist}
            >
                <Feather
                    name="trash-2"
                    color="#c82333"
                    size={30}
                />
            </RectButton>
        </View>
        <View
            style={[styles.musics, {
                height: isLoaded ? '72%' : '80%'
            }]}
        >
            <ScrollView
                style={{ flex: 1 }}
            >
                {musics.map((music, index, array) => <MusicItem
                    key={index}
                    index={index}
                    music={music}
                    onPress={removeMusic}
                    onMovePress={moveMusic}
                    length={array.length}
                />)}
            </ScrollView>
        </View>
        <View
            style={[styles.interface, {
                transform: [
                    {
                        translateY: (Dimensions.get('window').height / 100) * (isLoaded ? 82 : 90)
                    }
                ]
            }]}
        >
            <View
                style={styles.inputContainer}
            >
                <Text
                    style={styles.text}
                >Nome da playlist</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    value={name}
                    onChangeText={setName}
                />
                <View
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                    <Checkbox
                        status={publicPlaylist ? 'checked' : 'unchecked'}
                        uncheckedColor="#d9dadc"
                        color="#4c43df"
                        onPress={togglePublicPlaylist}
                    />
                    <RectButton
                        onPress={togglePublicPlaylist}
                    >
                        <Text
                            style={[styles.text, {
                                color: publicPlaylist ? '#4c43df' : '#d9dadc'
                            }]}
                        >Pública</Text>
                    </RectButton>
                </View>
            </View>
            <TouchableOpacity
                disabled={canSave()}
                style={styles.saveButton}
                onPress={saveChanges}
            >
                <Text
                    style={styles.text}
                >Salvar</Text>
            </TouchableOpacity>
        </View>
        {isLoaded ? <AudioController /> : null}
    </View>
}

export default UpdatePlaylist