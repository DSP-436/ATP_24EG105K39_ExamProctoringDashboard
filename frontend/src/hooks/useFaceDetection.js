import { useEffect, useRef, useCallback } from 'react';
import { HEAD_POSE } from '../utils/constants';

export default function useFaceDetection({
  videoRef,
  onFaceDetected,
  onMultipleFaces,
  onHeadPose,
  interval = 2000,
}) {
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const modelsLoadedRef = useRef(false);
  const faceapiRef = useRef(null);

  const getLandmarkAngles = (landmarks) => {
    const pts = landmarks.positions;
    const noseTip = pts[30];
    const leftEye = pts[36];
    const rightEye = pts[45];
    const noseBridge = pts[27];
    const chin = pts[8];
    const leftEar = pts[0];
    const rightEar = pts[16];

    const faceCenterX = (leftEar.x + rightEar.x) / 2;
    const faceWidth = rightEar.x - leftEar.x;

    const yaw = faceWidth !== 0
      ? ((noseTip.x - faceCenterX) / faceWidth) * 90
      : 0;

    const eyeY = (leftEye.y + rightEye.y) / 2;
    const noseY = noseBridge.y;
    const chinY = chin.y;
    const faceHeight = chinY - noseY;

    const pitch = faceHeight !== 0
      ? ((eyeY - noseTip.y) / faceHeight) * 90
      : 0;

    return { yaw, pitch };
  };

  const drawLandmarks = (ctx, landmarks, detections) => {
    const pts = landmarks.positions;

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    for (let i = 0; i < 17; i++) {
      const p1 = pts[i];
      const p2 = pts[(i + 1) % 17];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    ctx.fillStyle = '#3b82f6';
    pts.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    const noseTip = pts[30];
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(noseTip.x, noseTip.y, 4, 0, Math.PI * 2);
    ctx.fill();

    const box = detections.detection.box;
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.strokeRect(box.x, box.y, box.width, box.height);
  };

  const drawPoseText = (ctx, yaw, pitch) => {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(8, 8, 180, 52);
    ctx.font = '13px monospace';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Yaw:   ${yaw.toFixed(1)}°`, 16, 30);
    ctx.fillText(`Pitch: ${pitch.toFixed(1)}°`, 16, 50);
  };

  const detect = useCallback(async () => {
    if (!videoRef?.current || !videoRef.current.readyState) return;
    const faceapi = faceapiRef.current;
    if (!faceapi) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    try {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({
          inputSize: 320,
          scoreThreshold: 0.5,
        }))
        .withFaceLandmarks();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (detections.length > 1) {
        onMultipleFaces?.(true);
        onFaceDetected?.({ count: detections.length, status: 'multiple_faces' });
        return;
      }

      if (detections.length === 1) {
        const det = detections[0];
        onMultipleFaces?.(false);
        onFaceDetected?.({ count: 1, status: 'visible' });

        let yaw = 0;
        let pitch = 0;
        let poseStatus = 'center';

        if (det.landmarks) {
          const angles = getLandmarkAngles(det.landmarks);
          yaw = angles.yaw;
          pitch = angles.pitch;

          if (pitch < -HEAD_POSE.THRESHOLD_UP) {
            poseStatus = 'up';
          } else if (pitch > HEAD_POSE.THRESHOLD_DOWN) {
            poseStatus = 'down';
          } else if (yaw < -HEAD_POSE.THRESHOLD_LEFT) {
            poseStatus = 'left';
          } else if (yaw > HEAD_POSE.THRESHOLD_RIGHT) {
            poseStatus = 'right';
          }

          drawLandmarks(ctx, det.landmarks, det);
          drawPoseText(ctx, yaw, pitch);

          onHeadPose?.({ yaw, pitch, status: poseStatus });
        }

        return;
      }

      onMultipleFaces?.(false);
      onFaceDetected?.({ count: 0, status: 'not_visible' });
    } catch {
      // face-api may not be ready
    }
  }, [videoRef, onFaceDetected, onMultipleFaces, onHeadPose]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const faceapi = await import('face-api.js');
        faceapiRef.current = faceapi;
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        modelsLoadedRef.current = true;
      } catch {
        // models could not be loaded
      }
    };

    loadModels().then(() => {
      intervalRef.current = setInterval(detect, interval);
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [detect, interval]);

  return { canvasRef, modelsLoaded: modelsLoadedRef.current };
}
