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

### with [Vue 3](https://vuejs.org/) + runtime-dom

[Playground](https://stackblitz.com/edit/nativescript-dominative-vue-3?file=app/App.vue)

app.js
```js
import { Application } from '@nativescript/core'
import { registerComponents } from 'dominative-vue'
import { document } from 'dominative'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

registerComponents(app)

Application.run({
	create: () => {
		const frame = document.createElement('Frame')

		app.mount(frame)

		return frame
	}
})

```

### with [SolidJS](https://www.solidjs.com/)

Confirmed working, just need a playground


---


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

---


## Pseudo Elements

Pseudo elements are not real elements, but they appear as DOM elements to help organizing composition.

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

`itemLoading`: Triggered when patching and template has no content. Set `event.view` to change the view of this item. Additional props on `event`: `view`, `index`, `item`, `data`. This event's callback argument doesn't extend from NativeScript's data object.

`createView`: Triggered when creating view from the template and template has no content. Set created view to `event.view`. If not set, view will be created by cloning the template. This event's callback argument doesn't extend from NativeScript's data object.

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

There's a special maker caller `makeTemplateReceiver`, which you can use when a NativeScript component accepts templates.

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


---


## Tweaking

### Element.defineEventOption(eventName: string, option: EventOption)

Define how a event should be initialized. If an event is defined with `bubbles: true` or `captures: true`, they'll automatically be registered to native at element creation.

Event option:

```js
{
	bubbles: boolean // should this event bubble, default false
	captures: boolean // should this event have capture phase, default false
	cancelable: boolean // should this event be cancelable, defalut true
}
```

Usage:

```js
const ButtonElement = document.defaultView.Button
ButtonElement.defineEventOption('tap', {
	bubbles: true,
	captures: true
})
```

### Element.mapEvent(fromEvent: string, toEvent: string)

See [below](#hardcoded-events-and-props)

### Element.mapProp(fromProp: string, toProp: string)

See [below](#hardcoded-events-and-props)


---


## Caveats

### Hardcoding in Frameworks

Frameworks are great, but they're not great when it comes to hardcoded things. We have to invest methods to counter the harm done by those hardcodings.

**Hardcoding is harmful, please do not hardcode.**

#### Always lowercased tag names

Sometimes frameworks are just too thoughtful for you, they translate all your tag names to lowercase when compiling, which means your camelCase or PascalCase tag names won't work as intended.

We can alias our tag names to lowercase if you like:

```js
import { aliasTagName } from 'dominative'

const tagNameConverter = (PascalCaseName) => {
	// ...whatever your transformation code here
	// This is useful when your framework/renderer doesn't support document.createElement with uppercase letters.
	const transformedName = PascalCaseName.toLowerCase()
	return transformedName
}

// Convert all built-in tag names
aliasTagName(tagNameConverter)
```

#### Hardcoded events and props

Some frameworks work like magic by providing lots of "just works" features that you don't even need to think about what's going on behind. They're actually done by heavily assuming you're on a specific platform - browser, and hardcoded these features to browser specific features.

We have to mimic the events and props they hardcoded in order to make these frameworks happy:

```js
import { document } from 'dominative'

const TextFieldElement = document.defaultView.TextField
const ButtonElement = document.defaultView.Button

TextFieldElement.mapEvent('input', 'inputChange') // This is redirecting event handler registering for 'input' to 'inputChange'
TextFieldElement.mapProp('value', 'text') // This is redirecting access from 'value' prop to 'text' prop

ButtonElement.mapEvent('click', 'tap') // Redirect 'click' event to 'tap'

const input = document.createElement('TextField')
input.addEventListener('input', (event) => { // This is actually registered to `inputChange`
	console.log(event.target.value) // This is actually accessing `event.target.text`
})
```

Then the following code could work:

```html
<TextField v-model="userInput"/>
<!-- 'v-model' hardcoded with `input` or `change` event and `value` or `checked` prop, so we have to provide it with a emulated `input` event and `value` prop -->
```

```jsx
<button onClick="onTapHandler"></button> // 'onTapHandler' is actually registered to 'tap', since some frameworks hardcoded "possible" event names so they can know it's an event handler
```

---


## License

MIT
