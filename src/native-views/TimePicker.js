import { TimePicker } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeTimePicker = named(
	'TimePicker', 'TimePicker', TimePicker,
	_ => class TimePickerElement extends makeView(_) {}
)

export default makeTimePicker()
