import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    variant?: 'default' | 'elevated';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
    children,
    style,
    variant = 'default',
    padding = 'md',
}: CardProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const getPadding = () => {
        switch (padding) {
            case 'none':
                return 0;
            case 'sm':
                return Spacing.sm;
            case 'md':
                return Spacing.lg;
            case 'lg':
                return Spacing.xl;
        }
    };

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    padding: getPadding(),
                },
                variant === 'elevated' && Shadows.md,
                style,
            ]}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
    },
});
