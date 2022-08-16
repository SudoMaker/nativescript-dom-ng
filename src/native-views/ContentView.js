import { ContentView } from '@nativescript/core'
import { named, makeView } from './mixin.js'
import * as symbol from '../symbols.js'

export const makeContentView = named(
	'ContentView', 'ContentView', ContentView,
	_ => class ContentViewElement extends makeView(_) {
		[symbol.onInsertChild](child, ref) {
			if (!child[symbol.isNative] || (ref && !ref[symbol.isNative])) return super[symbol.onInsertChild](child, ref)

			this.content = child

			super[symbol.onInsertChild](child, ref)
		}

		[symbol.onRemoveChild](child) {
			if (!child[symbol.isNative]) return super[symbol.onRemoveChild](child)

			this.content = null

			super[symbol.onRemoveChild](child)
		}
	}
)

export default makeContentView()
