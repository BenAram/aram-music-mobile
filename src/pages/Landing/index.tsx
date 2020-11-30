import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    Image,
    KeyboardAvoidingView,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage'
import { Checkbox } from 'react-native-paper'
import { Feather } from '@expo/vector-icons'
import Divider from '../../components/Divider'

import styles from './styles'

import logo from '../../images/logo.png'
import api from '../../services/api'

function Landing(): JSX.Element {
    const navigation = useNavigation()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [createAccount, setCreateAccount] = useState<boolean>(false)
    const [rememberMe, setRememberMe] = useState<boolean>(true)

    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')

    const [error, setError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')

    function handleRememberMe(): void {
        setRememberMe(!rememberMe)
    }
    async function handleSubmit() {
        setIsLoading(true)
        if (createAccount) {
            try {
                const { data } = await api.post('/user', {
                    name,
                    email,
                    password,
                    confirmPassword
                })
                if (data.error) {
                    setError(true)
                    setErrorMessage(data.message)
                } else {
                    if (rememberMe) {
                        await AsyncStorage.setItem('email', email)
                        await AsyncStorage.setItem('token', data.token)
                        await AsyncStorage.setItem('rememberme', 'true')
                        navigation.navigate('app')
                    } else {
                        await AsyncStorage.setItem('email', email)
                        await AsyncStorage.setItem('token', data.token)
                        navigation.navigate('app')
                    }
                }
            } catch(err) {
                setError(true)
                setErrorMessage(`${err}`)
            }
        } else {
            try {
                const { data } = await api.post('/login', {
                    email,
                    password
                })
                if (data.error) {
                    setError(true)
                    setErrorMessage(data.message)
                } else {
                    if (rememberMe) {
                        await AsyncStorage.setItem('rememberme', 'true')
                        await AsyncStorage.setItem('email', email)
                        await AsyncStorage.setItem('token', data.token)
                        navigation.navigate('app')
                    } else {
                        await AsyncStorage.setItem('email', email)
                        await AsyncStorage.setItem('token', data.token)
                        navigation.navigate('app')
                    }
                }
            } catch(err) {
                setError(true)
                setErrorMessage(`${err}`)
            }
        }
        setIsLoading(false)
    }
    function handleCreateAccount(): void {
        setError(false)
        setErrorMessage('')
        setCreateAccount(!createAccount)
    }

    async function initialize(): Promise<void> {
        const rememberme = await AsyncStorage.getItem('rememberme')
        if (rememberme) {
            navigation.navigate('app')
        }
    }

    useEffect(() => {
        initialize()
    }, [])

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={logo}
                style={styles.logo}
            />
            <KeyboardAvoidingView style={styles.inputsContainer}>
                {createAccount ? <Text style={styles.inputLabel}>Seu nome</Text> : null}
                {createAccount ? <View style={styles.inputContainer}>
                    <Feather
                        name="user"
                        color="#4c43df"
                        size={30}
                    />
                    <TextInput
                        editable={!isLoading}
                        placeholder="Nome" 
                        style={styles.input}
                        value={name}
                        onChangeText={txt => setName(txt)}
                        autoCorrect={false}
                    />
                </View> : null}
                <Text style={styles.inputLabel}>Seu e-mail</Text>
                <View style={styles.inputContainer}>
                    <Feather 
                        name="at-sign"
                        color="#4c43df"
                        size={30}
                    />
                    <TextInput
                        editable={!isLoading}
                        placeholder="E-mail" 
                        style={styles.input}
                        value={email}
                        onChangeText={txt => setEmail(txt)}
                        keyboardType="email-address"
                    />
                </View>
                <Text style={styles.inputLabel}>Sua senha</Text>
                <View style={styles.inputContainer}>
                    <Feather 
                        name="lock"
                        color="#4c43df"
                        size={30}
                    />
                    <TextInput
                        editable={!isLoading}
                        placeholder="Senha"
                        style={styles.input}
                        value={password}
                        onChangeText={txt => setPassword(txt)}
                        secureTextEntry={true}
                    />
                </View>
                {createAccount ? <Text style={styles.inputLabel}>Confirme sua senha</Text> : null}
                {createAccount ? <View style={styles.inputContainer}>
                    <Feather 
                        name="lock"
                        color="#4c43df"
                        size={30}
                    />
                    <TextInput
                        editable={!isLoading}
                        placeholder="Confirme sua senha"
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={txt => setConfirmPassword(txt)}
                        secureTextEntry={true}
                    />
                </View> : null}
                {error ? <View style={styles.errorContainer}>
                    <Feather
                        name="x-circle"
                        color="#c82333"
                        size={26}
                    />
                    <Text style={styles.errorMessage}>{errorMessage}</Text>
                </View> : null}
                <View style={styles.confirmContainer}>
                    <Checkbox
                        color="#4c43df"
                        status={rememberMe ? 'checked' : 'unchecked'}
                        onPress={handleRememberMe}
                    />
                    <RectButton
                        onPress={handleRememberMe}
                    >
                        <Text style={styles.rememberMeText}>
                            Lembrar de mim
                        </Text>
                    </RectButton>
                    <TouchableOpacity
                        disabled={isLoading}
                        style={styles.loginButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.loginText}>{
                            createAccount ? 'Criar conta' : 'Logar'
                        }</Text>
                    </TouchableOpacity>
                </View>
                {isLoading ? <ActivityIndicator
                    size="large"
                    color="#4c43df"
                /> : null}
                <Divider />
                <Text style={styles.question}>
                    {createAccount ? 'Já tem uma conta?' : 'Não tem uma conta?'}
                </Text>
                <TouchableOpacity 
                    style={styles.createAccountButton}
                    onPress={handleCreateAccount}
                >
                    <Text style={styles.createAccountText}>
                        {createAccount ? 'Entrar em uma conta' : 'Criar conta'}
                    </Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default Landing