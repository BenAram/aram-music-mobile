import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
    Dimensions,
    View,
    Image,
    Text,
    ScrollView,
    TextInput,
    NativeSyntheticEvent,
    NativeScrollEvent,
    TouchableOpacity,
    Vibration,
    Clipboard,
    Keyboard
} from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { Feather, FontAwesome5 } from '@expo/vector-icons'
import AsyncStorage from '@react-native-community/async-storage'
import { useSelector } from 'react-redux'
import { Modalize } from 'react-native-modalize'

import io, { Socket } from 'socket.io-client'

import styles from './styles'

import api from '../../services/api'
import url from '../../services/url'

import logo from '../../images/logo.png'

const emojis = require('./emoji.json')
const emojisKeys = [
    'Smileys & Emotion',
    'People & Body',
    'Animals & Nature',
    'Food & Drink',
    'Travel & Places',
    'Activities',
    'Objects',
    'Symbols',
    'Flags'
]
const emojisNames = [
    'smile',
    'walking',
    'tree',
    'utensils',
    'bus-alt',
    'gift',
    'tablet',
    'heart',
    'flag'
]
const emojisTitles = [
    'Sorrisos',
    'Pessoas',
    'Animais e natureza',
    'Comida e bebida',
    'Viagens e lugares',
    'Atividades e eventos',
    'Objetos',
    'Símbolos',
    'Bandeiras'
]

interface UserMessage {
    name: string
    avatar: string
    id: number
    online: boolean
    type: string
}

interface Message {
    date: string
    from: number
    content: string
    seen: boolean
    id: number
}

interface Friendship {
    id: number
    from: UserMessage
    to: UserMessage
    accepted: boolean
    messages: Array<Message>
}

interface ChatInterface {
    friendship: Friendship
    setVisible: Function
    me: UserMessage
    setChat: Function
}

interface ScrollViewSize {
    width: number
    height: number
}

interface ScrollViewCoordinates {
    x: number
    y: number
}

interface Url {
    [index: number]: string
}

function treatTime(time: number): string {
    return time > 9 ? `${time}` : `0${time}`
}

function treatDate(time: string): string {
    const date = new Date(time)

    const hours = treatTime(date.getHours())
    const minutes = treatTime(date.getMinutes())

    const day = treatTime(date.getDate())
    const month = treatTime(date.getMonth())
    const year = treatTime(date.getFullYear())

    return `${hours}:${minutes} - ${day}/${month}/${year}`
}

