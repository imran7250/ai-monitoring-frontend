import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";

export default function Anomalies() {

  const [anomalies, setAnomalies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/api/anomalies/latest");
      setAnomalies(res.data || []);
    } catch (err) {
      console.error("Failed loading anomalies", err);
    }
  };

  const getSeverity = (score) => {
    if (!score) return { label: "LOW", color: "bg-yellow-500/20 text-yellow-400" };
    if (score > 10) return { label: "CRITICAL", color: "bg-red-500/20 text-red-400" };
    if (score > 5) return { label: "HIGH", color: "bg-orange-500/20 text-orange-400" };
    return { label: "LOW", color: "bg-yellow-500/20 text-yellow-400" };
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <AlertTriangle className="w-6 h-6 text-purple-400" />
        <h1 className="text-2xl font-bold">AI Anomaly Events</h1>
      </div>

      {anomalies.length === 0 && (
        <p className="text-slate-400">No anomalies detected</p>
      )}

      <div className="space-y-4">

        {anomalies.map((a) => {

          const severity = getSeverity(a.deviationScore);

          return (
            <div
              key={`${a.serviceId}-${a.metricName}-${a.detectedAt}`}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex justify-between items-center hover:border-purple-500/40 transition"
            >

              {/* LEFT SIDE */}
              <div className="space-y-1">

                <div className="text-sm text-slate-400">
                  Service
                </div>

                <div className="text-lg font-semibold text-blue-400">
                  {a.serviceName || `Service ${a.serviceId}`}
                </div>

                <div className="text-sm text-slate-300 mt-2">
                  Metric: <span className="font-medium">{a.metricName}</span>
                </div>

                <div className="text-sm text-slate-400">
                  Detected: {new Date(a.detectedAt).toLocaleString()}
                </div>

              </div>

              {/* CENTER */}
              <div className="text-center">

                <div className="text-sm text-slate-400">
                  Deviation
                </div>

                <div className="text-xl font-bold text-white">
                  {a.deviationScore ? a.deviationScore.toFixed(2) : "0.00"}σ
                </div>

                <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs ${severity.color}`}>
                  {severity.label}
                </div>

              </div>

              {/* RIGHT SIDE */}
              <div>
                <button
                  onClick={() => navigate(`/services/${a.serviceId}`)}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm"
                >
                  Investigate
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}
