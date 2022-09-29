import { Span } from '@nativescript/core'
import { named, makeText } from './mixin.js'

export const makeSpan = named(
	'Span', 'Span', Span,
	_ => class SpanElement extends makeText(_, {force: true}) {}
)

export default makeSpan.master()
