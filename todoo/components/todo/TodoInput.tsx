import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Priority } from '@/types/todo';
import {
    Colors,
    BorderRadius,
    Spacing,
    Typography,
    Shadows,
    PriorityColors,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface TodoInputProps {
    onAdd: (
        title: string,
        priority: Priority,
        dueDate: Date | null,
        category: string | null
    ) => void;
    loading?: boolean;
}

const PRIORITIES: Priority[] = ['high', 'medium', 'low'];
const CATEGORIES = ['Work', 'Personal', 'Shopping', 'Health', 'Learning'];

export function TodoInput({ onAdd, loading }: TodoInputProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<Priority>('medium');
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [category, setCategory] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    const handleAdd = () => {
        if (!title.trim()) return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onAdd(title.trim(), priority, dueDate, category);
        // Reset form
        setTitle('');
        setPriority('medium');
        setDueDate(null);
        setCategory(null);
        setIsExpanded(false);
    };

    const cyclePriority = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const currentIndex = PRIORITIES.indexOf(priority);
        const nextIndex = (currentIndex + 1) % PRIORITIES.length;
        setPriority(PRIORITIES[nextIndex]);
    };

    const toggleDatePicker = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (dueDate) {
            setDueDate(null);
        } else {
            // Default to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(12, 0, 0, 0);
            setDueDate(tomorrow);
        }
    };

    const priorityColor = PriorityColors[priority];

    return (
        <View
            style={[styles.container, { backgroundColor: colors.surface }]}
            pointerEvents="box-none"
        >
            {/* Main input row */}
            <View style={[styles.inputRow, Shadows.md]}>
                <Input
                    placeholder="What needs to be done?"
                    value={title}
                    onChangeText={setTitle}
                    onSubmitEditing={handleAdd}
                    returnKeyType="done"
                    containerStyle={styles.inputContainer}
                    leftIcon={
                        <Ionicons name="add-circle" size={22} color={colors.tint} />
                    }
                />
                <Button
                    title=""
                    onPress={handleAdd}
                    loading={loading}
                    disabled={!title.trim()}
                    icon={<Ionicons name="arrow-up-circle" size={28} color="#FFFFFF" />}
                    style={styles.addButton}
                />
            </View>

            {/* Options toggle */}
            <TouchableOpacity
                onPress={() => setIsExpanded(!isExpanded)}
                style={styles.optionsToggle}
            >
                <Text style={[styles.optionsText, { color: colors.textSecondary }]}>
                    {isExpanded ? 'Less options' : 'More options'}
                </Text>
                <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={colors.textSecondary}
                />
            </TouchableOpacity>

            {/* Expanded options */}
            {isExpanded && (
                <View style={styles.optionsRow}>
                    {/* Priority picker */}
                    <TouchableOpacity
                        onPress={cyclePriority}
                        style={[styles.optionChip, { backgroundColor: priorityColor.bg }]}
                    >
                        <View
                            style={[styles.priorityDot, { backgroundColor: priorityColor.dot }]}
                        />
                        <Text style={[styles.optionChipText, { color: priorityColor.text }]}>
                            {priority}
                        </Text>
                    </TouchableOpacity>

                    {/* Due date toggle */}
                    <TouchableOpacity
                        onPress={toggleDatePicker}
                        style={[
                            styles.optionChip,
                            {
                                backgroundColor: dueDate
                                    ? colors.tintLight
                                    : colors.surfaceSecondary,
                            },
                        ]}
                    >
                        <Ionicons
                            name="calendar-outline"
                            size={14}
                            color={dueDate ? colors.tint : colors.textSecondary}
                        />
                        <Text
                            style={[
                                styles.optionChipText,
                                { color: dueDate ? colors.tint : colors.textSecondary },
                            ]}
                        >
                            {dueDate
                                ? dueDate.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                })
                                : 'Due date'}
                        </Text>
                    </TouchableOpacity>

                    {/* Category picker */}
                    <TouchableOpacity
                        onPress={() => setShowCategoryModal(true)}
                        style={[
                            styles.optionChip,
                            {
                                backgroundColor: category
                                    ? colors.tintLight
                                    : colors.surfaceSecondary,
                            },
                        ]}
                    >
                        <Ionicons
                            name="pricetag-outline"
                            size={14}
                            color={category ? colors.tint : colors.textSecondary}
                        />
                        <Text
                            style={[
                                styles.optionChipText,
                                { color: category ? colors.tint : colors.textSecondary },
                            ]}
                        >
                            {category || 'Category'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Category Modal */}
            <Modal
                visible={showCategoryModal}
                animationType="slide"
                transparent
                onRequestClose={() => setShowCategoryModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View
                        style={[
                            styles.modalContent,
                            { backgroundColor: colors.surface },
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                Select Category
                            </Text>
                            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {CATEGORIES.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.categoryOption,
                                        {
                                            backgroundColor:
                                                category === cat
                                                    ? colors.tintLight
                                                    : colors.surfaceSecondary,
                                        },
                                    ]}
                                    onPress={() => {
                                        setCategory(category === cat ? null : cat);
                                        setShowCategoryModal(false);
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.categoryText,
                                            { color: category === cat ? colors.tint : colors.text },
                                        ]}
                                    >
                                        {cat}
                                    </Text>
                                    {category === cat && (
                                        <Ionicons name="checkmark" size={20} color={colors.tint} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    inputContainer: {
        flex: 1,
    },
    addButton: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.md,
        paddingHorizontal: 0,
    },
    optionsToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Spacing.md,
        gap: Spacing.xs,
    },
    optionsText: {
        fontSize: Typography.sizes.sm,
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        paddingTop: Spacing.md,
    },
    optionChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        gap: Spacing.xs,
    },
    optionChipText: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.medium,
        textTransform: 'capitalize',
    },
    priorityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        padding: Spacing.xl,
        maxHeight: '50%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    modalTitle: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
    },
    categoryOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.lg,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.sm,
    },
    categoryText: {
        fontSize: Typography.sizes.base,
        fontWeight: Typography.weights.medium,
    },
});
