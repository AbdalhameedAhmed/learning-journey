import type { Note } from "@schemas/course";

type NoteItemProps = {
  note: Note;
  onNoteClick: (time: number) => void;
};

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export default function NoteItem({ note, onNoteClick }: NoteItemProps) {
  return (
    <div className="rounded bg-gray-700 p-2">
      <p className="text-text-small">{note.note}</p>
      <button
        onClick={() => onNoteClick(note.time)}
        className="text-primary text-text-tiny hover:underline"
      >
        {formatTime(note.time)}
      </button>
    </div>
  );
}
