import { useEffect, useRef, useCallback } from 'react';

export default function useTabDetection({
  onTabSwitch,
  onMinimize,
  onScreenshotAttempt,
  onRightClick,
  onDevToolsOpen,
  enabled = true,
}) {
  const isVisibleRef = useRef(true);
  const devToolsOpenRef = useRef(false);

  const checkDevTools = useCallback(() => {
    const threshold = 160;
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;
    const isOpen = widthDiff > threshold || heightDiff > threshold;

    if (isOpen && !devToolsOpenRef.current) {
      devToolsOpenRef.current = true;
      onDevToolsOpen?.();
    } else if (!isOpen) {
      devToolsOpenRef.current = false;
    }
  }, [onDevToolsOpen]);

  const handleVisibility = useCallback(() => {
    if (document.hidden && enabled) {
      isVisibleRef.current = false;
      onMinimize?.();
      onTabSwitch?.();
    } else {
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
      }
    }
  }, [enabled, onTabSwitch, onMinimize]);

  const handleBlur = useCallback(() => {
    if (enabled) {
      onTabSwitch?.();
    }
  }, [enabled, onTabSwitch]);

  const handleFocus = useCallback(() => {
    if (enabled) {
      checkDevTools();
    }
  }, [enabled, checkDevTools]);

  const handleKeyDown = useCallback((e) => {
    if (!enabled) return;

    const isPrintScreen = e.key === 'PrintScreen';
    const isCtrlShiftS = (e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's';
    const isCtrlShiftI = (e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'i';
    const isF12 = e.key === 'F12';
    const isCtrlU = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u';
    const isCtrlShiftC = (e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c';

    if (isPrintScreen || isCtrlShiftS) {
      e.preventDefault();
      onScreenshotAttempt?.();
    }

    if (isF12 || isCtrlShiftI || isCtrlU || isCtrlShiftC) {
      e.preventDefault();
      onDevToolsOpen?.();
    }
  }, [enabled, onScreenshotAttempt, onDevToolsOpen]);

  const handleContextMenu = useCallback((e) => {
    if (enabled) {
      e.preventDefault();
      onRightClick?.();
    }
  }, [enabled, onRightClick]);

  const handleCopyPaste = useCallback((e) => {
    if (enabled) {
      e.preventDefault();
    }
  }, [enabled]);

  const handleResize = useCallback(() => {
    if (enabled) {
      checkDevTools();
    }
  }, [enabled, checkDevTools]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibility);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('cut', handleCopyPaste);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('resize', handleResize);

    const devInterval = setInterval(checkDevTools, 2000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('cut', handleCopyPaste);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('resize', handleResize);
      clearInterval(devInterval);
    };
  }, [
    handleVisibility,
    handleKeyDown,
    handleContextMenu,
    handleCopyPaste,
    handleBlur,
    handleFocus,
    handleResize,
    checkDevTools,
  ]);

  return { isVisible: isVisibleRef.current };
}
