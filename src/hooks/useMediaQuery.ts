import {useLayoutEffect, useState} from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (query) {
      return window.matchMedia(query).matches
    }
    return false
  });

  useLayoutEffect(() => {
    if (!query) {
      return
    }

    const matchMedia = window.matchMedia(query);
    const handleMatch = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    };

    matchMedia.addEventListener('change', handleMatch);
    return () => matchMedia.removeEventListener('change', handleMatch);
  }, [query]);

  return matches;
}