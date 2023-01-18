import { TabView, TabViewItem } from '@nativescript/core'
import { named, makeView } from './mixin.js'
import { addToArrayProp, removeFromArrayProp } from '../utils.js'

export const makeTabView = /*#__PURE__*/named(
	'TabView', 'TabView', TabView,
	(_, options) => class TabViewElement extends /*#__PURE__*/makeView(_, options) {
		__dominative_onInsertChild(child, ref) {
			if (!child.__dominative_isNative || (ref && !ref.__dominative_isNative)) return super.__dominative_onInsertChild(child, ref)
			if (!(child instanceof TabViewItem)) return

			if (ref && !(ref instanceof TabViewItem)) ref = null

			addToArrayProp(this, 'items', child, ref)

			super.__dominative_onInsertChild(child, ref)
		}

		__dominative_onRemoveChild(child) {
			if (!child.__dominative_isNative) return
			if (!(child instanceof TabViewItem)) return super.__dominative_onRemoveChild(child)

			removeFromArrayProp(this, 'items', child)

			super.__dominative_onRemoveChild(child)
		}
	}
)

export default /*#__PURE__*/makeTabView.master()
