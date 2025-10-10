import { useDeleteNote } from "@/hooks/courseContent/useDeleteNote";
import type { Note } from "@schemas/course";
import { Trash } from "lucide-react";

type NoteItemProps = {
  note: Note;
  lessonId: number;
  onNoteClick: (time: number) => void;
};

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export default function NoteItem({
  note,
  lessonId,
  onNoteClick,
}: NoteItemProps) {
  const { deleteNote } = useDeleteNote(lessonId);

  return (
    <div className="flex items-center justify-between rounded bg-gray-700 p-2">
      <div>
        <p className="text-text-small">{note.note}</p>
        <button
          onClick={() => onNoteClick(note.time)}
          className="text-primary text-text-tiny hover:underline"
        >
          {formatTime(note.time)}
        </button>
      </div>
      <button className="cursor-pointer" onClick={() => deleteNote(note.id)}>
        <Trash className="text-red-400" size={20} />
      </button>
    </div>
  );
}
