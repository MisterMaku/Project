import { auth } from '@/app/config/firebase';
import { createNote, deleteNote, subscribeToNotes, updateNote } from '@/app/services/notesService';
import { Note } from '@/app/types/notes';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Modal, StyleSheet, Text, TextInput, View } from 'react-native';

export default function NotesScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (!auth.currentUser) {
      router.replace('/login');
      return;
    }

    const unsubscribe = subscribeToNotes(auth.currentUser.uid, (notes) => {
      setNotes(notes);
    });

    return () => unsubscribe();
  }, []);

  const handleAddNote = async () => {
    if (!description.trim()) {
      Alert.alert("Error", "Description cannot be empty");
      return;
    }

    if (!auth.currentUser?.uid) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    setLoading(true);
    try {
      // Combine title and description with a separator
      const noteContent = title ? `${title}\n---\n${description}` : description;
      await createNote(noteContent, auth.currentUser.uid);
      setTitle("");
      setDescription("");
    } catch (error) {
      Alert.alert("Error", "Failed to add note");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNote = async () => {
    if (!editText.trim() || !editingNote) return;

    setLoading(true);
    try {
      await updateNote(editingNote.id, editText);
      setEditingNote(null);
      setEditText("");
    } catch (error) {
      Alert.alert("Error", "Failed to update note");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
    } catch (error) {
      Alert.alert("Error", "Failed to delete note");
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.replace('/login');
    } catch (error) {
      Alert.alert("Error", "Failed to sign out");
    }
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    // Split the note text back into title and description when editing
    const [noteTitle, noteDescription] = note.text.split('\n---\n');
    setEditText(noteDescription || noteTitle);
  };

  const renderNoteText = (text: string) => {
    const [title, description] = text.split('\n---\n');
    return (
      <View>
        {title && <Text style={styles.noteTitle}>{title}</Text>}
        {description && <Text style={styles.noteDescription}>{description}</Text>}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Notes</Text>
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Note title"
          value={title}
          onChangeText={setTitle}
          style={styles.titleInput}
          editable={!loading}
        />
        <TextInput
          placeholder="Note description"
          value={description}
          onChangeText={setDescription}
          style={styles.descriptionInput}
          onSubmitEditing={handleAddNote}
          editable={!loading}
          multiline
        />
        <Button 
          title={loading ? "Processing..." : "Add"} 
          onPress={handleAddNote} 
          disabled={loading || !description.trim()} 
        />
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.noteItem}>
            {renderNoteText(item.text)}
            <View style={styles.noteActions}>
              <Button 
                title="Edit" 
                onPress={() => openEditModal(item)} 
                color="#4CAF50"
                disabled={loading}
              />
              <Button 
                title="Delete" 
                onPress={() => handleDeleteNote(item.id)} 
                color="#ff4444"
                disabled={loading}
              />
            </View>
          </View>
        )}
        contentContainerStyle={styles.notesList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notes yet. Add your first note!</Text>
        }
      />

      {/* Edit Modal */}
      <Modal
        visible={!!editingNote}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditingNote(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Note</Text>
            <TextInput
              value={editText}
              onChangeText={setEditText}
              style={styles.modalInput}
              multiline
            />
            <View style={styles.modalButtons}>
              <Button 
                title="Cancel" 
                onPress={() => setEditingNote(null)} 
                color="#999"
              />
              <Button 
                title="Save" 
                onPress={handleUpdateNote} 
                disabled={loading}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    gap: 10,
    marginBottom: 20,
  },
  titleInput: {
    padding: 10,
    borderWidth: 0, 
    borderColor: '#ccc',
    backgroundColor: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold', 
  },
  descriptionInput: {
    padding: 10,
    borderWidth: 0, 
    borderRadius: 5,
    borderColor: '#ccc',
    backgroundColor: '#fff', 
    minHeight: 100,
    fontSize: 16, 
  },
  notesList: {
    paddingBottom: 20,
  },
  noteItem: {
    padding: 15,
    backgroundColor: '#fff', 
    borderRadius: 5,
    marginBottom: 10,
    borderLeftWidth: 0, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee', 
  },
  noteTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  noteDescription: {
    color: '#555',
  },
  noteMeta: { 
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    minHeight: 100,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
});