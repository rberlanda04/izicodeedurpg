import { FirebaseError } from 'firebase/app';

/** Maps Firebase Auth error codes to friendly Portuguese messages for the UI. */
export function describeAuthError(err: unknown): string {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case 'auth/email-already-in-use':
        return 'Este email já está cadastrado. Tente entrar em vez de criar uma conta.';
      case 'auth/invalid-email':
        return 'Email inválido.';
      case 'auth/weak-password':
        return 'A senha precisa ter pelo menos 6 caracteres.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Email ou senha incorretos.';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Aguarde um momento e tente de novo.';
      case 'auth/operation-not-allowed':
      case 'auth/configuration-not-found':
        return 'Login por email/senha ainda não foi ativado neste projeto Firebase (configuração pendente do administrador).';
      case 'auth/popup-closed-by-user':
        return 'Janela do Google fechada antes de concluir o login.';
      default:
        return `Não foi possível concluir: ${err.code}`;
    }
  }
  return 'Algo deu errado. Tente novamente.';
}
