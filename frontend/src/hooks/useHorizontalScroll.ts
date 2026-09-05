import { useEffect, useRef, useState } from 'react'

const SCROLL_AMOUNT = 300

export function useHorizontalScroll() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current

    if (!container) {
      return
    }

    setCanScrollLeft(container.scrollLeft > 0)

    setCanScrollRight(
      container.scrollLeft + container.clientWidth <
        container.scrollWidth - 1,
    )
  }

  useEffect(() => {
    const container = scrollContainerRef.current

    if (!container) {
      return
    }

    updateScrollButtons()

    container.addEventListener('scroll', updateScrollButtons)
    window.addEventListener('resize', updateScrollButtons)

    return () => {
      container.removeEventListener('scroll', updateScrollButtons)
      window.removeEventListener('resize', updateScrollButtons)
    }
  }, [])

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({
      left: -SCROLL_AMOUNT,
      behavior: 'smooth',
    })
  }

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({
      left: SCROLL_AMOUNT,
      behavior: 'smooth',
    })
  }

  return {
    scrollContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight,
  }
}
