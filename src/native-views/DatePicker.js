import { DatePicker } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeDatePicker = named(
	'DatePicker', 'DatePicker', DatePicker,
	_ => class DatePickerElement extends makeView(_) {}
)

export default makeDatePicker()
