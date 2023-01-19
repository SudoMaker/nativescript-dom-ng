import { ContentView } from '@nativescript/core'
import { named, makeView } from './mixin.js'
import { mergeProps } from '../utils.js'

export const makeContentView = /*#__PURE__*/named(
	'ContentView', 'ContentView', ContentView,
	(_, options) => class ContentViewElement extends /*#__PURE__*/makeView(_, mergeProps({childrenPolicy: 'content'}, options)) {}
)

export default /*#__PURE__*/makeContentView.master()
