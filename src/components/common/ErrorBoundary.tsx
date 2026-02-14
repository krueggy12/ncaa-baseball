import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Something went wrong.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
