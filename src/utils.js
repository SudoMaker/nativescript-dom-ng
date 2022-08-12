import { ObservableArray } from '@nativescript/core'

// eslint-disable-next-line max-params
const named = (name, baseClassName, baseClass, creator) => {
	const key = `__dominative_is${name}`
	const errMsg = `${name} element must be subclass of ${baseClassName}`
	const allowSelf = name === baseClassName

	return (_ = baseClass, force) => {
		if (_ && _.prototype[key]) return _

		if (!force && (allowSelf ? (_ !== baseClass) : true) && !(_.prototype instanceof baseClass)) throw new Error(errMsg)

		const createdClass = creator(_, force)
		createdClass.prototype[key] = true
		return createdClass
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

export {
	named,
	resolvePath,
	addToArrayProp,
	removeFromArrayProp
}
