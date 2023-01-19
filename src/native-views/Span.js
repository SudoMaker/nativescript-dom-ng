import { Span } from '@nativescript/core'
import { named, makeText } from './mixin.js'
import { mergeProps } from '../utils.js'

export const makeSpan = /*#__PURE__*/named(
	'Span', 'Span', Span,
	(_, options) => class SpanElement extends /*#__PURE__*/makeText(_, mergeProps({force: true}, options)) {}
)

export default /*#__PURE__*/makeSpan.master()
