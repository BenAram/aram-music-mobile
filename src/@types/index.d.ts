declare module '*.png'
declare interface Music {
    access: number
    description: string
    keywords: Array<string>
    name: string
    name_upload: string
    type: string
    user_owner: {
        avatar: string
        name: string
        id: number
    }
    music_background: string
    createdAt: string
    id: number
}
declare interface AVPlaybackStatus {
    androidImplementation?: string
    didJustFinish?: boolean
    durationMillis?: number
    isBuffering?: boolean
    isLoaded?: boolean
    isLooping?: boolean
    isMuted?: boolean
    isPlaying?: boolean
    playableDurationMillis?: number
    positionMillis?: number
    progressUpdateIntervalMillis?: number
    rate?: number
    shouldCorrectPitch?: boolean
    shouldPlay?: boolean
    uri?: string
    volume?: number
}
declare interface Playlist {
    name: string
    musics: Array<Music>
    public: boolean
    id: number
    editable: boolean
    owner: string
    owner_id: number
}
declare interface StoreStatePlaylist {
    isPlaylist: boolean
    musics: Array<Music>
    index: number
    updates: number
    name: string
}