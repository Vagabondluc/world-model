import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    if (window.confirm('Are you sure you want to perform a hard reset? This will clear all saved game data from this browser.')) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl text-center max-w-md mx-auto">
                <h1 className="text-3xl font-bold text-red-700 mb-4">Something Went Wrong</h1>
                <p className="text-gray-600 mb-6">
                    A critical error occurred. This might be due to corrupted session data.
                    You can try to reset the application to its initial state.
                </p>
                <Button onClick={this.handleReset} variant="destructive">
                    Hard Reset Application
                </Button>
                <p className="text-xs text-gray-500 mt-4">
                    <strong>Warning:</strong> This will clear all game data from your browser.
                </p>
                {this.state.error && (
                    <details className="mt-4 text-left text-xs text-gray-500">
                        <summary className="cursor-pointer">Error Details</summary>
                        <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                            {this.state.error.toString()}
                        </pre>
                    </details>
                )}
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
