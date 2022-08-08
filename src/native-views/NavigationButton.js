import { NavigationButton } from '@nativescript/core'
import { named } from './mixin.js'
import { makeActionItem } from './ActionItem.js'

export const makeNavigationButton = named(
	'NavigationButton', 'NavigationButton', NavigationButton,
	_ => class NavigationButtonElement extends makeActionItem(_) {}
)

export default makeNavigationButton()
