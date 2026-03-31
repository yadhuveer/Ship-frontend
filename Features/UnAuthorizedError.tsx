"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function UnauthorizedRedirect({ message }: { message: string }) {
  const router = useRouter();
  const hasRun = useRef(false);


 useEffect(() => {
    hasRun.current=true;

  const timer = setTimeout(() => {
    router.push("/login");
  }, 1500);

  return () => clearTimeout(timer);
}, []);

if(!hasRun.current){
 alert("Session expired. Redirecting to login...");
}
  return (
    <div className="flex items-center justify-center h-screen text-xl font-semibold text-red-600">
      {message}
    </div>
  );
}
