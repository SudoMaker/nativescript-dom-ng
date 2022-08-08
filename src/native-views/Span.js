import { Span } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeSpan = named(
	'Span', 'Span', Span,
	_ => class SpanElement extends makeView(_) {}
)

export default makeSpan()
