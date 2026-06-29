import { AuthFeedback } from "@/src/components/lumina/auth/AuthFeedback";
import type { LoginFormController } from "@/src/components/lumina/auth/types";

type AuthFormProps = {
  controller: LoginFormController;
};

export function AuthForm({ controller }: AuthFormProps) {
  return (
    <form className="form-stack" onSubmit={controller.submit}>
      {controller.mode === "signup" && (
        <label className="field-label">
          Nome
          <input
            className="text-field"
            value={controller.name}
            onChange={(event) => controller.setName(event.target.value)}
            disabled={controller.isSubmitting}
            placeholder="Seu nome"
            required
          />
        </label>
      )}
      <label className="field-label">
        E-mail
        <input
          className="text-field"
          type="email"
          value={controller.email}
          onChange={(event) => controller.setEmail(event.target.value)}
          disabled={controller.isSubmitting}
          placeholder="voce@email.com"
          required
        />
      </label>
      <label className="field-label">
        Senha
        <input
          className="text-field"
          type="password"
          value={controller.password}
          onChange={(event) => controller.setPassword(event.target.value)}
          disabled={controller.isSubmitting}
          minLength={6}
          placeholder="Minimo 6 caracteres"
          required
        />
      </label>
      <AuthFeedback
        email={controller.email}
        error={controller.error}
        recoverySent={controller.recoverySent}
      />
      <button className="primary-button" disabled={controller.isSubmitting} type="submit">
        {controller.isSubmitting ? "Processando..." : controller.mode === "signup" ? "Criar conta" : "Entrar"}
      </button>
    </form>
  );
}
