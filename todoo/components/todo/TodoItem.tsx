import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import {
    Gesture,
    GestureDetector,
} from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Todo, Priority } from '@/types/todo';
import {
    Colors,
    BorderRadius,
    Spacing,
    Typography,
    Shadows,
    PriorityColors,
    Animation,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface TodoItemProps {
    todo: Todo;
    onToggle: (todo: Todo) => void;
    onDelete: (id: string) => void;
    onEdit?: (todo: Todo) => void;
}

const SWIPE_THRESHOLD = -80;

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const translateX = useSharedValue(0);
    const itemHeight = useSharedValue(80);
    const opacity = useSharedValue(1);

    const priorityColor = PriorityColors[todo.priority || 'medium'];

    // Check if overdue
    const isOverdue =
        todo.due_date &&
        !todo.completed &&
        new Date(todo.due_date) < new Date();

    // Format due date
    const formatDueDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
        }
    };

    const handleDelete = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onDelete(todo.id);
    };

    const panGesture = Gesture.Pan()
        .activeOffsetX([-10, 10])
        .onUpdate((event) => {
            // Only allow left swipe (negative values)
            if (event.translationX < 0) {
                translateX.value = Math.max(event.translationX, -120);
            }
        })
        .onEnd((event) => {
            if (event.translationX < SWIPE_THRESHOLD) {
                // Trigger delete animation
                translateX.value = withTiming(-400, { duration: Animation.normal });
                itemHeight.value = withTiming(0, { duration: Animation.normal });
                opacity.value = withTiming(0, { duration: Animation.fast }, () => {
                    runOnJS(handleDelete)();
                });
            } else {
                // Snap back
                translateX.value = withSpring(0, Animation.spring);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const containerStyle = useAnimatedStyle(() => ({
        height: itemHeight.value,
        opacity: opacity.value,
        marginBottom: itemHeight.value > 0 ? Spacing.sm : 0,
    }));

    const handleToggle = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onToggle(todo);
    };

    return (
        <Animated.View style={containerStyle}>
            {/* Delete background */}
            <View
                style={[styles.deleteBackground, { backgroundColor: colors.error }]}
            >
                <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
            </View>

            <GestureDetector gesture={panGesture}>
                <Animated.View
                    style={[
                        styles.container,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        },
                        Shadows.sm,
                        animatedStyle,
                    ]}
                >
                    {/* Priority indicator */}
                    <View
                        style={[
                            styles.priorityIndicator,
                            { backgroundColor: priorityColor.dot },
                        ]}
                    />

                    {/* Checkbox */}
                    <TouchableOpacity
                        onPress={handleToggle}
                        style={[
                            styles.checkbox,
                            {
                                borderColor: todo.completed ? colors.success : colors.border,
                                backgroundColor: todo.completed
                                    ? colors.success
                                    : 'transparent',
                            },
                        ]}
                    >
                        {todo.completed && (
                            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                        )}
                    </TouchableOpacity>

                    {/* Content */}
                    <Pressable style={styles.content} onPress={() => onEdit?.(todo)}>
                        <Text
                            style={[
                                styles.title,
                                {
                                    color: todo.completed
                                        ? colors.textTertiary
                                        : colors.text,
                                },
                                todo.completed && styles.completedTitle,
                            ]}
                            numberOfLines={1}
                        >
                            {todo.title}
                        </Text>

                        <View style={styles.meta}>
                            {/* Priority badge */}
                            <View
                                style={[
                                    styles.badge,
                                    { backgroundColor: priorityColor.bg },
                                ]}
                            >
                                <Text
                                    style={[styles.badgeText, { color: priorityColor.text }]}
                                >
                                    {todo.priority || 'medium'}
                                </Text>
                            </View>

                            {/* Category */}
                            {todo.category && (
                                <View
                                    style={[
                                        styles.badge,
                                        { backgroundColor: colors.surfaceSecondary },
                                    ]}
                                >
                                    <Text
                                        style={[styles.badgeText, { color: colors.textSecondary }]}
                                    >
                                        {todo.category}
                                    </Text>
                                </View>
                            )}

                            {/* Due date */}
                            {todo.due_date && (
                                <View
                                    style={[
                                        styles.badge,
                                        {
                                            backgroundColor: isOverdue
                                                ? colors.errorBg
                                                : colors.surfaceSecondary,
                                        },
                                    ]}
                                >
                                    <Ionicons
                                        name="calendar-outline"
                                        size={10}
                                        color={isOverdue ? colors.error : colors.textSecondary}
                                        style={{ marginRight: 4 }}
                                    />
                                    <Text
                                        style={[
                                            styles.badgeText,
                                            {
                                                color: isOverdue ? colors.error : colors.textSecondary,
                                            },
                                        ]}
                                    >
                                        {formatDueDate(todo.due_date)}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </Pressable>
                </Animated.View>
            </GestureDetector>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingRight: Spacing.lg,
        paddingLeft: Spacing.xs,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        overflow: 'hidden',
    },
    deleteBackground: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: Spacing.sm,
        width: 100,
        borderRadius: BorderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    priorityIndicator: {
        width: 4,
        height: '60%',
        borderRadius: 2,
        marginRight: Spacing.md,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: BorderRadius.sm,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: Typography.sizes.base,
        fontWeight: Typography.weights.medium,
        marginBottom: Spacing.xs,
    },
    completedTitle: {
        textDecorationLine: 'line-through',
    },
    meta: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.xs,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.sm,
    },
    badgeText: {
        fontSize: Typography.sizes.xs,
        fontWeight: Typography.weights.medium,
        textTransform: 'capitalize',
    },
});
