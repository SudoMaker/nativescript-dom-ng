import { Span } from '@nativescript/core'
import { named, makeText } from './mixin.js'

export const makeSpan = /*#__PURE__*/named(
	'Span', 'Span', Span,
	_ => class SpanElement extends /*#__PURE__*/makeText(_, {force: true}) {}
)

export default /*#__PURE__*/makeSpan.master()
