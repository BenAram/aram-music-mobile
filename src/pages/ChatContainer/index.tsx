import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
    Dimensions,
    ActivityIndicator,
    View,
    Text,
    ScrollView,
    Image,
    Modal,
    TouchableOpacity,
    TextInput,
    Vibration
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { RectButton } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { Feather } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import { Modalize } from 'react-native-modalize'
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

interface UserConfig {
    notifications: boolean
    id: number
}

interface UsersConfig {
    [index: number]: UserConfig
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
    const [myRequests, setMyRequests] = useState<Array<Friendship>>([])
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

    const [actualUserConfig, setActualUserConfig] = useState<UserConfig>()

    const userConfigModalize = useRef<Modalize>()

    function removeFriendButton(id: number): Function {
        return function(): JSX.Element {
            return <RectButton onPress={handleRemoveFriend(id) as any} style={styles.removeFriendButton}>
                <Feather
                    name="user-minus"
                    color="#d9dadc"
                    size={30}
                />
            </RectButton>
        }
    }

    function handleRemoveFriend(id: number) {
        return async function() {
            try {
                const { data } = await api.delete(`/friends/${id}`, {
                    headers: {
                        email: await AsyncStorage.getItem('email'),
                        token: await AsyncStorage.getItem('token')
                    }
                })
                if (data.error) {
                    alert(data.message)
                }
            } catch(err) {
                alert('Um erro ocorreu')
            }
        }
    }

    function handleOpenUserConfig(id: number): Function {
        return async function() {
            try {
                const usersConfigJSON = await AsyncStorage.getItem('users-config')
                let usersConfig: UsersConfig
                if (usersConfigJSON) {
                    usersConfig = JSON.parse(usersConfigJSON)
                    if (usersConfig[id]) {
                        setActualUserConfig(usersConfig[id])
                    } else {
                        usersConfig[id] = {
                            notifications: true,
                            id
                        }
                        setActualUserConfig(usersConfig[id])
                        await AsyncStorage.setItem('users-config', JSON.stringify(usersConfig))
                    }
                } else {
                    usersConfig = {}
                    usersConfig[id] = {
                        notifications: true,
                        id
                    }
                    await AsyncStorage.setItem('users-config', JSON.stringify(usersConfig))
                    setActualUserConfig(usersConfig[id])
                }
                Vibration.vibrate(200)
                userConfigModalize.current?.open()
            } catch(err) {
                alert('Um erro ocorreu')
            }
        }
    }

    async function handleToggleUserNotification() {
        try {
            const newActualUserConfig: UserConfig = {
                id: actualUserConfig?.id || 1,
                notifications: !actualUserConfig?.notifications
            }

            const usersConfigJSON = await AsyncStorage.getItem('users-config')
            if (usersConfigJSON) {
                const usersConfig = JSON.parse(usersConfigJSON)
                usersConfig[newActualUserConfig.id] = newActualUserConfig
                await AsyncStorage.setItem('users-config', JSON.stringify(usersConfig))
            }

            userConfigModalize.current?.close()
        } catch(err) {
            alert('Um erro ocorreu')
        }
    }

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

