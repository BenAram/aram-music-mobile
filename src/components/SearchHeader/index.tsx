import React, { useState } from 'react'
import {
    View,
    TextInput,
    TouchableOpacity
} from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useDispatch } from 'react-redux'

import styles from './styles'

interface SearchHeaderProps {
    goBackButton?: boolean
}

function SearchHeader(props: SearchHeaderProps): JSX.Element {
    
    const route = useRoute()
    const navigation = useNavigation()

    const dispatch = useDispatch()

    const [searchText, setSearchText] = useState<string>('')

    function search(): void {
        dispatch({ type: 'change-search', actualSearch: {
            type: 'search',
            value: searchText
        } })
        if (route.name !== 'list-musics') {
            navigation.navigate('list-musics')
        }
    }

    function goBack(): void {
        navigation.goBack()
    }

    return <View style={styles.searchContainer}>
        {props.goBackButton ? <TouchableOpacity
                onPress={goBack}
                style={styles.goBackButton}
            >
            <Feather
                name="arrow-left"
                color="#d9dadc"
                size={50}
            />
        </TouchableOpacity> : null}
        <TextInput
            style={styles.input}
            placeholder="Pesquisa uma música."
            value={searchText}
            onEndEditing={search}
            onChangeText={txt => setSearchText(txt)}
        />
        <RectButton
            onPress={search}
        >
            <Feather
                name="search"
                color="#d9dadc"
                size={30}
            />
        </RectButton>
    </View>
}

export default SearchHeader