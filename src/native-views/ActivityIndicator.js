import { ActivityIndicator } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeActivityIndicator = /*#__PURE__*/named(
	'ActivityIndicator', 'ActivityIndicator', ActivityIndicator,
	_ => class ActivityIndicatorElement extends /*#__PURE__*/makeView(_) {}
)

export default /*#__PURE__*/makeActivityIndicator.master()
