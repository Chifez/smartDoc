import {
    BookOpen,
    Briefcase,
    Building2,
    Clock,
    Code,
    Cookie,
    FileCheck,
    FileText,
    Globe,
    Lock,
    LucideIcon,
    MessageSquare,
    Newspaper,
    Shield,
    Users,
    Users2,
    Zap,
} from "lucide-react";

export interface Feature {
    icon: LucideIcon;
    title: string;
    description: string;
    category: "collaboration" | "security" | "productivity" | "integration";
}

export interface Integration {
    name: string;
    description: string;
    icon: string;
    category: "productivity" | "communication" | "storage" | "development";
    status: "beta" | "stable";
}

export interface ChangelogEntry {
    version: string;
    date: string;
    changes: {
        type: "feature" | "improvement" | "fix" | "security";
        description: string;
    }[];
}

export interface RoadmapItem {
    title: string;
    description: string;
    status: "planned" | "in-progress" | "completed";
    quarter: "Q1" | "Q2" | "Q3" | "Q4";
    year: number;
}

export interface Tutorial {
    id: string;
    title: string;
    description: string;
    category: "getting-started" | "advanced" | "integration" | "api";
    difficulty: "beginner" | "intermediate" | "advanced";
    duration: string;
    author: {
        name: string;
        role: string;
        avatar: string;
    };
    content: string;
    publishedAt: string;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    author: {
        name: string;
        role: string;
        avatar: string;
    };
    category: string;
    tags: string[];
    publishedAt: string;
    readTime: string;
    featuredImage: string;
    isFeatured?: boolean;
}

export interface JobPosting {
    id: string;
    title: string;
    department: string;
    location: string;
    type: "full-time" | "part-time" | "contract" | "internship";
    description: string;
    requirements: string[];
    benefits: string[];
    postedAt: string;
}

export interface PressRelease {
    id: string;
    title: string;
    date: string;
    content: string;
    category: "announcement" | "partnership" | "funding" | "product";
    attachments?: {
        name: string;
        url: string;
        type: string;
    }[];
}

export const features: Feature[] = [
    {
        icon: FileText,
        title: "Smart Document Editing",
        description:
            "Powerful editing tools with real-time formatting, spell check, and AI-powered suggestions.",
        category: "productivity",
    },
    {
        icon: Users,
        title: "Real-time Collaboration",
        description:
            "Work together with your team in real-time, seeing changes as they happen.",
        category: "collaboration",
    },
    {
        icon: Clock,
        title: "Version History",
        description:
            "Track changes and revert to previous versions with comprehensive history.",
        category: "productivity",
    },
    {
        icon: Lock,
        title: "Advanced Permissions",
        description:
            "Control who can view, edit, or comment on your documents with granular permissions.",
        category: "security",
    },
    {
        icon: Zap,
        title: "Instant Sharing",
        description:
            "Share documents with anyone via secure links or direct invitations.",
        category: "collaboration",
    },
    {
        icon: Globe,
        title: "Cross-platform Access",
        description:
            "Access your documents from any device, anywhere, with our web and mobile apps.",
        category: "productivity",
    },
    {
        icon: Code,
        title: "API Access",
        description:
            "Integrate Syncro with your existing tools and workflows through our robust API.",
        category: "integration",
    },
    {
        icon: BookOpen,
        title: "Templates Library",
        description:
            "Start quickly with professionally designed templates for various document types.",
        category: "productivity",
    },
];

export const integrations: Integration[] = [
    {
        name: "Slack",
        description:
            "Share and collaborate on documents directly in Slack channels.",
        icon: "/integrations/slack.svg",
        category: "communication",
        status: "stable",
    },
    {
        name: "Google Drive",
        description:
            "Import and export documents seamlessly with Google Drive.",
        icon: "/integrations/google-drive.svg",
        category: "storage",
        status: "stable",
    },
    {
        name: "Microsoft Teams",
        description:
            "Integrate Syncro with Microsoft Teams for seamless collaboration.",
        icon: "/integrations/teams.svg",
        category: "communication",
        status: "beta",
    },
    {
        name: "GitHub",
        description: "Version control your documents with GitHub integration.",
        icon: "/integrations/github.svg",
        category: "development",
        status: "stable",
    },
];

