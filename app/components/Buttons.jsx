import { Save, X } from "lucide-react";

export default function Buttons({ onCancel, submitText = "Save Changes" }) {
  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
      <button
        type="button"
        onClick={onCancel}
        className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
      >
        <X className="w-4 h-4" />
        Cancel
      </button>
      <button
        type="submit"
        className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <Save className="w-4 h-4" />
        {submitText}
      </button>
    </div>
  );
}