    const newMyRequest = useCallback((friendship: Friendship) => {
        setMyRequests([...myRequests, friendship])
    }, [myRequests])
    const newFriendRequest = useCallback((friendship: Friendship) => {
        setFriendsRequests([...friendsRequests, friendship])
    }, [friendsRequests])
    const friendAccepted = useCallback((friendship: Friendship) => {
        const newMessagesNotSeen = {...messagesNotSeen}
        newMessagesNotSeen[friendship.id * 1] = []
        setMessagesNotSeen(newMessagesNotSeen)

        setFriendships([...friendships, friendship])
    }, [messagesNotSeen, friendships])
    const message = useCallback(async (message: Message, id: number) => {
        try {
            const index = friendships.findIndex(friendship => friendship.id === id * 1)
            const newFriendships = [...friendships]
            if (openedChatFriendship?.id == id && message.from !== me.id) {
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
                const usersConfigJSON = await AsyncStorage.getItem('users-config')
                let usersConfig: UsersConfig = {}
                usersConfig[message.from] = {
                    id: message.from,
                    notifications: true
                }
                if (usersConfigJSON) {
                    usersConfig = JSON.parse(usersConfigJSON)
                }
                if (usersConfig[message.from].notifications) {
                    presentNotificationAsync({
                        title: 'Nova mensagem!',
                        body: `${name}: ${message.content}`,
                        data: {
                            id,
                            messageId: message.id,
                            type: 'chat'
                        },
                        sound: false,
                        vibrate: [200]
                    })
                }
            } else {
                newFriendships[index].messages.push(message)
            }
            setFriendships(newFriendships)
        } catch(err) {
            console.log(err)
            alert('Um erro ocorreu')
        }
    }, [friendships, messagesNotSeen, openedChatFriendship])
    const messageDeleted = useCallback((messageId: number, id: number) => {
        const newFriendships = [...friendships]
        const friendship = newFriendships.find(friendship => friendship.id == id)
        
        const index = friendship?.messages.findIndex(message => message.id == messageId)
        if (index !== -1 && index !== undefined) {
            friendship?.messages.splice(index, 1)
            setFriendships(newFriendships)
        }
    }, [friendships])
    const newName = useCallback((id: number, newName: string) => {
        const newFriendships = [...friendships]

        const index1 = newFriendships.findIndex(friendship => friendship.from.id == id)
        const index2 = newFriendships.findIndex(friendship => friendship.to.id == id)

        if (index1 !== -1) {
            newFriendships[index1].from.name = newName
        }
        if (index2 !== -1) {
            newFriendships[index2].to.name = newName
        }

        setFriendships(newFriendships)
    }, [friendships])
    const newAvatar = useCallback((id: number, avatar: string) => {
        const newFriendships = [...friendships]

        const index1 = newFriendships.findIndex(friendship => friendship.from.id == id)
        const index2 = newFriendships.findIndex(friendship => friendship.to.id == id)

        if (index1 !== -1) {
            newFriendships[index1].from.avatar = avatar
        }
        if (index2 !== -1) {
            newFriendships[index2].to.name = avatar
        }

        setFriendships(newFriendships)
    }, [friendships])
    const userConnected = useCallback((id: number) => {
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
    }, [friendships, openedChatFriendship])
    const userDisconnected = useCallback((id: number) => {
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
    }, [friendships, openedChatFriendship])
    const userDeleted = useCallback((id: number) => {
        const newFriendships = [...friendships]

        const index = newFriendships.findIndex(friendship => (friendship.from.id == id || friendship.to.id == id))
        if (index === -1) {
            const newFriendsRequests = [...friendsRequests]
            const index = newFriendsRequests.findIndex(friendship => friendship.from.id == id)
            if (index === -1) {
                const newMyRequests = [...myRequests]
                const index = newMyRequests.findIndex(friendship => friendship.to.id == id)
                if (index === -1) {
                    return
                }
                newMyRequests.splice(index, 1)
                setMyRequests(newMyRequests)
            }
            newFriendsRequests.splice(index, 1)
            setFriendsRequests(newFriendsRequests)
        }
        if (openedChatFriendship === friendships[index]) {
            setOpenedChat(false)
            setOpenedChatFriendship(null)
        }

        newFriendships.splice(index, 1)
        setFriendships(newFriendships)
    }, [friendships, openedChatFriendship, friendsRequests])
    const friendDeleted = useCallback((id: number, type: string) => {
        switch (type) {
            case 'friendship':
                const newFriendships = [...friendships]
                const index = newFriendships.findIndex(friendship => friendship.id == id)
                if (index === -1) {
                    return
                }
                newFriendships.splice(index, 1)
                return
            case 'request':
                const newFriendsRequests = [...friendsRequests]
                const index2 = newFriendsRequests.findIndex(friendship => friendship.id == id)
                if (index2 === -1) {
                    return
                }
                newFriendsRequests.splice(index2, 1)
                setFriendsRequests(newFriendsRequests)
                return
            case 'my-request':
                const newMyRequests = [...myRequests]
                const index3 = newMyRequests.findIndex(friendship => friendship.id == id)
                if (index3 === -1) {
                    return
                }
                newMyRequests.splice(index3, 1)
                setMyRequests(newMyRequests)
                return
            default:
                return
        }
    }, [friendships, myRequests, friendsRequests])