export const changelog: ChangelogEntry[] = [
    {
        version: "1.2.0",
        date: "2024-03-15",
        changes: [
            {
                type: "feature",
                description:
                    "Added real-time collaboration with presence indicators",
            },
            {
                type: "improvement",
                description: "Enhanced document search with advanced filters",
            },
            {
                type: "fix",
                description: "Fixed issue with document version history",
            },
        ],
    },
    {
        version: "1.1.0",
        date: "2024-02-28",
        changes: [
            {
                type: "feature",
                description: "Introduced AI-powered writing suggestions",
            },
            {
                type: "security",
                description: "Enhanced document encryption",
            },
        ],
    },
];

export const roadmap: RoadmapItem[] = [
    {
        title: "Mobile Apps",
        description: "Native mobile applications for iOS and Android",
        status: "in-progress",
        quarter: "Q2",
        year: 2024,
    },
    {
        title: "Advanced Analytics",
        description: "Document usage and collaboration analytics dashboard",
        status: "planned",
        quarter: "Q3",
        year: 2024,
    },
    {
        title: "AI Document Assistant",
        description: "AI-powered document analysis and suggestions",
        status: "planned",
        quarter: "Q4",
        year: 2024,
    },
];

export const tutorials: Tutorial[] = [
    {
        id: "getting-started",
        title: "Getting Started with Syncro",
        description:
            "Learn the basics of using Syncro for document collaboration",
        category: "getting-started",
        difficulty: "beginner",
        duration: "10 minutes",
        author: {
            name: "Sarah Johnson",
            role: "Product Manager",
            avatar: "/team/sarah.jpg",
        },
        content: "...",
        publishedAt: "2024-03-01",
    },
    {
        id: "advanced-collaboration",
        title: "Advanced Collaboration Features",
        description: "Master real-time collaboration and team workflows",
        category: "advanced",
        difficulty: "intermediate",
        duration: "20 minutes",
        author: {
            name: "Michael Chen",
            role: "Technical Writer",
            avatar: "/team/michael.jpg",
        },
        content: "...",
        publishedAt: "2024-03-15",
    },
];

export const blogPosts: BlogPost[] = [
    {
        id: "improve-document-collaboration",
        title: "How to Improve Your Team's Document Collaboration",
        slug: "improve-document-collaboration",
        excerpt:
            "Learn the best practices for effective document collaboration and how Syncro can help your team work better together.",
        content: "...",
        author: {
            name: "Sarah Johnson",
            role: "Product Manager",
            avatar: "/team/sarah.jpg",
        },
        category: "collaboration",
        tags: ["collaboration", "productivity", "team-work"],
        publishedAt: "2024-03-20",
        readTime: "8 min read",
        featuredImage: "/blog/collaboration.jpg",
        isFeatured: true,
    },
    {
        id: "streamline-document-workflow",
        title: "5 Ways to Streamline Your Document Workflow",
        slug: "streamline-document-workflow",
        excerpt:
            "Discover how to optimize your document processes and save time with these proven strategies.",
        content: "...",
        author: {
            name: "Michael Chen",
            role: "Technical Writer",
            avatar: "/team/michael.jpg",
        },
        category: "productivity",
        tags: ["workflow", "efficiency", "tips"],
        publishedAt: "2024-03-15",
        readTime: "6 min read",
        featuredImage: "/blog/workflow.jpg",
    },
    {
        id: "future-collaboration-tools",
        title: "The Future of Real-time Collaboration Tools",
        slug: "future-collaboration-tools",
        excerpt:
            "Explore the emerging trends and technologies shaping the future of collaborative work.",
        content: "...",
        author: {
            name: "Emily Rodriguez",
            role: "Product Lead",
            avatar: "/team/emily.jpg",
        },
        category: "collaboration",
        tags: ["future", "technology", "trends"],
        publishedAt: "2024-03-10",
        readTime: "10 min read",
        featuredImage: "/blog/future-tools.jpg",
    },
    {
        id: "document-security-best-practices",
        title: "Security Best Practices for Document Sharing",
        slug: "document-security-best-practices",
        excerpt:
            "Learn how to keep your sensitive documents secure while maintaining efficient collaboration.",
        content: "...",
        author: {
            name: "David Kim",
            role: "Security Engineer",
            avatar: "/team/david.jpg",
        },
        category: "security",
        tags: ["security", "best-practices", "compliance"],
        publishedAt: "2024-03-05",
        readTime: "7 min read",
        featuredImage: "/blog/security.jpg",
    },
    {
        id: "ai-document-editing",
        title: "How AI is Transforming Document Editing",
        slug: "ai-document-editing",
        excerpt:
            "Discover how artificial intelligence is revolutionizing the way we create and edit documents.",
        content: "...",
        author: {
            name: "Priya Patel",
            role: "AI Research Lead",
            avatar: "/team/priya.jpg",
        },
        category: "product-updates",
        tags: ["ai", "innovation", "productivity"],
        publishedAt: "2024-02-28",
        readTime: "9 min read",
        featuredImage: "/blog/ai-editing.jpg",
    },
    {
        id: "company-x-case-study",
        title: "Case Study: How Company X Improved Efficiency by 40%",
        slug: "company-x-case-study",
        excerpt:
            "See how a leading company transformed their document workflow with Syncro.",
        content: "...",
        author: {
            name: "Lisa Thompson",
            role: "Customer Success Manager",
            avatar: "/team/lisa.jpg",
        },
        category: "case-studies",
        tags: ["case-study", "success-story", "efficiency"],
        publishedAt: "2024-02-20",
        readTime: "8 min read",
        featuredImage: "/blog/case-study.jpg",
    },
    // Additional blog posts for the archive page
    {
        id: "culture-of-collaboration",
        title: "Building a Culture of Collaboration",
        slug: "culture-of-collaboration",
        excerpt:
            "Tips for fostering a collaborative environment that enhances productivity and innovation.",
        content: "...",
        author: {
            name: "James Wilson",
            role: "Workplace Culture Specialist",
            avatar: "/team/james.jpg",
        },
        category: "tips-tricks",
        tags: ["culture", "collaboration", "leadership"],
        publishedAt: "2024-02-15",
        readTime: "5 min read",
        featuredImage: "/blog/culture.jpg",
    },
    {
        id: "remote-team-collaboration",
        title: "Mastering Remote Team Collaboration",
        slug: "remote-team-collaboration",
        excerpt:
            "Essential strategies for effective document collaboration in remote teams.",
        content: "...",
        author: {
            name: "Alex Martinez",
            role: "Remote Work Expert",
            avatar: "/team/alex.jpg",
        },
        category: "collaboration",
        tags: ["remote-work", "team-management", "productivity"],
        publishedAt: "2024-02-10",
        readTime: "7 min read",
        featuredImage: "/blog/remote-collab.jpg",
    },
];

