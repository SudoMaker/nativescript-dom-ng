import { ObservableArray } from '@nativescript/core'

const mergeProps = (...args) => Object.assign({}, ...args)

// eslint-disable-next-line max-params
const named = (name, baseClassName, baseClass, extender) => {
	const key = `__dominative_is_${name}`
	const allowSelf = name === baseClassName

	const maker = (_ = baseClass, options) => {
		let force = false
		if (options && options.force) force = true

		if (_ && _.prototype[key]) {
			if (force && process.env.NODE_ENV !== 'production') console.warn(`[DOMiNATIVE] ${_.name} is already a ${name} element, forcing to extend once.`)
			else return _
		}

		if (process.env.NODE_ENV !== 'production') {
			if (force) console.warn(`[DOMiNATIVE] Force making ${_.name} element based on ${baseClassName}.`)
			else if ((allowSelf ? (_ !== baseClass) : true) && !(_.prototype instanceof baseClass)) throw new Error(`[DOMiNATIVE] ${name} element must be subclass of ${baseClassName}, but got ${_.name}.`)
		}

		const extendedClass = /*#__PURE__*/extender(_, mergeProps(options, {name: null}))
		Object.defineProperty(extendedClass.prototype, key, {
			enumerable: false,
			value: true
		})

		if (options && options.name) {
			Object.defineProperty(extendedClass, '__class_type', { value: extendedClass.name, enumerable: false })
			Object.defineProperty(extendedClass, 'name', { value: options.name })
		}

		return extendedClass
	}

	maker.master = (...args) => {
		const extendedClass = /*#__PURE__*/maker(...args)

		Object.defineProperty(extendedClass, Symbol.hasInstance, {
			value(instance) {
				return instance && instance[key]
			}
		})

		return extendedClass
	}

	return maker
}

const dummyFn = _ => _

const makeTweakable = /*#__PURE__*/named(
	'Tweakable', 'Object', Object,
	(_) => {
		const eventMap = {}
		const eventOptionDefinition = {}

		class Tweakable extends _ {
			static initTweaks(self) {
				for (let [type, def] of Object.entries(eventOptionDefinition)) {
					if (def.bubbles || def.captures) self.addEventListener(type, dummyFn)
				}
			}

			static getEventMap(fromEvent) {
				return eventMap[fromEvent] || fromEvent
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

		return Tweakable
	}
)

const ignoreOwnerDocument = _ => class extends _ {
	constructor(ownerDocument, ...args) {
		super(...args)
	}
}

const resolvePath = (pathStr, base) => {
	const pathArr = pathStr.split('.')
	const key = pathArr.pop()
	base = pathArr.reduce((prev, key) => base[key], base)
	return [base, key]
}

// eslint-disable-next-line max-params
const addToArrayProp = (node, key, item, ref) => {
	if (!node[key]) node[key] = []

	let currentArr = node[key]

	let refIndex = currentArr.indexOf(ref)
	if (refIndex < 0) refIndex = node[key].length

	if (currentArr instanceof ObservableArray) {
		currentArr.splice(refIndex, 0, item)
	} else {
		currentArr = currentArr.slice()
		currentArr.splice(refIndex, 0, item)
		node[key] = currentArr
	}
}

const removeFromArrayProp = (node, key, item) => {
	if (!node[key]) return

	let currentArr = node[key]
	const itemIndex = currentArr.indexOf(item)
	if (itemIndex < 0) return

	if (currentArr instanceof ObservableArray) {
		currentArr.splice(itemIndex, 1)
	} else {
		currentArr = currentArr.slice()
		currentArr.splice(itemIndex, 1)
		node[key] = currentArr
	}
}

const reAssignObject = (target, source) => {
	for (let i of Object.keys(target)) delete target[i]
	Object.assign(target, source)
}

export {
	mergeProps,
	named,
	makeTweakable,
	ignoreOwnerDocument,
	resolvePath,
	addToArrayProp,
	removeFromArrayProp,
	reAssignObject
}
