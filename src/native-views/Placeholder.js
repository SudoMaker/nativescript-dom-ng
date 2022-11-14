import { Placeholder } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makePlaceholder = /*#__PURE__*/named(
	'Placeholder', 'Placeholder', Placeholder,
	_ => class PlaceholderElement extends /*#__PURE__*/makeView(_) {}
)

export default /*#__PURE__*/makePlaceholder.master()
