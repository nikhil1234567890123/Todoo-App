import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {
    Colors,
    BorderRadius,
    Spacing,
    Typography,
    Shadows,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type FilterStatus = 'all' | 'active' | 'completed';
export type SortOption = 'created' | 'dueDate' | 'priority';

interface TodoFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    activeFilter: FilterStatus;
    onFilterChange: (filter: FilterStatus) => void;
    sortBy: SortOption;
    onSortChange: (sort: SortOption) => void;
}

const FILTERS: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Done' },
];

const SORT_OPTIONS: { value: SortOption; label: string; icon: string }[] = [
    { value: 'created', label: 'Newest', icon: 'time-outline' },
    { value: 'dueDate', label: 'Due Date', icon: 'calendar-outline' },
    { value: 'priority', label: 'Priority', icon: 'flag-outline' },
];

export function TodoFilters({
    searchQuery,
    onSearchChange,
    activeFilter,
    onFilterChange,
    sortBy,
    onSortChange,
}: TodoFiltersProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const handleFilterChange = (filter: FilterStatus) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onFilterChange(filter);
    };

    const cycleSortOption = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const currentIndex = SORT_OPTIONS.findIndex((s) => s.value === sortBy);
        const nextIndex = (currentIndex + 1) % SORT_OPTIONS.length;
        onSortChange(SORT_OPTIONS[nextIndex].value);
    };

    const currentSort = SORT_OPTIONS.find((s) => s.value === sortBy)!;

    return (
        <View style={styles.container}>
            {/* Search bar */}
            <View
                style={[
                    styles.searchContainer,
                    {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                    },
                    Shadows.sm,
                ]}
            >
                <Ionicons
                    name="search-outline"
                    size={20}
                    color={colors.textSecondary}
                />
                <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search todos..."
                    placeholderTextColor={colors.textTertiary}
                    value={searchQuery}
                    onChangeText={onSearchChange}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => onSearchChange('')}>
                        <Ionicons
                            name="close-circle"
                            size={20}
                            color={colors.textSecondary}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {/* Filter tabs and sort */}
            <View style={styles.filtersRow}>
                {/* Filter chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterChips}
                >
                    {FILTERS.map((filter) => (
                        <TouchableOpacity
                            key={filter.value}
                            onPress={() => handleFilterChange(filter.value)}
                            style={[
                                styles.filterChip,
                                {
                                    backgroundColor:
                                        activeFilter === filter.value
                                            ? colors.tint
                                            : colors.surfaceSecondary,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.filterChipText,
                                    {
                                        color:
                                            activeFilter === filter.value
                                                ? '#FFFFFF'
                                                : colors.textSecondary,
                                    },
                                ]}
                            >
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Sort button */}
                <TouchableOpacity
                    onPress={cycleSortOption}
                    style={[
                        styles.sortButton,
                        { backgroundColor: colors.surfaceSecondary },
                    ]}
                >
                    <Ionicons
                        name={currentSort.icon as any}
                        size={16}
                        color={colors.textSecondary}
                    />
                    <Text style={[styles.sortText, { color: colors.textSecondary }]}>
                        {currentSort.label}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.lg,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        marginBottom: Spacing.md,
        gap: Spacing.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: Typography.sizes.base,
        padding: 0,
    },
    filtersRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    filterChips: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    filterChip: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
    },
    filterChipText: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.medium,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        gap: Spacing.xs,
    },
    sortText: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.medium,
    },
});
