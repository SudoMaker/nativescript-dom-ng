import { ActionBar, ActionItem, NavigationButton } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeActionBar = named(
	'ActionBar', 'ActionBar', ActionBar,
	_ => class ActionBarElement extends makeView(_) {
		onInsertChild(child, ref) {
			if (!child.__isNative || (ref && !ref.__isNative)) return

			if (child instanceof NavigationButton) {
				if (this.navigationButton && this.navigationButton.__undom_isNode) this.navigationButton.remove()
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

			super.onInsertChild(child, ref)
		}

		onRemovChild(child) {
			if (!child.__isNative) return

			if (child instanceof NavigationButton && child === this.navigationButton) {
				this.navigationButton = null
			} else if (child instanceof ActionItem) {
				this.actionItems.removeItem(child)
			}

			super.onRemovedChild(child)
		}
	}
)

export default makeActionBar()
