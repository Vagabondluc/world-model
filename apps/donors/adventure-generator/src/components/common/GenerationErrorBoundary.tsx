/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { css } from '@emotion/css';

const errorBoundaryStyle = css`
    padding: var(--space-l);
    border: 2px dashed var(--error-red);
    background: var(--error-bg);
`;

interface ErrorBoundaryProps {
    children?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class GenerationErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    public state: ErrorBoundaryState = {
        hasError: false,
        error: null
    };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Generation UI Error:', error, errorInfo);
    }

    private handleRecover = () => {
        this.setState({ hasError: false, error: null });
    }

    render() {
        const state = this.state;
        const props = this.props;

        if (state.hasError) {
            return (
                <div className={errorBoundaryStyle}>
                    <h2>Something Went Wrong</h2>
                    <p>A part of the generator has encountered a rendering error. You can try to recover, but you may need to reload the page or start over.</p>
                    <button 
                        className="secondary-button"
                        onClick={this.handleRecover}
                    >
                        Try to Recover
                    </button>
                    <details style={{ marginTop: '1rem' }}>
                        <summary>Error Details</summary>
                        <pre>{state.error?.toString()}</pre>
                    </details>
                </div>
            );
        }
        return props.children;
    }
}
