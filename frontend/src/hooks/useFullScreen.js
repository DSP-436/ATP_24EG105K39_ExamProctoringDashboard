import { useEffect, useRef, useCallback, useState } from 'react';

export default function useFullScreen({ onExit, enabled = true }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const pendingRef = useRef(false);

  const request = useCallback(async () => {
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      } else if (el.msRequestFullscreen) {
        await el.msRequestFullscreen();
      }
      setIsFullScreen(true);
      pendingRef.current = false;
    } catch {
      pendingRef.current = true;
    }
  }, []);

  const exit = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
      setIsFullScreen(false);
    } catch {
      // ignore
    }
  }, []);

  const handleChange = useCallback(() => {
    const fs = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    );
    setIsFullScreen(fs);

    if (!fs && enabled && !pendingRef.current) {
      onExit?.();
      request();
    }
  }, [enabled, onExit, request]);

  const handleKeyDown = useCallback((e) => {
    if (!enabled) return;
    if (e.key === 'Escape' || e.key === 'F11') {
      e.preventDefault();
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('fullscreenchange', handleChange);
    document.addEventListener('webkitfullscreenchange', handleChange);
    document.addEventListener('msfullscreenchange', handleChange);
    document.addEventListener('keydown', handleKeyDown);

    if (isFullScreen === false) {
      request();
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
      document.removeEventListener('webkitfullscreenchange', handleChange);
      document.removeEventListener('msfullscreenchange', handleChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleChange, handleKeyDown, request, isFullScreen]);

  return { isFullScreen, request, exit };
}
