import { BookOpen, CheckCircle, Library } from "lucide-react";

export default function StatsCards({
  activeBorrows,
  completedBorrows,
  availableBooks,
}) {
  const stats = [
    {
      label: "Active Borrows",
      value: activeBorrows,
      icon: BookOpen,
      gradient: "from-blue-500 to-indigo-500",
      bgGradient: "from-blue-50 to-indigo-50",
    },
    {
      label: "Completed",
      value: completedBorrows,
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
    },
    {
      label: "Available Books",
      value: availableBooks,
      icon: Library,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`bg-linear-to-br ${stat.bgGradient} rounded-2xl p-6 border border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  {stat.label}
                </p>
                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div
                className={`w-14 h-14 bg-linear-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <Icon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
