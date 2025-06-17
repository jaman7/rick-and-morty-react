import { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import httpService from '@/core/services/http/http.service';
import { ICharactersResponse } from '@/shared/types/character';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useAutoCompleteSearch } from './useAutoCompleteSearch';
import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';
import './AutoComplete.scss';

const http = new httpService();

interface Props {
  queryVal: string;
  onSelect: (name: string | null) => void;
  className?: string;
  placeholder?: string;
  url: string;
  paramName: string;
}

const AutoComplete = ({ url, paramName, queryVal, onSelect, className = '', placeholder = 'Search character...' }: Props) => {
  const [query, setQuery] = useState(queryVal);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const listId = useRef(`autocomplete-list-${Math.random().toString(36).substring(2, 9)}`).current;

  const { t } = useFallbackTranslation();

  useEffect(() => {
    setQuery(queryVal);
  }, [queryVal]);

  useAutoCompleteSearch(
    query,
    async (searchTerm) => {
      const res = await http.get<ICharactersResponse>(url, { [paramName]: searchTerm }, { ignoreLoader: 'true' });
      return res?.results?.map((r) => r.name) ?? [];
    },
    (res) => {
      setSuggestions(res);
      setIsOpen(true);
    }
  );

  const handleSelect = useCallback(
    (name: string) => {
      setQuery(name);
      setIsOpen(false);
      onSelect(name);
    },
    [onSelect]
  );

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onSelect(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0) handleSelect(suggestions[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className={classNames('autocomplete', className)}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length > 1 && setIsOpen(true)}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder={t(placeholder)}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={highlightedIndex >= 0 ? `autocomplete-option-${highlightedIndex}` : undefined}
      />

      {query?.length > 0 ? <FaTimes className="icon-clear" role="button" onClick={handleClear} /> : <FaSearch className="icon-search" />}

      {isOpen && suggestions.length > 0 && (
        <ul id={listId} role="listbox" className="autocomplete__list">
          {suggestions.map((name, i) => (
            <li
              key={i}
              id={`autocomplete-option-${i}`}
              role="option"
              aria-selected={highlightedIndex === i}
              className={highlightedIndex === i ? 'highlighted' : ''}
              onMouseDown={() => handleSelect(name)}
              data-testid={`autocomplete-option-${i}`}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoComplete;
