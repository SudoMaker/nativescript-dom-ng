import { ActionBar, ActionItem, NavigationButton } from '@nativescript/core'
import { isNode } from 'undom-ng'
import { named, makeView } from './mixin.js'

export const makeActionBar = /*#__PURE__*/named(
	'ActionBar', 'ActionBar', ActionBar,
	(_, options) => class ActionBarElement extends /*#__PURE__*/makeView(_, options) {
		__dominative_onInsertChild(child, ref) {
			if (!child.__dominative_isNative || (ref && !ref.__dominative_isNative)) return super.__dominative_onInsertChild(child, ref)

			if (child instanceof NavigationButton) {
				if (this.navigationButton && isNode(this.navigationButton)) this.navigationButton.remove()
				this.navigationButton = child
			} else if (child instanceof ActionItem) {
				if (ref instanceof ActionItem) {
					const items = this.actionItems.getItems()
					const refIndex = items.indexOf(items)
					if (refIndex < 0) throw new Error('Reference item could not be found on the parent node.')
					const restItems = []
					while (items.length > refIndex) {
						const popedItem = items.pop()
						this.actionItems.removeItem(popedItem)
						restItems.push(popedItem)
					}
					this.actionItems.addItem(child)
					while (restItems.length > 0) {
						this.actionItems.addItem(restItems.pop())
					}
				} else this.actionItems.addItem(child)
			}

			super.__dominative_onInsertChild(child, ref)
		}

		__dominative_onRemoveChild(child) {
			if (!child.__dominative_isNative) return super.__dominative_onRemoveChild(child)

			if (child instanceof NavigationButton && child === this.navigationButton) {
				this.navigationButton = null
			} else if (child instanceof ActionItem) {
				this.actionItems.removeItem(child)
			}

			super.__dominative_onRemoveChild(child)
		}
	}
)

export default /*#__PURE__*/makeActionBar.master()
