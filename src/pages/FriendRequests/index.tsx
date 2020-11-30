import React from 'react'
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity
} from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-community/async-storage'

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

interface FriendsRequestsProps {
    friendsRequests: Array<Friendship>
    hide: Function
    setFriendsRequests: Function
}

function FriendsRequests(props: FriendsRequestsProps): JSX.Element {

    function handleGoBack() {
        props.hide(false)
    }

    function handleAddFriend(id: number, idUser: number): Function {
        return async function() {
            try {
                const index = props.friendsRequests.findIndex(friendRequest => friendRequest.id === id)
                const { data } = await api.post('/friends/send', {
                    id: idUser
                }, {
                    headers: {
                        email: await AsyncStorage.getItem('email'),
                        token: await AsyncStorage.getItem('token')
                    }
                })
                if (data.error) {
                    alert(data.message)
                } else if (data.sucess) {
                    const newFriendsRequests = [...props.friendsRequests]
                    newFriendsRequests.splice(index, 1)
                    props.setFriendsRequests(newFriendsRequests)
                }
            } catch(err) {
                alert('Um erro ocorreu')
            }
        }
    }

    return <View style={styles.container}>
        <View style={styles.header}>
            <RectButton onPress={handleGoBack}>
                <Feather
                    name="arrow-left"
                    color="#d9dadc"
                    size={26}
                />
            </RectButton>
        </View>
        <View style={styles.main}>
            {props.friendsRequests.length === 0 ? <View style={styles.mainNoFriendsRequests}>
                <Image source={logo}/>
                <Text style={styles.mainNoFriendsRequestsText}>Você não tem pedidos de amizade</Text>
            </View> : null}
            <ScrollView style={styles.mainScrollView}>
                {props.friendsRequests.map(friendRequest => <View key={friendRequest.id} style={styles.mainUserContainer}>
                    <View style={styles.mainUserInfoContainer}>
                        <Image
                            style={styles.mainUserAvatar}
                            source={friendRequest.from.avatar ? { uri: `${url}/avatar/${friendRequest.from.avatar}` } : logo}
                        />
                        <Text style={styles.mainUserName}>{friendRequest.from.name}</Text>
                    </View>
                    <TouchableOpacity onPress={handleAddFriend(friendRequest.id, friendRequest.from.id) as any}>
                        <Feather
                            name="user-plus"
                            size={26}
                            color="#d9dadc"
                        />
                    </TouchableOpacity>
                </View>)}
            </ScrollView>
        </View>
    </View>
}

export default FriendsRequests