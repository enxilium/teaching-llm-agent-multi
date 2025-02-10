'use client'

import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import { ChatBox } from "@/components/Chatbox";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-[#2D0278] to-[#0A001D] h-screen w-screen p-8 overflow-hidden">
      <div className="absolute z-50">
        <Sidebar />
      </div>

      <div className="h-full flex flex-col">
        {/* Title Section */}
        <div className="flex justify-center items-center pb-4">
          <h1 className="text-4xl font-secondary text-foreground">Lesson 1.1: Combinatorics</h1>
        </div>

        {/* Blackboard Section */}
        <div className="flex-1">
          {/* Blackboard Image */}
          <div className="bg-primary border-[#210651] border-[1em] w-full h-full rounded-xl">

          </div>

          {/* Centered Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-4xl font-primary text-foreground text-center">
              Linear Algebra Basics
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-4 flex flex-col overflow-hidden h-[200px] md:h-[300px]">
          <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 overflow-hidden">
            {/* Left Table with Clyde */}
            <div className="flex justify-center items-center flex-1">
              <div className="relative h-full w-full min-w-[120px] md:max-w-[200px]">
                <Image
                  src="Clyde.svg"
                  alt="User Avatar"
                  fill
                  className="object-contain drop-shadow-lg z-[50]"
                />
                <Image
                  src="tableLeft.svg"
                  alt="Left Student Table"
                  fill
                  className="object-fill"
                />
              </div>
            </div>

            {/* Right Table */}
            <div className="flex justify-center items-center flex-1">
              <div className="relative h-full w-full min-w-[120px] md:max-w-[200px]">
                <Image
                  src="tableRight.svg"
                  alt="Right Student Table"
                  fill
                  className="object-fill"
                />
              </div>
            </div>
          </div>

          {/* Chatbox Section */}
          <div className="h-24 flex items-center justify-center -mb-4 -mx-8">
            <ChatBox />
          </div>
        </div>
      </div>
    </div>
  );
}