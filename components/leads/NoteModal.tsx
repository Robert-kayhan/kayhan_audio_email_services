"use client";

import React, { useState } from "react";
import { useAddNotesMutation } from "@/store/api/lead/leadFollowApi";

type Note = {
  id: number;
  content: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  leadId: string;
  refetch : any
};

export default function NoteModal({ isOpen, onClose, notes, setNotes, leadId ,refetch}: Props) {
  const [note, setNote] = useState("");
  const [addNotes, { isLoading }] = useAddNotesMutation();

  const handleAdd = async () => {
  const trimmedNote = note.trim();
  if (!trimmedNote) return;

  try {
    const data = {
      id: leadId,
      note: trimmedNote,
    };
    await addNotes(data).unwrap();
    await refetch(); // await this to ensure data is fresh before next render
    setNote("");
    onClose();
  } catch (error) {
    console.error("Failed to add note:", error);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add Note</h2>
        <textarea
          className="w-full p-2 border rounded text-gray-900 dark:text-white dark:bg-gray-700"
          rows={4}
          placeholder="Write your note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-4 py-2 rounded"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Note"}
          </button>
        </div>
      </div>
    </div>
  );
}
