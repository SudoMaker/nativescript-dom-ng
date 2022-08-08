import { SearchBar } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeSearchBar = named(
	'SearchBar', 'SearchBar', SearchBar,
	_ => class SearchBarElement extends makeView(_) {}
)

export default makeSearchBar()
