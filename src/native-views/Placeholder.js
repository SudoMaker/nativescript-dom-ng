import { Placeholder } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makePlaceholder = named(
	'Placeholder', 'Placeholder', Placeholder,
	_ => class PlaceholderElement extends makeView(_) {}
)

export default makePlaceholder.master()
