import { Switch } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeSwitch = /*#__PURE__*/named(
	'Switch', 'Switch', Switch,
	(_, options) => class SwitchElement extends /*#__PURE__*/makeView(_, options) {}
)

export default /*#__PURE__*/makeSwitch.master()
