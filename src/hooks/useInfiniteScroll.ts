import { useEffect, useRef, useCallback } from "react"

// target     — ref attached to the last item or a sentinel div at bottom
// onLoadMore — function to call when bottom is reached
// hasMore    — stop observing when no more data
// loading    — don't trigger while already fetching

const useInfiniteScroll = (
    onLoadMore: () => void,
    hasMore: boolean,
    loading: boolean
) => {
    // ref to attach to the last element or a sentinel div
    const observerRef = useRef<IntersectionObserver | null>(null)
    const sentinelRef = useRef<HTMLDivElement | null>(null)

    const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
        const first = entries[0]
        if (first.isIntersecting && hasMore && !loading) {
            onLoadMore()
        }
    }, [onLoadMore, hasMore, loading])

    useEffect(() => {
        // cleanup previous observer before creating new one
        if (observerRef.current) {
            observerRef.current.disconnect()
        }

        observerRef.current = new IntersectionObserver(handleIntersect, {
            root: null,       // observe relative to viewport
            rootMargin: "0px",
            threshold: 0.1    // trigger when 10% of sentinel is visible
        })

        if (sentinelRef.current) {
            observerRef.current.observe(sentinelRef.current)
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [handleIntersect])

    return sentinelRef
}

export default useInfiniteScroll
