Element;
declare module "dominative" {
	import {
		Page as NSPage,
		Frame as NSFrame,
		ViewBase,
	} from "@nativescript/core";

	export function isNode(node: any): boolean;
	export function isElement(element: any): boolean;
	export function createEvent(type: string): Event;
	export function defaultDocumentInit(document: Document): void;
	export function updateAttributeNS(
		self: Element,
		namespace: string,
		type: string,
		value: any
	);

	export interface NSElementTagNameMap {
		Frame: Frame;
		Page: Page;
	}

	export interface Node {
		constructor(public nodeType: number, public nodeName: string);
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

	export interface Text extends Node {
		constructor(text: string);
		set textContent(value: string);
		get textContent(value: string);
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

	export interface Element extends Node, EventTarget, ParentNode {
		attributes: { namespace: string; name: string }[];
		style: any;
		localName: string;
		get className(): string;

		set className(val: string);

		get cssText(): string;
		set cssText(val: string);

		get children(): Element[];

		namespaceURI(): string;

		get innerHTML(): string;

		set innerHTML(value: string);

		get outerHTML(): string;

		set outerHTML(): string;

		get textContent(): string;

		set textContent(value: string);

		insertBefore(child: Node, ref: Node);

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
		constructor(data: string);
	}

	export interface ParentNode extends Node {
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get children(): Node[];
		get childNodes(): Node;
		append(...nodes: Node[]);
		insertBefore(child: Node, ref: Node): Node;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		get textContent(): string;
		set textContent(value: string);
		removeChild(child: Node): Node;
	}

	export interface DocumentFragment extends ParentNode {}

	export interface SVGElement extends Element {}

	export interface HTMLElement extends Element {}

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

	export interface Document extends Element {
		createElement<K extends keyof NSElementTagNameMap>(
			tagName: K,
			options?: ElementCreationOptions
		): NSElementTagNameMap[K];
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

	export class Frame extends NSFrame implements Element {}
	export class Page extends NSPage implements Element {}
}
