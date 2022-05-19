
import { useEffect, useState, useRef } from "react";

const isServer = typeof window === 'undefined'

export default function useScrollInfo(pageBottomLimit = 0) {
  const [scrollInfo, setScrollInfo] = useState({
    isPageTop: false,
    isPageBottom: false,
    isScrolledUp: false,
    isScrolledDown: false,
    scrolledPosition: isServer ? 0 : window.pageYOffset,
    documentHeight: isServer ? 0 : document.documentElement.offsetHeight
  });

  const lastScrollInfo = useRef(scrollInfo);

  const handleScroll = () => {
    
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    const scrolledPosition = isServer ? 0 : Math.ceil(window.pageYOffset);
    const isPageBottom = isServer ? false : (window.innerHeight + scrolledPosition) >= documentHeight - pageBottomLimit;
    const isPageTop = isServer ? true : window.pageYOffset === 0;
    const isScrolledUp = scrolledPosition < lastScrollInfo.current.scrolledPosition;
    const isScrolledDown = scrolledPosition > lastScrollInfo.current.scrolledPosition;
    const scrollInfo = {
      isPageTop,
      isPageBottom,
      isScrolledUp,
      isScrolledDown,
      scrolledPosition,
      documentHeight
    };
    setScrollInfo(scrollInfo);
    lastScrollInfo.current = scrollInfo;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scrollInfo;
}
