import { isSignal } from "../reactivity";

export function applyProps(container: HTMLElement, props?: any) {
  if (!props) return
  for (const name in props) {
    if (name.startsWith('on') && typeof props[name] === 'function') {
      container.addEventListener(name.slice(2).toLowerCase(), props[name])

    } else if (name === 'className' || name === 'class') {
      container.setAttribute('class', props[name])
      
    } else {
      container.setAttribute(name, props[name])
    }
  }
}

export function appendChild(container: DocumentFragment | HTMLElement, childContent: any) {
  if (childContent == null || childContent === false) return

  if (Array.isArray(childContent)) {
    childContent.forEach((child) => appendChild(container, child)) // recursive

  } else if (isSignal(childContent)) {
    const textNode = document.createTextNode(childContent.value)
    container.appendChild(textNode)
    childContent.signal.sentry.assign(childContent.signal.id, () => textNode.textContent = childContent.value)

  } else if (typeof childContent === 'function') {
    appendChild(container, childContent())

  } else if (typeof childContent === 'string' || typeof childContent === 'number') {
    container.appendChild(document.createTextNode(childContent.toString()))

  } else if (childContent instanceof Node) {
    container.appendChild(childContent)

  } else {
    console.warn("Unhandled child type:", childContent)
  }
}

export function insertChildNode(container: DocumentFragment | HTMLElement | ParentNode, position: Node | null, childContent: any): Node | null {
  if (Array.isArray(childContent)) {
    return childContent.map((child) => insertChildNode(container, position, child)).find(Boolean) || null

  } else if (isSignal(childContent)) {
    const textNode = document.createTextNode(childContent.value)
    container.insertBefore(textNode, position)
    childContent.signal.sentry.assign(childContent.signal.id, () => textNode.textContent = childContent.value)
    return textNode

  } else if (childContent instanceof Node) {
    container.insertBefore(childContent, position)
    return childContent

  } else if (typeof childContent === 'string' || typeof childContent === 'number') {
    const textNode = document.createTextNode(childContent.toString())
    container.insertBefore(textNode, position)
    return textNode

  } else if (typeof childContent === 'function') {
    return insertChildNode(container, position, childContent())

  }
  console.warn("Unhandled child type:", childContent)
  return null
}