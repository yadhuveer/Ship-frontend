"use client";
import Link from "next/link";

import { useState, useEffect } from "react"
import {Ship,Info,Home,Navigation,Mail,Clock,User,RefreshCcw} from "lucide-react";
import { JSX } from "react";
import {useRouter} from "next/navigation";

export const NavBar = (): JSX.Element=>{

    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const router = useRouter()
    

    useEffect(() => {
        const updateTime = () => setCurrentTime(new Date());
    updateTime(); 
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const checkAuth = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/user/loginAuth`, {
          credentials: "include",
        });
        const data = await res.json();
        setIsLoggedIn(data.authStatus);
      } catch (err) {
        console.error("Error checking auth:", err);
        setIsLoggedIn(false);
      }
    };

  useEffect(() => {
    
    

    checkAuth();
  }, []);


   useEffect(() => {
    const handleRouteChange = () => {
      checkAuth();
    };

    router.prefetch("/"); 
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [router]);


  const handleLogout=async ()=>{
    try{
        console.log("Comming Inside logout")
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res=await fetch(`${apiUrl}/user/logout`,{
 
  credentials: "include"
});

        if (!res.ok) {
        
          router.push("/error");
        }
        setIsLoggedIn(false);
        alert("Sucessfully logged out")
       // window.location.reload();
        

    }catch(err){
        console.log(err);
        router.push("/error");
    }
    

  }
    
    return(
        <>
        <div className=" bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 border-b border-white/10 border-l border-white/10 ">
        <nav className="flex flex-row flex-wrap md:flex-nowrap gap-y-3 md:gap-y-0 justify-evenly w-full px-4 md:px-6 py-4 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10  ">

            <div className="flex flex-row  items-center gap-5 w-full md:w-auto justify-center md:justify-start">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-xl">
                <Ship className="h-8 w-8 text-white" />
                </div>
                <div className="text-center md:text-left">
                    <h1 className="text-lg md:text-xl font-bold text-white">SHIPSMART AI</h1>
                    <p className="text-xs text-blue-300 font-medium">Marine time Intelligence Platform</p>
                
                </div>
            </div>

            <div className="flex flex-wrap  justify-center md:justify-between lg:gap-15 gap-y-3 md:gap-y-0 w-full gap-4 md:w-auto items-center">
                <Link href="/" className="flex items-center gap-1 text-white/80 hover:text-white text-sm md:text-base"><Home/><span className="font-medium">Home</span></Link>
                <Link href="#" className="flex items-center gap-1 text-white/80 hover:text-white text-sm md:text-base"><Info/> <span>About</span></Link>
                <Link href="/history" className="flex items-center gap-1 text-white/80 hover:text-white text-sm md:text-base"><Navigation/><span>History Routes</span></Link>
                <Link href="/retrain" className="flex items-center gap-1 text-white/80 hover:text-white text-sm md:text-base"><RefreshCcw/><span>Retrain</span></Link>

            </div>
            
            <div className="flex items-center justify-center md:justify-end gap-3 w-full md:w-auto">
                <div className="hidden sm:flex items-center gap-2 text-white/60">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-mono">{currentTime? currentTime.toLocaleTimeString():""}</span>
                </div>
                {isLoggedIn?<button onClick={()=>handleLogout()}
                  className=" flex flex-row p-2 items-center w-30 gap-3 rounded-xl shadow-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105  text-sm md:text-base"
                 
                >
                    <User className="h-4 w-4 mr-2" />
                Logout</button>:<Link href="/login"
                  className=" flex flex-row p-2 items-center w-30 gap-3 rounded-xl shadow-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105  text-sm md:text-base"
                 
                >
                    <User className="h-4 w-4 mr-2" />
                Login</Link>}
                
                

            </div>

        </nav>
        </div>
        </>

    )
}