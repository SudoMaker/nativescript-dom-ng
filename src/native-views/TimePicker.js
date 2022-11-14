import { TimePicker } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeTimePicker = /*#__PURE__*/named(
	'TimePicker', 'TimePicker', TimePicker,
	_ => class TimePickerElement extends /*#__PURE__*/makeView(_) {}
)

export default /*#__PURE__*/makeTimePicker.master()
