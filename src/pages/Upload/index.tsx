import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator
} from 'react-native'
import { RadioButton } from 'react-native-paper'
import AsyncStorage from '@react-native-community/async-storage'
import { getDocumentAsync } from 'expo-document-picker'
import { Feather } from '@expo/vector-icons'
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'

import Divider from '../../components/Divider'

import api from '../../services/api'


import styles from './styles'

interface DocumentResult {
    name?: string
    size?: number
    type: string
    uri?: string
}

interface PickerSelectItem {
    label: string
    value: string
}

interface MusicBackground {
    cancelled: boolean
    height: number
    type: string
    uri: string
    width: number
}

function User(): JSX.Element {

    const navigation = useNavigation()

    const dispatch = useDispatch()

    const [radioItems, setRadioItems] = useState<Array<PickerSelectItem>>()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [keywords, setKeywords] = useState<string>('')
    const [musicType, setMusicType] = useState<string>('')
    const [musicBackground, setMusicBackground] = useState<MusicBackground>()
    const [file, setFile] = useState<DocumentResult>()

    const [error, setError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')

    const [sucess, setSucess] = useState<boolean>(false)

    function goBack(): void {
        navigation.goBack()
    }

    function resetErrorAndSucess(): void {
        setError(false)
        setErrorMessage('')
        setSucess(false)
    }

    function handlePickerSelect(value: string): void {
        setMusicType(value)
    }

    async function getMusicBackground() {
        try {
            const result = await launchImageLibraryAsync({
                mediaTypes: MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [2, 1],
                quality: 1
            })
            if (!result.cancelled) {
                setMusicBackground(result as any)
            }
        } catch(err) {
            alert('Um erro ocorreu.')
        }
    }

    async function getMusicFile() {
        try {
            const result: DocumentResult = await getDocumentAsync({
                type: 'audio/*'
            })
            if (result.type === 'success') {
                setFile(result)
                setError(false)
                setErrorMessage('')
            } else {
                if (!file) {
                    setError(true)
                    setErrorMessage('Por favor, selecione um arquivo.')
                }
            }
        } catch(err) {
            alert('Um erro ocorreu')
        }
    }

    async function uploadMusic() {
        if (!name || !description || !keywords || !musicBackground) {
            setError(true)
            return setErrorMessage('Por favor, preencha todos os campos.')
        }
        if (!file) {
            setError(true)
            return setErrorMessage('Por favor, selecione alguma música.')
        }
        setIsLoading(true)
        try {
            let fileName = file.name
            if (fileName?.includes('|')) {
                fileName = fileName.replace('|', '-')
            }

            const email = await AsyncStorage.getItem('email')
            const token = await AsyncStorage.getItem('token')
            const formData = new FormData()
            formData.append('name', name)
            formData.append('description', description)
            formData.append('keywords', keywords)
            formData.append('musicType', musicType)
            formData.append('music_background', {
                name: `${name}.png`,
                type: 'image/png',
                uri: musicBackground.uri
            } as any)
            formData.append('music', {
                name: `${fileName}.mp3`,
                type: `audio/mp3`,
                uri: file.uri
            } as any)
            const { data } = await api.post('/audio', formData, {
                headers: {
                    'Content-Type': 'multipart/formdata',
                    email,
                    token
                }
            })
            if (data.error) {
                setError(true)
                setErrorMessage(data.message)
            } else {
                setError(false)
                setErrorMessage('')
                setSucess(true)
                setName('')
                setDescription('')
                setKeywords('')
                setMusicBackground(undefined)
                setFile(undefined)
                dispatch({ type: 'clean-music-to-edit' })
            }
        } catch(error) {
            setError(true)
            setErrorMessage('Um erro ocorreu ao tentar enviar a música.')
        }
        setIsLoading(false)
    }

    useEffect(() => {
        api.get('/music-types').then(({ data }) => {
            setRadioItems(data)
        }).catch()
    }, [])

    return <View style={styles.container}>
        <View style={styles.header}>
            <RectButton onPress={goBack}>
                <Feather
                    name="arrow-left"
                    color="#e6e6e6"
                    size={26}
                />
            </RectButton>
            <Text
                style={styles.headerText}
            >
                Poste uma música de sua preferência.
            </Text>
        </View>
        <ScrollView style={styles.main} contentContainerStyle={styles.mainContainer}>
            <Text style={styles.subtitle}>
                Coloque um nome
            </Text>
            <View style={styles.inputContainer}>
                <Feather
                    name="type"
                    color="#e6e6e6"
                    size={26}
                />
                <TextInput
                    editable={!isLoading}
                    style={styles.input}
                    placeholder="Nome"
                    maxLength={30}
                    onChange={resetErrorAndSucess}
                    value={name}
                    onChangeText={txt => setName(txt)}
                />
            </View>
            <Text style={styles.subtitle}>
                Coloque a descrição
            </Text>
            <View style={styles.inputContainer}>
                <Feather
                    name="align-left"
                    color="#e6e6e6"
                    size={26}
                />
                <TextInput
                    editable={!isLoading}
                    style={styles.input}
                    placeholder="Descrição"
                    multiline
                    maxLength={100}
                    onChange={resetErrorAndSucess}
                    value={description}
                    onChangeText={txt => setDescription(txt)}
                />
            </View>
            <Text style={styles.subtitle}>
                Coloque palavras-chaves.
            </Text>
            <View style={styles.inputContainer}>
                <Feather
                    name="key"
                    color="#e6e6e6"
                    size={26}
                />
                <TextInput
                    editable={!isLoading}
                    style={styles.input}
                    placeholder="Palavras-chaves"
                    multiline
                    maxLength={400}
                    onChange={resetErrorAndSucess}
                    value={keywords}
                    onChangeText={txt => setKeywords(txt)}
                />
            </View>
            <View style={styles.radioItemsContainer}>
                <ScrollView
                    horizontal
                    pagingEnabled
                    contentContainerStyle={styles.radioItems}
                >
                    <RadioButton.Group
                        onValueChange={handlePickerSelect}
                        value={musicType}
                    >
                        {radioItems ? radioItems.map(item => (
                            <View
                                key={item.value}
                                style={styles.radioItem}
                            >
                                <TouchableOpacity
                                    disabled={isLoading}
                                    onPress={() => setMusicType(item.value)}
                                >
                                    <Text
                                        style={[styles.radioText, {
                                            color: `${musicType === item.value ? '#4c43df' : '#d9dadc'}`
                                        }]}
                                    >{item.label}</Text>
                                </TouchableOpacity>
                                <RadioButton
                                    disabled={isLoading}
                                    color="#4c43df"
                                    uncheckedColor="#d9dadc"
                                    value={item.value}
                                />
                            </View>
                        )) : null}
                    </RadioButton.Group>
                </ScrollView>
            </View>
            <TouchableOpacity
                disabled={isLoading}
                style={[styles.buttonAddDocument, { marginBottom: 10 }]}
                onPress={getMusicBackground}
            >
                {musicBackground ? <Image
                    source={{ uri: musicBackground.uri }}
                    style={{ width: 100, height: 50 }}
                /> : <Text
                    style={styles.buttonAddDocumentText}
                >Selecione uma foto de fundo para a música.</Text>}
            </TouchableOpacity>
            <TouchableOpacity
                disabled={isLoading}
                style={styles.buttonAddDocument}
                onPress={getMusicFile}
            >
                {file ? <Text
                    style={styles.buttonAddDocumentText}
                >
                    {file.name}
                </Text> : <Feather
                    name="plus"
                    color="#e6e6e6"
                    size={26}
                />}
            </TouchableOpacity>
            {isLoading ? <ActivityIndicator
                size="large"
                color="#4c43df"
            /> : null}
            {error ? <View style={styles.errorContainer}>
                <Feather
                    name="x"
                    size={26}
                    color="#c82333"
                />
                <Text style={styles.errorMessage}>{errorMessage}</Text>
            </View> : null}
            {sucess ? <View style={styles.sucessContainer}>
                <Feather
                    name="check"
                    size={26}
                    color="#28a745"
                />
                <Text style={styles.sucessMessage}>Música enviada com sucesso.</Text>
            </View> : null}
            <Divider />
            <TouchableOpacity
                disabled={isLoading}
                style={styles.buttonSendMusic}
                onPress={uploadMusic}
            >
                <Text
                    style={styles.buttonSendMusicText}
                >Enviar música</Text>
            </TouchableOpacity>
        </ScrollView>
    </View>
}

export default User