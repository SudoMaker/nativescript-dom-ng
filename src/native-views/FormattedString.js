import { FormattedString, Span } from '@nativescript/core'
import { named, makeView } from './mixin.js'
import { addToArrayProp, removeFromArrayProp } from '../utils.js'

export const makeFormattedString = named(
	'FormattedString', 'FormattedString', FormattedString,
	_ => class FormattedStringElement extends makeView(_) {
		onInsertChild(child, ref) {
			if (!child.__isNative || (ref && !ref.__isNative)) return super.onInsertChild(child, ref)

			if (!(child instanceof Span)) return
			if (ref && !(ref instanceof Span)) ref = null

			addToArrayProp(this, 'spans', child, ref)

			super.onInsertChild(child, ref)
		}

		onRemoveChild(child) {
			if (!child.__isNative) return super.onRemoveChild(child)
			if (!(child instanceof Span)) return

			removeFromArrayProp(this, 'spans', child)

			super.onRemoveChild(child)
		}
	}
)

export default makeFormattedString()
