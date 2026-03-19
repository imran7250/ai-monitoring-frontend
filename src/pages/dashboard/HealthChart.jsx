// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// const data = [
//   { time: "10:00", latency: 120 },
//   { time: "10:05", latency: 140 },
//   { time: "10:10", latency: 110 },
//   { time: "10:15", latency: 160 },
//   { time: "10:20", latency: 130 },
//   { time: "10:25", latency: 170 },
//   { time: "10:30", latency: 150 },
// ];

// export default function HealthChart() {
//   return (
//     <div className="bg-white rounded-2xl shadow p-6">
//       <h2 className="text-xl font-semibold mb-4">Service Response Time</h2>

//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="time" />
//           <YAxis />
//           <Tooltip />
//           <Line
//             type="monotone"
//             dataKey="latency"
//             stroke="#2563eb"
//             strokeWidth={3}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }
