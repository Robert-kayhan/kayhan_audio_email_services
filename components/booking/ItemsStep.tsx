export const ItemsStep = ({ items, setItems }: any) => {
  const addItem = () => {
    if (items.newItem.trim()) {
      setItems({ list: [...items.list, items.newItem.trim()], newItem: "" });
    }
  };

  const removeItem = (index: number) =>
    setItems({
      list: items.list.filter((_: any, i: any) => i !== index),
      newItem: items.newItem,
    });

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <input
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
          placeholder="Add an item"
          value={items.newItem}
          onChange={(e: any) => setItems({ ...items, newItem: e.target.value })}
        />
        <button
          type="button"
          className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg"
          onClick={addItem}
        >
          Add
        </button>
      </div>
      <ul className="list-disc pl-5 space-y-1">
        {items.list.map((item: string, index: number) => (
          <li key={index} className="flex justify-between items-center">
            <span>{item}</span>
            <button
              type="button"
              className="text-red-500 hover:text-red-400"
              onClick={() => removeItem(index)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};