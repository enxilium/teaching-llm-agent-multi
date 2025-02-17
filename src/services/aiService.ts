import { AIAgent, AIThought } from '@/types/ai';

const mockThoughts: AIThought[] = [
    {
        id: '1',
        timestamp: Date.now(),
        content: 'The problem involves combinatorial patterns...',
        type: 'observation'
    },
    {
        id: '2',
        timestamp: Date.now() + 1000,
        content: 'We should consider using the multiplication principle...',
        type: 'strategy'
    }
];

const mockAgents: AIAgent[] = [
    {
        id: 'agent1',
        name: 'Logic Bot',
        avatar: 'clyde.png',
        role: 'Mathematical Reasoning Expert',
        thoughts: [...mockThoughts]
    },
    {
        id: 'agent2',
        name: 'Pattern Bot',
        avatar: 'wade.png',
        role: 'Pattern Recognition Specialist',
        thoughts: [...mockThoughts]
    }
];

export const aiService = {
    getAgents: async (): Promise<AIAgent[]> => {
        return mockAgents;
    },

    getAgentThoughts: async (agentId: string): Promise<AIThought[]> => {
        const agent = mockAgents.find(a => a.id === agentId);
        return agent?.thoughts || [];
    },

    addThought: async (agentId: string, thought: Omit<AIThought, 'id' | 'timestamp'>): Promise<AIThought> => {
        const newThought = {
            ...thought,
            id: Math.random().toString(),
            timestamp: Date.now()
        };
        return newThought;
    }
};