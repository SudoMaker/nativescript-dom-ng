# DOMiNATIVE

[![NPM](https://img.shields.io/npm/v/dominative.svg?style=flat)](https://www.npmjs.org/package/dominative)

### **Minimally viable DOM Document implementation for NativeScript**

**NOTE** THIS IS STILL EXPERIMENTAL.

---


## Installation

Via npm:

`npm install dominative @utls/undom-ef`

**Note:** `undom-ef` is now a peer dependency, you have to install it manually.


---


## Usage

### Vanilla

app.js
```js
import { Application } from '@nativescript/core'
import { document } from 'dominative'

const frame = document.createElement('Frame')
const page = document.createElement('Page')
const actionBar = document.createElement('ActionBar')

actionBar.title = 'Hello World!'

page.appendChild(actionBar)
frame.appendChild(page)

Application.run({
	create: () => frame
})
```

### with [ef.js](https://github.com/TheNeuronProject/ef.js)

[Playground](https://stackblitz.com/edit/ef-native-experiment?file=app%2Fapp.js)

App.eft

```efml
>Frame#root
	>Page
		>ActionBar
			#title = Hello World!
			>ActionBarItem
				#text = Button
		>StackLayout
			>Label
				.Welcome to the wonderland of ef.native!
```

app.js
```js
import { Application } from '@nativescript/core'
import { domImpl } from 'dominative'
import { setDOMImpl } from 'ef-core'
import App from 'App.eft'

setDOMImpl(domImpl)

const app = new App()

Application.run({
	create: () => app.$refs.root
})
```

### with [SingUI](https://github.com/ClassicOldSong/SingUI)

[Playground](https://stackblitz.com/edit/singui-native-experiment?file=app%2Fapp.js)

app.js
```js
import { Application } from '@nativescript/core'
import { document } from 'dominative'
import { browser, prop, setGlobalCtx, useTags, useElement, build } from 'singui'

global.document = document

setGlobalCtx(browser())

const tags = useTags(false)

const app = () =>
	build(() => {
		const { Frame, Page, ActionBar, NavigationButton, ActionItem, StackLayout, Label, Button } = tags

		let frameElement = null

		Frame(() => {
			frameElement = useElement()
			Page(() => {
				ActionBar(() => {
					prop.title = 'Hello World!'
				})
			})
		})

		return frameElement
	})

Application.run({
	create: () => app(),
})

```

### with [React](https://reactjs.org) + react-dom

[Playground](https://stackblitz.com/edit/nativescript-stackblitz-templates-zeazui?file=package.json,src%2Fappi.tsx) - by [Ammar Ahmed](https://github.com/ammarahm-ed)

**Note:** This demo might have some issues with Chrome. Use Firefox if necessary.

## Register Elements

```js
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { RadListView } from 'nativescript-ui-listview'
import { registerElement, makers } from 'dominative'

// If you cannot determin what the component is based on, you can register it directly.
registerElement('RadSideDrawer', RadSideDrawer)
// Register with a specific type by using a pre-defined maker. Usually we check for inheritance, but with force we can make magic happen
registerElement('RadListView', makers.makeListView(RadListView, {force: true}))
```

## Pseudo Elements

Pseudo elements are not real elements, but they appear as DOM elements to help organize composition.

### Prop

Helper to put it's child/children to it's parent node's property by key

**Attributes:**

`key: String`: **RW** The prop name to set on parent.

`type: <'array'|'single'>`: **RW** Property type, could be an array prop or a single object prop.

`value: any`: **RW** Value to be set to parent. Usually children of this current node. Don't touch unless you know what you're doing.

`parent: Element`: **R** Parent node of this node.

`class: String`: **RW** Helper to set `key` and `type`, could be `key:type` or `multi.level.key:type`

**Events:**

None.

### Template

A `Template` element holds a template to be replicated later, or can create views programmatically.

**Attributes:**

Share mostly from `Prop`. Differences are listed below:

`key: String`: **RW** Same form `Prop`, also serves the key name of a `KeyedTemplate`

`type: 'single'`: **R** Should not be able to set `type` on a `Template`.

`value: Function<T extends ViewBase>`: **R** Same as `createView`.

`content: <T extends ViewBase>`: **RW** The single child of this node. Don't touch unless you know what you're doing.

`patch: Function<T extends ViewBase>(PatchOptions)`: **R** Method to patch an existing clone.

`createView: Function<T extends ViewBase>`: **R** Function to create view from this template.

**Events:**

`itemLoading`: Triggered when patching. Set `event.patched` to true to skip default patching method, set `event.view` to change the view of this item. Additional props on `event`: `view`, `index`, `item`, `data`.

`createView`: Triggered when creating view from the template. Set created view to `event.view`. If not set, view will be created by cloning the template.

**Note:**

`Template` element could only have one element child. If you'd like to have multiple children in a template, just use a different type of view or layout as the only child and insert your other contents inside.

## KeyedTemplates

By simpling putting `Template`s inside an array `Prop` we could set up a KeyedTemplate.

Example:

```html
<ListView itemTemplateSelector="$item % 2 ? 'odd' : 'even'">
	<Prop key="itemTemplates" type="array">
		<Template key="odd">
			<Label text="odd"/>
		</Template>
		<Template key="even">
			<Label text="even"/>
		</Template>
	</Prop>
</ListView>
```

## Template Handling for Custom Components

There's a special maker caller `makeTemplateReceiver`, which you can use when the NativeScript component accepts templates.

Example:

```js
import { RadListView } from 'nativescript-ui-listview'
import { registerElement, makers } from 'dominative'

registerElement('RadListView', makers.makeTemplateReceiver(RadListView, {
	templateProps: ['itemTemplate'],
	loadingEvents: ['itemLoading']
}))
```

`templateProps: Array<String>`: Props that accepts a template. Do not write keyed template props.

`loadingEvents: Array<String>`: Events that will fire on the component when items loading.

## Helper(s)

```js
import { aliasTagName } from 'dominative'

const tagNameConverter = (CamelCaseName) => {
	// ...whatever your transformation code here
	// This is useful when your framework/renderer doesn't support document.createElement with uppercase letters.
	return transformedName
}

// Convert all built-in tag names
aliasTagName(tagNameConverter)
```

## Caveats

### Event Handling

Since NativeScript uses `addEventListener` and `removeEventListener` as event handling method names as well as HTML DOM which are causes naming conflicts, we should tell DOMiNATIVE to register event handlers as DOM behavior by explicitly adding a third option:

```js
element.addEventListener('someEvent', callback, {mode: 'DOM'})
element.removeEventListener('someEvent', callback, {mode: 'DOM'})
```

without the `mode: 'DOM'` option, DOMiNATIVE will pass the event register operation to the original NativeScript implementation.

In DOM mode, your event callback function will receive a DOM-like Event object instead of the NativeScript `data` object. The original `data` object will be placed at `event.data` in most cases.

## License

MIT
