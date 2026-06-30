import { Icon } from "@/src/components/common/Icon";

type TopbarSearchProps = {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export function TopbarSearch({ placeholder, value, onChange }: TopbarSearchProps) {
  return (
    <div className="topbar-search search-field">
      <Icon name="search" />
      <input
        className="text-field"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
