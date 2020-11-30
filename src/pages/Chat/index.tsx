import React, { useState, useEffect, useRef, Fragment } from 'react'
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
    Clipboard
} from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-community/async-storage'
import { useSelector } from 'react-redux'
import { Modalize } from 'react-native-modalize'

import io, { Socket } from 'socket.io-client'

import styles from './styles'

import api from '../../services/api'
import url from '../../services/url'

import logo from '../../images/logo.png'

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

    const isLoaded: boolean = useSelector((state: any) => state.music.isLoaded)

    const [socket, setSocket] = useState<typeof Socket>()

    const [actualFriend, setActualFriend] = useState<UserMessage>()
    const [messages, setMessages] = useState<Array<Message>>([])

    const [message, setMessage] = useState<string>('')

    const [scrollViewSize, setScrollViewSize] = useState<ScrollViewSize>({width:0,height:0})
    const [scrollViewCoordinates, setScrollViewCoordinates] = useState<ScrollViewCoordinates>({x:0,y:0})

    const [actualMessage, setActualMessage] = useState<Message>()

    const [vibrations, setVibrations] = useState<number>(0)

    const messagesScrollView = useRef<ScrollView>()
    const modalizeRef = useRef<Modalize>()

    // function treatMessage(message: string): JSX.Element {
    //     if (message.match(/((https|http):\/\/)([^\/,\s]+\.[^\/,\s]+?)(?=\/|,|\s|$|\?|#)/g) {

    //     } else {

    //     }
    // }

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
            modalizeRef.current?.open()
        }
    }

    function handleCopyMessage() {
        if (actualMessage) {
            Clipboard.setString(actualMessage.content)
        }
        modalizeRef.current?.close()
    }

    function handleCopyMessageId() {
        if (actualMessage) {
            Clipboard.setString(`${actualMessage.id}`)
        }
        modalizeRef.current?.close()
    }

    async function handleSendMessage() {
        try {
            const email = await AsyncStorage.getItem('email')
            const token = await AsyncStorage.getItem('token')

            const { data } = await api.post(`/friends/message/send/${props.friendship.id}`, {
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
    }, [])

    return <View style={[
            styles.container,
            {
                width: Dimensions.get('window').width,
                height: isLoaded ? (Dimensions.get('window').height / 100) * 86 : (Dimensions.get('window').height / 100) * 94
            }
        ]}>
        <View style={styles.header}>
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
        <ScrollView onScroll={handleScroll} style={styles.main} ref={messagesScrollView as any}>
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
                                <Text style={[
                                styles.mainMessageContentAfter,
                                {
                                    marginBottom: messages[index + 1] ? message.from === messages[index + 1].from ? 0 : 10 : 10
                                }
                            ]}>{message.content}</Text>
                        </TouchableOpacity>
                    }
                }
                return <View style={[
                    styles.mainMessageContainer,
                    {
                        marginBottom: messages[index + 1] ? message.from === messages[index + 1].from ? 0 : 10 : 10
                    }
                    ]} key={index}>
                    <Image
                        style={styles.mainMessageAvatar}
                        source={actualUser.avatar ? { uri: `${url}/avatar/${actualUser.avatar}` } : logo}
                    />
                    <TouchableOpacity onLongPress={handleMessage(message) as any} style={styles.mainMessageContentContainer}>
                        <Text style={styles.mainMessageContent}>{message.content}</Text>
                    </TouchableOpacity>
                    <View style={styles.mainMessageNameContainer}>
                        <Text style={styles.mainMessageName}>{actualUser.name}</Text>
                    </View>
                    <Text style={styles.mainMessageDate}>{treatDate(message.date)}</Text>
                </View>
        })}
        </ScrollView>
        <View style={styles.footer}>
            <TextInput
                style={styles.footerInput}
                value={message}
                onChangeText={setMessage}
                placeholder={`Conversar com ${actualFriend?.name}`}
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
            {message.length > 0 ? <RectButton style={styles.footerButton} onPress={handleSendMessage}>
                <Feather
                    name="send"
                    color="#d9dadc"
                    size={24}
                />
            </RectButton> : null}
        </View>
        <Modalize
            snapPoint={100}
            ref={modalizeRef}
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