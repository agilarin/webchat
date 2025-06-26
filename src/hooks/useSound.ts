import {useEffect, useState} from "react";


export function useSound(src: string) {
  const [sound, setSound] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    setSound(new Audio(src))
  }, [src])

  return sound
}