import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import NotificationService from '@/services/NotificationService';
import { useNotifications, useNotificationTracking } from '@/contexts/NotificationContext';
import { apiService, SmartNote as ApiNote } from '@/services/ApiService';

interface ImageElement {
  id: string;
  uri: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
  textOverlay?: {
    text: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
  };
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'work' | 'development' | 'follow-up' | 'other';
  color: string;
  icon: string;
  image?: string;
  images?: ImageElement[];
  reminder?: {
    enabled: boolean;
    date: Date;
    repeat: 'none' | 'daily' | 'weekly' | 'monthly';
    notificationId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const noteCategories = {
  work: {
    label: 'عمل',
    icon: '💼',
    color: '#3B82F6'
  },
  development: {
    label: 'development',
    icon: '📚',
    color: '#10B981'
  },
  'follow-up': {
    label: 'متابعة',
    icon: '📍',
    color: '#F59E0B'
  },
  other: {
    label: 'أخرى',
    icon: '🗂️',
    color: '#6B7280'
  }
};

// Convert API note to local note format
const convertApiNoteToLocal = (apiNote: ApiNote): Note => {
  // Map API categories to local categories
  const categoryMap: { [key: string]: string } = {
    'WORK': 'work',
    'IDEAS': 'development',  // Map IDEAS back to development
    'FOLLOW_UP': 'follow-up',
    'OTHER': 'other'
  };

  const localCategory = categoryMap[apiNote.category] || 'other';

  return {
    id: apiNote.id,
    title: apiNote.title,
    content: apiNote.content,
    category: localCategory as 'work' | 'development' | 'follow-up' | 'other',
    color: noteCategories[localCategory as keyof typeof noteCategories]?.color || '#6B7280',
    icon: noteCategories[localCategory as keyof typeof noteCategories]?.icon || '🗂️',
    reminder: apiNote.smartReminderEnabled ? {
      enabled: true,
      date: apiNote.specificDate ? new Date(apiNote.specificDate) : new Date(),
      repeat: apiNote.reminderType === 'EVERY_HOUR' ? 'daily' : 'none',
      notificationId: undefined
    } : undefined,
    createdAt: new Date(apiNote.createdAt),
    updatedAt: new Date(apiNote.updatedAt),
  };
};

// Convert local note to API format
const convertLocalNoteToApi = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
  console.log('convertLocalNoteToApi: Input note category:', note.category);
  
  // Map local categories to API categories - ensure all valid categories are covered
  const categoryMap: { [key: string]: string } = {
    'work': 'WORK',
    'development': 'WORK',  // Map development to WORK
    'follow-up': 'FOLLOW_UP',
    'personal': 'OTHER',
    'other': 'OTHER',
    'ideas': 'OTHER',
    'notes': 'OTHER',
    'reminder': 'OTHER',
    'task': 'WORK',
    'project': 'WORK'
  };

  // Always default to OTHER if category is not recognized
  const apiCategory = categoryMap[note.category?.toLowerCase()] || 'OTHER';
  console.log('convertLocalNoteToApi: Mapped to API category:', apiCategory);

  return {
    title: note.title,
    content: note.content,
    category: apiCategory,
    smartReminderEnabled: note.reminder?.enabled || false,
    reminderType: note.reminder?.enabled ? 'DAY_AND_TIME' as const : undefined,
    specificDate: note.reminder?.enabled ? note.reminder.date.toISOString().split('T')[0] : undefined,
    specificTime: note.reminder?.enabled ? note.reminder.date.toTimeString().slice(0, 5) : undefined,
  };
};

export const [NotesProvider, useNotes] = createContextHook(() => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { scheduleNoteReminder, scheduleNoteReminder3Hours } = useNotifications();
  const { trackNotesActivity } = useNotificationTracking();

  const setupNotifications = useCallback(async () => {
    if (Platform.OS === 'web') {
      console.log('Notifications not supported on web');
      return;
    }
    console.log('Reminder system initialized');
  }, []);

  const saveNotes = useCallback(async (updatedNotes: Note[]) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    } catch (error) {
      console.log('Error saving notes:', error);
    }
  }, []);

  const scheduleNotification = useCallback(async (note: Note) => {
    if (!note.reminder?.enabled) return;

    try {
      // Cancel existing notification if any
      if (note.reminder.notificationId) {
        await NotificationService.cancelNotification(note.reminder.notificationId);
      }

      // Use smart notification service
      const noteTitle = note.title || note.content.substring(0, 50) + '...';
      const notificationId = await scheduleNoteReminder(noteTitle, note.reminder.date);

      if (notificationId) {
        // Update the note with the notification ID
        const updatedNotes = notes.map(n => 
          n.id === note.id 
            ? { ...n, reminder: { ...n.reminder!, notificationId } }
            : n
        );
        setNotes(updatedNotes);
        await saveNotes(updatedNotes);
        console.log('✅ تم تعيين تذكير ذكي للملاحظة:', {
          title: noteTitle,
          reminderTime: note.reminder.date.toLocaleString('ar-SA'),
          notificationId
        });
      } else {
        console.log('⚠️ فشل في جدولة التذكير للملاحظة:', noteTitle);
      }
    } catch (error) {
      console.log('Error setting smart reminder:', error);
    }
  }, [notes, saveNotes, scheduleNoteReminder]);

  const loadNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Check if user is authenticated before making API calls
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token available, loading from local storage only');
        // Load from local storage only
        try {
          const savedNotes = await AsyncStorage.getItem('notes');
          if (savedNotes) {
            const parsedNotes = JSON.parse(savedNotes);
            setNotes(parsedNotes);
            console.log('Loaded notes from local storage:', parsedNotes.length);
          } else {
            console.log('No local notes found');
            setNotes([]);
          }
        } catch (localError) {
          console.log('Error loading local notes:', localError);
          setNotes([]);
        }
        return;
      }
      
      // Set token for API service
      apiService.setToken(token);
      
      const response = await apiService.getAllNotes();
      const localNotes = response.notes.map(convertApiNoteToLocal);
      setNotes(localNotes);
    } catch (error) {
      console.log('Error loading notes:', error);
      // Fallback to local storage if API fails
      try {
        const storedNotes = await AsyncStorage.getItem('notes');
        if (storedNotes) {
          const parsedNotes = JSON.parse(storedNotes).map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
            reminder: note.reminder ? {
              ...note.reminder,
              date: new Date(note.reminder.date)
            } : undefined
          }));
          setNotes(parsedNotes);
        }
      } catch (localError) {
        console.log('Error loading local notes:', localError);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
    setupNotifications();
  }, [loadNotes, setupNotifications]);

  const addNote = useCallback(async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('NotesContext: Adding note with data:', noteData);
      
      // Check if user is authenticated before making API calls
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token available, saving locally only');
        // Save locally only
        const newNote: Note = {
          ...noteData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const updatedNotes = [...notes, newNote];
        setNotes(updatedNotes);
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
        return newNote;
      }
      
      // Set token for API service
      apiService.setToken(token);
      
      const apiNoteData = convertLocalNoteToApi(noteData);
      console.log('NotesContext: API note data:', apiNoteData);
      
      try {
        const response = await apiService.createNote(apiNoteData);
        console.log('NotesContext: API response:', response);
        const newNote = convertApiNoteToLocal(response.note);
        console.log('NotesContext: Converted note:', newNote);

        const updatedNotes = [...notes, newNote];
        setNotes(updatedNotes);

        if (newNote.reminder?.enabled) {
          await scheduleNotification(newNote);
        }

        // Track activity for smart notifications
        await trackNotesActivity();
      } catch (error) {
        console.log('API create note failed, creating locally:', error);
        // Create note locally if API fails
        const newNote: Note = {
          ...noteData,
          id: `local_${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const updatedNotes = [...notes, newNote];
        setNotes(updatedNotes);

        // Save to local storage
        await AsyncStorage.setItem('smart_notes', JSON.stringify(updatedNotes));

        if (newNote.reminder?.enabled) {
          await scheduleNotification(newNote);
        }

        // Track activity for smart notifications
        await trackNotesActivity();
      }

      // Schedule 3-hour reminder
      try {
        const finalNote = notes[notes.length - 1];
        if (finalNote) {
          await scheduleNoteReminder3Hours(finalNote.title);
          console.log('3-hour reminder scheduled for note:', finalNote.title);
        }
      } catch (reminderError) {
        console.error('Error scheduling 3-hour reminder:', reminderError);
      }

      return notes[notes.length - 1];
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  }, [notes, scheduleNotification, trackNotesActivity, scheduleNoteReminder3Hours]);

  const updateNote = useCallback(async (id: string, updates: Partial<Note>) => {
    try {
      const note = notes.find(n => n.id === id);
      if (!note) return;
      
      const updatedNote = { ...note, ...updates, updatedAt: new Date() };
      
      // Check if user is authenticated before making API calls
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token available, updating locally only');
        // Update locally only
        const updatedNotes = notes.map(n => n.id === id ? updatedNote : n);
        setNotes(updatedNotes);
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
        return;
      }
      
      // Set token for API service
      apiService.setToken(token);
      
      const apiNoteData = convertLocalNoteToApi(updatedNote);
      
      try {
        const response = await apiService.updateNote(id, {
          title: apiNoteData.title,
          content: apiNoteData.content,
          specificTime: apiNoteData.specificTime,
        });
        
        const apiUpdatedNote = convertApiNoteToLocal(response.note);
        const updatedNotes = notes.map(n => n.id === id ? apiUpdatedNote : n);
        setNotes(updatedNotes);

        if (apiUpdatedNote.reminder?.enabled) {
          await scheduleNotification(apiUpdatedNote);
        } else {
          // Cancel notification if reminder is disabled
          if (note.reminder?.notificationId) {
            await NotificationService.cancelNotification(note.reminder.notificationId);
          }
          console.log('Reminder cancelled for note:', id);
        }
      } catch (error) {
        console.log('API update note failed, updating locally:', error);
        // Update note locally if API fails
        const updatedNotes = notes.map(n => n.id === id ? {
          ...n,
          ...updatedNote,
          updatedAt: new Date(),
        } : n);
        setNotes(updatedNotes);

        // Save to local storage
        await AsyncStorage.setItem('smart_notes', JSON.stringify(updatedNotes));

        const updatedNoteObj = updatedNotes.find(n => n.id === id);
        if (updatedNoteObj?.reminder?.enabled) {
          await scheduleNotification(updatedNoteObj);
        } else {
          // Cancel notification if reminder is disabled
          if (note.reminder?.notificationId) {
            await NotificationService.cancelNotification(note.reminder.notificationId);
          }
          console.log('Reminder cancelled for note:', id);
        }
      }

      // Track activity for smart notifications
      await trackNotesActivity();
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }, [notes, scheduleNotification, trackNotesActivity]);

  const deleteNote = useCallback(async (id: string) => {
    try {
      // Cancel notification before deleting
      const noteToDelete = notes.find(note => note.id === id);
      if (noteToDelete?.reminder?.notificationId) {
        await NotificationService.cancelNotification(noteToDelete.reminder.notificationId);
      }
      
      // Check if user is authenticated before making API calls
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token available, deleting locally only');
        // Delete locally only
        const updatedNotes = notes.filter(note => note.id !== id);
        setNotes(updatedNotes);
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
        return;
      }
      
      // Set token for API service
      apiService.setToken(token);
      
      await apiService.deleteNote(id);
      
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      console.log('Note deleted and reminder cancelled:', id);

      // Track activity for smart notifications
      await trackNotesActivity();
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }, [notes, trackNotesActivity]);

  const getFilteredNotes = useCallback((filter: {
    category?: string;
    hasReminder?: boolean;
    dateRange?: { start: Date; end: Date };
  }) => {
    return notes.filter(note => {
      if (filter.category && note.category !== filter.category) return false;
      if (filter.hasReminder !== undefined) {
        const hasReminder = note.reminder?.enabled || false;
        if (hasReminder !== filter.hasReminder) return false;
      }
      if (filter.dateRange) {
        const noteDate = note.createdAt;
        if (noteDate < filter.dateRange.start || noteDate > filter.dateRange.end) return false;
      }
      return true;
    });
  }, [notes]);

  return useMemo(() => ({
    notes,
    isLoading,
    addNote,
    updateNote,
    deleteNote,
    getFilteredNotes
  }), [notes, isLoading, addNote, updateNote, deleteNote, getFilteredNotes]);
});