type FocusActionsProps = {
  onClose: () => void;
  onNext: () => void;
};

export function FocusActions({ onClose, onNext }: FocusActionsProps) {
  return (
    <div className="inline-between">
      <button className="secondary-button" onClick={onClose}>
        Voltar
      </button>
      <button className="primary-button" onClick={onNext}>
        Proximo
      </button>
    </div>
  );
}
