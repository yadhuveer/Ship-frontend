import { JSX } from "react";
 
//import React, { useState } from "react";
import { cookies  } from "next/headers";

import Retrain from "../../Features/Retrain";
import { size } from "zod";

export default async function RetrainPage(): Promise<JSX.Element>{

     


   return(
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-1">
    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight text-center">Retrain the ETA and Fuel Model</h1>
    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto mb-4"></div>
    <Retrain />
   
    </div>
   )
    

}