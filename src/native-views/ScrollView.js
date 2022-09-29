import { ScrollView } from '@nativescript/core'
import { named } from './mixin.js'
import { makeContentView } from './ContentView.js'

export const makeScrollView = named(
	'ScrollView', 'ScrollView', ScrollView,
	_ => class ScrollViewElement extends makeContentView(_) {}
)

export default makeScrollView.master()
