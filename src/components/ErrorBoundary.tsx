import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="glass rounded-3xl p-8 max-w-2xl w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Something Went Wrong
                </h2>
                <p className="text-white/70">
                  We encountered an unexpected error
                </p>
              </div>
            </div>

            {this.state.error && (
              <div className="glass-light rounded-xl p-4 mb-6">
                <p className="text-white/90 font-mono text-sm mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-4">
                    <summary className="text-white/70 cursor-pointer hover:text-white transition-colors">
                      Technical Details
                    </summary>
                    <pre className="text-white/60 text-xs mt-2 overflow-auto max-h-40">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="glass-strong hover:bg-white/25 transition-all duration-300 rounded-xl py-3 px-6 text-white font-semibold flex items-center gap-2 w-full justify-center"
            >
              <RotateCcw className="w-5 h-5" />
              Start Over
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
