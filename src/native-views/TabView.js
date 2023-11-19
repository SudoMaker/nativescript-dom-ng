import { TabView, TabViewItem } from '@nativescript/core'
import { named, makeView } from './mixin.js'
import { addToArrayProp, removeFromArrayProp } from '../utils.js'

export const makeTabView = /*#__PURE__*/named(
	'TabView', 'TabView', TabView,
	(_, {itemView = TabViewItem, ...options}) => class TabViewElement extends /*#__PURE__*/makeView(_, options) {
		constructor(...args) {
			super(...args)
			if (!this.items) this.items = []
		}

		__dominative_onInsertChild(child, ref) {
			if (!child.__dominative_isNative || (ref && !ref.__dominative_isNative)) return super.__dominative_onInsertChild(child, ref)
			if (!(child instanceof itemView)) return
			if (!child.firstElementChild) return

			if (ref && !(ref instanceof itemView)) ref = null

			addToArrayProp(this, 'items', child, ref)

			super.__dominative_onInsertChild(child, ref)
		}

		__dominative_onRemoveChild(child) {
			if (!child.__dominative_isNative) return
			if (!(child instanceof itemView)) return super.__dominative_onRemoveChild(child)
			if (!child.firstElementChild) return

			removeFromArrayProp(this, 'items', child)

			super.__dominative_onRemoveChild(child)
		}
	}
)

export default /*#__PURE__*/makeTabView.master()
