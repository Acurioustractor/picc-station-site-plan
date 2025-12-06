'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Eye, Plus, Image as ImageIcon, MapPin, Trash2, MoveUp, MoveDown, Save, RefreshCw, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast, Toaster } from 'sonner';
import Footer from '@/components/Footer';
import ReactMarkdown from 'react-markdown';
import { defaultReport, Report, ReportSection } from '@/lib/defaultReport';

// Helper to convert video URLs to embed format
const getVideoEmbedUrl = (url: string): string => {
  if (!url) return '';

  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('youtu.be')
      ? url.split('youtu.be/')[1]?.split('?')[0]
      : url.split('v=')[1]?.split('&')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }

  // Vimeo
  if (url.includes('vimeo.com') && !url.includes('player.vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
  }

  // Descript - convert /view/ to /embed/
  if (url.includes('share.descript.com')) {
    return url.replace('/view/', '/embed/');
  }

  return url;
};

export default function ReportPage() {
  const [editMode, setEditMode] = useState(false);
  // Use static default report as initial state, then load saved version
  const [report, setReport] = useState<Report>(defaultReport);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState<number | null>(null);
  const [mediaLibrary, setMediaLibrary] = useState<any[]>([]);
  const [allImages, setAllImages] = useState<{url: string; name: string; location: string}[]>([]);
  const [imageSearch, setImageSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load ALL images from disk (not just siteData)
  useEffect(() => {
    fetch('/api/all-images')
      .then(res => res.json())
      .then(data => {
        if (data.images && data.images.length > 0) {
          setAllImages(data.images);
          console.log(`Loaded ${data.count} images from disk`);
        }
      })
      .catch(err => {
        console.error('Failed to load images from API, falling back to siteData:', err);
        // Fallback to siteData
        import('@/lib/siteData').then(({ siteData }) => {
          const images: {url: string; name: string; location: string}[] = [];
          siteData.locations.forEach(loc => {
            loc.images?.forEach(img => {
              images.push({
                url: img.url,
                name: img.caption || img.url.split('/').pop() || 'Image',
                location: loc.title
              });
            });
          });
          setAllImages(images);
        });
      });
  }, []);

  // Load media library (for editing functionality)
  useEffect(() => {
    const savedMedia = localStorage.getItem('picc-media-library');
    if (savedMedia) {
      try {
        setMediaLibrary(JSON.parse(savedMedia));
      } catch (e) {
        console.error('Failed to parse media', e);
      }
    }
  }, []);

  // Load saved report from Vercel Blob on startup
  useEffect(() => {
    fetch('/api/load-report')
      .then(res => res.json())
      .then(data => {
        if (data.exists && data.report) {
          setReport(data.report);
          console.log('Loaded saved report from cloud');
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load saved report:', err);
        setIsLoading(false);
      });
  }, []);

  // Save report to Vercel Blob (permanent cloud storage)
  const saveReport = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/save-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Report saved to cloud - all visitors will see your changes!');
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Failed to save report:', err);
      toast.error('Failed to save report. Try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const addSection = (type: ReportSection['type']) => {
    const newSection: ReportSection = {
      id: `section-${Date.now()}`,
      type,
      content: '',
      layout: 'center',
      // Initialize empty arrays for gallery and stats sections
      ...(type === 'image-gallery' && { images: [] }),
      ...(type === 'stats' && { stats: [] })
    };
    setReport({ ...report, sections: [...report.sections, newSection] });
  };

  const updateSection = (id: string, updates: Partial<ReportSection>) => {
    setReport({
      ...report,
      sections: report.sections.map(s => s.id === id ? { ...s, ...updates } : s)
    });
  };

  const deleteSection = (id: string) => {
    setReport({
      ...report,
      sections: report.sections.filter(s => s.id !== id)
    });
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    const index = report.sections.findIndex(s => s.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === report.sections.length - 1) return;

    const newSections = [...report.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];

    setReport({ ...report, sections: newSections });
  };

  const selectMediaForSection = (mediaUrl: string) => {
    if (currentSectionId === 'hero-image') {
      // Special case: updating the report's hero background image
      setReport({ ...report, heroImage: mediaUrl });
      setShowMediaPicker(false);
      setCurrentSectionId(null);
    } else if (currentSectionId && currentGalleryIndex !== null) {
      // Updating a gallery image at a specific index
      const section = report.sections.find(s => s.id === currentSectionId);
      if (section?.images) {
        const newImages = [...section.images];
        if (currentGalleryIndex === -1) {
          // Adding a new image to the gallery
          newImages.push(mediaUrl);
        } else {
          // Replacing an existing image
          newImages[currentGalleryIndex] = mediaUrl;
        }
        updateSection(currentSectionId, { images: newImages });
      }
      setShowMediaPicker(false);
      setCurrentSectionId(null);
      setCurrentGalleryIndex(null);
    } else if (currentSectionId) {
      updateSection(currentSectionId, { imageUrl: mediaUrl });
      setShowMediaPicker(false);
      setCurrentSectionId(null);
    }
  };

  const removeGalleryImage = (sectionId: string, imageIndex: number) => {
    const section = report.sections.find(s => s.id === sectionId);
    if (section?.images) {
      const newImages = section.images.filter((_, i) => i !== imageIndex);
      updateSection(sectionId, { images: newImages });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-3 sm:px-4 md:px-6 py-3 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Link
              href="/"
              className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors min-h-[44px]"
            >
              <ArrowLeft size={20} className="text-stone-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-stone-600">Back to Map</span>
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors font-medium text-xs sm:text-sm whitespace-nowrap min-h-[44px] ${
                editMode
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {editMode ? <Eye size={18} /> : <Edit size={18} />}
              {editMode ? 'Preview' : 'Edit'}
            </button>

            {editMode && (
              <button
                onClick={saveReport}
                disabled={isSaving}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors font-medium text-xs sm:text-sm whitespace-nowrap min-h-[44px] ${
                  isSaving
                    ? 'bg-green-400 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <Save size={18} className={isSaving ? 'animate-pulse' : ''} />
                <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save Report'}</span>
                <span className="sm:hidden">{isSaving ? '...' : 'Save'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-[50vh] sm:h-[60vh] flex items-center justify-center text-white overflow-hidden group">
          {/* Background Image or Gradient */}
          {report.heroImage ? (
            <Image
              src={report.heroImage}
              alt="Report hero"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600" />
          )}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Click to change hero image */}
          {editMode && (
            <button
              onClick={() => {
                setCurrentSectionId('hero-image');
                setShowMediaPicker(true);
              }}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20 bg-white/90 px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 text-stone-800 font-medium text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity min-h-[44px]"
            >
              <RefreshCw size={16} />
              <span className="hidden sm:inline">{report.heroImage ? 'Change Hero Image' : 'Add Hero Image'}</span>
              <span className="sm:hidden">{report.heroImage ? 'Change' : 'Add'}</span>
            </button>
          )}

          <div className="relative z-10 text-center px-4 max-w-4xl w-full">
            {editMode ? (
              <>
                <input
                  type="text"
                  value={report.title}
                  onChange={(e) => setReport({ ...report, title: e.target.value })}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-3 sm:mb-4 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg w-full text-center text-white placeholder-white/50"
                  placeholder="Report Title"
                />
                <input
                  type="text"
                  value={report.subtitle}
                  onChange={(e) => setReport({ ...report, subtitle: e.target.value })}
                  className="text-base sm:text-lg md:text-xl lg:text-2xl bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg w-full text-center text-white/90 placeholder-white/50"
                  placeholder="Report Subtitle"
                />
              </>
            ) : (
              <>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-3 sm:mb-4 drop-shadow-lg">
                  {report.title}
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 drop-shadow-md">
                  {report.subtitle}
                </p>
              </>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stone-50 to-transparent"></div>
        </div>

        {/* Report Sections */}
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
          {report.sections.map((section, index) => (
            <div key={section.id} className="relative group">
              {/* Edit Controls */}
              {editMode && (
                <div className="absolute -left-16 top-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => moveSection(section.id, 'up')}
                    disabled={index === 0}
                    className="p-2 bg-stone-200 hover:bg-stone-300 rounded disabled:opacity-30"
                  >
                    <MoveUp size={16} />
                  </button>
                  <button
                    onClick={() => moveSection(section.id, 'down')}
                    disabled={index === report.sections.length - 1}
                    className="p-2 bg-stone-200 hover:bg-stone-300 rounded disabled:opacity-30"
                  >
                    <MoveDown size={16} />
                  </button>
                  <button
                    onClick={() => deleteSection(section.id)}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}

              {/* Section Content */}
              {section.type === 'text' && (
                <div className="prose prose-lg prose-stone max-w-none prose-headings:font-serif prose-headings:text-stone-900 prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-stone-700 prose-p:leading-relaxed prose-strong:text-stone-900 prose-ul:text-stone-700 prose-li:marker:text-orange-500">
                  {editMode ? (
                    <textarea
                      value={section.content}
                      onChange={(e) => updateSection(section.id, { content: e.target.value })}
                      rows={8}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                      placeholder="Write your story here... (supports markdown)"
                    />
                  ) : (
                    <ReactMarkdown>{section.content || ''}</ReactMarkdown>
                  )}
                </div>
              )}

              {section.type === 'hero' && (
                <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl group">
                  {section.imageUrl ? (
                    <>
                      <Image
                        src={section.imageUrl}
                        alt={section.caption || ''}
                        fill
                        className="object-cover"
                      />
                      {/* Click to swap overlay */}
                      {editMode && (
                        <button
                          onClick={() => {
                            setCurrentSectionId(section.id);
                            setShowMediaPicker(true);
                          }}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <div className="bg-white/90 px-6 py-3 rounded-lg flex items-center gap-2 text-stone-800 font-medium">
                            <RefreshCw size={20} />
                            Click to Swap Image
                          </div>
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="h-full bg-stone-200 flex items-center justify-center">
                      <button
                        onClick={() => {
                          setCurrentSectionId(section.id);
                          setShowMediaPicker(true);
                        }}
                        className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                      >
                        <ImageIcon size={20} />
                        Select Image
                      </button>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    {editMode ? (
                      <input
                        type="text"
                        value={section.caption || ''}
                        onChange={(e) => updateSection(section.id, { caption: e.target.value })}
                        className="w-full bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded"
                        placeholder="Image caption"
                      />
                    ) : section.caption ? (
                      <p className="text-white text-lg">{section.caption}</p>
                    ) : null}
                  </div>
                </div>
              )}

              {section.type === 'image' && (
                <div className={`${section.layout === 'full' ? 'w-full' : section.layout === 'left' ? 'float-left w-1/2 mr-6' : section.layout === 'right' ? 'float-right w-1/2 ml-6' : 'mx-auto w-3/4'}`}>
                  {section.imageUrl ? (
                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg group">
                      <Image
                        src={section.imageUrl}
                        alt={section.caption || ''}
                        fill
                        className="object-cover"
                      />
                      {/* Click to swap overlay */}
                      {editMode && (
                        <button
                          onClick={() => {
                            setCurrentSectionId(section.id);
                            setShowMediaPicker(true);
                          }}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <div className="bg-white/90 px-4 py-2 rounded-lg flex items-center gap-2 text-stone-800 font-medium text-sm">
                            <RefreshCw size={16} />
                            Swap Image
                          </div>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video bg-stone-200 rounded-xl flex items-center justify-center">
                      <button
                        onClick={() => {
                          setCurrentSectionId(section.id);
                          setShowMediaPicker(true);
                        }}
                        className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                      >
                        <ImageIcon size={20} />
                        Select Image
                      </button>
                    </div>
                  )}
                  {editMode && (
                    <select
                      value={section.layout}
                      onChange={(e) => updateSection(section.id, { layout: e.target.value as any })}
                      className="mt-2 px-3 py-2 border border-stone-300 rounded"
                    >
                      <option value="center">Centre</option>
                      <option value="full">Full Width</option>
                      <option value="left">Float Left</option>
                      <option value="right">Float Right</option>
                    </select>
                  )}
                  {section.caption && (
                    <div className="mt-2">
                      {editMode ? (
                        <input
                          type="text"
                          value={section.caption}
                          onChange={(e) => updateSection(section.id, { caption: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded"
                          placeholder="Image caption"
                        />
                      ) : (
                        <p className="text-sm text-stone-600 italic">{section.caption}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {section.type === 'video' && (
                <div className="space-y-3">
                  <div className="aspect-video bg-stone-900 rounded-xl overflow-hidden shadow-lg">
                    {section.videoUrl ? (
                      <iframe
                        src={getVideoEmbedUrl(section.videoUrl)}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={section.caption || 'Video'}
                      />
                    ) : editMode ? (
                      <div className="h-full flex items-center justify-center p-4">
                        <input
                          type="text"
                          value={section.videoUrl || ''}
                          onChange={(e) => updateSection(section.id, { videoUrl: e.target.value })}
                          className="w-full max-w-2xl px-3 sm:px-4 py-2 sm:py-3 border border-stone-300 rounded-lg text-sm sm:text-base"
                          placeholder="Enter video URL (YouTube, Vimeo, Descript)"
                        />
                      </div>
                    ) : null}
                  </div>
                  {section.caption && !editMode && (
                    <p className="text-center text-xs sm:text-sm text-stone-600 italic">{section.caption}</p>
                  )}
                  {editMode && (
                    <input
                      type="text"
                      value={section.caption || ''}
                      onChange={(e) => updateSection(section.id, { caption: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded text-sm sm:text-base"
                      placeholder="Video caption (optional)"
                    />
                  )}
                </div>
              )}

              {section.type === 'quote' && (
                <div className="border-l-4 border-orange-600 pl-6 py-4 bg-orange-50 rounded-r-xl">
                  {editMode ? (
                    <div className="space-y-2">
                      <textarea
                        value={section.content}
                        onChange={(e) => updateSection(section.id, { content: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        placeholder="Enter quote text"
                      />
                      <input
                        type="text"
                        value={section.author || ''}
                        onChange={(e) => updateSection(section.id, { author: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded"
                        placeholder="Quote author (optional)"
                      />
                    </div>
                  ) : (
                    <div>
                      <blockquote className="text-2xl font-serif italic text-stone-800">
                        &ldquo;{section.content}&rdquo;
                      </blockquote>
                      {section.author && (
                        <p className="mt-3 text-sm text-stone-600 font-medium">— {section.author}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {section.type === 'map-link' && (
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-6">
                  {editMode ? (
                    <input
                      type="text"
                      value={section.locationId || ''}
                      onChange={(e) => updateSection(section.id, { locationId: e.target.value })}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg mb-3"
                      placeholder="Location ID (e.g., kitchen-block)"
                    />
                  ) : null}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      {editMode ? (
                        <textarea
                          value={section.content}
                          onChange={(e) => updateSection(section.id, { content: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-stone-300 rounded"
                          placeholder="Link description"
                        />
                      ) : (
                        <p className="text-stone-700">{section.content}</p>
                      )}
                    </div>
                    {!editMode && section.locationId && (
                      <Link
                        href={`/?location=${section.locationId}`}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        View on Map
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Stats Section */}
              {section.type === 'stats' && (
                <div className="bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl p-8 text-white">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {section.stats?.map((stat, i) => (
                      <div key={i} className="text-center">
                        <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                        <div className="text-orange-100 text-sm font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Gallery Section */}
              {section.type === 'image-gallery' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {section.images?.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
                        <Image
                          src={img}
                          alt={`Gallery image ${i + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                        {/* Edit overlay for each gallery image */}
                        {editMode && (
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setCurrentSectionId(section.id);
                                setCurrentGalleryIndex(i);
                                setShowMediaPicker(true);
                              }}
                              className="bg-white/90 px-3 py-2 rounded-lg flex items-center gap-2 text-stone-800 font-medium text-sm"
                            >
                              <RefreshCw size={14} />
                              Swap
                            </button>
                            <button
                              onClick={() => removeGalleryImage(section.id, i)}
                              className="bg-red-500/90 px-3 py-2 rounded-lg flex items-center gap-2 text-white font-medium text-sm"
                            >
                              <Trash2 size={14} />
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {/* Add new image button */}
                    {editMode && (
                      <button
                        onClick={() => {
                          setCurrentSectionId(section.id);
                          setCurrentGalleryIndex(-1); // -1 means add new
                          setShowMediaPicker(true);
                        }}
                        className="aspect-square rounded-xl border-2 border-dashed border-stone-300 hover:border-orange-400 transition-colors flex flex-col items-center justify-center gap-2 text-stone-500 hover:text-orange-600"
                      >
                        <Plus size={32} />
                        <span className="text-sm font-medium">Add Image</span>
                      </button>
                    )}
                  </div>
                  {editMode ? (
                    <input
                      type="text"
                      value={section.caption || ''}
                      onChange={(e) => updateSection(section.id, { caption: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded text-center text-sm"
                      placeholder="Gallery caption (optional)"
                    />
                  ) : section.caption ? (
                    <p className="text-center text-sm text-stone-600 italic">{section.caption}</p>
                  ) : null}
                </div>
              )}

              {/* Divider Section */}
              {section.type === 'divider' && (
                <div className="py-8">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
                    {section.content && (
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-orange-800 px-4">
                        {section.content}
                      </h2>
                    )}
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add Section Buttons */}
          {editMode && (
            <div className="border-2 border-dashed border-stone-300 rounded-xl p-8">
              <p className="text-center text-stone-600 mb-4 font-medium">Add Section</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                <button
                  onClick={() => addSection('text')}
                  className="p-4 bg-white border-2 border-stone-200 hover:border-orange-400 rounded-lg transition-colors"
                >
                  <div className="text-2xl mb-2">📝</div>
                  <div className="text-sm font-medium text-stone-700">Text</div>
                </button>
                <button
                  onClick={() => addSection('hero')}
                  className="p-4 bg-white border-2 border-stone-200 hover:border-orange-400 rounded-lg transition-colors"
                >
                  <div className="text-2xl mb-2">🖼️</div>
                  <div className="text-sm font-medium text-stone-700">Hero Image</div>
                </button>
                <button
                  onClick={() => addSection('image')}
                  className="p-4 bg-white border-2 border-stone-200 hover:border-orange-400 rounded-lg transition-colors"
                >
                  <div className="text-2xl mb-2">📷</div>
                  <div className="text-sm font-medium text-stone-700">Image</div>
                </button>
                <button
                  onClick={() => addSection('video')}
                  className="p-4 bg-white border-2 border-stone-200 hover:border-orange-400 rounded-lg transition-colors"
                >
                  <div className="text-2xl mb-2">🎥</div>
                  <div className="text-sm font-medium text-stone-700">Video</div>
                </button>
                <button
                  onClick={() => addSection('quote')}
                  className="p-4 bg-white border-2 border-stone-200 hover:border-orange-400 rounded-lg transition-colors"
                >
                  <div className="text-2xl mb-2">💬</div>
                  <div className="text-sm font-medium text-stone-700">Quote</div>
                </button>
                <button
                  onClick={() => addSection('map-link')}
                  className="p-4 bg-white border-2 border-stone-200 hover:border-orange-400 rounded-lg transition-colors"
                >
                  <div className="text-2xl mb-2">🗺️</div>
                  <div className="text-sm font-medium text-stone-700">Map Link</div>
                </button>
                <button
                  onClick={() => addSection('image-gallery')}
                  className="p-4 bg-white border-2 border-stone-200 hover:border-orange-400 rounded-lg transition-colors"
                >
                  <div className="text-2xl mb-2">🖼️</div>
                  <div className="text-sm font-medium text-stone-700">Gallery</div>
                </button>
                <button
                  onClick={() => addSection('stats')}
                  className="p-4 bg-white border-2 border-stone-200 hover:border-orange-400 rounded-lg transition-colors"
                >
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-sm font-medium text-stone-700">Stats</div>
                </button>
                <button
                  onClick={() => addSection('divider')}
                  className="p-4 bg-white border-2 border-stone-200 hover:border-orange-400 rounded-lg transition-colors"
                >
                  <div className="text-2xl mb-2">➖</div>
                  <div className="text-sm font-medium text-stone-700">Divider</div>
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Media Picker Modal */}
        {showMediaPicker && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={() => {
              setShowMediaPicker(false);
              setImageSearch('');
            }}
          >
            <div
              className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6 border-b border-stone-200 flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-stone-900">Select Image</h2>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1">Click any image to use it in your report</p>
                </div>
                <button
                  onClick={() => {
                    setShowMediaPicker(false);
                    setImageSearch('');
                  }}
                  className="p-2 hover:bg-stone-100 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
                  aria-label="Close"
                >
                  <X size={20} className="text-stone-400" />
                </button>
              </div>

              {/* Search Box */}
              <div className="px-4 sm:px-6 py-3 border-b border-stone-200">
                <input
                  type="text"
                  value={imageSearch}
                  onChange={(e) => setImageSearch(e.target.value)}
                  placeholder="Search by location name (e.g. kitchen, house, yarning)..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                />
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                {/* Group images by location */}
                {(() => {
                  const searchTerm = imageSearch.toLowerCase();
                  const filteredImages = allImages.filter(img =>
                    !searchTerm || img.location.toLowerCase().includes(searchTerm)
                  );

                  // Group by location
                  const groupedImages: Record<string, typeof allImages> = {};
                  filteredImages.forEach(img => {
                    if (!groupedImages[img.location]) {
                      groupedImages[img.location] = [];
                    }
                    groupedImages[img.location].push(img);
                  });

                  const locations = Object.keys(groupedImages).sort();

                  return (
                    <>
                      <p className="text-sm text-stone-500 mb-4">
                        Showing {filteredImages.length} of {allImages.length} images across {locations.length} locations
                      </p>

                      {locations.map(location => (
                        <div key={location} className="mb-6">
                          <h3 className="text-xs sm:text-sm font-semibold text-orange-600 mb-3 sticky top-0 bg-white py-1 z-10">
                            {location} ({groupedImages[location].length})
                          </h3>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                            {groupedImages[location].map((item, idx) => (
                              <button
                                key={idx}
                                onClick={() => selectMediaForSection(item.url)}
                                className="relative aspect-square rounded-lg overflow-hidden border-2 border-stone-200 hover:border-orange-400 active:border-orange-500 transition-colors group min-h-[60px]"
                              >
                                <Image
                                  src={item.url}
                                  alt={item.name}
                                  fill
                                  className="object-cover group-hover:scale-105 group-active:scale-110 transition-transform"
                                  sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </>
                  );
                })()}

                {/* Uploaded Media */}
                {mediaLibrary.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-stone-200">
                    <h3 className="text-xs sm:text-sm font-semibold text-purple-600 mb-3">Uploaded Media ({mediaLibrary.length})</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                      {mediaLibrary.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => selectMediaForSection(item.url)}
                          className="relative aspect-square rounded-lg overflow-hidden border-2 border-stone-200 hover:border-orange-400 active:border-orange-500 transition-colors group min-h-[60px]"
                        >
                          <Image
                            src={item.url}
                            alt={item.filename}
                            fill
                            className="object-cover group-hover:scale-105 group-active:scale-110 transition-transform"
                            sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {allImages.length === 0 && mediaLibrary.length === 0 && (
                  <div className="text-center py-16">
                    <ImageIcon size={64} className="mx-auto text-stone-300 mb-4" />
                    <p className="text-stone-600 mb-4">No images available</p>
                    <Link
                      href="/media"
                      className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Upload Media
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
