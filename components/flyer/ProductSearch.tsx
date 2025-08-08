import React, { useState } from "react";

type Product = {
  id: number;
  name: string;
  thumbnail: string;
};

export default function ProductSearch({ onSelect }: { onSelect: (product: any) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  const handleSearch = async () => {
    const res = await fetch(
      `https://api.kayhanaudio.com.au/v1/product/list/shop?search=${query}`
    );
    const data = await res.json();
    setResults(data.data || []);
  };

  return (
    <div className="border p-4 rounded">
      <input
        type="text"
        placeholder="Search product..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border w-full px-3 py-2 mb-2"
      />
      <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">
        Search
      </button>

      <ul className="mt-2 max-h-60 overflow-y-auto">
        {results.map((item) => (
          <li
            key={item.id}
            className="cursor-pointer hover:bg-gray-100 p-2 border-b"
            onClick={async () => {
              const res = await fetch(`https://api.kayhanaudio.com.au/v1/product/${item.id}`);
              const detail = await res.json();
              onSelect(detail.data);
              setQuery("");
              setResults([]);
            }}
          >
            <img src={item.thumbnail} alt={item.name} className="w-12 inline-block mr-2" />
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
