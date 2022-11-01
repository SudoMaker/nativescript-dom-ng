import * as NativeViews from "@nativescript/core";
import { Style } from "@nativescript/core";

declare module "dominative" {
	interface ElementCreationOptions {
		is?: string;
	}

	interface EventListener {
		(evt: Event): void;
	}

	interface EventListenerObject {
		handleEvent(object: Event): void;
	}

	type EventListenerOrEventListenerObject = EventListener | EventListenerObject;

	interface AddEventListenerOptions extends EventListenerOptions {
		once?: boolean;
		passive?: boolean;
		//signal?: AbortSignal;
	}

	interface EventListenerOptions {
		capture?: boolean;
	}

	type DOMHighResTimeStamp = number;

	export interface Event {
		/** Returns true or false depending on how event was initialized. True if event goes through its target's ancestors in reverse tree order, and false otherwise. */
		readonly bubbles: boolean;
		/** @deprecated */
		cancelBubble: boolean;
		/** Returns true or false depending on how event was initialized. Its return value does not always carry meaning, but true can indicate that part of the operation during which event was dispatched, can be canceled by invoking the preventDefault() method. */
		readonly cancelable: boolean;
		/** Returns true or false depending on how event was initialized. True if event invokes listeners past a ShadowRoot node that is the root of its target, and false otherwise. */
		readonly composed: boolean;
		/** Returns the object whose event listener's callback is currently being invoked. */
		readonly currentTarget: EventTarget | null;
		/** Returns true if preventDefault() was invoked successfully to indicate cancelation, and false otherwise. */
		readonly defaultPrevented: boolean;
		/** Returns the event's phase, which is one of NONE, CAPTURING_PHASE, AT_TARGET, and BUBBLING_PHASE. */
		readonly eventPhase: number;
		/** Returns true if event was dispatched by the user agent, and false otherwise. */
		readonly isTrusted: boolean;
		/** @deprecated */
		returnValue: boolean;
		/** @deprecated */
		readonly srcElement: EventTarget | null;
		/** Returns the object to which event is dispatched (its target). */
		readonly target: EventTarget | null;
		/** Returns the event's timestamp as the number of milliseconds measured relative to the time origin. */
		readonly timeStamp: DOMHighResTimeStamp;
		/** Returns the type of event, e.g. "click", "hashchange", or "submit". */
		readonly type: string;
		/** Returns the invocation target objects of event's path (objects on which listeners will be invoked), except for any nodes in shadow trees of which the shadow root's mode is "closed" that are not reachable from event's currentTarget. */
		composedPath(): EventTarget[];
		/** @deprecated */
		initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void;
		/** If invoked when the cancelable attribute value is true, and while executing a listener for the event with passive set to false, signals to the operation that caused event to be dispatched that it needs to be canceled. */
		preventDefault(): void;
		/** Invoking this method prevents event from reaching any registered event listeners after the current one finishes running and, when dispatched in a tree, also prevents event from reaching any other objects. */
		stopImmediatePropagation(): void;
		/** When dispatched in a tree, invoking this method prevents event from reaching any objects other than the current object. */
		stopPropagation(): void;
		readonly AT_TARGET: number;
		readonly BUBBLING_PHASE: number;
		readonly CAPTURING_PHASE: number;
		readonly NONE: number;
	}

	export class Node extends NativeViews.ViewBase {
		constructor(nodeType: number, nodeName: string);
		readonly nodeType: number;
		readonly nodeName: string;
		readonly tagName: string;
		parentNode: ParentNode;
		get nextSibling(): Node;
		get previousSibling(): Node;

		get firstChild(): Node;
		get lastChild(): Node;

		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	//@ts-ignore
	export interface Text extends Node {
		constructor(text: string);
		set textContent(value: string);
		get textContent(): string;
	}

