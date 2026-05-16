// =============================================================================
// Domain Signal Keywords — Used for domain classification
// =============================================================================

export const DOMAIN_SIGNALS = {
  frontend: [
    'react', 'vue', 'angular', 'next.js', 'nextjs', 'svelte', 'tailwind',
    'css', 'sass', 'html', 'typescript', 'javascript', 'webpack', 'vite',
    'figma', 'ui/ux', 'responsive design', 'redux', 'zustand',
    'storybook', 'cypress', 'framer motion', 'frontend', 'front-end',
  ],
  backend: [
    'node.js', 'express', 'fastify', 'nestjs', 'django', 'flask', 'fastapi',
    'spring boot', 'java', 'golang', 'rust', 'ruby on rails',
    'postgresql', 'mysql', 'mongodb', 'redis', 'graphql', 'rest api', 'grpc',
    'microservices', 'kafka', 'rabbitmq', 'prisma', 'sql', 'backend', 'back-end',
  ],
  mlAI: [
    'pytorch', 'tensorflow', 'keras', 'scikit-learn', 'langchain', 'transformers',
    'huggingface', 'openai', 'gpt', 'bert', 'llm', 'machine learning',
    'deep learning', 'neural network', 'nlp', 'computer vision',
    'model training', 'fine-tuning', 'rag', 'cuda', 'data science',
    'pandas', 'numpy', 'jupyter', 'kaggle', 'artificial intelligence',
  ],
  devops: [
    'kubernetes', 'docker', 'terraform', 'ansible', 'ci/cd', 'jenkins',
    'github actions', 'aws', 'gcp', 'azure', 'monitoring', 'prometheus',
    'grafana', 'nginx', 'linux', 'bash', 'helm', 'devops', 'sre',
    'infrastructure as code', 'load balancer', 'cloudflare',
  ],
} as const;

export type DomainType = 'frontend' | 'backend' | 'ml-ai' | 'fullstack' | 'devops';

export const DOMAIN_LABELS: Record<DomainType, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  'ml-ai': 'ML / AI',
  fullstack: 'Full Stack',
  devops: 'DevOps',
};

export const DOMAIN_COLORS: Record<DomainType, string> = {
  frontend: 'pill-blue',
  backend: 'pill-cyan',
  'ml-ai': 'pill',
  fullstack: 'pill-orange',
  devops: 'pill-pink',
};
