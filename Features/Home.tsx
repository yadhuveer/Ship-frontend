"use client";
import Link from "next/link";
import path from "path";
import React, { useState, useEffect } from "react";
import {useRouter} from "next/navigation";
import {Ship,Info,Home,Navigation,Mail,Clock,User,Zap} from "lucide-react";
import { JSX } from "react";

import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";


export function HomePage(props:{ports:any[]}):JSX.Element{



  const [source,setSource]=useState<string>("");
  const [destination,setDestination]=useState<string>("");
  const [cargo,setCargo]=useState<number>(0);
  const router = useRouter();

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const sourcePort = props.ports.find((p) => p.port_name === source);
    const destPort = props.ports.find((p) => p.port_name === destination);

    if (!sourcePort || !destPort) {
      alert("Please select valid ports");
      return;
    }

    router.push(
      `/results?source=${sourcePort.port_id}&destination=${destPort.port_id}&cargo=${cargo}`
    );
  };

    return(
        <>

        <div className=" min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 border-b border-white/10 border-l border-white/10 ">
       


        <div className="max-w-6xl mx-auto text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full w-auto px-6 py-3 mb-8 mt-3">
            <Zap className="h-5 w-5 text-yellow-400" />
            <span className="text-blue-200 font-medium ">Next-Generation Maritime AI</span>
            </div>

            <div>
                <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                  Command Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  Fleet with AI
                </span>
              </h1>
              
              {/*<p className="text-white/70 text-xl max-w-3xl mx-auto leading-relaxed mb-12">
                Revolutionary artificial intelligence platform that transforms maritime operations through predictive analytics, 
                autonomous route optimization.
              </p>*/}

            </div>

            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
  Plan Your Voyage
</h2>



 {/*<div className="md841">
  Test Box
</div>*/}


        <form className="flex justify-center mt-10 md:w-auto w-full md840" onSubmit={handleSubmit}>
  <div className="flex   flex-wrap md:flex-nowrap w-[90%] md:w-auto  items-center  gap-4 bg-white/10 backdrop-blur-xl px-8 py-6 rounded-2xl border border-white/20 shadow-lg md840">
    
   
    <div className="relative w-auto md:w-48">
      <Listbox value={source} onChange={setSource}>
  <ListboxButton className="appearance-none w-full px-6 py-3 pr-10 rounded-xl bg-white/10 backdrop-blur-md text-white text-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:bg-white/20 transition">
    {source || "Select a source port"}
  </ListboxButton>

  <ListboxOptions className="absolute mt-2 w-full max-h-48 overflow-y-auto rounded-xl bg-slate-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
    {props.ports.map((port) => (
      <ListboxOption
        key={port.port_id}
        value={port.port_name}
        className={({ active }) =>
          `cursor-pointer select-none px-4 py-2 ${
            active ? "bg-cyan-600 text-white" : "text-gray-200"
          }`
        }
      >
        {port.port_name}
      </ListboxOption>
    ))}
  </ListboxOptions>
</Listbox>

      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none">▼</span>
    </div>

    <div className="relative w-auto md:w-48">
      <Listbox value={destination} onChange={setDestination}>
  <ListboxButton className="appearance-none w-full px-6 py-3 pr-10 rounded-xl bg-white/10 backdrop-blur-md text-white text-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:bg-white/20 transition">
    {destination || "Select a dest port"}
  </ListboxButton>

  <ListboxOptions className="absolute mt-2 w-full max-h-48 overflow-y-auto rounded-xl bg-slate-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
    {props.ports.map((port) => (
      <ListboxOption
        key={port.port_id}
        value={port.port_name}
        className={({ active }) =>
          `cursor-pointer select-none px-4 py-2 ${
            active ? "bg-cyan-600 text-white" : "text-gray-200"
          }`
        }
      >
        {port.port_name}
      </ListboxOption>
    ))}
  </ListboxOptions>
</Listbox>

      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none">▼</span>
    </div>

    

    
    <div className="relative">
      <input
        type="number"
        placeholder="Enter cargo value"
        className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md text-white text-sm placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:bg-white/20 transition"
        onChange={(e)=>setCargo(Number(e.target.value))}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60">#</span>
    </div>

   
    <button
      type="submit"
      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-medium shadow-md hover:shadow-cyan-500/40 hover:scale-105 transition"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
      </svg>
      Search
    </button>
  </div>
</form>

      </div>
      </div>

      <footer className=" bg-gradient-to-t from-slate-950 via-blue-950 to-indigo-950 border-t border-white/10 py-8 text-white text-center">
  <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
    <p className="text-sm md:text-base">&copy; 2024 SHIPSMART AI. All rights reserved.</p>
    <div className="flex gap-6">
      <Link href="#" className="hover:text-cyan-400 transition">Privacy Policy</Link>
      <Link href="#" className="hover:text-cyan-400 transition">Terms of Service</Link>
      <Link href="#" className="hover:text-cyan-400 transition">Support</Link>
    </div>
  </div>
</footer>

    </>


    
)


}



