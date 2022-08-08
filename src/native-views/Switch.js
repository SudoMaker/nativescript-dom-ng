import { Switch } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeSwitch = named(
	'Switch', 'Switch', Switch,
	_ => class SwitchElement extends makeView(_) {}
)

export default makeSwitch()
