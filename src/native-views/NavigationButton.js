import { NavigationButton } from '@nativescript/core'
import { named } from './mixin.js'
import { makeActionItem } from './ActionItem.js'

export const makeNavigationButton = /*#__PURE__*/named(
	'NavigationButton', 'NavigationButton', NavigationButton,
	(_, options) => class NavigationButtonElement extends /*#__PURE__*/makeActionItem(_, options) {}
)

export default /*#__PURE__*/makeNavigationButton.master()
