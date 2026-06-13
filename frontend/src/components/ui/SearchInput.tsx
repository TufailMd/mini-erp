import { Search } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';

type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  placeholder?: string;
};

export default function SearchInput({ placeholder = 'Search...', ...rest }: SearchInputProps) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
      <Search size={16} className="text-slate-400" />
      <input aria-label="Search" placeholder={placeholder} className="outline-none w-full text-sm" {...rest} />
    </div>
  );
}
