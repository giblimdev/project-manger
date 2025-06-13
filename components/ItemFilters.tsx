// components/ItemFilters.tsx
import React from "react";
import { Search, X } from "lucide-react";

type ItemFiltersProps = {
  tableName: string;
  search: string;
  setSearch: (search: string) => void;
  thema: string;
  setThema: (thema: string) => void;
  themas: string[];
  className?: string;
};

const ItemFilters: React.FC<ItemFiltersProps> = ({
  tableName,
  search,
  setSearch,
  thema,
  setThema,
  themas,
  className = "",
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <form
        className={`flex flex-col sm:flex-row gap-3 p-5 bg-white rounded-2xl shadow-lg border border-gray-100/50 backdrop-blur-sm ${className}`}
        role="search"
        aria-label={`Filtres pour ${tableName}`}
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Champ de recherche */}
        <div className="relative flex-1 min-w-[220px]">
          <label htmlFor="item-search" className="sr-only">
            Rechercher dans {tableName}
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={20} strokeWidth={2} />
          </div>
          <input
            id="item-search"
            type="search"
            placeholder={`Rechercher dans ${tableName}...`}
            className="block w-full pl-10 pr-10 py-3 text-sm border border-gray-200 rounded-xl bg-white/80 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none transition-all duration-300 text-gray-900 placeholder-gray-400 shadow-sm hover:shadow-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={`Rechercher dans ${tableName}`}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-500 transition-colors duration-200"
              aria-label="Effacer la recherche"
            >
              <X size={20} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Sélecteur de thème */}
        <div className="w-full sm:w-auto min-w-[220px]">
          <label htmlFor="item-thema" className="sr-only">
            Filtrer par thème
          </label>
          <div className="relative">
            <select
              id="item-thema"
              className="appearance-none block w-full pl-4 pr-8 py-3 text-sm border border-gray-200 rounded-xl bg-white/80 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none transition-all duration-300 text-gray-900 shadow-sm hover:shadow-md"
              value={thema}
              onChange={(e) => setThema(e.target.value)}
              aria-label="Filtrer par thème"
            >
              <option value="" className="text-gray-500">
                Tous les thèmes
              </option>
              {themas.map((option) => (
                <option key={option} value={option} className="text-gray-900">
                  {option}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Bouton de réinitialisation */}
        {(search || thema) && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setThema("");
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl hover:from-blue-600 hover:to-teal-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <X size={16} strokeWidth={2} />
            Réinitialiser
          </button>
        )}
      </form>
    </div>
  );
};

export default ItemFilters;
