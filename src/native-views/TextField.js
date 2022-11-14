import { TextField } from '@nativescript/core'
import { named, makeEditableText } from './mixin.js'

export const makeTextField = /*#__PURE__*/named(
	'TextField', 'TextField', TextField,
	_ => class TextFieldElement extends /*#__PURE__*/makeEditableText(_) {}
)

export default /*#__PURE__*/makeTextField.master()
