import * as nativeViews from './native-views/index.js'
import * as makers from './native-views/makers.js'
import * as pseudoElements from './pseudo-elements/index.js'
import { registerDOMElement, domImpl, document, scope } from './dom.js'

const IS_TWEAKABLE = '__dominative_is_Tweakable'

const dummyFn = _ => _

const makeTweakable = (_) => {
	if (_.prototype[IS_TWEAKABLE]) return _

	const eventMap = {}
	const eventOptionDefinition = {}

	class Mappable extends _ {
		constructor(...args) {
			super(...args)
			for (let [type, def] of Object.entries(eventOptionDefinition)) {
				if (def.bubbles || def.captures) this.addEventListener(type, dummyFn, {mode: 'DOM'})
			}
		}

		static getEventMap(fromEvent) {
			return eventMap[fromEvent]
		}

		static getEventOption(type) {
			return eventOptionDefinition[type]
		}

		static mapEvent(fromEvent, toEvent) {
			if (process.env.NODE_ENV !== 'production') console.warn(`[DOMiNATIVE] Mapping event '${fromEvent}' to '${toEvent}' on '${_.name}'. Will only affect newly registered event handlers, event handlers already registered will not be affected.
	Do not rely on event mapping, use '${toEvent}' directly when possible. See https://github.com/SudoMaker/DOMiNATIVE#hardcoding-in-frameworks for details.`)
			eventMap[fromEvent] = toEvent
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

		static defineEventOption(type, option) {

			/** Event Option:
			 *	{
			 *		bubbles: boolean
			 *		captures: boolean
			 *		cancelable: boolean
			 *	}
			**/
			eventOptionDefinition[type] = option
		}
	}

	Object.defineProperty(Mappable.prototype, IS_TWEAKABLE, {
		value: true
	})

	return Mappable
}

const registerElement = (key, val) => registerDOMElement(key, makeTweakable(makers.makeView(val)))
const aliasTagName = (nameHandler) => {
	for (let key of Object.keys(nativeViews)) scope[nameHandler(key)] = scope[key]
	for (let key of Object.keys(pseudoElements)) scope[nameHandler(key)] = scope[key]
}

for (let [key, val] of Object.entries(nativeViews)) {
	registerDOMElement(key, makeTweakable(val))
}

for (let [key, val] of Object.entries(pseudoElements)) {
	registerDOMElement(key, makeTweakable(val))
}

export { document, domImpl, nativeViews, pseudoElements, makers, registerElement, aliasTagName }
