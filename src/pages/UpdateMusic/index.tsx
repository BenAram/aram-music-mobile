import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    Image,
    ScrollView,
    Alert,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage'
import { useSelector, useDispatch } from 'react-redux'

import AudioController from '../../components/AudioController'
import Divider from '../../components/Divider'

import styles from './styles'

import api from '../../services/api'
import url from '../../services/url'

function UpdateMusic(): JSX.Element {

    const navigation = useNavigation()

    const isLoaded: boolean = useSelector((state: any) => state.music.isLoaded)
    const musicToEdit: Music = useSelector((state: any) => state.musicToEdit)
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [initialName, setInitialName] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [initialDescription, setInitialDescription] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [initialKeywords, setInitialKeywords] = useState<string>('')
    const [keywords, setKeywords] = useState<string>('')
    const [sucess, setSucess] = useState<boolean>(false)

    function goBack(): void {
        reset()
        dispatch({ type: 'clean-music-to-edit' })
        navigation.goBack()
    }

    function canSave(): boolean {
        if (initialName !== name) {
            return true
        }
        if (initialDescription !== description) {
            return true
        }
        if (initialKeywords !== keywords) {
            return true
        }
        return false
    }

    async function saveChanges(): Promise<void> {
        setIsLoading(true)
        try {
            const newConfig: any = {}
            newConfig.name_upload = musicToEdit.name_upload
            if (name !== initialName) {
                newConfig.name = name
            }
            if (description !== initialDescription) {
                newConfig.description = description
            }
            if (keywords !== initialKeywords) {
                newConfig.keywords = keywords
            }
            const { data } = await api.patch('/audio', newConfig, {
                headers: {
                    email: await AsyncStorage.getItem('email'),
                    token: await AsyncStorage.getItem('token')
                }
            })
            if (data.error) {
                Alert.alert(data.message)
            } else {
                setInitialName(name)
                setInitialDescription(description)
                setInitialKeywords(keywords)
                setSucess(true)
                dispatch({ type: 'update-playlist' })
            }
        } catch(err) {
            Alert.alert('Não foi possível salvar as alterações.')
        }
        setIsLoading(false)
    }

    function reset(): void {
        setSucess(false)
    }

    useEffect(() => {
        const { name, description, keywords: oldKeywords } = musicToEdit
        const keywords = oldKeywords.join(', ')
        setInitialName(name),
        setName(name)
        setInitialDescription(description)
        setDescription(description)
        setInitialKeywords(keywords)
        setKeywords(keywords)
    }, [])

    return <View
        style={{ flex: 1 }}
    >
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.containerStyle}
        >
            <View
                style={styles.returnButtonContainer}
            >
                <RectButton
                    style={styles.returnButton}
                    onPress={goBack}
                >
                    <Feather
                        name="arrow-left"
                        size={30}
                        color="#d9dadc"
                    />
                </RectButton>
            </View>
            <Image
                source={{ uri: `${url}/music-bg/${musicToEdit.music_background}` }}
                style={styles.image}
            />
            <View style={styles.inputContainer}>
                <Feather
                    name="type"
                    size={26}
                    color="#d9dadc"
                />
                <TextInput
                    editable={!isLoading}
                    onChange={reset}
                    style={styles.input}
                    value={name}
                    onChangeText={txt => setName(txt)}
                    maxLength={30}
                />
            </View>
            <View style={styles.inputContainer}>
                <Feather
                    name="align-left"
                    size={26}
                    color="#d9dadc"
                />
                <TextInput
                    editable={!isLoading}
                    onChange={reset}
                    style={styles.input}
                    value={description}
                    onChangeText={txt => setDescription(txt)}
                    maxLength={100}
                />
            </View>
            <View style={styles.inputContainer}>
                <Feather
                    name="key"
                    size={26}
                    color="#d9dadc"
                />
                <TextInput
                    editable={!isLoading}
                    onChange={reset}
                    style={styles.input}
                    value={keywords}
                    multiline
                    onChangeText={txt => setKeywords(txt)}
                    maxLength={400}
                />
            </View>
            {isLoading ? <ActivityIndicator
                size="large"
                color="#4c43df"
            /> : null}
            <Divider />
            {sucess ? <View
                style={styles.sucessContainer}
            >
                <Text
                    style={styles.sucessText}
                >Alterações feitas com sucesso.</Text>
            </View> : null}
            {canSave() ? <TouchableOpacity
                disabled={isLoading}
                style={styles.saveButton}
                onPress={saveChanges}
            >
                <Text
                    style={styles.saveButtonText}
                >Salvar alterações</Text>
            </TouchableOpacity> : null}
        </ScrollView>
        {isLoaded ? <AudioController /> : null}
    </View>
}

export default UpdateMusic