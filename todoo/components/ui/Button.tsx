import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, BorderRadius, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
    style?: ViewStyle;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    fullWidth = false,
    style,
}: ButtonProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const handlePress = () => {
        if (!loading && !disabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
        }
    };

    const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
        switch (variant) {
            case 'primary':
                return {
                    container: {
                        backgroundColor: colors.tint,
                    },
                    text: {
                        color: '#FFFFFF',
                    },
                };
            case 'secondary':
                return {
                    container: {
                        backgroundColor: colors.surfaceSecondary,
                        borderWidth: 1,
                        borderColor: colors.border,
                    },
                    text: {
                        color: colors.text,
                    },
                };
            case 'danger':
                return {
                    container: {
                        backgroundColor: colors.error,
                    },
                    text: {
                        color: '#FFFFFF',
                    },
                };
            case 'ghost':
                return {
                    container: {
                        backgroundColor: 'transparent',
                    },
                    text: {
                        color: colors.tint,
                    },
                };
        }
    };

    const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
        switch (size) {
            case 'sm':
                return {
                    container: {
                        paddingVertical: Spacing.xs,
                        paddingHorizontal: Spacing.md,
                    },
                    text: {
                        fontSize: Typography.sizes.sm,
                    },
                };
            case 'md':
                return {
                    container: {
                        paddingVertical: Spacing.sm,
                        paddingHorizontal: Spacing.lg,
                    },
                    text: {
                        fontSize: Typography.sizes.base,
                    },
                };
            case 'lg':
                return {
                    container: {
                        paddingVertical: Spacing.md,
                        paddingHorizontal: Spacing.xl,
                    },
                    text: {
                        fontSize: Typography.sizes.lg,
                    },
                };
        }
    };

    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={disabled || loading}
            activeOpacity={0.7}
            style={[
                styles.container,
                variantStyles.container,
                sizeStyles.container,
                fullWidth && styles.fullWidth,
                (disabled || loading) && styles.disabled,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : colors.tint}
                />
            ) : (
                <>
                    {icon}
                    <Text
                        style={[
                            styles.text,
                            variantStyles.text,
                            sizeStyles.text,
                            icon && styles.textWithIcon,
                        ]}
                    >
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BorderRadius.md,
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontWeight: Typography.weights.semibold,
    },
    textWithIcon: {
        marginLeft: Spacing.xs,
    },
});
