import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  iconName?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
}

export const Button = ({ title, loading, variant = 'primary', iconName, style, ...props }: ButtonProps) => {
  const isOutline = variant === 'outline' || variant === 'ghost';
  const contentColor = isOutline ? styles[`${variant}Text`].color : '#ffffff';

  return (
    <TouchableOpacity 
      style={[styles.base, styles[variant], props.disabled && styles.disabled, style]}
      disabled={loading || props.disabled}
      activeOpacity={0.84}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={contentColor} />
      ) : (
        <>
          {iconName && <MaterialCommunityIcons name={iconName} size={19} color={contentColor} style={styles.icon} />}
          <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: 8,
  },
  primary: {
    backgroundColor: Colors.light.tint,
  },
  secondary: {
    backgroundColor: Colors.light.info,
  },
  danger: {
    backgroundColor: Colors.light.danger,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.tint,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.55,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#ffffff',
  },
  dangerText: {
    color: '#ffffff',
  },
  outlineText: {
    color: Colors.light.tint,
  },
  ghostText: {
    color: Colors.light.text,
  },
});
