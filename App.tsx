import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react'
import { AppLoading } from 'expo'
import {
  View,
  Modal,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking
} from 'react-native'
import { 
  Nunito_400Regular, 
  Nunito_600SemiBold, 
  Nunito_700Bold, 
  useFonts
} from '@expo-google-fonts/nunito'
import { Provider } from 'react-redux'
import { StatusBar } from 'expo-status-bar'
import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-community/async-storage'

import api from './src/services/api'
import url from './src/services/url'

import Stack from './src/navigator/Stack'

import store from './src/store'

import styles from './styles'

interface News {
  version: string
  content: Array<{
      title: string
      content: {
          type: 'list' | 'body'
          value: string | Array<string>
      }
  }>
}

interface Content {
  title: string
  content: {
      type: 'list' | 'body'
      value: string | Array<string>
  }
}

export default function App(): JSX.Element {
  const [fontsLoaded] = useFonts({
    Nunito400: Nunito_400Regular,
    Nunito600: Nunito_600SemiBold,
    Nunito700: Nunito_700Bold
  })

  const actualVersion = '0.2.3'

  const [news, setNews] = useState<News>()
  const [downloadable, setDownloadable] = useState<boolean>(false)
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  function getNewsItem(content2: Content): JSX.Element {
    const content: any = content2.content
    switch (content.type) {
      case 'list':
        return content.value.map((value: any) => {
          return <View style={styles.listItem} key={value}>
            <View
              style={styles.listMarker}
            ></View><Text>{value}</Text>
          </View>
        })
      case 'body':
        return <Text>{content.value}</Text>
      default:
        return <View/>
    }
  }

  function closeModal(): void {
    setModalVisible(false)
  }

  function downloadNewVersion(): void {
    Linking.openURL(`${url}/download`)
  }

  useEffect(() => {
    async function run() {
      try {
        const { data: AppNews } = await api.get('/news')
        const exists = await AsyncStorage.getItem(AppNews.version)
        setNews(AppNews)
        if (!exists) {
          await AsyncStorage.setItem(AppNews.version, 'true')
          setModalVisible(true)
        }
        if (AppNews.version > actualVersion) {
          setModalVisible(true)
          setDownloadable(true)
        }
      } catch(err) {
        setModalVisible(false)
      }
    }
    run()
  }, [])

  if (!fontsLoaded) {
    return <AppLoading />
  } else {
    return <View style={{ flex: 1 }}>
      <Provider
        store={store}
      >
        <StatusBar style="light" hidden translucent />
        <Stack />
        <Modal
          transparent
          visible={modalVisible}
        >
          <View
            style={styles.modalContainer}
          >
            <View
              style={styles.newsContainer}
            >
              <View
                style={styles.newsHeader}
              >
                <Text
                  style={styles.newsTitle}
                >{news ? news.version <= actualVersion ? 'Novidades' : 'Nova atualização disponível' : null}</Text>
                <TouchableOpacity
                  onPress={closeModal}
                >
                  <Feather
                    name="x"
                    size={26}
                    color="#4c43df"
                  />
                </TouchableOpacity>
              </View>
              <ScrollView
                style={{ padding: 10 }}
              >
                {news ? news.content.map(newItem => <View
                  key={newItem.title}
                  style={styles.newsItem}
                >
                  <Text
                    style={styles.newsTitle}
                  >{newItem.title}</Text>
                  {getNewsItem(newItem)}
                </View>) : null}
              </ScrollView>
              {downloadable ? <TouchableOpacity
                onPress={downloadNewVersion}
              >
                <Text
                  style={styles.downloadButtonText}
                >Baixar nova versão aqui</Text>
              </TouchableOpacity> : null}
            </View>
          </View>
        </Modal>
      </Provider>
    </View>
  }
}