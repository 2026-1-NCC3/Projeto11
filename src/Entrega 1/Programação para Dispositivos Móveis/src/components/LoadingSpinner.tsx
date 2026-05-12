import React from 'react';
import { View, ActivityIndicator } from 'react-native';

interface LoadingSpinnerProps {
  color?: string;
  size?: 'small' | 'large';
}

export default function LoadingSpinner({
  color = '#0ea5e9',
  size = 'large',
}: LoadingSpinnerProps) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0c1929' }}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}
