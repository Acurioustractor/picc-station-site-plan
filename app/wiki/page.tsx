'use client';

import { MapPin, ArrowLeft, BookOpen, Building, Users, Target, Handshake } from 'lucide-react';
import Link from 'next/link';
import { siteData } from '@/lib/siteData';
import Footer from '@/components/Footer';

export default function WikiPage() {
  const { about } = siteData;

  const sections = [
    {
      id: 'context',
      title: 'Context & History',
      icon: BookOpen,
      content: about.context,
      color: 'blue'
    },
    {
      id: 'site',
      title: 'The Site',
      icon: Building,
      content: about.site,
      color: 'green'
    },
    {
      id: 'project',
      title: 'The Project',
      icon: Target,
      content: about.project,
      color: 'orange'
    },
    {
      id: 'partnership',
      title: 'Partnership Approach',
      icon: Handshake,
      content: about.partnership,
      color: 'purple'
    },
    {
      id: 'impact',
      title: 'Impact & Vision',
      icon: Users,
      content: about.impact,
      color: 'indigo'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'green':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'orange':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'purple':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'indigo':
        return 'bg-indigo-50 border-indigo-200 text-indigo-700';
      default:
        return 'bg-stone-50 border-stone-200 text-stone-700';
    }
  };

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-4 md:px-6 py-3 shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-stone-600" />
              <span className="text-sm font-medium text-stone-600">Back to Map</span>
            </Link>
            <div className="hidden md:flex items-center gap-2 ml-4">
              <BookOpen className="text-orange-600" />
              <h1 className="text-lg font-serif font-bold text-stone-800">
                The Centre Wiki
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-3">
            {about.title}
          </h1>
          <p className="text-stone-600 text-lg">
            A comprehensive guide to The Centre project
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 mb-8">
          <h2 className="text-sm font-bold text-stone-900 uppercase mb-4">Contents</h2>
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors group"
                >
                  <Icon size={18} className={`${getColorClasses(section.color).split(' ')[2]}`} />
                  <span className="text-sm text-stone-700 group-hover:text-stone-900 font-medium">
                    {section.title}
                  </span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <section
                key={section.id}
                id={section.id}
                className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden"
              >
                <div className={`px-6 py-4 border-b ${getColorClasses(section.color)}`}>
                  <div className="flex items-center gap-3">
                    <Icon size={24} />
                    <h2 className="text-xl font-serif font-bold">
                      {section.title}
                    </h2>
                  </div>
                </div>
                <div className="px-6 py-6">
                  <div
                    className="prose prose-stone max-w-none text-stone-700 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: section.content
                        .split('\n\n')
                        .map(para => {
                          // Convert markdown bold to HTML
                          const formatted = para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                          // Check if it's a list item
                          if (formatted.trim().startsWith('-')) {
                            return `<li class="ml-4">${formatted.substring(1).trim()}</li>`;
                          }
                          return `<p class="mb-4">${formatted}</p>`;
                        })
                        .join('')
                        .replace(/(<li.*?<\/li>)+/g, '<ul class="list-disc space-y-2 mb-4">$&</ul>')
                    }}
                  />
                </div>
              </section>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="mt-8 bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-orange-900 uppercase mb-4">Explore More</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-orange-100 rounded-lg transition-colors border border-orange-200"
            >
              <MapPin size={18} className="text-orange-600" />
              <span className="text-sm font-medium text-stone-700">Interactive Site Map</span>
            </Link>
            <Link
              href="/gallery"
              className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-orange-100 rounded-lg transition-colors border border-orange-200"
            >
              <BookOpen size={18} className="text-orange-600" />
              <span className="text-sm font-medium text-stone-700">Media Gallery</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
