import { Progress } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeProgress = /*#__PURE__*/named(
	'Progress', 'Progress', Progress,
	_ => class ProgressElement extends /*#__PURE__*/makeView(_) {}
)

export default /*#__PURE__*/makeProgress.master()
