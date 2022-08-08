import { ListView } from '@nativescript/core'
import { named, makeView } from './mixin.js'

const updateList = (self) => {
	/* eslint-disable camelcase */
	if (self.__dominative_listViewUpdating) return
	self.__dominative_listViewUpdating = true
	setTimeout(() => {
		self.refresh()
		self.__dominative_listViewUpdating = false
	}, 0)
}

export class ListViewItem {
	constructor(view, data, handleUpdate) {
		this.view = view
		this.data = data
		this.handleUpdate = handleUpdate
	}
}

const handleItemLoading = (self, data) => {
	const itemIndex = data.index
	if (!self.items) return

	let item = null
	if (self.items.getItem) item = self.items.getItem(itemIndex)
	else item = self.items[itemIndex]

	if (item instanceof ListViewItem) {
		if (item.view && item.view !== data.view) data.view = item.view
		if (item.handleUpdate) item.handleUpdate(itemIndex, item.data)
	}
}

export const makeListView = named(
	'ListView', 'ListView', ListView,
	_ => class ListViewElement extends makeView(_) {
		constructor(...args) {
			super(...args)
			this.items = []
			this.__childList = []
			super.addEventListener(ListView.itemLoadingEvent, data => handleItemLoading(this, data))
		}

		onInsertChild(child, ref) {
			if (!child.__isNative || (ref && !ref.__isNative)) return

			let currentArr = this.__childList
			let refIndex = ref && currentArr.indexOf(ref) || currentArr.length
			if (refIndex < 0) refIndex = currentArr.length
			currentArr.splice(refIndex, 0, child)

			if (Array.isArray(this.items)) {
				currentArr = this.items
				refIndex = currentArr.length
				if (ref) {
					refIndex -= 1
					while (refIndex >= 0) {
						const currentItem = currentArr[refIndex]
						if ((currentItem instanceof ListViewItem) && currentItem.view === ref) break
						refIndex -= 1
					}
				}

				if (refIndex < 0) refIndex = currentArr.length

				const item = new ListViewItem(child, null, child.__handleListUpdate)
				currentArr.splice(refIndex, 0, item)
			}

			super.onInsertChild(child, ref)
			updateList(this)
		}

		onRemoveChild(child) {
			if (!child.__isNative) return

			let currentArr = this.__childList
			let childIndex = currentArr.indexOf(child)
			if (childIndex >= 0) currentArr.splice(childIndex, 1)

			if (Array.isArray(this.items)) {
				currentArr = this.items
				childIndex = currentArr.length - 1
				while (childIndex >= 0) {
					const currentItem = currentArr[childIndex]
					if ((currentItem instanceof ListViewItem) && currentItem.view === child) break
					childIndex -= 1
				}

				if (childIndex >= 0) currentArr.splice(childIndex, 1)
			}

			super.onRemoveChild(child)
			updateList(this)
		}
	}
)

export default makeListView()
