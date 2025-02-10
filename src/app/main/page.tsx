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
        <div className="flex-1 flex items-center align-middle justify-center py-8 relative">
          {/* Blackboard Image */}
          <div className="bg-secondary border-[#210651] border-[1em] w-full h-full rounded-xl mx-16 relative">
            {/* Centered Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="font-primary text-foreground text-center m-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </div>
          {/* Decoration */}
          <Image
            src="/Bob.svg"
            alt="Blackboard"
            width="200"
            height="200"
            className="absolute z-10 -top-10 left-0"
          />

          <div className="bg-primary w-[95%] h-8 rounded-2xl absolute left-1/2 transform -translate-x-1/2 bottom-[5%]">
            <Image
              src="/flower.svg"
              alt="Blackboard"
              width="50"
              height="50"
              className="absolute z-10 bottom-full left-24"
            />

            <Image
              src="/chalk.svg"
              alt="Blackboard"
              width="50"
              height="50"
              className="absolute z-10 bottom-full right-64"
            />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col overflow-hidden h">
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
                  height={200}
                  width={200}
                />
              </div>
            </div>

            {/* Right Table */}
            <div className="flex justify-center items-center flex-1">
              <div className="relative h-full w-full min-w-[120px] md:max-w-[200px]">
                <Image
                  src="tableRight.svg"
                  alt="Right Student Table"
                  height={200}
                  width={200}
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