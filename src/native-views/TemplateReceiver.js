import { ViewBase } from '@nativescript/core'
import { named } from './mixin.js'
import { TemplateWrapperView } from '../pseudo-elements/Template.js'
import * as symbol from '../symbols.js'

export const defaultItemTemplate = () => new TemplateWrapperView()

const handleItemLoading = (self, data) => {
	if (!self.items || !self.items.length || (!data.view && !data.object)) return

	const itemIndex = data.index
	const wrapper = data.view || data.object

	if (!(wrapper instanceof TemplateWrapperView)) return

	let item = null
	if (self.items.getItem) item = self.items.getItem(itemIndex)
	else item = self.items[itemIndex]

	if (wrapper[symbol.template]) {
		const oldView = wrapper.content
		const newView = wrapper[symbol.template].patch({
			view: oldView,
			index: itemIndex,
			item,
			data
		})

		if (oldView !== newView) wrapper.content = newView

		return
	}

	if (self.itemTemplate === defaultItemTemplate && item instanceof ViewBase) {
		if (!item.parent) wrapper.content = item
		else if (item.parent instanceof TemplateWrapperView) {
			item.parent.content = null
			wrapper.content = item
		}
	}
}

export const makeTemplateReceiver = named(
	'TemplateReceiver', 'ViewBase', ViewBase,
	(_, {
		templateProps = [],
		loadingEvents = []
	} = {}) => class TemplateReceiverElement extends _ {
		constructor(...args) {
			super(...args)
			const loadingHandler = data => handleItemLoading(this, data)
			for (let i of templateProps) super[i] = defaultItemTemplate
			for (let i of loadingEvents) super.addEventListener(i, loadingHandler)
		}
	}
)
