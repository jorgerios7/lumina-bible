import { Icon } from "@/src/components/common/Icon";

type BibleSearchProps = {
  query: string;
  onChangeQuery: (value: string) => void;
};

export function BibleSearch({ query, onChangeQuery }: BibleSearchProps) {
  return (
    <div className="search-field">
      <Icon name="search" />
      <input
        className="text-field"
        value={query}
        onChange={(event) => onChangeQuery(event.target.value)}
        placeholder="Pesquisar neste capitulo..."
      />
    </div>
  );
}
