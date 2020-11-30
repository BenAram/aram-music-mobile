import React from 'react'
import {
    View
} from 'react-native'

import styles from './styles'

function Divider(props: any): JSX.Element {
    return <View style={[styles.divider, props.style ? props.style : {}]} />
}

export default Divider