	export interface EventTarget {
		/**
		 * Appends an event listener for events whose type attribute value is type. The callback argument sets the callback that will be invoked when the event is dispatched.
		 *
		 * The options argument sets listener-specific options. For compatibility this can be a boolean, in which case the method behaves exactly as if the value was specified as options's capture.
		 *
		 * When set to true, options's capture prevents callback from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE. When false (or not present), callback will not be invoked when event's eventPhase attribute value is CAPTURING_PHASE. Either way, callback will be invoked if event's eventPhase attribute value is AT_TARGET.
		 *
		 * When set to true, options's passive indicates that the callback will not cancel the event by invoking preventDefault(). This is used to enable performance optimizations described in § 2.8 Observing event listeners.
		 *
		 * When set to true, options's once indicates that the callback will only be invoked once after which the event listener will be removed.
		 *
		 * If an AbortSignal is passed for options's signal, then the event listener will be removed when signal is aborted.
		 *
		 * The event listener is appended to target's event listener list and is not appended if it has the same type, callback, and capture.
		 */
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject | null,
			options?: AddEventListenerOptions | boolean
		): void;
		/** Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise. */
		dispatchEvent(event: Event): boolean;
		/** Removes the event listener in target's event listener list with the same type, callback, and options. */
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject | null,
			options?: EventListenerOptions | boolean
		): void;
	}

	export class Element extends ParentNode implements EventTarget {
		attributes: { namespace: string; name: string }[];
		style: Style;
		localName: string;
		//@ts-ignore
		get className(): string;

		set className(val: string);

		get cssText(): string;
		set cssText(val: string);
		//@ts-ignore
		get children(): Element[];

		namespaceURI(): string;

		get innerHTML(): string;

		set innerHTML(value: string);

		get outerHTML(): string;

		set outerHTML(value: string);

		get textContent(): string;

		set textContent(value: string);

		insertBefore(child: Node, ref: Node): Node;

		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string | null;

		removeAttribute(qualifiedName: string): void;
		/** Removes element's attribute whose namespace is namespace and local name is localName. */
		removeAttributeNS(namespace: string | null, localName: string): void;

		setAttributeNS(
			namespace: string | null,
			qualifiedName: string,
			value: string
		): void;
		/** Returns element's attribute whose namespace is namespace and local name is localName, and null if there is no such attribute otherwise. */
		getAttributeNS(namespace: string | null, localName: string): string | null;
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		dispatchEvent(event: Event): boolean;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
	}

	export interface CharacterData extends Node {
		get data(): string;
		set data(data: string);

		get length(): number;

		get nodeValue(): string;
		set nodeValue(data: string);

		get textContent(): string;
		set textContent(value: string);

		appendData(data: string);
	}

	export interface Comment extends CharacterData {
		constructor(data: string): void;
	}

	export class ParentNode extends Node {
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get children(): Node[];
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		insertBefore(child: Node, ref: Node): Node;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		get textContent(): string;
		set textContent(value: string);
		removeChild(child: Node): Node;
	}

	export interface Scope {
		Event: Event;
		Node: Node;
		ParentNode: ParentNode;
		HTMLElement: HTMLElement;
		SVGElement: SVGElement;
		DocumentFragment: DocumentFragment;
		Comment: Comment;
		CharacterData: CharacterData;
		Text: Text;
		Element: Element;
		Document: Document;
	}

	export const scope: Scope;

	export interface Document extends Element {
		createElement<K extends keyof HTMLElementTagNameMap>(
			tagName: K,
			options?: ElementCreationOptions
		): HTMLElementTagNameMap[K];
		createElementNS(
			namespace: string | null,
			qualifiedName: string,
			options?: ElementCreationOptions
		): Element;
		createTextNode(text: string): Text;
		createDocumentFragment(): DocumentFragment;
		createEvent(type: string): Event;
		createComment(data: string): Comment;
		get defaultView(): Scope;
	}

	export class DocumentFragment extends ParentNode {}

	export class SVGElement extends Element {}

	export class HTMLElement extends Element {}

	export class Prop extends HTMLElement {
		constructor(key: string, type: string);
		get key(): string;
		set key(key: string);
		get class(): string;
		set class(value: string);
		get type(): string;
		set type(type: string);
		get value(): any;
		set value(value: any);
		//@ts-ignore
		get parent(): ParentNode;
	}

	export class ItemTemplate extends Prop {
		get content(): any;
		set content(value: any);
		patch(data: {
			view: HTMLElement;
			index: number;
			item: any;
			data: any;
		}): HTMLElement;
		createView(): HTMLElement;
	}

	export class Frame extends NativeViews.Frame implements HTMLElement {
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class Page extends NativeViews.Page implements HTMLElement {
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class AbsoluteLayout
		extends NativeViews.AbsoluteLayout
		implements HTMLElement
	{
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class ActionBar extends NativeViews.ActionBar implements HTMLElement {
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class ActionItem
		extends NativeViews.ActionItem
		implements HTMLElement
	{
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class ActivityIndicator
		extends NativeViews.ActivityIndicator
		implements HTMLElement
	{
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class Button extends NativeViews.Button implements HTMLElement {
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class ContentView
		extends NativeViews.ContentView
		implements HTMLElement
	{
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class DatePicker
		extends NativeViews.DatePicker
		implements HTMLElement
	{
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class DockLayout
		extends NativeViews.DockLayout
		implements HTMLElement
	{
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class FlexboxLayout
		extends NativeViews.FlexboxLayout
		implements HTMLElement
	{
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class FormattedString
		extends NativeViews.FormattedString
		implements HTMLElement
	{
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class GridLayout
		extends NativeViews.GridLayout
		implements HTMLElement
	{
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class HtmlView extends NativeViews.HtmlView implements HTMLElement {
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class Image extends NativeViews.Image implements HTMLElement {
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class Label extends NativeViews.Label implements HTMLElement {
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class ListPicker
		extends NativeViews.ListPicker
		implements HTMLElement
	{
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class ListView extends NativeViews.ListView implements HTMLElement {
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class NavigationButton
		extends NativeViews.NavigationButton
		implements HTMLElement
	{
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class Placeholder
		extends NativeViews.Placeholder
		implements HTMLElement
	{
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class Progress extends NativeViews.Progress implements HTMLElement {
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class ProxyViewContainer
		extends NativeViews.ProxyViewContainer
		implements HTMLElement
	{
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class RootLayout
		extends NativeViews.RootLayout
		implements HTMLElement
	{
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class ScrollView
		extends NativeViews.ScrollView
		implements HTMLElement
	{
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class SearchBar extends NativeViews.SearchBar implements HTMLElement {
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class SegmentedBar
		extends NativeViews.SegmentedBar
		implements HTMLElement
	{
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class SegmentedBarItem
		extends NativeViews.SegmentedBarItem
		implements HTMLElement
	{
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class Slider extends NativeViews.Slider implements HTMLElement {
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class Span extends NativeViews.Span implements HTMLElement {
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class StackLayout
		extends NativeViews.StackLayout
		implements HTMLElement
	{
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class Switch extends NativeViews.Switch implements HTMLElement {
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class TabView extends NativeViews.TabView implements HTMLElement {
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class TabViewItem
		extends NativeViews.TabViewItem
		implements HTMLElement
	{
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class TextField extends NativeViews.TextField implements HTMLElement {
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class TextView extends NativeViews.TextView implements HTMLElement {
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class TimePicker
		extends NativeViews.TimePicker
		implements HTMLElement
	{
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class WebView extends NativeViews.WebView implements HTMLElement {
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export class WrapLayout
		extends NativeViews.WrapLayout
		implements HTMLElement
	{
		style: Style;
		//@ts-ignore
		get className(): string;
		set className(val: string);
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
		//@ts-ignore
		parentNode: ParentNode;
		attributes: { namespace: string; name: string }[];
		localName: string;
		get cssText(): string;
		set cssText(val: string);
		get children(): Element[];
		namespaceURI(): string;
		get innerHTML(): string;
		set innerHTML(value: string);
		get outerHTML(): string;
		set outerHTML(value: string);
		get textContent(): string;
		set textContent(value: string);
		insertBefore(child: Node, ref: Node): Node;
		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string;
		removeAttribute(qualifiedName: string): void;
		removeAttributeNS(namespace: string, localName: string): void;
		setAttributeNS(
			namespace: string,
			qualifiedName: string,
			value: string
		): void;
		getAttributeNS(namespace: string, localName: string): string;
		dispatchEvent(event: Event): boolean;
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		//@ts-ignore
		removeChild(child: Node): Node;
		nodeType: number;
		nodeName: string;
		tagName: string;
		get nextSibling(): Node;
		get previousSibling(): Node;
		get firstChild(): Node;
		get lastChild(): Node;
		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	export const document: Document;

	export function aliasTagName(nameHnadler: (tag: string) => string): void;
	export function isNode(node: any): boolean;
	export const domImpl: {
		Node: Node;
		document: Document;
		isNode(node: any): boolean;
	};
	export function createDocument(): Document;
	export function registerElement(name: string, element: HTMLElement): HTMLElement;
	export function registerDOMElement(
		name: string,
		element: HTMLElement,
		isSvg: boolean
	): HTMLElement;
	export function register(global: any): void;
	export function isElement(element: any): boolean;
	export function createEvent(type: string): Event;
	export function defaultDocumentInit(document: Document): void;
	export function updateAttributeNS(
		self: HTMLElement,
		namespace: string,
		type: string,
		value: any
	): void;

	interface HTMLElementTagNameMap {
		Frame: Frame;
		Page: Page;
		Prop: Prop;
		ItemTemplate: ItemTemplate;
		AbsoluteLayout: AbsoluteLayout;
		ActionBar: ActionBar;
		ActionItem: ActionItem;
		ActivityIndicator: ActivityIndicator;
		Button: Button;
		ContentView: ContentView;
		DatePicker: DatePicker;
		DockLayout: DockLayout;
		FlexboxLayout: FlexboxLayout;
		FormattedString: FormattedString;
		GridLayout: GridLayout;
		HtmlView: HtmlView;
		Image: Image;
		Label: Label;
		ListPicker: ListPicker;
		ListView: ListView;
		NavigationButton: NavigationButton;
		Placeholder: Placeholder;
		Progress: Progress;
		ProxyViewContainer: ProxyViewContainer;
		RootLayout: RootLayout;
		ScrollView: ScrollView;
		SearchBar: SearchBar;
		SegmentedBar: SegmentedBar;
		SegmentedBarItem: SegmentedBarItem;
		Slider: Slider;
		Span: Span;
		StackLayout: StackLayout;
		Switch: Switch;
		TabView: TabView;
		TabViewItem: TabViewItem;
		TextField: TextField;
		TextView: TextView;
		TimePicker: TimePicker;
		WebView: WebView;
		WrapLayout: WrapLayout;
	}

	export const pseudoElements: {
		Prop: Prop;
		ItemTemplate: ItemTemplate;
	};

	export const nativeViews: Omit<
		HTMLElementTagNameMap,
		"Prop" | "ItemTemplate"
	>;

	export const makers: {
		makeTweakable(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeView(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeLayout(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeText(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeEditableText(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeAbsoluteLayout(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeActionBar(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeActionItem(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeActivityIndicator(
			view: NativeViews.ViewBase,
			options: any
		): HTMLElement;
		makeButton(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeContentView(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeDatePicker(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeDockLayout(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeFlexboxLayout(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeFormattedString(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeFrame(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeGridLayout(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeHtmlView(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeImage(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeLabel(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeListPicker(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeListView(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeNavigationButton(view: NativeViews.ViewBase, options: any): HTMLElement;
		makePage(view: NativeViews.ViewBase, options: any): HTMLElement;
		makePlaceholder(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeProgress(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeProxyViewContainer(
			view: NativeViews.ViewBase,
			options: any
		): HTMLElement;
		makeRootLayout(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeScrollView(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeSearchBar(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeSegmentedBar(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeSegmentedBarItem(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeSlider(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeSpan(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeStackLayout(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeSwitch(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeTabView(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeTabViewItem(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeTemplateReceiver(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeTextField(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeTextView(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeTimePicker(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeWebView(view: NativeViews.ViewBase, options: any): HTMLElement;
		makeWrapLayout(view: NativeViews.ViewBase, options: any): HTMLElement;
	};
}
