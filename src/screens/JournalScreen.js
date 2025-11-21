// src/screens/JournalScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

import Screen from '../components/Screen';
import { Colors } from '../constants/colors';
import { getTodaysVirtue } from '../logic/dailyVirtue';
import {
  loadRecentJournalEntries,
  saveJournalEntry,
  removeJournalEntry,
} from '../services/journalService';
import { getTodaysQuestVirtue } from '../logic/dailyQuest';

export default function JournalScreen() {
  const route = useRoute();

  // virtue is now state, so we can override it from navigation
  // const [virtue, setVirtue] = useState('Today');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [entries, setEntries] = useState([]);
  const [note, setNote] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [virtue, setVirtue] = useState('Today');

  // If we navigated from Quest, we may get route.params.virtue
  const overrideVirtue =
    typeof route.params?.virtue === 'string' && route.params.virtue.length
      ? route.params.virtue
      : null;

  // const virtue = overrideVirtue || getTodaysVirtue() || null;

  const presetVirtue = route?.params?.presetVirtue || null;

  // Load virtue (either preset from Quest, or today’s virtue)
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // 👇 Pull virtue from today's QUEST
        const v = await getTodaysQuestVirtue();

        if (mounted) {
          setVirtue(v || presetVirtue || 'Today');
        }
      } catch (e) {
        console.warn('Error loading quest virtue for journal:', e);

        if (mounted) {
          setVirtue(presetVirtue || 'Today');
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [presetVirtue]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      // const rows = await getJournalEntries();
      const rows = await loadRecentJournalEntries();
      setEntries(rows || []);
    } catch (e) {
      console.warn('Error loading journal entries:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleSave = async () => {
    const trimmed = note.trim();
    if (!trimmed) return;

    try {
      setSaving(true);

      if (editingId) {
        // Update existing
        // const updatedMeta = await updateJournalEntry(editingId, trimmed);
        const updated = await saveJournalEntry({
          id: editingId,
          note: trimmed,
        });
        const updatedMeta = { updated_at: updated?.updated_at };
        setEntries((prev) =>
          prev.map((entry) =>
            entry.id === editingId
              ? { ...entry, note: trimmed, updated_at: updatedMeta?.updated_at }
              : entry
          )
        );
      } else {
        // Create new – use the current virtue state
        // const created = await createJournalEntry(trimmed, virtue);
        const created = await saveJournalEntry({ note: trimmed, virtue });
        if (created) {
          setEntries((prev) => [created, ...prev]);
        }
      }

      setNote('');
      setEditingId(null);
    } catch (e) {
      console.warn('Error saving journal entry:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (entry) => {
    setNote(entry.note || '');
    setEditingId(entry.id);
  };

  const handleDelete = async (entryId) => {
    try {
      await removeJournalEntry(entryId);
      setEntries((prev) => prev.filter((e) => e.id !== entryId));

      // If we were editing this one, reset editor
      if (editingId === entryId) {
        setEditingId(null);
        setNote('');
      }
    } catch (e) {
      console.warn('Error deleting journal entry:', e);
    }
  };

  const isEditing = Boolean(editingId);
  const saveLabel = isEditing ? 'Update Entry' : 'Save Entry';

  return (
    <Screen dismissOnTap={false}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Journal 🕊️</Text>
        <Text style={styles.subtitle}>
          {virtue ? (
            <>
              How can you live out{' '}
              <Text style={styles.virtueHighlight}>{virtue.toLowerCase()}</Text>{' '}
              today?
            </>
          ) : (
            'How can you live this out today?'
          )}
        </Text>

        <View style={styles.editorCard}>
          {isEditing ? (
            <Text style={styles.editingBadge}>Editing existing entry…</Text>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Write a few thoughts or a prayer for today…"
            placeholderTextColor="#6B7280"
            value={note}
            onChangeText={setNote}
            multiline
          />
          <View style={styles.editorButtonsRow}>
            {isEditing ? (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setEditingId(null);
                  setNote('');
                }}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={[
                styles.saveButton,
                (!note.trim() || saving) && { opacity: 0.6 },
              ]}
              onPress={handleSave}
              disabled={!note.trim() || saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>{saveLabel}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 24 }} />

        <Text style={styles.sectionTitle}>Past entries</Text>

        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator />
          </View>
        ) : entries.length === 0 ? (
          <Text style={styles.emptyText}>
            No journal entries yet. After you finish a Quest, come here and
            write how you can live out today’s virtue.
          </Text>
        ) : (
          entries.map((entry) => (
            <View key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeaderRow}>
                <Text style={styles.entryHeader}>
                  {entry.date} ·{' '}
                  <Text style={styles.entryVirtue}>{entry.virtue}</Text>
                </Text>

                <View style={styles.entryActions}>
                  <TouchableOpacity
                    onPress={() => handleEdit(entry)}
                    style={styles.entryActionButton}
                  >
                    <Text style={styles.entryActionText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(entry.id)}
                    style={styles.entryActionButton}
                  >
                    <Text
                      style={[styles.entryActionText, { color: '#F97373' }]}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.entryNote}>{entry.note}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.button,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 16,
  },
  virtueHighlight: {
    color: Colors.button,
    fontWeight: '800',
  },
  editorCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#374151',
  },
  editingBadge: {
    fontSize: 12,
    color: '#FBBF24',
    marginBottom: 6,
  },
  input: {
    minHeight: 80,
    maxHeight: 180,
    color: '#E5E7EB',
    fontSize: 14,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  editorButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelButton: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#6B7280',
  },
  cancelButtonText: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: Colors.button,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  loadingRow: {
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text,
  },
  entryCard: {
    backgroundColor: '#111827',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#374151',
  },
  entryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  entryHeader: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  entryVirtue: {
    fontWeight: '700',
    color: '#ffffff',
  },
  entryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  entryActionButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  entryActionText: {
    fontSize: 12,
    color: '#E5E7EB',
    fontWeight: '600',
  },
  entryNote: {
    fontSize: 14,
    color: '#E5E7EB',
    lineHeight: 20,
    marginTop: 4,
  },
});
