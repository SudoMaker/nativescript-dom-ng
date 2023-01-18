import { ContentView } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeContentView = /*#__PURE__*/named(
	'ContentView', 'ContentView', ContentView,
	(_, options) => class ContentViewElement extends /*#__PURE__*/makeView(_, options) {
		__dominative_onInsertChild(child, ref) {
			if (!child.__dominative_isNative || (ref && !ref.__dominative_isNative)) return super.__dominative_onInsertChild(child, ref)

			if (this.content && this.content.__dominative_isNative) this.content.remove()
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

export default /*#__PURE__*/makeContentView.master()
