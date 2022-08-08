import { TextField } from '@nativescript/core'
import { named, makeEditableText } from './mixin.js'

export const makeTextField = named(
	'TextField', 'TextField', TextField,
	_ => class TextFieldElement extends makeEditableText(_) {}
)

export default makeTextField()
