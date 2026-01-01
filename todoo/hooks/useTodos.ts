import { useEffect, useState, useMemo, useCallback } from 'react';
import { Todo, Priority, TodoStats } from '@/types/todo';
import { supabase } from '@/lib/supabase';

export type FilterStatus = 'all' | 'active' | 'completed';
export type SortOption = 'created' | 'dueDate' | 'priority';

interface UseTodosOptions {
  autoFetch?: boolean;
}

export function useTodos(options: UseTodosOptions = { autoFetch: true }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('created');

  // Calculate stats
  const stats: TodoStats = useMemo(() => {
    return {
      total: todos.length,
      completed: todos.filter((t) => t.completed).length,
      pending: todos.filter((t) => !t.completed).length,
      highPriority: todos.filter((t) => t.priority === 'high' && !t.completed)
        .length,
    };
  }, [todos]);

  // Filtered and sorted todos
  const filteredTodos = useMemo(() => {
    let result = [...todos];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.category?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filterStatus === 'active') {
      result = result.filter((t) => !t.completed);
    } else if (filterStatus === 'completed') {
      result = result.filter((t) => t.completed);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          // Tasks without due dates go to the end
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();

        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return (
            (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1)
          );

        case 'created':
        default:
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
      }
    });

    return result;
  }, [todos, searchQuery, filterStatus, sortBy]);

  const fetchTodos = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setTodos(data || []);
    } catch (err) {
      console.error('Fetch todos error:', err);
      setError('Failed to load todos. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const addTodo = useCallback(
    async (
      title: string,
      priority: Priority = 'medium',
      dueDate: Date | null = null,
      category: string | null = null
    ) => {
      if (!title.trim()) return;

      setError(null);

      // Create optimistic todo
      const tempId = `temp-${Date.now()}`;
      const tempTodo: Todo = {
        id: tempId,
        title: title.trim(),
        completed: false,
        created_at: new Date().toISOString(),
        priority,
        due_date: dueDate ? dueDate.toISOString() : null,
        category,
      };

      // Optimistic update
      setTodos((prev) => [tempTodo, ...prev]);

      try {
        const { data, error: insertError } = await supabase
          .from('todos')
          .insert({
            title: title.trim(),
            priority,
            due_date: dueDate ? dueDate.toISOString() : null,
            category,
            completed: false,
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        // Replace temp todo with real one
        setTodos((prev) =>
          prev.map((t) => (t.id === tempId ? data : t))
        );
      } catch (err) {
        console.error('Add todo error:', err);
        // Rollback optimistic update
        setTodos((prev) => prev.filter((t) => t.id !== tempId));
        setError('Failed to add todo. Please try again.');
      }
    },
    []
  );

  const toggleTodo = useCallback(async (todo: Todo) => {
    setError(null);

    // Optimistic update
    setTodos((prev) =>
      prev.map((t) =>
        t.id === todo.id ? { ...t, completed: !t.completed } : t
      )
    );

    try {
      const { error: updateError } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', todo.id);

      if (updateError) {
        throw updateError;
      }
    } catch (err) {
      console.error('Toggle todo error:', err);
      // Rollback
      setTodos((prev) =>
        prev.map((t) =>
          t.id === todo.id ? { ...t, completed: todo.completed } : t
        )
      );
      setError('Failed to update todo. Please try again.');
    }
  }, []);

  const updateTodo = useCallback(
    async (
      id: string,
      updates: Partial<Omit<Todo, 'id' | 'created_at'>>
    ) => {
      setError(null);

      // Find original todo for rollback
      const originalTodo = todos.find((t) => t.id === id);
      if (!originalTodo) return;

      // Optimistic update
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );

      try {
        const { error: updateError } = await supabase
          .from('todos')
          .update(updates)
          .eq('id', id);

        if (updateError) {
          throw updateError;
        }
      } catch (err) {
        console.error('Update todo error:', err);
        // Rollback
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? originalTodo : t))
        );
        setError('Failed to update todo. Please try again.');
      }
    },
    [todos]
  );

  const deleteTodo = useCallback(
    async (id: string) => {
      setError(null);

      // Find original for rollback
      const originalTodo = todos.find((t) => t.id === id);
      const originalIndex = todos.findIndex((t) => t.id === id);

      // Optimistic update
      setTodos((prev) => prev.filter((t) => t.id !== id));

      try {
        const { error: deleteError } = await supabase
          .from('todos')
          .delete()
          .eq('id', id);

        if (deleteError) {
          throw deleteError;
        }
      } catch (err) {
        console.error('Delete todo error:', err);
        // Rollback - insert back at original position
        if (originalTodo) {
          setTodos((prev) => {
            const newTodos = [...prev];
            newTodos.splice(originalIndex, 0, originalTodo);
            return newTodos;
          });
        }
        setError('Failed to delete todo. Please try again.');
      }
    },
    [todos]
  );

  // Pull to refresh handler
  const onRefresh = useCallback(() => {
    fetchTodos(true);
  }, [fetchTodos]);

  useEffect(() => {
    if (options.autoFetch) {
      fetchTodos();
    }
  }, []);

  return {
    // Data
    todos: filteredTodos,
    allTodos: todos,
    stats,
    loading,
    refreshing,
    error,

    // Actions
    fetchTodos,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    onRefresh,

    // Filters
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
  };
}
