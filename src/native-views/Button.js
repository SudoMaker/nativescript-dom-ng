import { Button } from '@nativescript/core'
import { named, makeText } from './mixin.js'

export const makeButton = /*#__PURE__*/named(
	'Button', 'Button', Button,
	_ => class ButtonElement extends /*#__PURE__*/makeText(_) {}
)

export default /*#__PURE__*/makeButton.master()
