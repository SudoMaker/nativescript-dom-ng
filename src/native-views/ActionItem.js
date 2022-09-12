import { ActionItem, ViewBase } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeActionItem = named(
	'ActionItem', 'ActionItem', ActionItem,
	_ => class ActionItemElement extends makeView(_) {
		__dominative_onInsertChild(child, ref) {
			if (!child.__dominative_isNative || (ref && !ref.__dominative_isNative)) return super.__dominative_onInsertChild(child, ref)

			if (child instanceof ViewBase) {
				this.actionView = child
			}

			super.__dominative_onInsertChild(child, ref)
		}

		__dominative_onRemoveChild(child) {
			if (!child.__dominative_isNative) return super.__dominative_onRemoveChild(child)

			if (child === this.actionView) this.actionView = null

			super.__dominative_onRemoveChild(child)
		}
	}
)

export default makeActionItem()
