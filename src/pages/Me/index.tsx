import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Alert,
    ScrollView,
    ActivityIndicator
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker'
import { Audio } from 'expo-av'
import { useSelector, useDispatch } from 'react-redux'

import Divider from '../../components/Divider'

import styles from './styles'

import api from '../../services/api'
import url from '../../services/url'

import logo from '../../images/logo.png'

interface Avatar {
    name: string
    uri: string
    type: string
}

function User(): JSX.Element {
    const audio: Audio.Sound = useSelector((state: any) => state.music.sound)
    const dispatch = useDispatch()

    const navigation = useNavigation()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [initialName, setInitialName] = useState<string>('')
    const [initialEmail, setInitialEmail] = useState<string>('')
    const [initialAvatar, setInitialAvatar] = useState<Avatar | null>()

    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [oldPassword, setOldPassword] = useState<string>('')
    const [newPassword, setNewPassword] = useState<string>('')
    const [avatar, setAvatar] = useState<Avatar | null>()

    const [error, setError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [sucess, setSucess] = useState<boolean>(false)

    function initialize(): void {
        AsyncStorage.getItem('email').then(email => {
            if (email) {
                AsyncStorage.getItem('token').then(token => {
                    if (token) {
                        api.get('/user', {
                            headers: {
                                email,
                                token
                            }
                        }).then(({ data }) => {
                            let avatar: Avatar | any
                            if (data.avatar) {
                                avatar = {
                                    name: data.avatar,
                                    uri: `${url}/avatar/${data.avatar}`,
                                    type: 'image/png'
                                }
                            }

                            setInitialName(data.name)
                            setInitialEmail(data.email)
                            
                            setName(data.name)
                            setEmail(data.email)
                            

                            if (data.avatar) {
                                setInitialAvatar(avatar)
                                setAvatar(avatar)
                            } else {
                                setInitialAvatar(null)
                                setAvatar(null)
                            }
                        }).catch(() => null)
                    }
                }).catch(() => null)
            }
        }).catch(() => null)
        setOldPassword('')
        setNewPassword('')
    }

    async function uploadImage() {
        try {
            const result = await launchImageLibraryAsync({
                mediaTypes: MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
                exif: true
            })
            if (!result.cancelled) {
                setAvatar({
                    uri: result.uri,
                    name: `${name}.png`,
                    type: 'image/png'
                })
            }
        } catch(err) {
            Alert.alert('Um erro ocorreu')
        }
    }

    function verifyCanSave(): boolean {
        if (name !== initialName || email !== initialEmail || newPassword.length > 0 || avatar !== initialAvatar) {
            return true
        } else {
            return false
        }
    }

    async function saveChanges() {
        setIsLoading(true)
        setError(false)
        setErrorMessage('')
        setSucess(false)
        try {
            const formData = new FormData()
            formData.append('password', oldPassword)
            if (avatar !== initialAvatar) {
                formData.append('avatar', {
                    name: `${name}.png`,
                    type: 'image/png',
                    uri: avatar?.uri
                } as any)
            }
            if (name !== initialName) {
                formData.append('name', name)
            }
            if (email !== initialEmail) {
                formData.append('email', email)
            }
            if (newPassword) {
                formData.append('newPassword', newPassword)
            }
            const { data } = await api.patch('/user', formData, {
                headers: {
                    'Content-Type': 'multipart/formdata',
                    email: await AsyncStorage.getItem('email'),
                    token: await AsyncStorage.getItem('token')
                }
            })
            if (data.error) {
                setError(true)
                setErrorMessage(data.message)
            } else {
                if (email !== initialEmail) {
                    await AsyncStorage.setItem('token', data.token)
                    await AsyncStorage.setItem('email', data.email)
                    setSucess(true)
                    initialize()
                } else {
                    setSucess(true)
                    initialize()
                }
            }
        } catch(err) {
            setError(true)
            setErrorMessage('Não foi possível fazer as alterações')
        }
        setIsLoading(false)
    }

    function leaveAccount(): void {
        audio.unloadAsync().then(() => null).catch(() => null)
        dispatch({ type: 'turn-off' })
        dispatch({ type: 'change-music', music: null })
        dispatch({ type: 'disactive-did-mount' })
        AsyncStorage.clear().then(() => null).catch(() => null)
        navigation.navigate('landing')
    }

    async function deleteAccount() {
        try {
            const { data } = await api.delete('/user', {
                headers: {
                    email: await AsyncStorage.getItem('email'),
                    token: await AsyncStorage.getItem('token')
                }
            })
            if (data.error) {
                setError(true)
                setErrorMessage(data.message)
            } else {
                Alert.alert('Conta deletada')
                leaveAccount()
            }
        } catch(err) {
            Alert.alert('Um erro ocorreu')
        }
    }

    useEffect(() => {
        initialize()
    }, [])

    return <ScrollView contentContainerStyle={styles.container}>
        <View
            style={styles.accountContainer}
        >
            <View style={styles.avatarContainer}>
                <TouchableOpacity
                    disabled={isLoading}
                    onPress={uploadImage}
                >
                    <Image
                        source={avatar ? { uri: avatar.uri } : logo}
                        style={styles.avatar}
                    />
                </TouchableOpacity>
            </View>
            <TextInput
                editable={!isLoading}
                placeholder="Nome"
                style={styles.input}
                value={name}
                onChangeText={txt => setName(txt)}
            />
            <TextInput
                editable={!isLoading}
                placeholder="Email"
                style={styles.input}
                keyboardType="email-address"
                value={email}
                onChangeText={txt => setEmail(txt)}
            />
            <TextInput
                editable={!isLoading}
                placeholder="Nova senha (opcional)"
                style={styles.input}
                secureTextEntry
                value={newPassword}
                onChangeText={txt => setNewPassword(txt)}
            />
            <Divider />
            <Text
                style={styles.warningText}
            >Coloque sua senha para confimar as alterações</Text>
            <TextInput
                editable={!isLoading}
                placeholder="Senha antiga"
                style={styles.input}
                secureTextEntry
                value={oldPassword}
                onChangeText={txt => setOldPassword(txt)}
            />
            {error ? <View style={styles.errorContainer}>
                <Feather
                    name="x"
                    size={24}
                    color="#c82333"
                />
                <Text
                    style={styles.errorText}
                >{errorMessage}</Text>
            </View> : null}
            {sucess ? <View
                style={styles.sucessContainer}
            >
                <Feather
                    name="check"
                    size={24}
                    color="#28a745"
                />
                <Text
                    style={styles.sucessText}
                >Alterações feitas com sucesso.</Text>
            </View> : null}
            {verifyCanSave() ? <TouchableOpacity
                disabled={isLoading}
                style={styles.saveButton}
                onPress={saveChanges}
            >
                <Text
                    style={styles.saveButtonText}
                >Salvar alterações</Text>
            </TouchableOpacity> : null}
            {isLoading ? <ActivityIndicator
                size="large"
                color="#4c43df"
            /> : null}
        </View>
        <View style={styles.accountConfig}>
            <TouchableOpacity
                style={styles.buttonLeave}
                onPress={leaveAccount}
            >
                <Feather
                    name="log-out"
                    size={24}
                    color="#d9dadc"
                />
                <Text
                    style={styles.buttonLeaveText}
                >Sair da conta</Text>
            </TouchableOpacity>
            <TouchableOpacity
                disabled={isLoading}
                style={styles.buttonDelete}
                onPress={deleteAccount}
            >
                <Feather
                    name="trash-2"
                    size={24}
                    color="#d9dadc"
                />
                <Text
                    style={styles.buttonDeleteText}
                >Excluir conta</Text>
            </TouchableOpacity>
        </View>
    </ScrollView>
}

export default User