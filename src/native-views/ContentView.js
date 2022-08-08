import { ContentView } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeContentView = named(
	'ContentView', 'ContentView', ContentView,
	_ => class ContentViewElement extends makeView(_) {
		onInsertChild(child, ref) {
			if (!child.__isNative || (ref && !ref.__isNative)) return super.onInsertChild(child, ref)

			this.content = child

			super.onInsertChild(child, ref)
		}

		onRemoveChild(child) {
			if (!child.__isNative) return super.onRemoveChild(child)

			this.content = null

			super.onRemoveChild(child)
		}
	}
)

export default makeContentView()
