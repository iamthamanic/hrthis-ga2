import React, { useEffect, useRef, useState } from 'react';

import { useLearningStore } from '../../state/learning';
import { VideoContent } from '../../types/learning';

interface UseVideoPlayerProps {
  video: VideoContent;
  onComplete?: () => void;
}

interface VideoEventHandlersParams {
  video: VideoContent;
  setCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
  updateProgress: (videoId: string, time: number) => void;
  completeVideo: (videoId: string) => void;
  onComplete?: () => void;
}

const createVideoEventHandlers = ({
  video,
  setCurrentTime,
  setIsPlaying,
  updateProgress,
  completeVideo,
  onComplete
}: VideoEventHandlersParams) => {
  const handleTimeUpdate = (videoElement: HTMLVideoElement) => {
    setCurrentTime(videoElement.currentTime);
    
    if (Math.floor(videoElement.currentTime) % 5 === 0) {
      updateProgress(video.id, Math.floor(videoElement.currentTime));
    }
  };

  const handleEnded = () => {
    completeVideo(video.id);
    if (onComplete) onComplete();
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  return { handleTimeUpdate, handleEnded, handlePlay, handlePause };
};

const setupVideoEventListeners = (
  videoElement: HTMLVideoElement,
  handlers: ReturnType<typeof createVideoEventHandlers>
) => {
  const timeUpdateHandler = () => handlers.handleTimeUpdate(videoElement);
  
  videoElement.addEventListener('timeupdate', timeUpdateHandler);
  videoElement.addEventListener('ended', handlers.handleEnded);
  videoElement.addEventListener('play', handlers.handlePlay);
  videoElement.addEventListener('pause', handlers.handlePause);

  return () => {
    videoElement.removeEventListener('timeupdate', timeUpdateHandler);
    videoElement.removeEventListener('ended', handlers.handleEnded);
    videoElement.removeEventListener('play', handlers.handlePlay);
    videoElement.removeEventListener('pause', handlers.handlePause);
  };
};

const createVideoControls = (videoRef: React.RefObject<HTMLVideoElement | null>, isPlaying: boolean, playbackSpeed: number, setPlaybackSpeed: (speed: number) => void) => {
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const changeSpeed = (speed?: number) => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const newSpeed = speed || getNextSpeed(speeds, playbackSpeed);
    
    setPlaybackSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  return { togglePlayPause, skipTime, changeSpeed };
};

const createVideoUtils = (video: VideoContent, currentTime: number) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getActiveTranscriptSegment = () => {
    if (!video.transcription) return null;
    
    return video.transcription.segments.find(
      segment => currentTime >= segment.start && currentTime <= segment.end
    );
  };

  return { formatTime, getActiveTranscriptSegment };
};

export const useVideoPlayer = ({ video, onComplete }: UseVideoPlayerProps) => {
  const { updateProgress, completeVideo } = useLearningStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handlers = createVideoEventHandlers({
      video,
      setCurrentTime,
      setIsPlaying,
      updateProgress,
      completeVideo,
      onComplete
    });

    return setupVideoEventListeners(videoElement, handlers);
  }, [video, updateProgress, completeVideo, onComplete]);

  const controls = createVideoControls(videoRef, isPlaying, playbackSpeed, setPlaybackSpeed);
  const utils = createVideoUtils(video, currentTime);

  return {
    videoRef,
    isPlaying,
    currentTime,
    showTranscript,
    playbackSpeed,
    setShowTranscript,
    ...controls,
    ...utils
  };
};

const getNextSpeed = (speeds: number[], currentSpeed: number): number => {
  const currentIndex = speeds.indexOf(currentSpeed);
  const nextIndex = (currentIndex + 1) % speeds.length;
  return speeds[nextIndex];
};