import { TextView } from '@nativescript/core'
import { named, makeEditableText } from './mixin.js'

export const makeTextView = /*#__PURE__*/named(
	'TextView', 'TextView', TextView,
	_ => class TextViewElement extends /*#__PURE__*/makeEditableText(_) {}
)

export default /*#__PURE__*/makeTextView.master()
