import { Span } from '@nativescript/core'
import { named, makeText } from './mixin.js'

export const makeSpan = /*#__PURE__*/named(
	'Span', 'Span', Span,
	(_, options) => class SpanElement extends /*#__PURE__*/makeText(_, Object.assign({}, options, {force: true})) {}
)

export default /*#__PURE__*/makeSpan.master()
