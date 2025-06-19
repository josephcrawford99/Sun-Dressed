import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { theme, typography } from '@/styles';

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
    padding: theme.spacing.lg,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    ...typography.heading,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  errorDetails: {
    fontSize: theme.fontSize.xs,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
});