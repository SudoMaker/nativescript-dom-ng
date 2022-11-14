import { Switch } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeSwitch = /*#__PURE__*/named(
	'Switch', 'Switch', Switch,
	_ => class SwitchElement extends /*#__PURE__*/makeView(_) {}
)

export default /*#__PURE__*/makeSwitch.master()
