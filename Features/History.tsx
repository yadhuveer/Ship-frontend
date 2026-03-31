"use client";

import React, {useEffect, useState } from "react";

import { UnauthorizedRedirect } from "./UnAuthorizedError";



interface VoyageData {
  _id: string;
  userId: string;
  origin: string;
  destination: string;
  distance: number;
  cargo: number;
  originPort: string;
  destinationPort: string;
  predictedETA: number;
  feedBackETA: number | null;
  predictedFuel: number;
  feedBackFuel: number | null;
  speed: number;
  weatherFactor: number;
  weather: string;
  TrafficFactor: number;
  Traffic: string;
  portPath: string[];
  reqPath: string[];
}

/*interface HistoryProps {
  data: VoyageData[];
}*/

const History: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [submittedIds, setSubmittedIds] = useState<string[]>([]);
   const [data, setData] = useState<VoyageData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);


  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/voyage/history`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await res.json();

        if (result.message === "unauthorized") {
          setUnauthorized(true);
        } else {
          setData(result.message);
        }
      } catch (err) {
        console.error("Error fetching history:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getItemsPerPage = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 6;
      return 8;
    }
    return 8;
  };

  const itemsPerPage = getItemsPerPage();
  
  const handleSubmit = async (id: string) => {
    const etaInput = document.getElementById(`eta-${id}`) as HTMLInputElement;
    const fuelInput = document.getElementById(`fuel-${id}`) as HTMLInputElement;

    if (etaInput && fuelInput && etaInput.value && fuelInput.value) {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${API}/voyage/feedback`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            feedBackETA: Number(etaInput.value),
            feedBackFuel: Number(fuelInput.value),
          }),
        });

        if (res.ok) {
          // mark this voyage as submitted
          setSubmittedIds((prev) => [...prev, id]);
        } else {
          alert("Failed to submit feedback");
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Please enter both feedback values.");
    }
  };


   if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold text-gray-600">
        Loading history...
      </div>
    );
  }

  if (unauthorized) {
    return (
      <UnauthorizedRedirect message="Session expired. Redirecting to login..." />
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold text-gray-600">
        No voyage history found.
      </div>
    );
  }



  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);



  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
    {/* Header */}
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Voyage History</h1>
      <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto mb-4"></div>
      <p className="text-slate-300 text-lg">Review and provide feedback on past voyage predictions</p>
    </div>

    {/* Cards Grid */}
    <div className="grid gap-6 justify-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto auto-rows-fr">
      {currentData.map((item) => {
        const alreadySubmitted = submittedIds.includes(item._id);

        return (
          <div
            key={item._id}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 w-full max-w-sm flex flex-col"
          >
            {/* Top Section */}
            <div className="flex flex-col flex-1">
              {/* Title */}
              <div className="mb-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-3">
                  {item.origin} → {item.destination}
                </h2>
              </div>

              {/* Stats Section */}
              <div className="space-y-3 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm font-medium">Cargo:</span>
                  <span className="text-emerald-400 font-semibold">{item.cargo} tons</span>
                </div>

                <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-300 text-sm font-medium">Pred. ETA:</span>
                    <span className="text-blue-400 font-bold">{item.predictedETA.toFixed(2)} hrs</span>
                  </div>
                </div>

                <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300 text-sm font-medium">Pred. Fuel:</span>
                    <span className="text-purple-400 font-bold">{item.predictedFuel.toFixed(2)} lts</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm font-medium">Speed:</span>
                  <span className="text-cyan-400 font-semibold">{item.speed.toFixed(2)} km/hr</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm font-medium">Weather:</span>
                  <span className="text-yellow-400 font-semibold capitalize">{item.weather}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm font-medium">Traffic:</span>
                  <span className="text-orange-400 font-semibold capitalize">{item.Traffic}</span>
                </div>
              </div>

              {/* Path Section */}
              <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30 min-h-[200px]   mt-auto">
                <p className="text-slate-400 text-xs font-medium mb-1">Path:</p>
                <p className="text-slate-300 text-sm break-words whitespace-normal leading-relaxed">
                  {item.reqPath.join(" → ")}
                </p>
              </div>
            </div>

            {/* Feedback Section */}
            <div className="mt-3 flex flex-col gap-3">
              <div className="bg-slate-700/20 rounded-xl p-4 border border-slate-600/30 flex flex-col gap-3">
                <h3 className="text-slate-300 font-semibold mb-3 text-center">Provide Feedback</h3>

                <input
                  type="number"
                  id={`eta-${item._id}`}
                  placeholder="Feedback ETA"
                  className="w-full p-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={alreadySubmitted}
                />
                <input
                  type="number"
                  id={`fuel-${item._id}`}
                  placeholder="Feedback Fuel"
                  className="w-full p-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={alreadySubmitted}
                />
                <button
                  onClick={() => !alreadySubmitted && handleSubmit(item._id)}
                  disabled={alreadySubmitted}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                    alreadySubmitted
                      ? "bg-emerald-600 text-white cursor-not-allowed shadow-lg"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
                  }`}
                >
                  {alreadySubmitted ? "✓ Feedback Submitted" : "Submit"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {/* Pagination */}
    <div className="flex justify-center items-center mt-12 space-x-4">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((p) => p - 1)}
        className="px-6 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white font-medium hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
      >
        Prev
      </button>
      <div className="px-6 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg">
        <span className="text-white font-semibold">
          Page {currentPage} of {totalPages}
        </span>
      </div>
      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((p) => p + 1)}
        className="px-6 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white font-medium hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
      >
        Next
      </button>
    </div>
  </div>
);


  
};

export default History;
