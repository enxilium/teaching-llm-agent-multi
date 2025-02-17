'use client'

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Scratchboard from "@/components/Scratchboard";

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [questionInput, setQuestionInput] = useState("");
  const [isScratchboardOpen, setScratchboardOpen] = useState(false);
  const [scratchboardContent, setScratchboardContent] = useState("");
  const [usedQuestionIndices, setUsedQuestionIndices] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [isQuestioningEnabled, setIsQuestioningEnabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [nextMessageId, setNextMessageId] = useState(3); // IDs 1 and 2 are used initially

  const timerInitializedRef = useRef(false);
  const roundEndedRef = useRef(false);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Function to load a new round: clears chat, fetches a new problem, resets timer and state.
  const startNewRound = async () => {
    try {
      const response = await fetch('questions.json');
      const data = await response.json();
      const combinatoricsQuestions = data.combinatorics;

      // Reset used indices if necessary
      let availableIndices = Array.from({ length: combinatoricsQuestions.length }, (_, i) => i)
        .filter(index => !usedQuestionIndices.includes(index));
      if (availableIndices.length === 0) {
        setUsedQuestionIndices([]);
        availableIndices = Array.from({ length: combinatoricsQuestions.length }, (_, i) => i);
      }

      const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      setCurrentQuestionIndex(randomIndex);
      setUsedQuestionIndices(prev => [...prev, randomIndex]);

      // Clear previous messages and set new initial messages
      setMessages([
        {
          id: 1,
          sender: "ai",
          text: "Welcome! Let's solve this combinatorics problem. You have 2 minutes to ask questions, then submit your final answer. Please show your reasoning in the scratchboard before submitting."
        },
        {
          id: 2,
          sender: "ai",
          text: combinatoricsQuestions[randomIndex]
        }
      ]);
      // Reset message id counter if desired (or continue incrementing)
      setNextMessageId(3);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
    // Reset timer and enable interactions for the new round
    setTimeLeft(120);
    setIsQuestioningEnabled(true);
    roundEndedRef.current = false;
  };

  // Initial load – start new round on mount
  useEffect(() => {
    startNewRound();
  }, []); // run once on mount

  // Timer effect – runs continuously via one interval
  useEffect(() => {
    if (timerInitializedRef.current) return;
    timerInitializedRef.current = true;

    const countdownInterval = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 0) {
          // End current round if not already ended
          if (!roundEndedRef.current) {
            setIsQuestioningEnabled(false);
            roundEndedRef.current = true;
            // Start a new round
            startNewRound();
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  const handleQuestion = async () => {
    if (!questionInput.trim() || !isQuestioningEnabled) return;

    setNextMessageId(prevId => {
      const newId = prevId;
      setMessages(prev => [
        ...prev,
        {
          id: newId,
          sender: "user",
          text: questionInput.trim()
        }
      ]);
      return newId + 1;
    });
    setQuestionInput("");

    setNextMessageId(prevId => {
      const newId = prevId;
      setMessages(prev => [
        ...prev,
        {
          id: newId,
          sender: "ai",
          text: "Here's my help with your question... [AI response logic here]"
        }
      ]);
      return newId + 1;
    });
  };

  const handleSend = async () => {
    if (!input.trim() || !isQuestioningEnabled) return;
    if (!scratchboardContent.trim()) {
      alert("Please use the scratchboard to show your reasoning before submitting your answer.");
      return;
    }

    setNextMessageId(prevId => {
      const newId = prevId;
      setMessages(prev => [
        ...prev,
        {
          id: newId,
          sender: "user",
          text: `Final Answer: ${input.trim()}`
        }
      ]);
      return newId + 1;
    });
    setInput("");

    setNextMessageId(prevId => {
      const newId = prevId;
      setMessages(prev => [
        ...prev,
        {
          id: newId,
          sender: "ai",
          text: `Thank you for your answer! Here's my feedback: [Evaluation logic here]`
        }
      ]);
      return newId + 1;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(nextMessageId);
    if (e.key === "Enter") {
      if (e.currentTarget.name === "question") {
        handleQuestion();
      } else if (isQuestioningEnabled && scratchboardContent.trim()) {
        handleSend();
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#2D0278] to-[#0A001D] h-screen w-screen p-8 overflow-hidden flex flex-col">
      <div className="h-full flex flex-col">
        {/* Title Section */}
        <div className="p-4 mb-4">
          <div className="bg-white bg-opacity-10 rounded-md p-4">
            <h2 className="text-2xl text-white font-bold mb-2">
              Solve the Following:
            </h2>
            <p className="text-white break-words">
              {currentQuestionIndex !== null && messages[1]?.text}
            </p>
          </div>
        </div>

        {/* Blackboard Section */}
        <div className="flex-1 flex items-center justify-center py-8 relative">
          <div className="bg-secondary border-[#210651] border-[1em] w-full h-full rounded-xl mx-16 relative">
            {/* Timer */}
            <div className={`absolute top-4 right-4 px-4 py-2 rounded-full ${timeLeft <= 30 ? 'bg-red-500' : 'bg-blue-500'} text-white font-mono text-xl z-10 flex items-center gap-2`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {formatTime(timeLeft)}
            </div>

            {/* Chat Area */}
            <div className="absolute inset-0 p-8 mt-16 mb-24 mx-8 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "ai" ? "flex-row" : "flex-row-reverse"} items-start`}>
                    {msg.sender === "ai" && (
                      <Image
                        src={"bob_avatar.svg"}
                        alt="AI Avatar"
                        width={75}
                        height={75}
                        className="rounded-full mr-2"
                      />
                    )}
                    <div className={`max-w-[70%] p-3 rounded-lg ${msg.sender === "ai" ? "bg-gray-200 text-gray-800" : "bg-blue-500 text-white"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              
            </div>
          </div>

          {/* Decorations */}
          <Image
            src={"Bob.svg"}
            alt="Blackboard"
            width={200}
            height={200}
            className="absolute z-10 -top-10 left-0"
          />

          <div className="bg-primary w-[95%] h-8 rounded-2xl absolute left-1/2 transform -translate-x-1/2 bottom-[5%]">
            <Image
              src={"flower.svg"}
              alt="Decoration"
              width={50}
              height={50}
              className="absolute z-10 bottom-full left-24"
            />

            <Image
              src={"chalk.svg"}
              alt="Decoration"
              width={50}
              height={50}
              className="absolute z-10 bottom-full right-64"
            />
            {/* Question Input - Moved here and styled */}
            {isQuestioningEnabled && (
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-full max-w-xl">
                <div className="bg-white bg-opacity-20 rounded-lg p-2 flex gap-2 mx-4">
                  <input
                    type="text"
                    name="question"
                    value={questionInput}
                    onChange={(e) => setQuestionInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent text-white placeholder-gray-300 outline-none px-4"
                    placeholder="Ask a question..."
                  />
                  <button
                    onClick={handleQuestion}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Ask
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Answer Submission Section */}
        <div className="mt-4 flex gap-4 items-center justify-center">
          <button
            onClick={() => setScratchboardOpen(true)}
            className="bg-primary hover:bg-opacity-90 text-white px-6 py-3 rounded-full flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Scratchboard
          </button>
          <div className="flex items-center bg-white rounded-full p-2 max-w-xs w-full">
            <input
              type="text"
              name="answer"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 outline-none px-4 text-sm"
              placeholder={scratchboardContent ? "Submit final answer..." : "Use scratchboard first..."}
              disabled={!scratchboardContent || !isQuestioningEnabled}
            />
            <button
              onClick={handleSend}
              disabled={!scratchboardContent || !isQuestioningEnabled}
              className={`px-4 py-1 rounded-full text-sm ${scratchboardContent && isQuestioningEnabled
                ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Scratchboard Component */}
      <Scratchboard
        isOpen={isScratchboardOpen}
        onClose={() => setScratchboardOpen(false)}
        onContentChange={setScratchboardContent}
      />
    </div>
  );
}