function Chat(props: ChatInterface): JSX.Element {

    const navigation = useNavigation()

    const isLoaded: boolean = useSelector((state: any) => state.music.isLoaded)

    const [socket, setSocket] = useState<typeof Socket>()

    const [actualFriend, setActualFriend] = useState<UserMessage>()
    const [messages, setMessages] = useState<Array<Message>>([])

    const [message, setMessage] = useState<string>('')

    const [scrollViewSize, setScrollViewSize] = useState<ScrollViewSize>({width:0,height:0})
    const [scrollViewCoordinates, setScrollViewCoordinates] = useState<ScrollViewCoordinates>({x:0,y:0})

    const [actualMessage, setActualMessage] = useState<Message>()

    const [vibrations, setVibrations] = useState<number>(0)

    const [emojiKeyboard, setEmojiKeyboard] = useState<boolean>(false)
    const [emojiKeyboardIndex, setEmojiKeyboardIndex] = useState<number>(0)

    const messageInput = useRef<TextInput>()
    const messagesScrollView = useRef<ScrollView>()
    const userModalize = useRef<Modalize>()
    const messageModalize = useRef<Modalize>()
    const myMessageModalize = useRef<Modalize>()

    function treatMessage(message: string, style: any): JSX.Element | Array<JSX.Element> {
        let newMessage: string = message

        // const urls: Array<Array<String>> = [...(newMessage.matchAll(/((https|http):\/\/)([^\/,\s]+\.[^\/,\s]+?)(?=\/|,|\s|$|\?|#)/g) as any)]
        const urls: Array<Array<String>> = []

        if (urls.length === 0) {
            return <Text style={style}>{message}</Text>
        }

        const links: Array<Url> = []

        urls.map(url => {
            let finalUrl: string = ''
            url.map(newFinalUrl => {
                finalUrl += newFinalUrl
            })
            newMessage.replace(finalUrl, '')

            const newLinks: Url = {}
            newLinks[(url as any).index] = finalUrl
            links.push(newLinks)
        })

        const newMessageAgain = [...(newMessage as any)]

        return newMessageAgain.map((message, index) => {
            if (links[index]) {
                return <TouchableOpacity>
                    <Text>{links[index]}</Text>
                </TouchableOpacity>
            } else {
                return <Text style={style}>{message}</Text>
            }
        })
    }

    function handleCloseChat() {
        props.setVisible(false)
        props.setChat(null)
    }

    function handleScroll(evt: NativeSyntheticEvent<NativeScrollEvent>) {
        const { x, y } = evt.nativeEvent.contentOffset
        const { width, height } = evt.nativeEvent.layoutMeasurement
        setScrollViewSize({
            width,
            height
        })
        setScrollViewCoordinates({
            x,
            y
        })
    }

    function handleOpenEmojiKeyboard() {
        if (emojiKeyboard) {
            messageInput.current?.focus()
            setEmojiKeyboard(false)
            setEmojiKeyboardIndex(0)
        } else {
            Keyboard.dismiss()
            setEmojiKeyboard(true)
            let scroll: boolean = scrollViewCoordinates.y >= scrollViewSize.height
            if (scroll) {
                setTimeout(() => {
                    messagesScrollView.current?.scrollToEnd({ animated: true, duration: 500 } as any)
                }, 1)
            }
        }
    }

    function handleEmojiGroup(index: number): Function {
        return function() {
            setEmojiKeyboardIndex(index)
        }
    }

    function handleAddEmoji(emoji: string): Function {
        return function() {
            setMessage(message + emoji)
        }
    }

    function handleUser() {
        Vibration.vibrate(200)
        userModalize.current?.open()
    }

    function handleMessage(message: Message): Function {
        return function() {
            Vibration.vibrate(200)
            setVibrations(vibrations + 1)
            if (vibrations === 13) {
                const interval = setInterval(() => {
                    Vibration.vibrate(1000)
                    alert('Para de me pressionar!!!!!')
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                }, 10000)
            }
            setActualMessage(message)
            
            if (message.from === props.me.id) {
                myMessageModalize.current?.open()
            } else {
                messageModalize.current?.open()
            }
        }
    }

    function handleSeeUser() {
        navigation.navigate('user', { id: actualFriend?.id })
        userModalize.current?.close()
    }

    function handleCopyUserId() {
        Clipboard.setString(`${actualFriend?.id}`)
        userModalize.current?.close()
    }

    function handleCopyMessage() {
        if (actualMessage) {
            Clipboard.setString(actualMessage.content)
        }
        messageModalize.current?.close()
        myMessageModalize.current?.close()
    }

    function handleCopyMessageId() {
        if (actualMessage) {
            Clipboard.setString(`${actualMessage.id}`)
        }
        messageModalize.current?.close()
        myMessageModalize.current?.close()
    }

    async function handleDeleteMessage() {
        try {
            const { data } = await api.delete(`/friends/message/${props.friendship.id}/${actualMessage?.id}`, {
                headers: {
                    email: await AsyncStorage.getItem('email'),
                    token: await AsyncStorage.getItem('token')
                }
            })
            if (data.error) {
                alert(data.message)
            } else {
                myMessageModalize.current?.close()
            }
        } catch(err) {
            alert('Um erro ocorreu')
        }
    }

    async function handleSendMessage() {
        try {
            const email = await AsyncStorage.getItem('email')
            const token = await AsyncStorage.getItem('token')

            const { data } = await api.post(`/friends/message/${props.friendship.id}`, {
                content: message
            }, {
                headers: {
                    email,
                    token
                }
            })
            if (data.error) {
                alert(data.message)
            } else {
                setMessage('')
            }
        } catch(err) {
            alert('Um erro ocorreu')
        }
    }

    useEffect(() => {
        if (socket && messagesScrollView.current) {
            socket.on('message', (_: any, id: number) => {
                let scroll: boolean = scrollViewCoordinates.y >= scrollViewSize.height
                if (id == props.friendship.id) {
                    if (scroll) {
                        setTimeout(() => {
                            messagesScrollView.current?.scrollToEnd({ animated: true, duration: 500 } as any)
                        }, 1)
                    }
                }
            })
        }
    }, [socket])

    useEffect(() => {
        if (props.friendship.from.id === props.me.id) {
            setActualFriend(props.friendship.to)
        } else {
            setActualFriend(props.friendship.from)
        }
        setMessages(props.friendship.messages)

        async function run() {
            setSocket(io(url, {
                transportOptions: {
                    polling: {
                        extraHeaders: {
                            email: await AsyncStorage.getItem('email'),
                            token: await AsyncStorage.getItem('token'),
                            type: 'android'
                        }
                    }
                }
            }))
        }
        run()
        setTimeout(() => {
            messagesScrollView.current?.scrollToEnd()
        }, 1)
        function keyboardDidShow() {
            setEmojiKeyboard(false)
            setEmojiKeyboardIndex(0)
        }
        Keyboard.addListener('keyboardDidShow', keyboardDidShow)
        return () => {
            Keyboard.removeListener('keyboardDidShow', keyboardDidShow)
        }
    }, [])

    const Header = useCallback(() => {
        return <View style={styles.header}>
            <View style={styles.headerProfileContainer}>
                <Image
                    style={styles.headerProfileImage}
                    source={actualFriend?.avatar ? { uri: `${url}/avatar/${actualFriend.avatar}` } : logo}
                />
                <Text style={styles.headerProfileName}>{actualFriend?.name}</Text>
                {actualFriend?.type === 'android' && actualFriend?.online ? <Feather
                    name="smartphone"
                    size={15}
                    color="#28a745"
                /> : <View style={[styles.headerChatView, { backgroundColor: actualFriend?.online ? '#28a745' : 'rgba(255, 255, 255, 0.2)' }]} />}
            </View>
            <RectButton onPress={handleCloseChat}>
                <Feather
                    name="x"
                    color="#d9dadc"
                    size={26}
                />
            </RectButton>
        </View>
    }, [actualFriend])

    const Main = useCallback(() => {
        return <ScrollView onScroll={handleScroll} style={styles.main} ref={messagesScrollView as any}>
            {messages.map((message, index, messages) => {
                let actualUser: UserMessage
                if (message.from === actualFriend?.id) {
                    actualUser = actualFriend
                } else {
                    actualUser = props.me
                }
                if (index > 0) {
                    if (message.from === messages[index - 1].from) {
                        return <TouchableOpacity onLongPress={handleMessage(message) as any} key={index}>
                            {treatMessage(message.content, [
                                styles.mainMessageContentAfter,
                                {
                                marginBottom: messages[index + 1] ? message.from === messages[index + 1].from ? 0 : 10 : 10
                            }])}
                        </TouchableOpacity>
                    }
                }
                return <View style={[
                    styles.mainMessageContainer,
                    {
                        marginBottom: messages[index + 1] ? message.from === messages[index + 1].from ? 0 : 10 : 10
                    }
                    ]} key={index}>
                    <TouchableOpacity onLongPress={handleUser}>
                        <Image
                            style={styles.mainMessageAvatar}
                            source={actualUser.avatar ? { uri: `${url}/avatar/${actualUser.avatar}` } : logo}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onLongPress={handleMessage(message) as any} style={styles.mainMessageContentContainer}>
                        {treatMessage(message.content, styles.mainMessageContent)}
                    </TouchableOpacity>
                    <TouchableOpacity onLongPress={handleUser} style={styles.mainMessageNameContainer}>
                        <Text style={styles.mainMessageName}>{actualUser.name}</Text>
                    </TouchableOpacity>
                    <Text style={styles.mainMessageDate}>{treatDate(message.date)}</Text>
                </View>
            })}
        </ScrollView>
    }, [messages])

    const Footer = useCallback(() => {
        return <View style={styles.footer}>
            <View style={styles.footerInputContainer}>
                <RectButton style={styles.footerEmoji} onPress={handleOpenEmojiKeyboard}>
                    <FontAwesome5
                        name={emojiKeyboard ? 'keyboard' : 'smile'}
                        color="#d9dadc"
                        size={26}
                    />
                </RectButton>
                <TextInput
                    ref={messageInput as any}
                    style={styles.footerInput}
                    value={message}
                    onChangeText={setMessage}
                    placeholder={`Conversar com ${actualFriend?.name}`}
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    selectionColor="#4c43df"
                />
            </View>
            {message.length > 0 ? <RectButton style={styles.footerButton} onPress={handleSendMessage}>
                <Feather
                    name="send"
                    color="#d9dadc"
                    size={24}
                />
            </RectButton> : null}
        </View>
    }, [emojiKeyboard])

    return <View style={[
            styles.container,
            {
                width: Dimensions.get('window').width,
                height: isLoaded ? (Dimensions.get('window').height / 100) * 86 : (Dimensions.get('window').height / 100) * 94
            }
        ]}>
        <Header/>
        <Main/>
        <Footer/>
        {emojiKeyboard ? <View style={styles.footerKeyboard}>
            <ScrollView
                contentContainerStyle={styles.footerKeyboardGroupsContent}
                style={styles.footerKeyboardGroups} 
                horizontal
            >
                {emojisKeys.map((key, index) => <RectButton 
                    key={key}
                    style={styles.footerKeyboardGroupButton}
                    onPress={handleEmojiGroup(index) as any}
                >
                    <FontAwesome5
                        name={emojisNames[index]}
                        color={emojiKeyboardIndex === index ? '#4c43df' : '#d9dadc'}
                        size={26}
                    />
                </RectButton>)}
            </ScrollView>
            <View style={styles.footerKeyboardHeader}>
                <Text style={styles.footerKeyboardTitle}>{emojisTitles[emojiKeyboardIndex]}</Text>
            </View>
            <ScrollView contentContainerStyle={styles.footerKeyboardMainContent} style={styles.footerKeyboardMain}>
                {emojis[emojisKeys[emojiKeyboardIndex]].map((emoji: any) => <RectButton key={emoji.emoji} onPress={handleAddEmoji(emoji.emoji) as any}>
                    <Text style={styles.footerKeyboardMainText}>{emoji.emoji}</Text>
                </RectButton>)}
            </ScrollView>
        </View> : null}
        <Modalize
            snapPoint={100}
            ref={userModalize}
            modalHeight={100}
            modalStyle={{
                backgroundColor: '#3e3e3e'
            }}
        >
            <View style={styles.modalizeContainer}>
                <RectButton onPress={handleSeeUser} style={styles.modalizeButton}>
                    <Feather
                        name="eye"
                        size={35}
                        color="#d9dadc"
                    />
                    <View style={styles.modalizeButtonDivider}/>
                    <Text style={styles.modalizeButtonText}>Ver usuário</Text>
                </RectButton>
                <RectButton onPress={handleCopyUserId} style={styles.modalizeButton}>
                    <Feather
                        name="copy"
                        size={35}
                        color="#d9dadc"
                    />
                    <View style={styles.modalizeButtonDivider}/>
                    <Text style={styles.modalizeButtonText}>Copiar id do usuário</Text>
                </RectButton>
            </View>
        </Modalize>
        <Modalize
            snapPoint={140}
            ref={myMessageModalize}
            modalHeight={140}
            modalStyle={{
                backgroundColor: '#3e3e3e'
            }}
        >
            <View style={styles.modalizeContainer}>
                <RectButton onPress={handleCopyMessage} style={styles.modalizeButton}>
                    <Feather
                        name="copy"
                        size={35}
                        color="#d9dadc"
                    />
                    <View style={styles.modalizeButtonDivider}/>
                    <Text style={styles.modalizeButtonText}>Copiar texto!</Text>
                </RectButton>
                <RectButton onPress={handleCopyMessageId} style={styles.modalizeButton}>
                    <Feather
                        name="copy"
                        size={35}
                        color="#d9dadc"
                    />
                    <View style={styles.modalizeButtonDivider}/>
                    <Text style={styles.modalizeButtonText}>Copiar id da mensagem</Text>
                </RectButton>
                <RectButton onPress={handleDeleteMessage} style={styles.modalizeButton}>
                    <Feather
                        name="trash-2"
                        size={35}
                        color="#d9dadc"
                    />
                    <View style={styles.modalizeButtonDivider}/>
                    <Text style={styles.modalizeButtonText}>Deletar mensagem</Text>
                </RectButton>
            </View>
        </Modalize>
        <Modalize
            snapPoint={100}
            ref={messageModalize}
            modalHeight={100}
            modalStyle={{
                backgroundColor: '#3e3e3e'
            }}
        >
            <View style={styles.modalizeContainer}>
                <RectButton onPress={handleCopyMessage} style={styles.modalizeButton}>
                    <Feather
                        name="copy"
                        size={35}
                        color="#d9dadc"
                    />
                    <View style={styles.modalizeButtonDivider}/>
                    <Text style={styles.modalizeButtonText}>Copiar texto!</Text>
                </RectButton>
                <RectButton onPress={handleCopyMessageId} style={styles.modalizeButton}>
                    <Feather
                        name="copy"
                        size={35}
                        color="#d9dadc"
                    />
                    <View style={styles.modalizeButtonDivider}/>
                    <Text style={styles.modalizeButtonText}>Copiar id da mensagem</Text>
                </RectButton>
            </View>
        </Modalize>
    </View>
}

export default Chat