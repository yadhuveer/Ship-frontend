"use client";
import Link from "next/link";
import { JSX } from "react";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Waves } from "lucide-react";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";

const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters")
    .regex(/^[A-Za-z][A-Za-z\s'-]*$/, "Only letters, spaces, apostrophes, and hyphens allowed"),

  lastName: z
    .string()
    .min(1, "Last name must be at least 1 character")
    .max(50, "Last name must be at most 50 characters")
    .regex(/^[A-Za-z][A-Za-z\s'-]*$/, "Only letters, spaces, apostrophes, and hyphens allowed"),

  email: z.string().email("Please provide a valid email address"),

  password: z.string().min(8, "Password must be at least 8 characters"),
});


type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage(): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const router = useRouter()
  type RegisterResponse = {
    success:boolean,
    message:string
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleRegister = async (data: RegisterFormData) => {
    //alert("Hi");
    //alert(data);
    //console.log("Form submitted:", data);
    //console.log("Hi");
    try{
      const API = process.env.NEXT_PUBLIC_API_URL;
       const result:Response = await fetch(`${API}/user/signUp`,{method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)})
      
      const jsonResult:RegisterResponse = await result.json();

      if (!result.ok) {
        
        setServerError(jsonResult.message || "Something went wrong");
        return;
      }
    
    setServerError(null);

    console.log(jsonResult);
    alert("Sucessfully Registered");
    router.push("/login")
    

    }catch(err){
      setServerError("Server is unreachable, please try again later.");
      console.log("Its an err "+err);
    }
   
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden">
      <div className="min-w-full flex flex-col justify-center items-center">
        <form
          onSubmit={handleSubmit(handleRegister)}
          className="mt-3 flex flex-col justify-center w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg sm:rounded-xl p-6 sm:p-8 space-y-2"
        >
          <div className="text-center pb-4 sm:pb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Create Account
            </h2>
            <p className="text-white/60 text-sm sm:text-base">
              Join the maritime command center
            </p>
          </div>

   
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="block text-white font-medium text-sm sm:text-base"
            >
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                id="firstName"
                type="text"
                placeholder="John"
                {...register("firstName")}
                className="w-full pl-9 sm:pl-10 pr-4 h-10 sm:h-12 bg-white/10 backdrop-blur-sm border border-white/20 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/30 focus:outline-none text-white placeholder-white/50 rounded-lg text-sm sm:text-base transition-all duration-200"
              />
            </div>
            {errors.firstName && (
              <p className="text-red-400 text-xs sm:text-sm">
                {errors.firstName.message}
              </p>
            )}
          </div>

       
          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="block text-white font-medium text-sm sm:text-base"
            >
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                id="lastName"
                type="text"
                placeholder="Doe"
                {...register("lastName")}
                className="w-full pl-9 sm:pl-10 pr-4 h-10 sm:h-12 bg-white/10 backdrop-blur-sm border border-white/20 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/30 focus:outline-none text-white placeholder-white/50 rounded-lg text-sm sm:text-base transition-all duration-200"
              />
            </div>
            {errors.lastName && (
              <p className="text-red-400 text-xs sm:text-sm">
                {errors.lastName.message}
              </p>
            )}
          </div>

       
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-white font-medium text-sm sm:text-base"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="captain@shipsmart.ai"
                {...register("email")}
                className="w-full pl-9 sm:pl-10 pr-4 h-10 sm:h-12 bg-white/10 backdrop-blur-sm border border-white/20 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/30 focus:outline-none text-white placeholder-white/50 rounded-lg text-sm sm:text-base transition-all duration-200"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs sm:text-sm">
                {errors.email.message}
              </p>
            )}
            {serverError && (
               <p className="text-red-400 text-xs sm:text-sm">
                {serverError}
              </p>
)}
          </div>

         
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-white font-medium text-sm sm:text-base"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder=".........."
                {...register("password")}
                className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 h-10 sm:h-12 bg-white/10 backdrop-blur-sm border border-white/20 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/30 focus:outline-none text-white placeholder-white/50 rounded-lg text-sm sm:text-base transition-all duration-200"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center hover:bg-white/10 rounded transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                ) : (
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs sm:text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

         
          <button
            type="submit"
            className="w-full h-10 sm:h-12 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
          >
            Register
          </button>

          <div className="text-center text-white/60 pt-4">
            <p>Already have an account?</p>
            <Link href="/login">
              <button className="w-full mt-2 h-10 sm:h-12 border-2 border-white/20 bg-white/5 hover:bg-white/10 hover:border-blue-400/50 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base">
                <div className="flex items-center justify-center space-x-2">
                  <Waves className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Login</span>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </div>
              </button>
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
  );



}
