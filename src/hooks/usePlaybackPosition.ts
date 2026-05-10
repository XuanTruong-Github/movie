const PREFIX = "cine_pos_";
const EXPIRE_MS = 30 * 24 * 60 * 60 * 1000;

function storageKey(movieSlug: string, episodeSlug: string) {
  return `${PREFIX}${movieSlug}_${episodeSlug}`;
}

export function usePlaybackPosition() {
  function savePosition(movieSlug: string, episodeSlug: string, position: number) {
    if (position < 5) return;
    try {
      localStorage.setItem(storageKey(movieSlug, episodeSlug), JSON.stringify({
        position,
        savedAt: Date.now(),
      }));
    } catch {}
  }

  function getPosition(movieSlug: string, episodeSlug: string): number {
    try {
      const raw = localStorage.getItem(storageKey(movieSlug, episodeSlug));
      if (!raw) return 0;
      const { position, savedAt } = JSON.parse(raw);
      if (Date.now() - savedAt > EXPIRE_MS) {
        localStorage.removeItem(storageKey(movieSlug, episodeSlug));
        return 0;
      }
      return position ?? 0;
    } catch {
      return 0;
    }
  }

  function clearPosition(movieSlug: string, episodeSlug: string) {
    try {
      localStorage.removeItem(storageKey(movieSlug, episodeSlug));
    } catch {}
  }

  return { savePosition, getPosition, clearPosition };
}
