type AuthFeedbackProps = {
  email: string;
  error: string;
  recoverySent: boolean;
};

export function AuthFeedback({ email, error, recoverySent }: AuthFeedbackProps) {
  return (
    <>
      {error && <p className="auth-alert error">{error}</p>}
      {recoverySent && (
        <p className="auth-alert success">Link de recuperacao enviado para {email.trim()}.</p>
      )}
    </>
  );
}
