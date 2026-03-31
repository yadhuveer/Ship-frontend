/*import { Result } from "../../Features/Result"

import History from "../../Features/History"
import { JSX } from "react";
 
import { cookies  } from "next/headers";
import { UnauthorizedRedirect } from "../../Features/UnAuthorizedError";

export default async function HistoryPage(): Promise<JSX.Element>{

    let newResult;
    let unauthorized = false;
   try{
     const cookieStore= await cookies();
    const token = cookieStore.get("token")?.value;
    
    const headers: HeadersInit = {"Content-Type": "application/json",};


    let sizeCount=8;


    if (token) {
      headers.Cookie = `token=${token}`;
    }

   
    
    
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    

    const resultResponse:Response =  await fetch(`${apiUrl}/voyage/history`,{
      headers,
      credentials: "include"});

       const result =await  resultResponse.json();

      console.log(result.message);
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
    

    return(
        <>
        {newResult ? (
        <History data={newResult} />
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
import  History  from "../../Features/History";

export default function HistoryPage() {
  return <History />;
}
