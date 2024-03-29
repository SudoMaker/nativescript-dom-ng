import { ScrollView } from '@nativescript/core'
import { named } from './mixin.js'
import { makeContentView } from './ContentView.js'

export const makeScrollView = /*#__PURE__*/named(
	'ScrollView', 'ScrollView', ScrollView,
	(_, options) => class ScrollViewElement extends /*#__PURE__*/makeContentView(_, options) {}
)

export default /*#__PURE__*/makeScrollView.master()
