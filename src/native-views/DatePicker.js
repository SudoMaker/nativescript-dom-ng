import { DatePicker } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeDatePicker = /*#__PURE__*/named(
	'DatePicker', 'DatePicker', DatePicker,
	_ => class DatePickerElement extends /*#__PURE__*/makeView(_) {}
)

export default /*#__PURE__*/makeDatePicker.master()
