import { TextView } from '@nativescript/core'
import { named, makeEditableText } from './mixin.js'

export const makeTextView = named(
	'TextView', 'TextView', TextView,
	_ => class TextViewElement extends makeEditableText(_) {}
)

export default makeTextView.master()
