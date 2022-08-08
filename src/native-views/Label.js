import { Label } from '@nativescript/core'
import { named, makeText } from './mixin.js'

export const makeLabel = named(
	'Label', 'Label', Label,
	_ => class LabelElement extends makeText(_) {}
)

export default makeLabel()
