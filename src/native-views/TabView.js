import { TabView, TabViewItem } from '@nativescript/core'
import { named, makeView } from './mixin.js'
import { addToArrayProp, removeFromArrayProp } from '../utils.js'

export const makeTabView = named(
	'TabView', 'TabView', TabView,
	_ => class TabViewElement extends makeView(_) {
		onInsertChild(child, ref) {
			if (!child.__isNative || (ref && !ref.__isNative)) return super.onInsertChild(child, ref)
			if (!(child instanceof TabViewItem)) return

			if (ref && !(ref instanceof TabViewItem)) ref = null

			addToArrayProp(this, 'items', child, ref)

			super.onInsertChild(child, ref)
		}

		onRemoveChild(child) {
			if (!child.__isNative) return
			if (!(child instanceof TabViewItem)) return super.onRemoveChild(child)

			removeFromArrayProp(this, 'items', child)

			super.onRemoveChild(child)
		}
	}
)

export default makeTabView()
