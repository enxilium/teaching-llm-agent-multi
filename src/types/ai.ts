export interface AIThought {
    id: string;
    timestamp: number;
    content: string;
    type: 'observation' | 'analysis' | 'strategy' | 'question';
}

export interface AIAgent {
    id: string;
    name: string;
    avatar: string;
    role: string;
    thoughts: AIThought[];
}