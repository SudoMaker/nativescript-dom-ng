import { ViewBase, ContentView } from '@nativescript/core'
import { named } from './mixin.js'
import { globals } from '../globals.js'

export const defaultItemTemplate = () => {
	const wrapper = new ContentView()
	wrapper.__dominative_isDefalutTemplate = true
	return wrapper
}

const handleItemLoading = (self, data) => {
	if (!self.items || !self.items.length || (!data.view && !data.object)) return

	const itemIndex = data.index
	const wrapper = data.view || data.object

	let item = data.bindingContext

	if (!item) {
		if (self.items.getItem) item = self.items.getItem(itemIndex)
		else item = self.items[itemIndex]
	}

	if (wrapper) {
		if (wrapper.__dominative_template) {
			const template = wrapper.__dominative_template
			const newView = wrapper._batchUpdate(() => template.patch({
				view: wrapper,
				index: itemIndex,
				item,
				data
			}))

			if (wrapper !== newView) event.view = newView

			return
		}

		if (self.itemTemplate === defaultItemTemplate && item.__dominative_isNative) {
			// Shouldn't use DOM methods since items are already a children on ListView etc
			// calling appendChild will cause the item to be removed from that ListView
			if (item.parent && item.parent.__dominative_isDefalutTemplate) item.parent.content = null
			wrapper.content = item
		}
	}
}

const itemEventHandler = (self, data, eventName) => {
	if (!self.items || !self.items.length || (!data.view && !data.object)) return

	const wrapper = data.view || data.object

	if (!(wrapper && wrapper.__dominative_template)) return

	const template = wrapper.__dominative_template

	const event = globals.document.createEvent(eventName)
	event.view = wrapper
	event.data = data

	template.dispatchEvent(event)
}

export const makeTemplateReceiver = /*#__PURE__*/named(
	'TemplateReceiver', 'ViewBase', ViewBase,
	(_, {
		templateProps = [],
		loadingEvents = [],
		itemEvents = []
	} = {}) => class TemplateReceiverElement extends _ {
		constructor(...args) {
			super(...args)
			const loadingHandler = data => handleItemLoading(this, data)
			for (let i of templateProps) super[i] = defaultItemTemplate
			for (let i of loadingEvents) super.addEventListener(i, loadingHandler)
			for (let i of itemEvents) super.addEventListener(i, data => itemEventHandler(self, data, i))
		}
	}
)
