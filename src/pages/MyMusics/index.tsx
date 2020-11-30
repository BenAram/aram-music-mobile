import React, { useState, useEffect, useRef }from 'react'
import {
    View,
    Text,
    Alert,
    Image,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { RectButton } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import { Modalize } from 'react-native-modalize'
import { useNavigation } from '@react-navigation/native'
import { Checkbox } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux'

import MusicInfo from '../../components/MusicInfo'

import styles from './styles'

import api from '../../services/api'
import url from '../../services/url'

function MyMusics(): JSX.Element {

    const dispatch = useDispatch()
    const playlist: StoreStatePlaylist = useSelector((state: any) => state.playlist)
    const musicToEdit = useSelector((state: any) => state.musicToEdit)

    const navigation = useNavigation()

    const modalizeRef = useRef<Modalize>()

    const [publicPlaylist, setPublicPlaylist] = useState<boolean>(false)
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [playlistName, setPlaylistName] = useState<string>('')
    const [actualMusic, setActualMusic] = useState<Music>()
    const [myMusics, setMyMusics] = useState<Array<Music>>()
    const [playlists, setPlaylists] = useState<Array<Playlist>>()

    function handleSetMusic(music: Music): Function {
        return function() {
            setActualMusic(music)
            modalizeRef.current?.open()
        }
    }

    function handleChangeMusic(music: Music): Function {
        return function() {
            dispatch({ type: 'change-music-to-edit', music })
            navigation.navigate('update-music')
        }
    }

    function handleDeleteMusic(music: Music): Function {
        return async function() {
            try {
                const { data } = await api.delete('/audio', {
                    headers: {
                        name_upload: music.name_upload,
                        email: await AsyncStorage.getItem('email'),
                        token: await AsyncStorage.getItem('token')
                    }
                })
                if (data.error) {
                    Alert.alert(data.message)
                } else {
                    Alert.alert('Música deletada com sucesso.')
                    dispatch({ type: 'clean-music-to-edit' })
                }
            } catch(err) {
                Alert.alert('Ocorreu um erro ao deletar a música.')
            }
        }
    }

    function cancelModal(): void {
        setPlaylistName('')
        setModalVisible(false)
        dispatch({ type: 'clean-music-to-edit' })
    }

    function handleAddMusic() {
        navigation.navigate('upload')
    }

    function handleAddPlaylist(): void {
        setModalVisible(true)
    }

    async function handleCreatePlaylist(): Promise<void> {
        if (!playlistName) {
            Alert.alert('Coloque um nome')
            return
        }
        try {
            const { data } = await api.post('/playlists', {
                name: playlistName,
                public_playlist: publicPlaylist
            }, {
                headers: {
                    email: await AsyncStorage.getItem('email'),
                    token: await AsyncStorage.getItem('token')
                }
            })
            if (data.error) {
                Alert.alert(data.message)
                return
            }
            Alert.alert('Playlist criada com sucesso.')
            dispatch({ type: 'update-playlist' })
            cancelModal()
        } catch(err) {
            Alert.alert('Um erro ocorreu')
        }
    }

    function handleSeePlaylist(id: number): Function {
        return function() {
            navigation.navigate('playlist', { id })
        }
    }

    function handlePlayPlaylist(playlist: Playlist): Function {
        return function() {
            dispatch({ type: 'active-playlist', musics: playlist.musics, name: playlist.name })
            navigation.navigate('audio-player', { staysActive: false })
        }
    }

    function handleEditPlaylist(playlist: Playlist): Function {
        return function() {
            dispatch({ type: 'active-playlist-to-edit', playlist })
            navigation.navigate('update-playlist')
        }
    }

    function handleDeletePlaylist(playlist: Playlist): Function {
        return async function() {
            const { data } = await api.delete('/playlists', {
                headers: {
                    email: await AsyncStorage.getItem('email'),
                    token: await AsyncStorage.getItem('token'),
                    name: playlist.name
                }
            })
            if (data.error) {
                Alert.alert(data.message)
            } else {
                Alert.alert(`Playlist deletada: ${playlist.name}`)
                dispatch({ type: 'update-playlist' })
            }
        }
    }

    useEffect(() => {
        async function run() {
            try {
                const { data: MyMusics } = await api.get('/music/my', {
                    headers: {
                        email: await AsyncStorage.getItem('email'),
                        token: await AsyncStorage.getItem('token')
                    }
                })
                setMyMusics(MyMusics)
                const { data: MyPlaylists } = await api.get('/playlists', {
                    headers: {
                        email: await AsyncStorage.getItem('email'),
                        token: await AsyncStorage.getItem('token')
                    }
                })
                setPlaylists(MyPlaylists)
            } catch(err) {
                Alert.alert('Um erro ocorreu ao carregar suas músicas e playlists.')
            }
        }
        run()
    }, [musicToEdit, playlist.updates])

    return <View
        style={styles.mainContainer}
    >
        <ScrollView
            style={styles.container}
        >
            <View
                style={styles.section}
            >
                <View
                    style={styles.sectionTitleContainer}
                >
                    <Text
                        style={styles.sectionTitle}
                    >Minhas músicas</Text>
                    <TouchableOpacity
                        onPress={handleAddMusic}
                    >
                        <Feather
                            name="plus-circle"
                            color="#d9dadc"
                            size={30}
                        />
                    </TouchableOpacity>
                </View>
                {myMusics?.map(item => <View
                    key={item.name_upload}
                    style={styles.sectionItem}
                >
                    <RectButton
                        style={styles.sectionButtonMusic}
                        onPress={handleSetMusic(item) as any}
                    >
                        <Image
                            source={{ uri: `${url}/music-bg/${item.music_background}` }}
                            style={styles.sectionImage}
                        />
                        <View>
                            <Text
                                style={styles.sectionName}
                            >{item.name}</Text>
                            <Text
                                style={styles.sectionAccess}
                            >Acessos: {item.access}</Text>
                        </View>
                    </RectButton>
                    <View
                        style={styles.sectionButtonsContainer}
                    >
                        <RectButton
                            onPress={handleChangeMusic(item) as any}
                        >
                            <Feather
                                name="edit"
                                color="#d9dadc"
                                size={26}
                            />
                        </RectButton>
                        <RectButton
                            onPress={handleDeleteMusic(item) as any}
                        >
                            <Feather
                                name="trash-2"
                                color="#d9dadc"
                                size={26}
                            />
                        </RectButton>
                    </View>
                </View>)}
            </View>
            <View>
                <View
                    style={styles.sectionTitleContainer}
                >
                    <Text
                        style={styles.sectionTitle}
                    >Minhas playlists</Text>
                    <TouchableOpacity
                        onPress={handleAddPlaylist}
                    >
                        <Feather
                            name="plus-circle"
                            color="#d9dadc"
                            size={30}
                        />
                    </TouchableOpacity>
                </View>
                {playlists ? playlists.map(playlist => <RectButton
                    onPress={handleSeePlaylist(playlist.id) as any}
                    key={playlist.name}
                    style={styles.sectionItem}
                >
                    <View
                        style={styles.sectionButtonMusic}
                    >
                        {playlist.musics[0] ? <Image
                            style={styles.sectionImage}
                            source={{ uri: `${url}/music-bg/${playlist.musics[0].music_background}` }}
                        /> : <View
                            style={styles.sectionImage}
                        />}
                        <View>
                            <Text
                                style={styles.sectionPlaylistName}
                            >{playlist.name}</Text>
                            <Text
                                style={styles.sectionPlaylistMusics}
                            >{playlist.musics.length} Música{playlist.musics.length > 1 ? 's' : ''}</Text>
                        </View>
                        {playlist.musics.length > 0 ? <RectButton
                            onPress={handlePlayPlaylist(playlist) as any}
                        >
                            <Feather
                                name="play-circle"
                                size={30}
                                color="#d9dadc"
                            />
                        </RectButton> : null}
                    </View>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                        <RectButton
                            onPress={handleEditPlaylist(playlist) as any}
                        >
                            <Feather
                                name="edit"
                                color="#d9dadc"
                                size={26}
                            />
                        </RectButton>
                        <RectButton
                            onPress={handleDeletePlaylist(playlist) as any}
                        >
                            <Feather
                                name="trash-2"
                                color="#d9dadc"
                                size={26}
                            />
                        </RectButton>
                    </View>
                </RectButton>) : null}
            </View>
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
        <Modal
            visible={modalVisible}
            transparent
        >
            <View
                style={styles.containerModal}
            >
                <View
                    style={styles.modal}
                >
                    <View>
                        <Text>Coloque o nome da playlist</Text>
                        <TextInput
                            style={styles.modalTextInput}
                            placeholder="Nome da playlist"
                            value={playlistName}
                            onChangeText={txt => setPlaylistName(txt)}
                        />
                    </View>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                        <Checkbox
                            status={publicPlaylist ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setPublicPlaylist(!publicPlaylist)
                            }}
                            uncheckedColor="#000"
                            color="#4c43df"
                        />
                        <TouchableOpacity
                            onPress={() => {
                                setPublicPlaylist(!publicPlaylist)
                            }}
                        >
                            <Text>Playlist pública</Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={styles.modalButtonContainer}
                    >
                        <TouchableOpacity
                            onPress={cancelModal}
                            style={styles.modalButtonCancel}
                        >
                            <Text
                                style={styles.modalButtonText}
                            >Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleCreatePlaylist}
                            style={styles.modalConfirmButton}
                        >
                            <Text
                                style={styles.modalButtonText}
                            >Criar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    </View>
}

export default MyMusics