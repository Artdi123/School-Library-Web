import { CheckCircle } from "lucide-react";

export default function SuccessToast({ show, message, submessage }) {
  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5">
      <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]">
        <CheckCircle className="w-6 h-6 shrink-0" />
        <div>
          <p className="font-semibold">{message}</p>
          {submessage && (
            <p className="text-sm text-green-100 mt-1">{submessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
