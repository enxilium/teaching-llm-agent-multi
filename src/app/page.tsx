// page.tsx
'use client'

import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import { ChatBox } from "@/components/Chatbox";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-[#2D0278] to-[#0A001D] h-screen w-screen p-8 overflow-hidden">
      <div className="absolute">
        <Sidebar />
      </div>

      <div className="h-full flex flex-col">
        {/* Title Section */}
        <div className="flex justify-center items-center pb-4">
          <h1 className="text-4xl font-secondary text-foreground">Lesson 1.1: Combinatorics</h1>
        </div>

        {/* Blackboard Section */}
        <div className="flex-1 min-h-0 relative" style={{
          height: 'calc(100vh - 12rem)',
          marginLeft: '-2rem',
          marginRight: '-2rem'
        }}>
          {/* Blackboard Image */}
          <div className="absolute inset-0">
            <Image
              src="/board.svg"
              alt="Classroom Board"
              fill
              className="object-fill"
              priority
            />
          </div>

          {/* Centered Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-4xl font-primary text-foreground text-center">
              Linear Algebra Basics
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="h-[300px] flex flex-col mt-4 overflow-hidden">
          <div className="flex-1 flex gap-6 overflow-hidden">
            {/* Left Table with Clyde */}
            <div className="flex items-center flex-1"> {/* New flex container */}
              {/* Clyde positioned inline with table */}
              {/* Left Table */}
              <div className="relative flex-1 h-full">
                <Image
                  src="/Clyde.svg"
                  alt="User Avatar"
                  fill
                  className="object-contain drop-shadow-lg z-[50]"
                />
                <Image
                  src="/tableLeft.svg"
                  alt="Left Student Table"
                  fill
                  className="object-fill"
                />
              </div>
            </div>

            {/* Right Table */}
            <div className="relative flex-1">
              <Image
                src="/tableRight.svg"
                alt="Right Student Table"
                fill
                className="object-fill"
              />
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