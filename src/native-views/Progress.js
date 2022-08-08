import { Progress } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeProgress = named(
	'Progress', 'Progress', Progress,
	_ => class ProgressElement extends makeView(_) {}
)

export default makeProgress()
