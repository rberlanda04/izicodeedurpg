import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

// React error boundaries must be class components — there is no hook
// equivalent for componentDidCatch/getDerivedStateFromError. Catches render
// errors anywhere in the tree below it (main.tsx wraps <RouterProvider>)
// so a single bad render shows a recoverable screen instead of a blank page.
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Erro não tratado na interface:', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stem-mist text-center gap-3 px-4">
          <span className="text-5xl">⚠️</span>
          <h1 className="font-display font-extrabold text-xl text-stem-ink">Algo deu errado</h1>
          <p className="font-body-stem text-sm text-stem-ink-soft max-w-sm">
            A tela travou de forma inesperada. Você pode tentar de novo — se continuar acontecendo, avise a
            coordenação da sua escola.
          </p>
          <button
            onClick={this.handleRetry}
            className="mt-2 rounded-xl bg-stem-teal text-white font-display font-semibold px-4 py-2 hover:opacity-90"
          >
            Tentar novamente
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
