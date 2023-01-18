import { Placeholder } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makePlaceholder = /*#__PURE__*/named(
	'Placeholder', 'Placeholder', Placeholder,
	(_, options) => class PlaceholderElement extends /*#__PURE__*/makeView(_, options) {}
)

export default /*#__PURE__*/makePlaceholder.master()
