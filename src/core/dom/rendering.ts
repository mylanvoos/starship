import { SignalGuard } from "../reactivity/signal";
import { isSignal, setCurrentComputation } from "../reactivity/store";

export function h(tag: any, props?: any, ...children: any[]): HTMLElement {
  if (tag instanceof Node) {
    // @ts-ignore
    return tag
  }

  if (typeof tag === 'function') {
    console.log("hui")
    console.log(tag)
    return tag({ ...props, children });
  }

  console.log(tag)

  const element = document.createElement(tag);

  if (props) {
    for (const name in props) {
      if (name.startsWith('on') && typeof props[name] === 'function') {
        element.addEventListener(name.slice(2).toLowerCase(), props[name]);
      } else if (name === 'className' || name === 'class') {
        element.setAttribute('class', props[name])
      } else {
        element.setAttribute(name, props[name]);
      }
    }
  }

  console.log("here")
  function appendChild(child: any) {
    if (child == null || child === false) return

    console.log("inside appendCHIld")

    if (Array.isArray(child)) {
      console.log("here now")
      child.forEach(appendChild) // recursive

    } else if (isSignal(child)) {
      const textNode = document.createTextNode(child.value)
      element.appendChild(textNode)
      child.signal.sentry.assign(child.signal.id, () => textNode.textContent = child.value)

    } else if (typeof child === 'function') {
      console.log("hi")
      const result = child()
      appendChild(result)

    } else if (child instanceof Node) {
      console.log("node")
      element.appendChild(child)

    } else {
      console.log("else")
      element.appendChild(document.createTextNode(child.toString()))
    }

    console.log("nothing")
  }

  children.flat().forEach(appendChild)

  return element;
}

export const Fragment = (props: { children: any[] }) => props.children

// Checks if when is a signal and assigns update to its listeners in Sentry
export function Show(props: { when: (() => boolean) | SignalGuard<boolean>; children: any[] }): Comment {
  const { when, children } = props
  const container = document.createComment("Show")
  let currentChildNodes: Node[] = []

  const evaluateWhen = () => {
    if (typeof when === 'function') {
      return when()
    } else if (when instanceof SignalGuard) {
      return when.value
    } else {
      return Boolean(when)
    }
  }

  const update = () => {
    const parent = container.parentNode;

    if (!parent) return;

    currentChildNodes.forEach((child) => parent.removeChild(child));
    currentChildNodes = [];

    // conditional rendering
    if (evaluateWhen()) {
      children.flat().forEach((child) => {
        function appendChild(node) {
          if (node == null || node === false) return;

          if (Array.isArray(node)) {
            node.forEach(appendChild);
          } else if (node instanceof Node) {
            parent.insertBefore(node, container.nextSibling);
            currentChildNodes.push(node);
          } else if (isSignal(node)) {
            const textNode = document.createTextNode(node.value);
            parent.insertBefore(textNode, container.nextSibling);
            currentChildNodes.push(textNode);
            node.signal.sentry.assign(node.signal.id, () => {
              textNode.textContent = node.value;
            });
          } else if (typeof node === 'string' || typeof node === 'number') {
            const textNode = document.createTextNode(node.toString());
            parent.insertBefore(textNode, container.nextSibling);
            currentChildNodes.push(textNode);
          } else if (typeof node === 'object' && node !== null && 'tag' in node) {
            const { tag, props = {}, children: childElements = [] } = node;
            const element = h(tag, props, ...childElements);
            parent.insertBefore(element, container.nextSibling);
            currentChildNodes.push(element);
          } else if (typeof node === 'function') {
            const result = node();
            appendChild(result);
          } else {
            console.warn("Unhandled child type in Show:", node);
          }
        }

        appendChild(child);
      });
    }
  };

  if (when instanceof SignalGuard) {
    when.signal.sentry.assign(when.signal.id, update)
  } else if (typeof when === 'function') {
    // start tracking, then eval 'when' once so that any signals accessed will register `update` as a listener
    // only signals accessed during the evaluation of `when` are tracked
    setCurrentComputation(update)
    evaluateWhen()
    setCurrentComputation(null)
  }

  // defer the initial update() call until after component has been attached to DOM
  // previously calling update() right away causes const parent = container.parentNode to be null
  Promise.resolve().then(update)

  return container
}

/**
 * Looping over elements in array
 * <For each={signal3}>
    {(item, index) => (
      <div>
        Item {index}: {item}
      </div>
    )}
 * </For>
 * 
 * Looping over a range of indices
 * <For each={Array.from({ length: signal3 }, (_, index) => index)} range={true}>
    {(index) => (
      <div>
        Index: {index}
      </div>
    )}
 * </For>
 */
export function For<T>(props: {
  each: any[]
  range?: boolean; // if <For {item}:in:{array}> or <For {index}:range:{array.length}>
  children: (itemOrIndex: any, index: number) => any
}): DocumentFragment {

  console.log("here")
  // Hold all generated element
  const container = document.createDocumentFragment()

  if (props.range) {
    console.log("HERE:", props)
  }

  return container
}