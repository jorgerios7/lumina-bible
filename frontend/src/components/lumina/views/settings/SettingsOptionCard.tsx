type SettingsOptionCardProps<TValue extends string> = {
  title: string;
  activeValue: TValue;
  values: readonly TValue[];
  onSelect: (value: TValue) => void;
};

export function SettingsOptionCard<TValue extends string>({
  title,
  activeValue,
  values,
  onSelect,
}: SettingsOptionCardProps<TValue>) {
  return (
    <article className="settings-card">
      <h3>{title}</h3>
      <div className="form-stack">
        {values.map((value) => (
          <button className="secondary-button" key={value} onClick={() => onSelect(value)}>
            {activeValue === value ? "Selecionado" : "Usar"} {value}
          </button>
        ))}
      </div>
    </article>
  );
}
