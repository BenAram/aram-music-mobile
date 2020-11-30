import React, { useState, useEffect } from 'react'
import {
    Dimensions,
    ActivityIndicator,
    View,
    Text,
    ScrollView,
    Image,
    Modal,
    TouchableOpacity,
    TextInput
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { RectButton } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import { presentNotificationAsync, addNotificationResponseReceivedListener } from 'expo-notifications'

import Chat from '../Chat'
import FriendsRequests from '../FriendRequests'

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

interface Error {
    error: boolean
    message: string
}

interface MessagesNotSeen {
    [index: number]: Array<Message>
}

const iconConfig = {
    size: 26,
    color: '#d9dadc'
}

const initialState: UserMessage = {
    name: '',
    avatar: '',
    id: 0,
    online: true,
    type: 'android'
}
const initialStateError: Error = {
    error: false,
    message: ''
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

function ChatContainer(): JSX.Element {
    
    const isLoaded: boolean = useSelector((state: any) => state.music.isLoaded)

    const [didMount, setDidMount] = useState<boolean>(false)

    const [me, setMe] = useState<UserMessage>(initialState)
    const [friendships, setFriendships] = useState<Array<Friendship>>([])
    const [friendshipsIds, setFriendshipsIds] = useState<Array<number>>([])
    const [friendsRequests, setFriendsRequests] = useState<Array<Friendship>>([])
    const [messagesNotSeen, setMessagesNotSeen] = useState<MessagesNotSeen>({})
    const [socket, setSocket] = useState<typeof Socket>()

    const [addFriendModal, setAddFriendModal] = useState<boolean>(false)
    const [addFriendId, setAddFriendId] = useState<string>('')
    const [addFriendError, setAddFriendError] = useState<Error>(initialStateError)
    const [addFriendSucess, setAddFriendSucess] = useState<boolean>(false)

    const [seeFriendsRequests, setSeeFriendsRequests] = useState<boolean>(false)

    const [openedChat, setOpenedChat] = useState<boolean>(false)
    const [openedChatFriendship, setOpenedChatFriendship] = useState<Friendship | null>()

    function handleAddFriend() {
        setAddFriendModal(true)
    }

    function handleCloseAddFriend() {
        setAddFriendModal(false)
        setAddFriendId('')
        setAddFriendError(initialStateError)
        setAddFriendSucess(false)
    }

    async function handleSendAddFriend() {
        setAddFriendError(initialStateError)
        setAddFriendSucess(false)
        try {
            const email = await AsyncStorage.getItem('email')
            const token = await AsyncStorage.getItem('token')

            const { data } = await api.post('/friends/send', {
                id: addFriendId
            }, {
                headers: {
                    email,
                    token
                }
            })
            if (data.error) {
                setAddFriendError(data)
            } else {
                setAddFriendSucess(true)
            }
        } catch(err) {
            setAddFriendError({
                error: true,
                message: 'Ocorreu um erro.'
            })
        }
    }

    function handleSeeFriendsRequests() {
        setSeeFriendsRequests(true)
    }

    function handleOpenChat(friendship: Friendship): Function {
        return function() {
            setOpenedChat(true)
            setOpenedChatFriendship(friendship)

            const index = friendships.indexOf(friendship)
            const newFriendships = [...friendships]

            const newUnseenMessages = {...messagesNotSeen}
            newFriendships[index].messages.map(async (message, messageIndex) => {
                if (!message.seen) {
                    try {
                        const { data } = await api.get(`/friends/message/see/${friendship.id}/${message.id}`, {
                            headers: {
                                email: await AsyncStorage.getItem('email'),
                                token: await AsyncStorage.getItem('token')
                            }
                        })
                        if (data.error) {
                            alert(data.message)
                        } else if (data.sucess) {
                            newFriendships[index].messages[messageIndex].seen = true

                            const unseenMessageIndex = messagesNotSeen[friendship.id * 1].indexOf(message)
                            newUnseenMessages[friendship.id * 1].splice(unseenMessageIndex, 1)
                        }
                    } catch(err) {
                        alert('Um erro ocorreu')
                    }
                }
            })
            setFriendships(newFriendships)
            setMessagesNotSeen(newUnseenMessages)
        }
    }

    useEffect(() => {
        function newFriendRequest(friendship: Friendship) {
            const newFriendsRequests = [...friendsRequests]
            newFriendsRequests.push(friendship)
            setFriendsRequests(newFriendsRequests)
        }
        function friendAccepted(friendship: Friendship) {
            const newMessagesNotSeen = {...messagesNotSeen}
            const newFriendshipsIds = [...friendshipsIds]

            newMessagesNotSeen[friendship.id * 1] = []
            newFriendshipsIds.push(friendship.id * 1)

            setMessagesNotSeen(newMessagesNotSeen)
            setFriendshipsIds(newFriendshipsIds)
            setFriendships([...friendships, friendship])
        }
        async function message(message: Message, id: number) {
            try {
                const index = friendshipsIds.indexOf(id * 1)
                const newFriendships = [...friendships]
                if (openedChatFriendship?.id == id && message.from !== me.id) {
                    console.log(`Caiu aq: ${me.name}`)
                    await api.get(`/friends/message/see/${id}/${message.id}`, {
                        headers: {
                            email: await AsyncStorage.getItem('email'),
                            token: await AsyncStorage.getItem('token')
                        }
                    })
                    newFriendships[index].messages.push({...message, seen: true})
                } else if (message.from !== me.id) {
                    newFriendships[index].messages.push(message)

                    const newUnseenMessages = {...messagesNotSeen}
                    newUnseenMessages[id * 1].push(message)
                    setMessagesNotSeen(newUnseenMessages)

                    let name: string
                    friendships[index].from
                    if (message.from === friendships[index].from.id) {
                        name = friendships[index].from.name
                    } else {
                        name = friendships[index].to.name
                    }
                    // presentNotificationAsync({
                    //     title: 'Nova mensagem!',
                    //     body: `${name}: ${message.content}`,
                    //     data: {
                    //         id,
                    //         messageId: message.id,
                    //         type: 'chat'
                    //     },
                    //     sound: false,
                    //     vibrate: [200]
                    // })
                } else {
                    newFriendships[index].messages.push(message)
                }
                setFriendships(newFriendships)
            } catch(err) {
                console.log(err)
                alert('Um erro ocorreu')
            }
        }
        function userConnected(id: number) {
            if (openedChatFriendship?.from.id === id || openedChatFriendship?.to.id === id) {
                const newFriendship = openedChatFriendship
                if (newFriendship.from.id === me.id) {
                    newFriendship.to.online = true
                } else {
                    newFriendship.from.online = true
                }
                setOpenedChatFriendship(newFriendship)
            }
            const newFriendships = [...friendships]
            newFriendships.map(friendship => {
                if (friendship.from.id === id) {
                    friendship.from.online = true
                }
                if (friendship.to.id === id) {
                    friendship.to.online = true
                }
            })
            setFriendships(newFriendships)
        }
        function userDisconnected(id: number) {
            if (openedChatFriendship?.from.id === id || openedChatFriendship?.to.id === id) {
                const newFriendship = openedChatFriendship
                if (newFriendship.from.id === me.id) {
                    newFriendship.to.online = false
                } else {
                    newFriendship.from.online = false
                }
                setOpenedChatFriendship(newFriendship)
            }
            const newFriendships = [...friendships]
            newFriendships.map(friendship => {
                if (friendship.from.id === id) {
                    friendship.from.online = false
                }
                if (friendship.to.id === id) {
                    friendship.to.online = false
                }
            })
            setFriendships(newFriendships)
        }
        
        if (socket) {
            socket.removeAllListeners()
            
            setTimeout(() => {
                socket.on('new-friend-request', newFriendRequest)
                socket.on('friend-accepted', friendAccepted)
                socket.on('message', message)
                socket.on('user-connected', userConnected)
                socket.on('user-disconnected', userDisconnected)
            }, 1)
        }
    }, [socket, openedChatFriendship, friendships, friendshipsIds])

    useEffect(() => {
        const subscribe = addNotificationResponseReceivedListener(async (resp) => {
            try {
                const { data } = resp.notification.request.content as any
                if (data.type === 'chat') {
                    const index: number = friendships.findIndex(friendship => friendship.id == data.id)

                    handleOpenChat(friendships[index])
                }
            } catch(err) {
                alert('Um erro ocorreu')
            }
        })
        return () => {
            subscribe.remove()
        }
    }, [friendships])

    useEffect(() => {
        async function run() {
            try {
                const email = await AsyncStorage.getItem('email')
                const token = await AsyncStorage.getItem('token')

                const { data: me } = await api.get('/user', {
                    headers: {
                        email,
                        token
                    }
                })
                if (me.error) {
                    alert(me.message)
                } else {
                    setMe(me)
                }

                const { data: newMessages } = await api.get('/friends/messages', {
                    headers: {
                        email,
                        token
                    }
                })
                if (newMessages.error) {
                    alert(newMessages.message)
                } else {
                    setFriendships(newMessages)
                    const newFriendshipsIds: Array<number> = []
                    const newMessagesNotSeen: MessagesNotSeen = {...messagesNotSeen}
                    newMessages.map((friendship: Friendship) => {
                        newFriendshipsIds.push(friendship.id * 1)
                        newMessagesNotSeen[friendship.id * 1] = friendship.messages.filter(message => !message.seen && message.from !== me.id)
                    })
                    setMessagesNotSeen(newMessagesNotSeen)
                    setFriendshipsIds(newFriendshipsIds)
                }

                const { data: newFriendsRequests } = await api.get('/friends/requests', {
                    headers: {
                        email,
                        token
                    }
                })
                setFriendsRequests(newFriendsRequests)

                setSocket(io(url, {
                    transportOptions: {
                        polling: {
                            extraHeaders: {
                                email,
                                token,
                                type: 'android'
                            }
                        }
                    }
                }))
            } catch(err) {
                alert('Um erro ocorreu')
            }
            setDidMount(true)
        }
        run()
    }, [])

    if (!didMount) {
        return <View style={[
            styles.container, 
            { 
                justifyContent: 'center',
                alignItems: 'center',
                width: Dimensions.get('window').width,
                height: (Dimensions.get('window').height / 100) * 94
            }]}>
            <ActivityIndicator
                color="#4c43df"
                size="large"
            />
        </View>
    }

    if (seeFriendsRequests) {
        return <FriendsRequests
            friendsRequests={friendsRequests}
            hide={setSeeFriendsRequests}
            setFriendsRequests={setFriendsRequests}
        />
    }

    if (openedChat) {
        if (openedChatFriendship) {
            if (socket) {
                return <Chat
                    friendship={openedChatFriendship}
                    setVisible={setOpenedChat}
                    me={me}
                    setChat={setOpenedChatFriendship}
                />
            }
        }
    }

    return <View style={[styles.container, {
        width: Dimensions.get('window').width,
        height: isLoaded ? (Dimensions.get('window').height / 100) * 86 : (Dimensions.get('window').height / 100) * 94
    }]}>
        <View style={styles.header}>
            <Text style={styles.text}>Chat</Text>
            <View style={styles.headerActionsContainer}>
                <RectButton onPress={handleAddFriend}>
                    <Feather
                        {...iconConfig}
                        name="user-plus"
                    />
                </RectButton>
                <RectButton onPress={handleSeeFriendsRequests}>
                    <Text style={styles.headerFriendsRequestsText}>{friendsRequests.length < 100 ? friendsRequests.length : 99}</Text>
                    <Feather
                        {...iconConfig}
                        name="users"
                    />
                </RectButton>
            </View>
        </View>
        <ScrollView style={styles.main}>
            {friendships.length === 0 ? <View style={styles.noFriendsContainer}>
                <Image
                    style={styles.noFriendsImage}
                    source={logo}
                />
                <Text style={styles.text}>Sem amigos em companhia?{'\n'}Adicione eles!</Text>
                <RectButton onPress={handleAddFriend}>
                    <Feather
                        {...iconConfig}
                        name="user-plus"
                    />
                </RectButton>
            </View> : null}
            {friendships.map(friendship => {
                let actualAvatar: any
                let actualUser: UserMessage
                let actualMessage: Message | null = null
                if (friendship.from.id === me.id) {
                    actualUser = friendship.to
                } else {
                    actualUser = friendship.from
                }
                if (actualUser.avatar) {
                    actualAvatar = { uri: `${url}/avatar/${actualUser.avatar}` }
                }
                if (friendship.messages[0]) {
                    actualMessage = friendship.messages[friendship.messages.length - 1]
                }
                return <RectButton style={styles.friendsButtons} key={friendship.id} onPress={handleOpenChat(friendship) as any}>
                <Image
                    style={styles.friendsImages}
                    source={actualAvatar ? actualAvatar : logo}
                />
                <View style={styles.friendsChatContainer}>
                    <View style={styles.friendsChatTextContainer}>
                        <Text style={styles.friendsChatText}>
                            {actualUser.name}
                        </Text>
                        {actualUser.type === 'android' && actualUser.online ? <Feather
                            name="smartphone"
                            size={15}
                            color="#28a745"
                        /> : <View style={[styles.friendsChatView, {
                            backgroundColor: actualUser.online ? '#28a745' : 'rgba(255, 255, 255, 0.2)'
                        }]}/>}
                    </View>
                    <View style={styles.friendsChatMessageContainer}>
                        <Text style={styles.friendsChatMessage}>{actualMessage ?
                        actualMessage.content :
                        ''}</Text>
                        {actualMessage ? <Text style={styles.friendsChatDate}>
                            {treatDate(actualMessage.date)}
                        </Text> : null}
                        {messagesNotSeen[friendship.id * 1].length > 0 ? <Text style={styles.friendsChatNewMessages}>
                            {messagesNotSeen[friendship.id * 1].length}
                        </Text> : null}
                    </View>
                </View>
            </RectButton>})}
        </ScrollView>
        <Modal
            transparent
            visible={addFriendModal}
        >
            <View style={styles.addFriendContainer}>
                <View style={styles.addFriendView}>
                    <View style={styles.addFriendHeader}>
                        <TouchableOpacity onPress={handleCloseAddFriend}>
                            <Feather
                                color="#000"
                                size={26}
                                name="x"
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.addFriendTitle}>Digite o id para adicionar!</Text>
                    <TextInput
                        keyboardType="number-pad"
                        placeholder="Id"
                        value={addFriendId}
                        onChangeText={setAddFriendId}
                        style={styles.addFriendInput}
                    />
                    {addFriendError.error ? <View style={styles.addFriendErrorContainer}>
                        <Text style={styles.text}>{addFriendError.message}</Text>
                    </View> : null}
                    {addFriendSucess ? <View style={styles.addFriendSuccessContainer}>
                        <Text style={styles.text}>Pedido enviado</Text>
                    </View> : null}
                    <TouchableOpacity style={styles.addFriendButton} onPress={handleSendAddFriend}>
                        <Text style={styles.text}>Adicionar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    </View>
}

export default ChatContainer