import { SignalGuard } from "@core/reactivity/signal";
import { isSignal, setCurrentComputation } from "../reactivity/store";

export function h(tag: any, props?: any, ...children: any[]): HTMLElement {
  if (tag instanceof Node) {
    // @ts-ignore
    return tag;
  }  
  
  if (typeof tag === 'function') {
      return tag({ ...props, children });
    }
  
    const element = document.createElement(tag);

    if (props) {
      for (const name in props) {
        if (name.startsWith('on') && typeof props[name] === 'function') {
          element.addEventListener(name.slice(2).toLowerCase(), props[name]);
        } else if (name === 'className' || name === 'class' ) {
          element.setAttribute('class', props[name])
        } else {
          element.setAttribute(name, props[name]);
        }
      }
    }

    function appendChild(child: any) {
      if (child == null || child === false) return

      if (Array.isArray(child)) {
        child.forEach(appendChild) // recursive

      } else if (isSignal(child)) {
        const textNode = document.createTextNode(child.value)
        element.appendChild(textNode)
        child.signal.sentry.assign(child.signal.id, () => textNode.textContent = child.value)

      } else if (child instanceof Node) {
        element.appendChild(child)
        
      } else {
        element.appendChild(document.createTextNode(child.toString()))
      }
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

    update()

    return container
}