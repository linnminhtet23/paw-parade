import { useEffect, useRef } from 'react'

const easeInOutCubic = (value) => value < 0.5
  ? 4 * value * value * value
  : 1 - Math.pow(-2 * value + 2, 3) / 2

export function useSceneNavigation(targetRef, {
  sceneCount = 3,
  transitionDuration = 1200,
  wrapDuration = 850,
  swipeThreshold = 45,
} = {}) {
  //to remember current page without rerendering

  const progressRef = useRef(0)

  useEffect(() => {
    const targetElement = targetRef.current
    if (!targetElement) return undefined

    let gestureActive = false
    let gestureReleaseTimer
    let isAnimating = false
    let animationFrame
    let touchStartY = null
    const lastScene = sceneCount - 1
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousBodyOverflow = document.body.style.overflow

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    window.scrollTo(0, 0)

    const renderProgress = (progress) => {
      progressRef.current = progress
      //separat into two transition
      //introProgress controls Page 1 → Page 2:
      const introProgress = Math.min(progress, 1)
      //walkProgress controls Page 2 → Page 3:
      const walkProgress = Math.max(progress - 1, 0)

      targetElement.style.setProperty('--scroll-progress', introProgress.toFixed(4))
      targetElement.style.setProperty('--walk-progress', walkProgress.toFixed(4))
      targetElement.classList.toggle('is-scrolling', progress > 0.02)
      targetElement.dataset.scene = String(Math.round(progress))
    }

    renderProgress(progressRef.current)

    // to smoothly move to next page
    const animateToScene = (targetScene, wraps = false) => {
      if (isAnimating || targetScene === progressRef.current) return

      cancelAnimationFrame(animationFrame)

      const startProgress = progressRef.current
      const distance = targetScene - startProgress
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const duration = reduceMotion ? 1 : wraps ? wrapDuration : transitionDuration
      const startedAt = performance.now()
      let hasSwappedScene = false
      isAnimating = true

      const animate = (now) => {
        const elapsed = Math.min((now - startedAt) / duration, 1)
        const eased = easeInOutCubic(elapsed)

        if (wraps) {
          if (elapsed >= 0.5 && !hasSwappedScene) {
            renderProgress(targetScene)
            hasSwappedScene = true
          }

          const fadeProgress = elapsed < 0.5 ? elapsed * 2 : (elapsed - 0.5) * 2
          const fade = elapsed < 0.5
            ? 1 - easeInOutCubic(fadeProgress)
            : easeInOutCubic(fadeProgress)
          targetElement.style.opacity = fade.toFixed(4)
        } else {
          renderProgress(startProgress + distance * eased)
        }

        if (elapsed < 1) animationFrame = requestAnimationFrame(animate)
        else {
          renderProgress(targetScene)
          targetElement.style.opacity = '1'
          isAnimating = false
        }
      }

      animationFrame = requestAnimationFrame(animate)
    }

    // decide direction
    const moveOnePage = (direction) => {
      if (isAnimating) return

      const currentScene = Math.round(progressRef.current)
      const wraps = (currentScene === lastScene && direction > 0)
        || (currentScene === 0 && direction < 0)
      const nextScene = wraps
        ? direction > 0 ? 0 : lastScene
        : currentScene + direction

      animateToScene(nextScene, wraps)
    }

    const handleWheel = (event) => {
      if (event.ctrlKey) return

      event.preventDefault()
      if (Math.abs(event.deltaY) < 4 || isAnimating) return

      clearTimeout(gestureReleaseTimer)
      gestureReleaseTimer = window.setTimeout(() => {
        gestureActive = false
      }, 140)

      if (gestureActive) return

      gestureActive = true
      moveOnePage(Math.sign(event.deltaY))
    }

    const handleKeyDown = (event) => {
      const direction = ['ArrowDown', 'PageDown', ' '].includes(event.key)
        ? 1
        : ['ArrowUp', 'PageUp'].includes(event.key)
          ? -1
          : 0

      if (direction === 0) return
      event.preventDefault()
      moveOnePage(direction)
    }

    const handleTouchStart = (event) => {
      touchStartY = event.touches[0]?.clientY ?? null
    }

    const handleTouchEnd = (event) => {
      if (touchStartY === null) return

      const endY = event.changedTouches[0]?.clientY ?? touchStartY
      const distance = touchStartY - endY
      touchStartY = null

      if (Math.abs(distance) >= swipeThreshold) moveOnePage(Math.sign(distance))
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      cancelAnimationFrame(animationFrame)
      clearTimeout(gestureReleaseTimer)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      targetElement.style.opacity = '1'
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousBodyOverflow
    }
  }, [sceneCount, swipeThreshold, targetRef, transitionDuration, wrapDuration])
}
