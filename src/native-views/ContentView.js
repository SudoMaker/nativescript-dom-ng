import { ContentView } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeContentView = named(
	'ContentView', 'ContentView', ContentView,
	_ => class ContentViewElement extends makeView(_) {
		__dominative_onInsertChild(child, ref) {
			if (!child.__dominative_isNative || (ref && !ref.__dominative_isNative)) return super.__dominative_onInsertChild(child, ref)

			this.content = child

			super.__dominative_onInsertChild(child, ref)
		}

		__dominative_onRemoveChild(child) {
			if (!child.__dominative_isNative) return super.__dominative_onRemoveChild(child)

			this.content = null

			super.__dominative_onRemoveChild(child)
		}
	}
)

export default makeContentView.master()
