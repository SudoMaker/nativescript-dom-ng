import { ListPicker } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeListPicker = /*#__PURE__*/named(
	'ListPicker', 'ListPicker', ListPicker,
	(_, options) => class ListPickerElement extends /*#__PURE__*/makeView(_, options) {}
)

export default /*#__PURE__*/makeListPicker.master()
