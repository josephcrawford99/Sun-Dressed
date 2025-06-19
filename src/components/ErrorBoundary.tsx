import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { theme } from '@/styles/theme';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Error boundary caught an error - could integrate with error reporting service
  }

  handleTryAgain = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ThemedView style={styles.container}>
          <ThemedView style={styles.content}>
            <ThemedText style={styles.title}>Something went wrong</ThemedText>
            <ThemedText style={styles.message}>
              We encountered an unexpected error. Please try again.
            </ThemedText>
            {__DEV__ && this.state.error && (
              <ThemedText style={styles.errorDetails}>
                {this.state.error.toString()}
              </ThemedText>
            )}
            <Pressable style={styles.button} onPress={this.handleTryAgain}>
              <Text style={styles.buttonText}>Try Again</Text>
            </Pressable>
          </ThemedView>
        </ThemedView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  errorDetails: {
    fontSize: 12,
    marginBottom: 24,
    padding: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.medium,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
});