import { ListPicker } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeListPicker = named(
	'ListPicker', 'ListPicker', ListPicker,
	_ => class ListPickerElement extends makeView(_) {}
)

export default makeListPicker()
