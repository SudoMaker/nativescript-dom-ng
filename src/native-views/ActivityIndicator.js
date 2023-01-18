import { ActivityIndicator } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeActivityIndicator = /*#__PURE__*/named(
	'ActivityIndicator', 'ActivityIndicator', ActivityIndicator,
	(_, options) => class ActivityIndicatorElement extends /*#__PURE__*/makeView(_, options) {}
)

export default /*#__PURE__*/makeActivityIndicator.master()
