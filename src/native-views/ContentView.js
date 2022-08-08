import { ContentView } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeContentView = named(
	'ContentView', 'ContentView', ContentView,
	_ => class ContentViewElement extends makeView(_) {
		onInsertChild(child, ref) {
			if (!child.__isNative || (ref && !ref.__isNative)) return

			this.content = child

			super.onInsertChild(child, ref)
		}

		onRemoveChild(child) {
			if (!child.__isNative) return

			this.content = null

			super.onRemoveChild(child)
		}
	}
)

export default makeContentView()
