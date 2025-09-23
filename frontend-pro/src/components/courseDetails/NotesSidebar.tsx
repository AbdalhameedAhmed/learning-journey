import { useEffect, useState } from "react";
import type { Note } from "./VideoViewer";
import NoteItem from "./NoteItem";

type NotesSidebarProps = {
  notes: Note[];
  onAddNote: (content: string, time: number) => void;
  onNoteClick: (time: number) => void;
  videoCurrentTime: number;
  videoDuration: number;
};

export default function NotesSidebar({
  notes,
  onAddNote,
  onNoteClick,
  videoCurrentTime,
  videoDuration,
}: NotesSidebarProps) {
  const [newNote, setNewNote] = useState("");
  const [noteTime, setNoteTime] = useState("00:00");
  const [timeError, setTimeError] = useState<string | null>(null);

  useEffect(() => {
    setNoteTime(formatTime(videoCurrentTime));
  }, [videoCurrentTime]);

  const parseTime = (timeStr: string) => {
    const [minutes, seconds] = timeStr.split(":").map(Number);
    if (isNaN(minutes) || isNaN(seconds)) return NaN;
    return minutes * 60 + seconds;
  };

  const handleAddNote = () => {
    const timeRegex = /^[0-5]?\d:[0-5]\d$/;
    if (!timeRegex.test(noteTime)) {
      setTimeError("Invalid time format. Use mm:ss.");
      return;
    }

    const timeInSeconds = parseTime(noteTime);
    if (timeInSeconds > videoDuration) {
      setTimeError("Time cannot be greater than video duration.");
      return;
    }

    setTimeError(null);
    if (newNote.trim()) {
      onAddNote(newNote, timeInSeconds);
      setNewNote("");
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0",
    )}`;
  };

  return (
    <div className="bg-opacity-90 absolute top-0 right-0 z-10 flex h-full w-80 flex-col bg-gray-800 p-4 text-white transition-transform duration-300">
      <h3 className="mb-4 text-lg font-bold">الملاحظات</h3>
      <div className="mb-4">
        <input
          className="w-full rounded bg-gray-700 p-2 text-white"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="اضف ملاحظة جديدة"
        ></input>
        <input
          type="text"
          value={noteTime}
          onChange={(e) => setNoteTime(e.target.value)}
          className="mt-2 w-full rounded bg-gray-700 p-2 text-white"
          placeholder="Time (mm:ss)"
        />
        {timeError && <p className="mt-1 text-xs text-red-500">{timeError}</p>}
        <button
          onClick={handleAddNote}
          className="mt-2 w-full rounded bg-[#FFB732] px-4 py-2 text-white"
        >
          اضف ملاحظة
        </button>
      </div>
      <div className="flex max-h-full flex-col gap-2 overflow-y-auto">
        {notes
          .sort((a, b) => a.time - b.time)
          .map((note) => (
            <NoteItem key={note.id} note={note} onNoteClick={onNoteClick} />
          ))}
      </div>
    </div>
  );
}
