import { createStore, Store, combineReducers } from 'redux'
import { Audio } from 'expo-av'

interface StoreStateMusic {
    isLoaded: boolean
    sound: Audio.Sound
    actualMusic: Music | number | null
}

interface StoreStateSearch {
    type: string
    value: String
}

Audio.setAudioModeAsync({
    staysActiveInBackground: true,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS
})

const INITIAL_STATE_MUSIC: StoreStateMusic = {
    isLoaded: false,
    sound: new Audio.Sound(),
    actualMusic: {
        name: '',
        access: 0,
        description: '',
        keywords: [''],
        music_background: '',
        name_upload: '',
        type: '',
        user_owner: {
            name: '',
            avatar: ''
        }
    }
}

const INITIAL_STATE_ACTUAL_SEARCH: StoreStateSearch = {
    type: '',
    value: ''
}

const INITIAL_STATE_PLAYLIST: StoreStatePlaylist = {
    isPlaylist: false,
    musics: [],
    updates: 0,
    index: 0,
    name: ''
}

const INITIAL_STATE_MUSIC_TO_EDIT: Music | number | null = null

const INITIAL_STATE_PLAYLIST_TO_EDIT: Playlist = {
    name: '',
    musics: [],
    public: false
}

function music(state = INITIAL_STATE_MUSIC, actions: any) {
    switch (actions.type) {
        case 'toggle':
            state.isLoaded = !state.isLoaded
            return state
        case 'turn-off':
            state.isLoaded = false
            return state
        case 'turn-on':
            state.isLoaded = true
            return state
        case 'change-music':
            state.actualMusic = actions.music
            return state
        default:
            return state
    }
}

function actualSearch(state = INITIAL_STATE_ACTUAL_SEARCH, actions: any) {
    switch (actions.type) {
        case 'change-search':
        return {
            type: actions.actualSearch.type,
            value: actions.actualSearch.value
        }
        default:
            return state
    }
}
function musicToEdit(state = INITIAL_STATE_MUSIC_TO_EDIT, actions: any) {
    switch (actions.type) {
        case 'change-music-to-edit':
            return actions.music
        case 'clean-music-to-edit':
            return {}
        default:
            return state
    }
}

function playlistToEdit(state = INITIAL_STATE_PLAYLIST_TO_EDIT, actions: any) {
    switch (actions.type) {
        case 'active-playlist-to-edit':
            return actions.playlist
        case 'clean-playlist-to-edit':
            return INITIAL_STATE_PLAYLIST_TO_EDIT
        default:
            return INITIAL_STATE_PLAYLIST_TO_EDIT
    }
}

function playlist(state = INITIAL_STATE_PLAYLIST, actions: any) {
    switch (actions.type) {
        case 'active-playlist':
            return {
                ...state,
                isPlaylist: true,
                musics: actions.musics,
                name: actions.name
            }
        case 'update-playlist':
            return {
                ...state,
                updates: state.updates + 1
            }
        case 'up-playlist':
            return {
                ...state,
                index: state.index + 1
            }
        case 'down-playlist':
            return {
                ...state,
                index: state.index - 1
            }
        case 'clean-playlist':
            return INITIAL_STATE_PLAYLIST
        default:
            return state
    }
}

const reducers = combineReducers({
    music,
    musicToEdit,
    actualSearch,
    playlist,
    playlistToEdit
})

const store: Store = createStore(reducers)

export default store