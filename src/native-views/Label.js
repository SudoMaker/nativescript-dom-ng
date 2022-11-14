import { Label } from '@nativescript/core'
import { named, makeText } from './mixin.js'

export const makeLabel = /*#__PURE__*/named(
	'Label', 'Label', Label,
	_ => class LabelElement extends /*#__PURE__*/makeText(_) {}
)

export default /*#__PURE__*/makeLabel.master()
