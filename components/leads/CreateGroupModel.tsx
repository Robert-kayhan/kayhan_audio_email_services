export default function CreateGroupModal({
  isOpen,
  groupName,
  setGroupName,
  onClose,
  onCreate,
}: {
  isOpen: boolean;
  groupName: string;
  setGroupName: (v: string) => void;
  onClose: () => void;
  onCreate: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-sm shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Create New Lead Group</h3>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group Name"
          className="w-full px-4 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-700 focus:outline-none"
        />
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
