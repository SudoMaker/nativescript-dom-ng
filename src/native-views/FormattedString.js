import { FormattedString, Span } from '@nativescript/core'
import { named, makeView } from './mixin.js'
import { addToArrayProp, removeFromArrayProp } from '../utils.js'
import * as symbol from '../symbols.js'

export const makeFormattedString = named(
	'FormattedString', 'FormattedString', FormattedString,
	_ => class FormattedStringElement extends makeView(_) {
		[symbol.onInsertChild](child, ref) {
			if (!child[symbol.isNative] || (ref && !ref[symbol.isNative])) return super[symbol.onInsertChild](child, ref)

			if (!(child instanceof Span)) return
			if (ref && !(ref instanceof Span)) ref = null

			addToArrayProp(this, 'spans', child, ref)

			super[symbol.onInsertChild](child, ref)
		}

		[symbol.onRemoveChild](child) {
			if (!child[symbol.isNative]) return super[symbol.onRemoveChild](child)
			if (!(child instanceof Span)) return

			removeFromArrayProp(this, 'spans', child)

			super[symbol.onRemoveChild](child)
		}
	}
)

export default makeFormattedString()
