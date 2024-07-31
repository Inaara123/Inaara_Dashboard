"use client"
import { ContainerScroll } from "./components/ui/container-scroll-animation";
import ShootingStars from "./components/ui/shooting-stars";
import { StarsBackground } from "./components/ui/stars-background";
import Image from "next/image";
import mainImg from '..//public/main.jpg'
import Navbar from "./components/Navbar";


export default function Home() {
  return (
    <div className="bg-gradient-to-r from-slate-500 to-slate-900">
    <Navbar/>
    <ShootingStars />
      <StarsBackground />
   
    <div className="flex flex-col overflow-hidden">
    <ContainerScroll
      titleComponent={
        <>
          <h1 className="text-4xl font-semibold text-black dark:text-white">
          Comprehensive Management and <br />
            <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
             Control Center
            </span>
          </h1>
        </>
      }
    >
      <Image
        src={mainImg}
        alt="hero"
        height={720}
        width={1400}
        className="mx-auto rounded-2xl object-cover h-full object-left-top"
        draggable={false}
      />
    </ContainerScroll>
    
  </div>
  </div>
  );
}
