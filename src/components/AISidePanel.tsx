import { AIAgent } from '@/types/ai';
import Image from 'next/image';

interface AISidePanelProps {
    agent: AIAgent;
    isLeft?: boolean;
}

export default function AISidePanel({ agent, isLeft }: AISidePanelProps) {
    return (
        <div className={`w-80 bg-gray-900 bg-opacity-50 p-4 flex flex-col max-h-full ${isLeft ? 'mr-4' : 'ml-4'}`}>
            {/* Agent Header - Fixed */}
            <div className="flex items-center mb-4 flex-shrink-0">
                <Image
                    src={agent.avatar}
                    alt={agent.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                <div className="ml-3">
                    <h3 className="text-white font-bold">{agent.name}</h3>
                    <p className="text-gray-300 text-sm">{agent.role}</p>
                </div>
            </div>

            {/* Thoughts Container - Scrollable */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
                {agent.thoughts.map((thought) => (
                    <div
                        key={thought.id}
                        className="mb-3 p-3 bg-gray-800 bg-opacity-50 rounded-lg"
                    >
                        <span className="text-xs text-gray-400 uppercase">{thought.type}</span>
                        <p className="text-white text-sm mt-1">{thought.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}