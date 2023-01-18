import { SearchBar } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeSearchBar = /*#__PURE__*/named(
	'SearchBar', 'SearchBar', SearchBar,
	(_, options) => class SearchBarElement extends /*#__PURE__*/makeView(_, options) {}
)

export default /*#__PURE__*/makeSearchBar.master()
