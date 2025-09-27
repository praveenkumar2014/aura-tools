import { AITool } from '@/components/ToolCard';

// Import app icons
import chatgptIcon from '@/assets/icons/chatgpt-icon.png';
import midjourneyIcon from '@/assets/icons/midjourney-icon.png';
import notionIcon from '@/assets/icons/notion-icon.png';
import runwayIcon from '@/assets/icons/runway-icon.png';
import jasperIcon from '@/assets/icons/jasper-icon.png';
import grammarlyIcon from '@/assets/icons/grammarly-icon.png';
import stableDiffusionIcon from '@/assets/icons/stablediffusion-icon.png';
import githubIcon from '@/assets/icons/github-icon.png';
import canvaIcon from '@/assets/icons/canva-icon.png';
import copyaiIcon from '@/assets/icons/copyai-icon.png';
import loomIcon from '@/assets/icons/loom-icon.png';
import synthesiaIcon from '@/assets/icons/synthesia-icon.png';

export const sampleTools: AITool[] = [
  {
    id: '1',
    name: 'ChatGPT',
    description: 'Advanced conversational AI for writing, coding, analysis, and creative tasks. Perfect for content creation and problem-solving.',
    category: 'Language Models',
    rating: 5,
    price: 'Freemium',
    isPremium: true,
    image: chatgptIcon,
    tags: ['writing', 'coding', 'analysis', 'conversation'],
    url: 'https://chat.openai.com'
  },
  {
    id: '2',
    name: 'Midjourney',
    description: 'Create stunning artwork and images from text descriptions. Industry-leading AI art generator with incredible detail and style.',
    category: 'Image Generation',
    rating: 5,
    price: 'Paid',
    isPremium: true,
    image: midjourneyIcon,
    tags: ['art', 'images', 'creative', 'design'],
    url: 'https://midjourney.com'
  },
  {
    id: '3',
    name: 'Notion AI',
    description: 'Integrated AI assistant within Notion for writing, summarizing, and organizing your workspace content efficiently.',
    category: 'Productivity',
    rating: 4,
    price: 'Freemium',
    image: notionIcon,
    tags: ['productivity', 'writing', 'organization', 'workspace'],
    url: 'https://notion.so'
  },
  {
    id: '4',
    name: 'Runway ML',
    description: 'AI-powered video editing and generation platform. Create, edit, and enhance videos with cutting-edge machine learning.',
    category: 'Video & Media',
    rating: 4,
    price: 'Freemium',
    isPremium: true,
    image: runwayIcon,
    tags: ['video', 'editing', 'generation', 'creative'],
    url: 'https://runwayml.com'
  },
  {
    id: '5',
    name: 'Jasper AI',
    description: 'AI copywriting assistant for marketing teams. Generate high-converting copy, blog posts, and marketing materials.',
    category: 'Marketing',
    rating: 4,
    price: 'Paid',
    image: jasperIcon,
    tags: ['copywriting', 'marketing', 'content', 'business'],
    url: 'https://jasper.ai'
  },
  {
    id: '6',
    name: 'Grammarly',
    description: 'AI-powered writing assistant that helps with grammar, style, tone, and clarity improvements across all platforms.',
    category: 'Writing',
    rating: 4,
    price: 'Freemium',
    image: grammarlyIcon,
    tags: ['grammar', 'writing', 'editing', 'proofreading'],
    url: 'https://grammarly.com'
  },
  {
    id: '7',
    name: 'Stable Diffusion',
    description: 'Open-source AI image generator. Create high-quality images from text prompts with complete creative control.',
    category: 'Image Generation',
    rating: 4,
    price: 'Free',
    image: stableDiffusionIcon,
    tags: ['images', 'open-source', 'creative', 'art'],
    url: 'https://stability.ai'
  },
  {
    id: '8',
    name: 'GitHub Copilot',
    description: 'AI pair programmer that suggests code and entire functions in real-time. Boost your coding productivity significantly.',
    category: 'Development',
    rating: 5,
    price: 'Paid',
    isPremium: true,
    image: githubIcon,
    tags: ['coding', 'programming', 'development', 'productivity'],
    url: 'https://github.com/features/copilot'
  },
  {
    id: '9',
    name: 'Canva AI',
    description: 'Design platform with AI-powered features for creating presentations, social media graphics, and marketing materials.',
    category: 'Design',
    rating: 4,
    price: 'Freemium',
    image: canvaIcon,
    tags: ['design', 'graphics', 'presentations', 'marketing'],
    url: 'https://canva.com'
  },
  {
    id: '10',
    name: 'Copy.ai',
    description: 'AI content generator for marketing copy, blog posts, product descriptions, and social media content.',
    category: 'Marketing',
    rating: 4,
    price: 'Freemium',
    image: copyaiIcon,
    tags: ['copywriting', 'content', 'marketing', 'social media'],
    url: 'https://copy.ai'
  },
  {
    id: '11',
    name: 'Loom AI',
    description: 'Screen recording with AI-powered summaries, transcriptions, and video editing capabilities.',
    category: 'Video & Media',
    rating: 4,
    price: 'Freemium',
    image: loomIcon,
    tags: ['screen recording', 'video', 'summaries', 'transcription'],
    url: 'https://loom.com'
  },
  {
    id: '12',
    name: 'Synthesia',
    description: 'Create AI-generated videos with virtual presenters. Transform text into engaging video content without cameras.',
    category: 'Video & Media',
    rating: 4,
    price: 'Paid',
    isPremium: true,
    image: synthesiaIcon,
    tags: ['video', 'AI avatars', 'presentation', 'content creation'],
    url: 'https://synthesia.io'
  }
];