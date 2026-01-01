import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTodos } from '@/hooks/useTodos';
import { TodoItem } from '@/components/todo/TodoItem';
import { TodoInput } from '@/components/todo/TodoInput';
import { TodoFilters } from '@/components/todo/TodoFilters';
import { TodoStats } from '@/components/todo/TodoStats';
import { EmptyState } from '@/components/todo/EmptyState';
import { Colors, Spacing, Typography, Shadows } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TodoScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const {
    todos,
    stats,
    loading,
    refreshing,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    onRefresh,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
  } = useTodos();

  // Determine empty state type
  const getEmptyStateType = () => {
    if (searchQuery.trim()) return 'search';
    if (filterStatus === 'completed' && stats.completed === 0) return 'empty';
    if (filterStatus === 'active' && stats.pending === 0) return 'completed';
    return 'empty';
  };

  if (loading && todos.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading your tasks...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top', 'left', 'right']}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>My Tasks</Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Stats */}
        {stats.total > 0 && <TodoStats stats={stats} />}

        {/* Input */}
        <TodoInput onAdd={addTodo} loading={loading} />

        {/* Filters */}
        {stats.total > 0 && (
          <TodoFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={filterStatus}
            onFilterChange={setFilterStatus}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        )}

        {/* Error message */}
        {error && (
          <View
            style={[styles.errorContainer, { backgroundColor: colors.errorBg }]}
          >
            <Text style={[styles.errorText, { color: colors.error }]}>
              {error}
            </Text>
          </View>
        )}

        {/* Todo List */}
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TodoItem
              todo={item}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.tint}
              colors={[colors.tint]}
            />
          }
          ListEmptyComponent={<EmptyState type={getEmptyStateType()} />}
          contentContainerStyle={[
            styles.listContent,
            todos.length === 0 && styles.emptyListContent,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: Typography.sizes.base,
  },
  header: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.xs,
  },
  date: {
    fontSize: Typography.sizes.base,
  },
  errorContainer: {
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  errorText: {
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: Spacing['4xl'],
  },
  emptyListContent: {
    flex: 1,
  },
});
