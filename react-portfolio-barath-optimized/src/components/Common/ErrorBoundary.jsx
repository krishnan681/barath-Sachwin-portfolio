import { Component } from "react";
import { RotateCcw, ArrowLeft, Sparkles, Terminal } from "lucide-react";
import "./ErrorBoundary.css";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("[STUDIO ERROR]", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="studio-error-screen" role="alert">
          {/* Ambient Lighting Orbs */}
          <div className="studio-error-orb orb-1" aria-hidden="true" />
          <div className="studio-error-orb orb-2" aria-hidden="true" />

          {/* Background Ambient Text */}
          <div className="studio-error-bg-text" aria-hidden="true">
            REFRESH
          </div>

          <div className="studio-error-canvas">
            {/* Editorial Status Badge */}
            <div className="studio-error-badge">
              <span className="studio-error-pulse-dot" />
              <span className="studio-error-badge-text">CREATIVE PAUSE</span>
              <span className="studio-error-badge-code">00 / INTERRUPT</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="studio-error-headline">
              A Moment of <span className="highlight-text">Refinement.</span>
            </h1>

            {/* Descriptive Body */}
            <p className="studio-error-desc">
              The visual canvas encountered an unexpected glitch during rendering. 
              Let’s reload the gallery to restore the full visual experience.
            </p>

            {/* Action Buttons */}
            <div className="studio-error-actions">
              <button
                type="button"
                className="studio-btn-primary"
                onClick={this.handleReload}
              >
                <RotateCcw size={16} className="btn-icon" />
                <span>Reload Showcase</span>
              </button>

              <button
                type="button"
                className="studio-btn-secondary"
                onClick={this.handleReset}
              >
                <ArrowLeft size={16} className="btn-icon" />
                <span>Back to Home</span>
              </button>
            </div>

            {/* Technical Diagnostics (Clean Developer Drawer) */}
            {this.state.error && (
              <details className="studio-error-diagnostics">
                <summary className="studio-diagnostics-summary">
                  <Terminal size={14} />
                  <span>Developer Diagnostics</span>
                </summary>
                <div className="studio-diagnostics-body">
                  <p className="diagnostics-error-name">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="diagnostics-stack">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
