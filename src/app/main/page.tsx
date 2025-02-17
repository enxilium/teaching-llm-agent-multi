'use client'

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { AIAgent } from '@/types/ai';
import { aiService } from '@/services/aiService';
import AISidePanel from '@/components/AISidePanel';
import TypewriterText from '@/components/TypewriterText';

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
  agentId?: string;
  onComplete?: () => void;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [questionInput, setQuestionInput] = useState("");
  const [scratchboardContent, setScratchboardContent] = useState("");
  const [usedQuestionIndices, setUsedQuestionIndices] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [isQuestioningEnabled, setIsQuestioningEnabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(120);
  const [nextMessageId, setNextMessageId] = useState(3);
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [typingMessageIds, setTypingMessageIds] = useState<number[]>([]);
  const [isFinalAnswerPhase, setIsFinalAnswerPhase] = useState(false);

  const timerInitializedRef = useRef(false);
  const roundEndedRef = useRef(false);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Add to your imports and interface declarations
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Add this function after your existing state declarations
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Load agents on mount
  useEffect(() => {
    const loadAgents = async () => {
      const loadedAgents = await aiService.getAgents();
      setAgents(loadedAgents);
    };
    loadAgents();
  }, []);

  const startNewRound = useCallback(async () => {
    try {
      const response = await fetch('questions.json');
      const data = await response.json();
      const combinatoricsQuestions = data.combinatorics;

      let availableIndices = Array.from({ length: combinatoricsQuestions.length }, (_, i) => i)
        .filter(index => !usedQuestionIndices.includes(index));
      if (availableIndices.length === 0) {
        setUsedQuestionIndices([]);
        availableIndices = Array.from({ length: combinatoricsQuestions.length }, (_, i) => i);
      }

      const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      setCurrentQuestionIndex(randomIndex);
      setUsedQuestionIndices(prev => [...prev, randomIndex]);

      // Reset agents' thoughts
      setAgents(prevAgents =>
        prevAgents.map(agent => ({
          ...agent,
          thoughts: []
        }))
      );

      setMessages([
        {
          id: 1,
          sender: "ai",
          text: "Welcome! Let's solve this combinatorics problem. You have 2 minutes to ask questions, then submit your final answer. Please show your reasoning in the scratchboard before submitting.",
          agentId: "bob"
        },
        {
          id: 2,
          sender: "ai",
          text: combinatoricsQuestions[randomIndex],
          agentId: "bob"
        }
      ]);
      setNextMessageId(3);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
    setTimeLeft(120);
    setIsQuestioningEnabled(true);
    roundEndedRef.current = false;
  }, [usedQuestionIndices]);

  // Start first round on mount
  useEffect(() => {
    startNewRound();
  }, []);

  // Timer effect
  useEffect(() => {
    if (timerInitializedRef.current || isFinalAnswerPhase) return;
    timerInitializedRef.current = true;

    const countdownInterval = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 0 && !roundEndedRef.current) {
          setIsQuestioningEnabled(false);
          roundEndedRef.current = true;
          startNewRound();
          return 0;
        }
        return prevTime - 1; // This was missing
      });
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
      timerInitializedRef.current = false; // Reset the ref on cleanup
    };
  }, [startNewRound, isFinalAnswerPhase]);

  // Periodic AI questions
  useEffect(() => {
    if (!isQuestioningEnabled) return;

    const questionInterval = setInterval(async () => {
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      if (!randomAgent) return;

      const newThought = await aiService.addThought(randomAgent.id, {
        content: "I should ask about this specific aspect...",
        type: 'question'
      });

      const messageId = nextMessageId;
      setNextMessageId(prev => prev + 1);

      // Add the message ID to typing messages before adding the message
      setTypingMessageIds(prev => [...prev, messageId]);

      setMessages(prev => [...prev, {
        id: messageId,
        sender: "ai",
        text: `[${randomAgent.name}]: What if we consider...?`,
        agentId: randomAgent.id
      }]);

      setAgents(prevAgents =>
        prevAgents.map(agent =>
          agent.id === randomAgent.id
            ? { ...agent, thoughts: [...agent.thoughts, newThought] }
            : agent
        )
      );
    }, 15000);

    return () => clearInterval(questionInterval);
  }, [agents, isQuestioningEnabled, nextMessageId]); // Added nextMessageId as dependency

  // Add this effect after your other useEffects
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update handleQuestion function
  const handleQuestion = async () => {
    if (!questionInput.trim() || !isQuestioningEnabled) return;

    const currentUserMessageId = nextMessageId;
    const currentAiMessageId = nextMessageId + 1;
    setNextMessageId(prev => prev + 2);

    // User message (instant)
    setMessages(prev => [
      ...prev,
      {
        id: currentUserMessageId,
        sender: "user",
        text: questionInput.trim()
      }
    ]);
    setQuestionInput("");

    // AI message (animated)
    setTypingMessageIds(prev => [...prev, currentAiMessageId]);
    setMessages(prev => [
      ...prev,
      {
        id: currentAiMessageId,
        sender: "ai",
        text: "Here's my help with your question... [AI response logic here]"
      }
    ]);
  };

  // Update handleSend function
  const handleSend = async () => {
    if (!input.trim() || !isQuestioningEnabled) return;
    if (!scratchboardContent.trim()) {
      alert("Please use the scratchboard to show your reasoning before submitting your answer.");
      return;
    }

    // Stop the timer and questioning
    setIsQuestioningEnabled(false);
    setIsFinalAnswerPhase(true);

    // Store all message IDs
    const messageIds = {
      user: nextMessageId,
      agent1: nextMessageId + 1,
      agent2: nextMessageId + 2,
      teacher: nextMessageId + 3
    };
    setNextMessageId(prev => prev + 4);

    // User's final answer (immediate)
    setMessages(prev => [
      ...prev,
      {
        id: messageIds.user,
        sender: "user",
        text: `Final Answer: ${input.trim()}\n\nReasoning: ${scratchboardContent}`
      }
    ]);
    setInput("");

    // Add Logic Bot's answer after a short delay
    const agent1 = agents[0];
    if (agent1) {
      setTimeout(() => {
        setTypingMessageIds(prev => [...prev, messageIds.agent1]);
        setMessages(prev => [
          ...prev,
          {
            id: messageIds.agent1,
            sender: "ai",
            text: `My final answer is: Based on the pattern recognition, I believe the solution is [Agent 1's answer]. Here's my reasoning: [detailed explanation]`,
            agentId: agent1.id,
            onComplete: () => {
              // Start Pattern Bot's answer only after Logic Bot finishes
              const agent2 = agents[1];
              if (agent2) {
                setTypingMessageIds(prev => [...prev, messageIds.agent2]);
                setMessages(prev => [
                  ...prev,
                  {
                    id: messageIds.agent2,
                    sender: "ai",
                    text: `After analyzing the logical structure, I conclude that: [Agent 2's answer]. My reasoning is: [detailed explanation]`,
                    agentId: agent2.id,
                    onComplete: () => {
                      // Start Teacher's evaluation only after Pattern Bot finishes
                      setTypingMessageIds(prev => [...prev, messageIds.teacher]);
                      setMessages(prev => [
                        ...prev,
                        {
                          id: messageIds.teacher,
                          sender: "ai",
                          text: `Let me evaluate all three answers:\n\n1. Student's Answer: ${input.trim()}\nReasoning: ${scratchboardContent}\n\n2. ${agent1.name}'s Answer: [evaluation]\n\n3. ${agent2.name}'s Answer: [evaluation]\n\nOverall evaluation and correct solution: [detailed explanation]`,
                          agentId: "bob"
                        }
                      ]);
                    }
                  }
                ]);
              }
            }
          }
        ]);
      }, 1000);
    }
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

        
        <div className="flex-1 flex items-stretch overflow-hidden">
          {/* Left AI Panel */}
          {agents[0] && <AISidePanel agent={agents[0]} isLeft />}
        {/* Blackboard Section */}
          <div className="flex-1 flex items-center justify-center pb-8 relative">
            <div className="bg-secondary border-[#210651] border-[1em] w-full h-full rounded-xl mx-16 relative">
              
              {/* Timer */}
              <div className={`absolute top-4 right-4 px-4 py-2 rounded-full ${timeLeft <= 30 ? 'bg-red-500' : 'bg-blue-500'} text-white font-mono text-xl z-10 flex items-center gap-2`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {formatTime(timeLeft)}
              </div>

              {/* Decorations */}
              <Image
                src={"Bob.svg"}
                alt="Blackboard"
                width={150}
                height={150}
                className="absolute z-10 -top-5 -left-20"
              />

              {/* Chat Area */}
              <div className="absolute inset-0 p-8 mt-16 mb-24 mx-8 flex flex-col">
                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto space-y-4 mb-4 custom-scrollbar"
                >
                  {messages.map((msg) => (
                    <div key={`msg-${msg.id}`} className={`flex ${msg.sender === "ai" ? "flex-row" : "flex-row-reverse"} items-start`}>
                      {msg.sender === "ai" && (
                        <div className={`flex flex-col items-center ${msg.sender === "ai" ? "mr-3" : "ml-3"}`}>
                          <div className="w-[40px] h-[40px] relative">
                            <Image
                              src={msg.agentId
                                ? agents.find(a => a.id === msg.agentId)?.avatar || "bob_avatar.svg"
                                : "bob_avatar.svg"}
                              alt="AI Avatar"
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                          <span className="text-white text-xs mt-1">
                            {msg.agentId
                              ? agents.find(a => a.id === msg.agentId)?.name || "Bob"
                              : "Bob"}
                          </span>
                        </div>
                      )}
                      <div className={`max-w-[70%] p-3 rounded-lg ${msg.sender === "ai" ? "bg-gray-200 text-gray-800" : "bg-blue-500 text-white"
                        }`}>
                        {msg.sender === "ai" && typingMessageIds.includes(msg.id) ? (
                          <TypewriterText
                            text={msg.text}
                            speed={30}
                            onCharacterTyped={scrollToBottom}
                            onComplete={() => {
                              setTypingMessageIds(prev => prev.filter(id => id !== msg.id));
                              scrollToBottom();
                              msg.onComplete?.();
                            }}
                          />
                        ) : (
                          <div className="whitespace-pre-wrap">{msg.text}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

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
              {isQuestioningEnabled && !isFinalAnswerPhase && (
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
          {/* Right AI Panel */}
          {agents[1] && <AISidePanel agent={agents[1]} />}
        </div>
        {/* Answer Submission Section */}
        <div className="flex gap-4 items-center justify-center">
          {/* Scratchboard Component */}
          {/* Replace the Scratchboard button and component section with this */}
          <div className="mt-4 flex gap-4 items-center justify-center w-full mx-auto">
            {/* Scratchboard Textbox */}
            <div className="w-full">
              <label htmlFor="scratchboard" className="block text-white text-sm mb-2">
                Show your reasoning:
              </label>
              <textarea
                id="scratchboard"
                value={scratchboardContent}
                onChange={(e) => setScratchboardContent(e.target.value)}
                className="w-full h-32 bg-white bg-opacity-10 text-white rounded-lg p-3 resize-none outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your reasoning here before submitting your final answer..."
              />
            </div>

            {/* Final Answer Input */}
            <div className="flex items-center bg-white rounded-full p-2 w-full">
              <input
                type="text"
                name="answer"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 outline-none px-4 text-sm"
                placeholder={scratchboardContent ? "Submit final answer..." : "Show your reasoning first..."}
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
      </div>

      
    </div>
  );
}