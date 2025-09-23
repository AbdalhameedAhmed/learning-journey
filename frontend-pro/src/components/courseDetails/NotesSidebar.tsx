import { useState } from "react";
import type { Note } from "./VideoViewer";
import NoteItem from "./NoteItem";

type NotesSidebarProps = {
  notes: Note[];
  onAddNote: (content: string) => void;
  onNoteClick: (time: number) => void;
  videoCurrentTime: number;
};

export default function NotesSidebar({
  notes,
  onAddNote,
  onNoteClick,
}: NotesSidebarProps) {
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(newNote);
      setNewNote("");
    }
  };

  return (
    <div className="bg-opacity-90 absolute top-0 right-0 z-10 h-full w-80 bg-gray-800 p-4 text-white transition-transform duration-300">
      <h3 className="mb-4 text-lg font-bold">Notes</h3>
      <div className="mb-4">
        <textarea
          className="w-full rounded bg-gray-700 p-2 text-white"
          rows={3}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a new note..."
        ></textarea>
        <button
          onClick={handleAddNote}
          className="mt-2 w-full rounded bg-[#FFB732] px-4 py-2 text-white"
        >
          Add Note
        </button>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto">
        {notes
          .sort((a, b) => a.time - b.time)
          .map((note) => (
            <NoteItem key={note.id} note={note} onNoteClick={onNoteClick} />
          ))}
      </div>
    </div>
  );
}
