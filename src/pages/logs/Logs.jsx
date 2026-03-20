import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/client";

export default function Logs() {

  const { serviceId } = useParams();   // ← dynamic id from URL

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, [serviceId]);

  const loadLogs = async () => {
    try {

      const res = await api.get(`/api/services/${serviceId}/logs`);

      setLogs(
        (res.data || [])
          .sort((a, b) => new Date(b.checkedAt) - new Date(a.checkedAt))
          .slice(0, 20)
      );

    } catch (e) {
      console.error("Failed loading logs", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading logs...</div>;

  return (
    <div className="space-y-6 text-white">

      <h1 className="text-3xl font-bold">Service Logs</h1>

      {logs.length === 0 ? (
        <div className="bg-slate-900 p-6 rounded-xl">
          No logs found
        </div>
      ) : (
        logs.map(log => (
          <div key={log.id} className="bg-slate-900 p-4 rounded-xl">

            <div className="flex justify-between">
              <div className="font-semibold">
                {log.serviceName}
              </div>

              <div className="text-sm text-slate-400">
                {log.checkedAt}
              </div>
            </div>

            <div className="mt-2 text-sm">
              Status:
              <span className={
                log.status === "UP"
                  ? "text-green-400 ml-2"
                  : log.status === "DOWN"
                  ? "text-red-400 ml-2"
                  : "text-yellow-400 ml-2"
              }>
                {log.status}
              </span>
            </div>

            <div className="text-sm mt-1">
              Response Time: {log.responseTimeMs} ms
            </div>

            {log.errorMessage && (
              <div className="text-sm text-red-400 mt-2">
                Error: {log.errorMessage}
              </div>
            )}

          </div>
        ))
      )}
    </div>
  );
}
