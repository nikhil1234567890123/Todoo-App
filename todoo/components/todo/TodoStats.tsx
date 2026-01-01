import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TodoStats as TodoStatsType } from '@/types/todo';
import {
    Colors,
    BorderRadius,
    Spacing,
    Typography,
    Shadows,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface TodoStatsProps {
    stats: TodoStatsType;
}

export function TodoStats({ stats }: TodoStatsProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const completionPercentage =
        stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    // Calculate ring progress (for SVG-like display with View)
    const circumference = 2 * Math.PI * 35;
    const strokeDashoffset =
        circumference - (completionPercentage / 100) * circumference;

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: colors.surface },
                Shadows.md,
            ]}
        >
            {/* Progress Ring */}
            <View style={styles.ringContainer}>
                <View
                    style={[
                        styles.ringBackground,
                        { borderColor: colors.surfaceSecondary },
                    ]}
                />
                <View
                    style={[
                        styles.ringProgress,
                        {
                            borderColor: colors.tint,
                            borderTopColor: 'transparent',
                            borderRightColor:
                                completionPercentage > 25 ? colors.tint : 'transparent',
                            borderBottomColor:
                                completionPercentage > 50 ? colors.tint : 'transparent',
                            borderLeftColor:
                                completionPercentage > 75 ? colors.tint : 'transparent',
                            transform: [
                                { rotate: `${(completionPercentage / 100) * 360}deg` },
                            ],
                        },
                    ]}
                />
                <View style={styles.ringCenter}>
                    <Text style={[styles.percentageText, { color: colors.text }]}>
                        {completionPercentage}%
                    </Text>
                </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                    <View
                        style={[
                            styles.statIcon,
                            { backgroundColor: colors.surfaceSecondary },
                        ]}
                    >
                        <Ionicons name="list" size={16} color={colors.tint} />
                    </View>
                    <Text style={[styles.statValue, { color: colors.text }]}>
                        {stats.total}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                        Total
                    </Text>
                </View>

                <View style={styles.statItem}>
                    <View
                        style={[styles.statIcon, { backgroundColor: colors.successBg }]}
                    >
                        <Ionicons name="checkmark" size={16} color={colors.success} />
                    </View>
                    <Text style={[styles.statValue, { color: colors.text }]}>
                        {stats.completed}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                        Done
                    </Text>
                </View>

                <View style={styles.statItem}>
                    <View
                        style={[styles.statIcon, { backgroundColor: colors.warningBg }]}
                    >
                        <Ionicons name="time" size={16} color={colors.warning} />
                    </View>
                    <Text style={[styles.statValue, { color: colors.text }]}>
                        {stats.pending}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                        Pending
                    </Text>
                </View>

                <View style={styles.statItem}>
                    <View style={[styles.statIcon, { backgroundColor: colors.errorBg }]}>
                        <Ionicons name="flag" size={16} color={colors.error} />
                    </View>
                    <Text style={[styles.statValue, { color: colors.text }]}>
                        {stats.highPriority}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                        Urgent
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.lg,
        gap: Spacing.xl,
    },
    ringContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ringBackground: {
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 6,
    },
    ringProgress: {
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 6,
    },
    ringCenter: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    percentageText: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.bold,
    },
    statsGrid: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
    },
    statItem: {
        width: '45%',
        alignItems: 'center',
    },
    statIcon: {
        width: 32,
        height: 32,
        borderRadius: BorderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    statValue: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.bold,
    },
    statLabel: {
        fontSize: Typography.sizes.xs,
    },
});
