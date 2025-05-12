import React from "react";

interface SearchBarProps {
  title: string;
  setTitle: (value: string) => void;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ title, setTitle, onSearch }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(title);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center space-y-2"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter show or movie..."
        className="border border-gray-300 rounded px-4 py-2 w-64"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 !text-white font-semibold px-4 py-2 rounded shadow transition duration-200"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
