# DOMiNATIVE

[![NPM](https://img.shields.io/npm/v/dominative.svg?style=flat)](https://www.npmjs.org/package/dominative)

### **Minimally viable DOM Document implementation for NativeScript**

**NOTE** THIS IS STILL EXPERIMENTAL.

---


## Installation

Via npm:

`npm install dominative`


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
