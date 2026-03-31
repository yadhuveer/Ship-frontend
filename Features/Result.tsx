"use client";
//import React from "react";
import React, { useEffect, useState } from "react";

import { UnauthorizedRedirect } from "./UnAuthorizedError";
import { useRef } from "react";
import { useSearchParams } from "next/navigation";

interface ResultData {
  
    origin: string;
    destination: string;
    cargo: number;
    predictedETA: number;
    predictedFuel: number;
    speed: number;
    weather: string;
    Traffic: string;
    reqPath: string[];

}


interface SearchParams {
  source?: string;
  destination?: string;
  cargo?: string;
}

interface ResultProps {
  searchParams: SearchParams;
}



export const Result: React.FC = () => {
  /*if (!data) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold text-gray-600">
        No Result Found
      </div>
    );
  }*/
   const searchParams = useSearchParams();
  const [data, setData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

   const fetchCalled = useRef(false);

    const params = {
    source: searchParams.get("source") || undefined,
    destination: searchParams.get("destination") || undefined,
    cargo: searchParams.get("cargo") || undefined,
  };

   useEffect(() => {

    if (fetchCalled.current) return;
  fetchCalled.current = true;
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/voyage/voyagePlanner`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", 
          body: JSON.stringify(params),
        });

        const result = await response.json();
        console.log(result.message);

        if (response.status === 429) {
          setRateLimited(true);
        } else if (result.message === "unauthorized") {
          setUnauthorized(true);
        } else {
          setData(result.message);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold text-gray-600">
        Loading...
      </div>
    );
  }

   if (rateLimited) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold text-red-600">
        Rate limit exceeded. Please try after 24 hours.
      </div>
    );
  }

  if (unauthorized) {
    return <UnauthorizedRedirect message="Session expired. Redirecting to login..." />;
  }

    if (!data) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold text-gray-600">
        No Result Found
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-3xl w-full space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Voyage Planner Result
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <p>
            <span className="font-semibold">Source:</span> {data.origin}
          </p>
          <p>
            <span className="font-semibold">Destination:</span> {data.destination}
          </p>
          <p>
            <span className="font-semibold">Cargo:</span> {data.cargo} tons
          </p>
          <p>
            <span className="font-semibold">ETA:</span>{" "}
            {data.predictedETA.toFixed(2)} hrs
          </p>
          <p>
            <span className="font-semibold">Fuel Required:</span>{" "}
            {data.predictedFuel.toFixed(2)} L
          </p>
          <p>
            <span className="font-semibold">Speed:</span>{" "}
            {data.speed.toFixed(2)} knots
          </p>
          <p>
            <span className="font-semibold">Weather:</span> {data.weather}
          </p>
          <p>
            <span className="font-semibold">Traffic:</span> {data.Traffic}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Route</h2>
          <p className="text-gray-700">
            {data.reqPath.join(" → ")}
          </p>
        </div>
      </div>
    </div>
  );
};

//export default Result;
