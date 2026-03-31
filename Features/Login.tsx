"use client";
import Link from "next/link";
import path from "path";
import { useState, useEffect } from "react";
import {useRouter} from "next/navigation";
import { JSX } from "react";

import type React from "react";

import { Ship, Mail, Lock, Eye, EyeOff, ArrowRight, Anchor, Waves } from "lucide-react"



export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    //alert("Hi");
    const data:{}={email:email,password:password};
    try{
      const API = process.env.NEXT_PUBLIC_API_URL;

       const result:Response = await fetch(`${API}/user/login`,{method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),credentials: "include"})
      
      
      const jsonResult = await result.json();

      if (!result.ok) {
        
        setServerError(jsonResult.message || "Something went wrong");
        console.error(jsonResult.message);
        return;
      }
    
    setServerError(null);

    console.log(jsonResult);
    
    alert("Sucessfully Logged In");
    window.location.reload();
    //router.push("/")
    

    }catch(err){
      setServerError("Server is unreachable, please try again later.");
      console.log("Its an err "+err);
    }
   
    
    
  }


return(<>
<div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden">
    <div className="min-w-full  flex flex-col justify-center items-center">
    <form onSubmit={handleLogin} className=" mt-3 w-auto flex flex-col  justify-center w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg sm:rounded-xl p-6 sm:p-8 space-y-2">
           
            <div className="text-center pb-4 sm:pb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-white/60 text-sm sm:text-base">Access your maritime command center</p>
            </div>


            
        
               
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-white font-medium text-sm sm:text-base">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      placeholder="captain@shipsmart.ai"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 sm:pl-10 pr-4 h-10 sm:h-12 bg-white/10 backdrop-blur-sm border border-white/20 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/30 focus:outline-none text-white placeholder-white/50 rounded-lg text-sm sm:text-base transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-white font-medium text-sm sm:text-base">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <input
                      id="email"
                      type={showPassword ? "text" : "password"}
                      placeholder=".........."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 h-10 sm:h-12 bg-white/10 backdrop-blur-sm border border-white/20 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/30 focus:outline-none text-white placeholder-white/50 rounded-lg text-sm sm:text-base transition-all duration-200" 
                    />
                  </div>
                  <button
                      type="button"
                      className="absolute right-9 top-[45%] topeye topeye280 transform -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center hover:bg-white/10 rounded transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                      )}
                    </button>
                </div>

                 {serverError && (
            <p className="text-red-400 text-sm font-medium">{serverError}</p>
          )}
                 <button
                  type="submit"
                 
                  className="w-full h-10 sm:h-12 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg  transition-all duration-300 hover:scale-105 text-sm sm:text-base space-y-2"
                >
                  Login
                    
                  
                </button>
                
                <br/>
                 <div className="text-center text-white/60">
                   <p>New to our fleet?</p>
                 </div>
                
                <hr className="text-white"/>


                <div className="text-center space-y-3 sm:space-y-4">
                <p className="text-white/60 text-xs sm:text-sm">Join thousands of maritime professionals</p>
                <Link href="/register">
                  <button className="w-full h-10 sm:h-12 border-2 border-white/20 bg-white/5 hover:bg-white/10 hover:border-blue-400/50 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base">
                    <div className="flex items-center justify-center space-x-2">
                      <Waves className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Register</span>
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                  </button>
                </Link>
              </div>


              <br/>

               <hr className="text-white"/>

               <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm">
                <Link href="#" className="text-white/60 hover:text-white/80 transition-colors duration-200">
                    Privacy Policy
                  </Link>
                  <Link href="#" className="text-white/60 hover:text-white/80 transition-colors duration-200">
                    Terms of Service
                  </Link>
                  <Link href="#" className="text-white/60 hover:text-white/80 transition-colors duration-200">
                    Support
                  </Link>
                
               </div>



                
            
    </form>
     
          <div className="text-center mt-6 sm:mt-8">
            <p className="text-white/40 text-xs">
              © 2024 SHIPSMART AI. Navigating the future of maritime intelligence.
            </p>
          </div>
    </div>
</div>

</>

)


}