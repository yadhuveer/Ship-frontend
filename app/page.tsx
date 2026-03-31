import Image from "next/image";
import fs  from "fs";
import Papa from "papaparse";

import path from "path";
import {HomePage} from "../Features/Home";
import { JSX } from "react";

export default function Home(): JSX.Element{
    const filePath = path.join(process.cwd(), "public/data/ports_50.csv");
  const file =  fs.readFileSync(filePath, "utf8");

  const parsed = Papa.parse(file, { header: true });
  const ports = parsed.data;
  //console.log(ports);

  
  
  return (

    <>
    
    <HomePage ports={ports}/>
    </>
  )


}

