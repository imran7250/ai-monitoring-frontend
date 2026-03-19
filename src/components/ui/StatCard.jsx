export default function StatCard({ title, value }) {
  const getColor = () => {
    if (title === "UP") return "text-green-600";
    if (title === "DOWN") return "text-red-600";
    if (title === "Incidents") return "text-orange-500";
    return "text-gray-800";
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 border">
      <div className="text-gray-500">{title}</div>
      <div className={`text-3xl font-bold mt-2 ${getColor()}`}>
        {value}
      </div>
    </div>
  );
}
