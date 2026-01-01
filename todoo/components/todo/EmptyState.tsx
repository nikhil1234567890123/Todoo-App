import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    Colors,
    Spacing,
    Typography,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface EmptyStateProps {
    title?: string;
    message?: string;
    type?: 'empty' | 'search' | 'completed';
}

export function EmptyState({
    title,
    message,
    type = 'empty',
}: EmptyStateProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const getContent = () => {
        switch (type) {
            case 'search':
                return {
                    icon: 'search-outline',
                    title: title || 'No results found',
                    message: message || 'Try a different search term',
                };
            case 'completed':
                return {
                    icon: 'checkmark-done-circle-outline',
                    title: title || 'All done!',
                    message: message || 'Great job completing all your tasks',
                };
            default:
                return {
                    icon: 'clipboard-outline',
                    title: title || 'No tasks yet',
                    message: message || 'Add your first task to get started',
                };
        }
    };

    const content = getContent();

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.iconContainer,
                    { backgroundColor: colors.surfaceSecondary },
                ]}
            >
                <Ionicons
                    name={content.icon as any}
                    size={48}
                    color={colors.textTertiary}
                />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>
                {content.title}
            </Text>
            <Text style={[styles.message, { color: colors.textSecondary }]}>
                {content.message}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: Spacing['5xl'],
        paddingHorizontal: Spacing.xl,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    title: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.semibold,
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },
    message: {
        fontSize: Typography.sizes.base,
        textAlign: 'center',
        lineHeight: 22,
    },
});