export const jobPostings: JobPosting[] = [
    {
        id: "senior-frontend",
        title: "Senior Frontend Engineer",
        department: "Engineering",
        location: "Remote",
        type: "full-time",
        description:
            "Join our team to build the next generation of collaborative document editing tools",
        requirements: [
            "5+ years of experience with React and TypeScript",
            "Experience with real-time collaboration features",
            "Strong understanding of web performance optimization",
        ],
        benefits: [
            "Competitive salary and equity",
            "Remote-first culture",
            "Health insurance and wellness benefits",
        ],
        postedAt: "2024-03-20",
    },
];

export const pressReleases: PressRelease[] = [
    {
        id: "series-a",
        title:
            "Syncro Raises $10M Series A to Transform Document Collaboration",
        date: "2024-03-15",
        content: "...",
        category: "funding",
        attachments: [
            {
                name: "Press Kit",
                url: "/press/series-a-press-kit.zip",
                type: "application/zip",
            },
        ],
    },
];

// Navigation structure for documentation
export const documentationNav = {
    "Getting Started": [
        { title: "Introduction", path: "/docs/introduction" },
        { title: "Quick Start", path: "/docs/quick-start" },
        { title: "Installation", path: "/docs/installation" },
    ],
    "Core Concepts": [
        { title: "Documents", path: "/docs/documents" },
        { title: "Collaboration", path: "/docs/collaboration" },
        { title: "Permissions", path: "/docs/permissions" },
    ],
    "API Reference": [
        { title: "Authentication", path: "/docs/api/auth" },
        { title: "Documents API", path: "/docs/api/documents" },
        { title: "Webhooks", path: "/docs/api/webhooks" },
    ],
};

// Legal documents
export const legalDocs = {
    privacy: {
        title: "Privacy Policy",
        lastUpdated: "2024-03-01",
        content: "...",
    },
    terms: {
        title: "Terms of Service",
        lastUpdated: "2024-03-01",
        content: "...",
    },
    cookies: {
        title: "Cookie Policy",
        lastUpdated: "2024-03-01",
        content: "...",
    },
};
