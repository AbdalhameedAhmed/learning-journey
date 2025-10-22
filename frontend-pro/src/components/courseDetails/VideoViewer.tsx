import { useGetNotes } from "@/hooks/courseContent/useGetNotes";
import {
  Fullscreen,
  Minimize,
  NotebookText,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import NotesSidebar from "./NotesSidebar";
import clsx from "clsx";

export default function VideoViewer({
  url,
  lessonId,
}: {
  url: string;
  lessonId: number;
}) {
  const { notes } = useGetNotes(lessonId);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressContainerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const toggleFullScreen = () => {
    const videoContainer = videoContainerRef.current;
    if (!videoContainer) return;

    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen().catch((err) => {
        alert(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`,
        );
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  });

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume > 0 ? volume : 0.5;
        setVolume(volume > 0 ? volume : 0.5);
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setVolume(0);
        setIsMuted(true);
      }
    }
  };

  const handlePlaybackRateChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newPlaybackRate = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.playbackRate = newPlaybackRate;
      setPlaybackRate(newPlaybackRate);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const newProgress =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setCurrentTime(videoRef.current.currentTime);
    setDuration(videoRef.current.duration);
    setProgress(newProgress);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const handleProgressClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressContainerRef.current) return;
    const progressContainer = progressContainerRef.current;
    const rect = progressContainer.getBoundingClientRect();
    const isRtl = getComputedStyle(progressContainer).direction === "rtl";

    const clickPositionInPixels = isRtl
      ? rect.right - e.clientX
      : e.clientX - rect.left;

    const percentage = (clickPositionInPixels / rect.width) * 100;

    const newTime = (percentage / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(percentage);
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleNoteClick = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      if (videoRef.current.paused || videoRef.current.ended) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div
      ref={videoContainerRef}
      className="group/video relative mx-auto flex w-full max-w-[1400px] flex-col rounded-lg bg-gray-900 shadow-lg"
    >
      <video
        ref={videoRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
        className="h-auto w-full flex-1"
        onClick={togglePlayPause}
      />
      {showNotes && (
        <NotesSidebar
          lessonId={lessonId}
          notes={notes}
          onNoteClick={handleNoteClick}
          videoCurrentTime={videoRef.current?.currentTime ?? 0}
          videoDuration={videoRef.current?.duration ?? 0}
        />
      )}

      <div className="bg-opacity-75 flex flex-col items-center gap-2 bg-black p-4 group-[:fullscreen]/video:absolute group-[:fullscreen]/video:bottom-0 group-[:fullscreen]/video:w-full">
        <div
          ref={progressContainerRef}
          onClick={handleProgressClick}
          className="relative h-2 w-full cursor-pointer rounded-lg bg-gray-500"
        >
          <div
            className="bg-primary dark:bg-dark-primary h-full rounded-lg"
            style={{ width: `${progress}%` }}
          ></div>
          {notes?.map((note) => {
            if (!videoRef.current?.duration) return null;
            const notePosition = (note.time / videoRef.current.duration) * 100;
            return (
              <div
                key={note.id}
                className="group/note-indicator absolute -top-1 h-4 w-4"
                style={{ insetInlineStart: `${notePosition}%` }}
              >
                <div className="h-full w-1 rounded-full bg-white"></div>
                <div className="invisible absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform rounded bg-black px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover/note-indicator:visible group-hover/note-indicator:opacity-100">
                  {note.note}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Play/Pause Button */}
            <button onClick={togglePlayPause}>
              {isPlaying && !videoRef.current?.ended ? (
                <Pause color="white" />
              ) : (
                <Play color="white" className="-scale-x-100" />
              )}
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="text-white">
                {isMuted || volume === 0 ? (
                  <VolumeX size={20} className="-scale-x-100" />
                ) : (
                  <Volume2 size={20} className="-scale-x-100" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="h-2 w-24 cursor-pointer appearance-none rounded-lg bg-gray-500"
              />
            </div>

            {/* Time Display */}
            <span className="text-white">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Playback Speed Control */}
            <select
              value={playbackRate}
              onChange={handlePlaybackRateChange}
              className="rounded bg-gray-700 px-2 py-1 text-white"
            >
              <option value="0.25">0.25x</option>
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="1.75">1.75x</option>
              <option value="2">2x</option>
            </select>

            {/* Notes Button */}
            <button onClick={() => setShowNotes(!showNotes)}>
              <NotebookText
                className={clsx({
                  "text-white": !showNotes,
                  "text-primary": showNotes,
                })}
              />
            </button>

            {/* Fullscreen Button */}
            <button onClick={toggleFullScreen}>
              {isFullScreen ? (
                <Minimize color="white" />
              ) : (
                <Fullscreen color="white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
