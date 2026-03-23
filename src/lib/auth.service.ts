/**
 * Auth service – local password gate only (no database).
 * signOut clears local session. signIn/signUp/signInWithGoogle are no-ops.
 */

export type SignUpResult = { success: true; message: string } | { success: false; error: string };
export type SignInResult = { success: true } | { success: false; error: string };

export async function signUp(
  _email: string,
  _password: string,
  _options?: { redirectTo?: string }
): Promise<SignUpResult> {
  return { success: false, error: 'Auth not configured. Use password gate (VITE_GATE_PASSWORD) for edit access.' };
}

export async function signIn(_email: string, _password: string): Promise<SignInResult> {
  return { success: false, error: 'Auth not configured. Use password gate (VITE_GATE_PASSWORD) for edit access.' };
}

export async function signInWithGoogle(_redirectTo?: string): Promise<SignInResult> {
  return { success: false, error: 'Auth not configured.' };
}

export async function signOut(): Promise<void> {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem('ift_local_admin');
  }
}
