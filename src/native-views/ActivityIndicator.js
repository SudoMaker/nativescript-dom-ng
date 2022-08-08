import { ActivityIndicator } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeActivityIndicator = named(
	'ActivityIndicator', 'ActivityIndicator', ActivityIndicator,
	_ => class ActivityIndicatorElement extends makeView(_) {}
)

export default makeActivityIndicator()
