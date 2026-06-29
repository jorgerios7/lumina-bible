import { Icon } from "@/src/components/common/Icon";

export function AuthBrand() {
  return (
    <>
      <span className="brand-mark">
        <Icon name="leaf" />
      </span>
      <h1 className="auth-title" id="login-title">
        Lumina Bible
      </h1>
      <p className="auth-copy">Estudos biblicos guiados em uma arvore de aprendizado.</p>
    </>
  );
}
