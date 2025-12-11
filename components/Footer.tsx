'use client';

import Link from 'next/link';
import { MapPin, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-800 text-stone-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <h3 className="font-serif font-bold text-xl text-white">Mounty Yarns</h3>
              <p className="text-sm text-stone-400">Mount Druitt, Darug Country</p>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-md">
              A safe space where young people can just be kids. Youth-led programs,
              community connection, and a place to call home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-stone-400 hover:text-orange-400 transition-colors flex items-center gap-1">
                  <MapPin size={14} />
                  Interactive Map
                </Link>
              </li>
              <li>
                <Link href="/wiki" className="text-stone-400 hover:text-orange-400 transition-colors">
                  Site Wiki
                </Link>
              </li>
              <li>
                <Link href="/report" className="text-stone-400 hover:text-orange-400 transition-colors">
                  Site Report
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-stone-400 hover:text-orange-400 transition-colors">
                  Media Gallery
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-stone-400 hover:text-orange-400 transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-3">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:mtdruittinfo@justreinvest.org.au"
                  className="text-stone-400 hover:text-orange-400 transition-colors flex items-center gap-2"
                >
                  <Mail size={14} />
                  mtdruittinfo@justreinvest.org.au
                </a>
              </li>
              <li>
                <a
                  href="https://justreinvest.org.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-400 hover:text-orange-400 transition-colors flex items-center gap-2"
                >
                  <ExternalLink size={14} />
                  Just Reinvest NSW
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone-500">
            © {new Date().getFullYear()} Mounty Yarns & Just Reinvest NSW. On Darug Country.
          </p>
          <p className="text-xs text-stone-500">
            Supported by{' '}
            <a
              href="https://act.place"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-orange-400 transition-colors"
            >
              A Curious Tractor
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
