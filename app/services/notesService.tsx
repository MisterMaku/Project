import { db } from '@/app/config/firebase';
import { Note } from '@/app/types/notes';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore';

export const subscribeToNotes = (userId: string, callback: (notes: Note[]) => void) => {
  const q = query(
    collection(db, 'notes'),
    where('userId', '==', userId)
  );

  return onSnapshot(q, (querySnapshot) => {
    const notesArray: Note[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      notesArray.push({
        id: doc.id,
        text: data.text,
        userId: data.userId,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      });
    });
    callback(notesArray);
  });
};

export const createNote = async (text: string, userId: string) => {
  await addDoc(collection(db, "notes"), {
    text,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const updateNote = async (id: string, newText: string) => {
  await updateDoc(doc(db, "notes", id), {
    text: newText,
    updatedAt: serverTimestamp()
  });
};

export const deleteNote = async (id: string) => {
  await deleteDoc(doc(db, "notes", id));
};