    useEffect(() => {
        if (socket) {
            socket.on('new-my-request', newMyRequest)
            socket.on('new-friend-request', newFriendRequest)
            socket.on('friend-accepted', friendAccepted)
            socket.on('message', message)
            socket.on('message-deleted', messageDeleted)
            socket.on('new-name', newName)
            socket.on('new-avatar', newAvatar)
            socket.on('user-connected', userConnected)
            socket.on('user-disconnected', userDisconnected)
            socket.on('user-deleted', userDeleted)
            socket.on('friend-deleted', friendDeleted)
        }
    }, [socket])

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
                }

                const { data: newFriendsRequests } = await api.get('/friends/requests', {
                    headers: {
                        email,
                        token
                    }
                })
                setFriendsRequests(newFriendsRequests.requests)
                setMyRequests(newFriendsRequests.myRequests)

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
            setFriendsRequests={setFriendsRequests}
            myRequests={myRequests}
            hide={setSeeFriendsRequests}
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

    const Header = useCallback(() => {
        return <View style={styles.header}>
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
    }, [friendsRequests])

    const FriendsList = useCallback(() => {
        return <ScrollView style={styles.main}>
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
        {friendships.sort((friendship1, friendship2) => {
            if (!friendship1.messages[0]) {
                return -1
            }
            if (!friendship2.messages[0]) {
                return 1
            }

            const time1 = new Date(friendship1.messages[friendship1.messages.length - 1].date).getTime()
            const time2 = new Date(friendship2.messages[friendship2.messages.length - 1].date).getTime()

            if (time1 > time2) {
                return -1
            }
            if (time1 < time2) {
                return 1
            }
            if (time1 === time2) {
                return 0
            }
            return 0
        }).map(friendship => {
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
            return <Swipeable
                    containerStyle={styles.friendsSwipeable}
                    childrenContainerStyle={{ flex: 1, backgroundColor: '#3e3e3e' }}
                    leftThreshold={40}
                    key={friendship.id}
                    renderRightActions={removeFriendButton(friendship.id) as any}
                >
                    <TouchableOpacity
                        style={styles.friendsButtons}
                        onPress={handleOpenChat(friendship) as any}
                        onLongPress={handleOpenUserConfig(actualUser.id) as any}
                    >
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
                    </TouchableOpacity>
                </Swipeable>
                })}
        </ScrollView>
    }, [friendships])

    return <View style={[styles.container, {
        width: Dimensions.get('window').width,
        height: isLoaded ? (Dimensions.get('window').height / 100) * 86 : (Dimensions.get('window').height / 100) * 94
    }]}>
        <Header/>
        <FriendsList/>
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
        <Modalize
            ref={userConfigModalize}
            snapPoint={60}
            modalHeight={60}
            modalStyle={{
                backgroundColor: '#3e3e3e'
            }}
        >
            <View style={styles.modalizeContainer}>
                <RectButton style={styles.modalizeButton} onPress={handleToggleUserNotification}>
                    <Feather
                        name={actualUserConfig?.notifications ? 'bell-off' : 'bell'}
                        size={26}
                        color="#d9dadc"
                    />
                    <View style={styles.modalizeButtonDivider}/>
                    <Text style={styles.modalizeButtonText}>{actualUserConfig?.notifications ? 'Desativar notificações' : 'Ativar notificações'}</Text>
                </RectButton>
            </View>
        </Modalize>
    </View>
}

export default ChatContainer