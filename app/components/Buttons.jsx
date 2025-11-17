export default function Buttons({ onCancel }) {
  return (
    <div className="flex justify-end gap-3 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm hover:shadow-md"
      >
        Save Changes
      </button>
    </div>
  );
}
