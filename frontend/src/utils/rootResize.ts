export const adjustBodyHeight = () => {
  document.body.style.minHeight = ''
  document.body.style.minHeight = `${document.documentElement.scrollHeight}px`
}

// ResizeObserver to observe size changes
export const resizeObserver = new ResizeObserver(() => {
  adjustBodyHeight()
})

// MutationObserver to observe direct children additions to the body
export const mutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        resizeObserver.observe(node as Element)
      }
    })
  })

  adjustBodyHeight()
})

addEventListener('DOMContentLoaded', () => {
  // Start observing
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: false // Only observe direct children
  })

  const main = document.getElementsByTagName('main')[0]
  mutationObserver.observe(main, {
    childList: true,
    subtree: false // Only observe direct children
  })

  // Observe initial direct children of the body
  document.body.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      resizeObserver.observe(node as Element)
    }
  })
})
