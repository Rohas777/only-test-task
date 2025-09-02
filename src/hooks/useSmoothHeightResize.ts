import { RefObject, useEffect } from "react";

export default function useSmoothHeightResize(
  parent: RefObject<HTMLElement | null>,
  child: RefObject<HTMLElement | null>
) { 
  const updateContainerHeight = () => {
    if (parent.current && child.current) {
      const childHeight = child.current.offsetHeight;
      parent.current.style.height = `${childHeight}px`;
    }
  };

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      updateContainerHeight();
    });

    if (child.current) {
      observer.observe(child.current);
    }

    updateContainerHeight();

    return () => {
      if (child.current) {
        observer.unobserve(child.current);
      }
    };
  }, [parent, child]);

  return {
    updateContainerHeight
  };
}