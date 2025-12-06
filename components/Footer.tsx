'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-800 text-stone-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-24 h-12">
                <Image
                  src="/images/picc-logo-transparent.png"
                  alt="PICC Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-white">The Centre</h3>
                <p className="text-sm text-stone-400">Palm Island Community Company</p>
              </div>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-md">
              A regenerative space for youth pathways, circular economy manufacturing,
              and community connection between Palm Island and Townsville.
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
                <Link href="/grants" className="text-stone-400 hover:text-orange-400 transition-colors">
                  Grant Pipeline
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-stone-400 hover:text-orange-400 transition-colors">
                  Media Gallery
                </Link>
              </li>
              <li>
                <Link href="/media" className="text-stone-400 hover:text-orange-400 transition-colors">
                  Media Library
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
                  href="mailto:contact@picc.org.au"
                  className="text-stone-400 hover:text-orange-400 transition-colors flex items-center gap-2"
                >
                  <Mail size={14} />
                  contact@picc.org.au
                </a>
              </li>
              <li>
                <a
                  href="tel:+61747212222"
                  className="text-stone-400 hover:text-orange-400 transition-colors flex items-center gap-2"
                >
                  <Phone size={14} />
                  (07) 4721 2222
                </a>
              </li>
              <li>
                <a
                  href="https://www.palmisland.qld.gov.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-400 hover:text-orange-400 transition-colors flex items-center gap-2"
                >
                  <ExternalLink size={14} />
                  Palm Island
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone-500">
            © {new Date().getFullYear()} Palm Island Community Company. All rights reserved.
          </p>
          <p className="text-xs text-stone-500">
            Developed in partnership with{' '}
            <span className="text-orange-400">A Curious Tractor</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
