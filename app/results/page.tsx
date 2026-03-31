/*import { Result } from "../../Features/Result"

import { JSX } from "react";
 
import { cookies  } from "next/headers";

import { redirect } from "next/navigation";


import {UnauthorizedRedirect} from "../../Features/UnAuthorizedError"
export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise< { source?: string; destination?: string; cargo?: string }>;
}): Promise<JSX.Element>{

 

  let newResult;
  let unauthorized = false;
   try{
     const cookieStore= await cookies();
    const token = cookieStore.get("token")?.value;
    
    const headers: HeadersInit = {"Content-Type": "application/json",};

    console.log("Hi");
    if (token) {
      console.log("token exsists");
      headers.Cookie = `token=${token}`;
    }
    
    const {source,destination,cargo}= await searchParams; 
    
    const data={cargo:cargo,source:source,destination:destination};

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const resultResponse:Response =  await fetch(`${apiUrl}/voyage/voyagePlanner`,{method: 'POST',
      headers,
      body: JSON.stringify(data),credentials: "include"});

       const result =await  resultResponse.json();

      console.log(result.message);

      if(resultResponse.status==429){
       return (
        <div className="flex items-center justify-center h-screen text-xl font-semibold text-red-600">
          Rate limit exceeded. Please try after 24 hours.
        </div>)
      }

      console.log("Hi after json response")

      if(result.message=="unauthorized"){
        unauthorized = true;
        
       
        newResult=null;
      }else{
        newResult =result.message;

      }
      
  

   }catch(err){
    console.log("err is "+err);
    newResult=null;

   }

   if (unauthorized) {
    return <UnauthorizedRedirect message="Session expired. Redirecting to login..." />;
  }
    
    return (
        <>
        {newResult ? (
        <Result data={newResult} />
      ) : (
        <div className="flex items-center justify-center h-screen text-xl font-semibold text-gray-600">
          Something went wrong. Please try again later.
        </div>
      )}
        
        </>
      

   
  )



}*/
"use client";

import React from "react";
import { Result } from "../../Features/Result";

/*interface ResultPageProps {
  searchParams: {
    source?: string;
    destination?: string;
    cargo?: string;
  };
}*/

export default function ResultPage() {
  return <Result  />;
}

