import { ListPicker } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeListPicker = /*#__PURE__*/named(
	'ListPicker', 'ListPicker', ListPicker,
	_ => class ListPickerElement extends /*#__PURE__*/makeView(_) {}
)

export default /*#__PURE__*/makeListPicker.master()
