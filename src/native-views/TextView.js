import { TextView } from '@nativescript/core'
import { named, makeEditableText } from './mixin.js'

export const makeTextView = /*#__PURE__*/named(
	'TextView', 'TextView', TextView,
	(_, options) => class TextViewElement extends /*#__PURE__*/makeEditableText(_, options) {}
)

export default /*#__PURE__*/makeTextView.master()
