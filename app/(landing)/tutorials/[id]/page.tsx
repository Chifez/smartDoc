import { tutorials } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  BookOpen,
  Code,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { format } from 'date-fns';

export default function TutorialPage({ params }: { params: { id: string } }) {
  const tutorial = tutorials.find((t) => t.id === params.id);

  if (!tutorial) {
    notFound();
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'getting-started':
        return BookOpen;
      case 'advanced':
        return Zap;
      case 'integration':
        return Code;
      case 'api':
        return Code;
      default:
        return BookOpen;
    }
  };

  const Icon = getCategoryIcon(tutorial.category);

  // Find related tutorials
  const relatedTutorials = tutorials
    .filter((t) => t.category === tutorial.category && t.id !== tutorial.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <div className="container px-4 py-16 md:px-6 md:py-24">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/tutorials" className="hover:text-[#634AFF]">
            Tutorials
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">{tutorial.title}</span>
        </nav>

        {/* Tutorial Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-[#634AFF]" />
              <span className="text-sm text-gray-500">
                {tutorial.category.charAt(0).toUpperCase() +
                  tutorial.category.slice(1)}
              </span>
            </div>
            <Badge
              variant="outline"
              className={`${getDifficultyColor(tutorial.difficulty)} border-0`}
            >
              {tutorial.difficulty.charAt(0).toUpperCase() +
                tutorial.difficulty.slice(1)}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              {tutorial.duration}
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter mb-4">
            {tutorial.title}
          </h1>
          <p className="text-xl text-gray-500 mb-8">{tutorial.description}</p>
          <div className="flex items-center gap-4">
            <Image
              src={tutorial.author.avatar}
              alt={tutorial.author.name}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <div className="font-medium">{tutorial.author.name}</div>
              <div className="text-sm text-gray-500">
                Published on{' '}
                {format(new Date(tutorial.publishedAt), 'MMMM d, yyyy')}
              </div>
            </div>
          </div>
        </div>

        {/* Tutorial Content */}
        <div className="prose prose-lg max-w-none mb-16">
          {tutorial.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-6">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Related Tutorials */}
        {relatedTutorials.length > 0 && (
          <div className="border-t pt-16">
            <h2 className="text-2xl font-bold mb-8">Related Tutorials</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedTutorials.map((relatedTutorial) => {
                const RelatedIcon = getCategoryIcon(relatedTutorial.category);
                return (
                  <Link
                    key={relatedTutorial.id}
                    href={`/tutorials/${relatedTutorial.id}`}
                    className="group"
                  >
                    <div className="flex flex-col space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <RelatedIcon className="h-5 w-5 text-[#634AFF]" />
                          <span className="text-sm text-gray-500">
                            {relatedTutorial.category.charAt(0).toUpperCase() +
                              relatedTutorial.category.slice(1)}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`${getDifficultyColor(
                            relatedTutorial.difficulty
                          )} border-0`}
                        >
                          {relatedTutorial.difficulty.charAt(0).toUpperCase() +
                            relatedTutorial.difficulty.slice(1)}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-[#634AFF] transition-colors">
                          {relatedTutorial.title}
                        </h3>
                        <p className="mt-2 text-gray-500 line-clamp-2">
                          {relatedTutorial.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          {relatedTutorial.duration}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-16 flex justify-between items-center border-t pt-8">
          <Link
            href="/tutorials"
            className="inline-flex items-center gap-2 text-[#634AFF] hover:text-[#5239E0] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Tutorials
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/support"
              className="inline-flex items-center justify-center rounded-md border border-[#634AFF] px-4 py-2 text-sm font-medium text-[#634AFF] hover:bg-[#634AFF]/5 transition-colors"
            >
              Need Help?
            </Link>
            <Link
              href="/documentation"
              className="inline-flex items-center justify-center rounded-md bg-[#634AFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#5239E0] transition-colors"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
