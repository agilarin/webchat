import { useEffect, useRef } from "react";
import { useReadStatusesStore } from "@/store";
import Sound from "@/assets/media/pop.mp3";

export function UnreadSoundNotifier() {
  const unreadCounts = useReadStatusesStore.use.unreadCounts();
  const readStatusesLoading = useReadStatusesStore.use.readStatusesLoading();
  const prevUnreadCountsRef = useRef<Record<string, number>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(Sound);
  }, []);

  useEffect(() => {
    Object.entries(unreadCounts).forEach(([chatId, currentCount]) => {
      const loading = readStatusesLoading[chatId];
      if (loading || !currentCount) return;

      const prevCount = prevUnreadCountsRef.current[chatId];

      if (prevCount !== undefined && currentCount > prevCount) {
        audioRef.current?.play().catch((e) => {
          console.warn("Не удалось воспроизвести звук:", e);
        });
      }

      prevUnreadCountsRef.current[chatId] = currentCount;
    });
  }, [unreadCounts, readStatusesLoading]);

  return null;
}
