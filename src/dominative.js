import * as nativeViews from './native-views/index.js'
import * as makers from './native-views/makers.js'
import * as pseudoElements from './pseudo-elements/index.js'
import { registerDOMElement, domImpl, document, scope } from './dom.js'

const IS_MAPPABLE = '__dominative_is_Mappable'

const makeMappable = (_) => {
	if (_.prototype[IS_MAPPABLE]) return _

	const eventMap = {}

	class Mappable extends _ {
		static mapEvent(fromEvent, toEvent) {
			if (process.env.NODE_ENV !== 'production') console.warn(`[DOMiNATIVE] Mapping event '${fromEvent}' to '${toEvent}' on '${_.name}'. Will only affect newly registered event handlers, event handlers already registered will not be affected.
	Do not rely on event mapping, use '${toEvent}' directly when possible. See https://github.com/SudoMaker/DOMiNATIVE#hardcoding-in-frameworks for details.`)
			eventMap[fromEvent] = toEvent
		}

		static getEventMap(fromEvent) {
			return eventMap[fromEvent]
		}

		static mapProp(fromProp, toProp) {
			if (process.env.NODE_ENV !== 'production') console.warn(`[DOMiNATIVE] Mapping property '${fromProp}' to '${toProp}' on '${_.name}'. Will affect all existing and future created nodes.
	Do not rely on property mapping, use '${toProp}' directly when possible. See https://github.com/SudoMaker/DOMiNATIVE#hardcoding-in-frameworks for details.`)
			Object.defineProperty(this.prototype, fromProp, {
				enumerable: true,
				get() {
					return this[toProp]
				},
				set(val) {
					this[toProp] = val
				}
			})
		}
	}

	Object.defineProperty(Mappable.prototype, IS_MAPPABLE, {
		value: true
	})

	return Mappable
}

const registerElement = (key, val) => registerDOMElement(key, makeMappable(makers.makeView(val)))
const aliasTagName = (nameHandler) => {
	for (let key of Object.keys(nativeViews)) scope[nameHandler(key)] = scope[key]
	for (let key of Object.keys(pseudoElements)) scope[nameHandler(key)] = scope[key]
}

for (let [key, val] of Object.entries(nativeViews)) {
	registerDOMElement(key, makeMappable(val))
}

for (let [key, val] of Object.entries(pseudoElements)) {
	registerDOMElement(key, makeMappable(val))
}

export { document, domImpl, nativeViews, pseudoElements, makers, registerElement, aliasTagName }
