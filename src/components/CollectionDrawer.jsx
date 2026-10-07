import React, { useEffect } from 'react'

const CollectionDrawer = ({collectionOpen, onCollectionClose}) => {
  useEffect(() => {
  if (!collectionOpen) return undefined

  const previouslyFocused = document.activeElement
  const previousHtmlOverflow =
    document.documentElement.style.overflow
  const previousBodyOverflow =
    document.body.style.overflow

  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'

  const focusFrame = window.requestAnimationFrame(() => {
    closeButtonRef.current?.focus()
  })

  const handleKeyDown = (event) => {
    // Prevent the page's arrow-key scene navigation.
    event.stopPropagation()

    if (event.key === 'Escape') {
      onClose()
      return
    }

    if (event.key !== 'Tab') return

    const elements = Array.from(
      panelRef.current?.querySelectorAll(focusableSelector) ?? [],
    )

    const firstElement = elements[0]
    const lastElement = elements.at(-1)

    if (!firstElement || !lastElement) return

    if (
      event.shiftKey &&
      document.activeElement === firstElement
    ) {
      event.preventDefault()
      lastElement.focus()
    } else if (
      !event.shiftKey &&
      document.activeElement === lastElement
    ) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  document.addEventListener('keydown', handleKeyDown)

  return () => {
    window.cancelAnimationFrame(focusFrame)
    document.removeEventListener('keydown', handleKeyDown)

    document.documentElement.style.overflow =
      previousHtmlOverflow
    document.body.style.overflow =
      previousBodyOverflow

    previouslyFocused?.focus()
  }
}, [collectionOpen, onCollectionClose])
  return (
    <div className={`collection-drawer ${collectionOpen ? 'open' : ''}`}>
      CollectionDrawer
    </div>
  )
}

export default CollectionDrawer