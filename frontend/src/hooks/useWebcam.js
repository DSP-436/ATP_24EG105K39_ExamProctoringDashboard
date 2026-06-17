import { useRef, useState, useCallback, useEffect } from 'react';

const CONSTRAINTS = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'user',
    frameRate: { ideal: 30 },
  },
  audio: false,
};

export default function useWebcam() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState(null);

  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia(CONSTRAINTS);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      const track = stream.getVideoTracks()[0];
      const caps = track.getCapabilities?.();
      const trackSettings = track.getSettings?.();
      setSettings({ capabilities: caps, settings: trackSettings });
      setIsActive(true);
    } catch (err) {
      const message =
        err.name === 'NotAllowedError'
          ? 'Camera access denied. Please allow camera permissions.'
          : err.name === 'NotFoundError'
          ? 'No camera found.'
          : err.name === 'NotReadableError'
          ? 'Camera is in use by another application.'
          : 'Failed to access camera.';
      setError(message);
    }
  }, []);

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setSettings(null);
  }, []);

  const takeSnapshot = useCallback(() => {
    if (!videoRef.current || !streamRef.current) return null;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  const getVideoTrack = useCallback(() => {
    return streamRef.current?.getVideoTracks()[0] || null;
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return { videoRef, isActive, error, settings, start, stop, takeSnapshot, getVideoTrack };
}
