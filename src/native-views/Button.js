import { Button } from '@nativescript/core'
import { named, makeText } from './mixin.js'

export const makeButton = named(
	'Button', 'Button', Button,
	_ => class ButtonElement extends makeText(_) {}
)

export default makeButton()
