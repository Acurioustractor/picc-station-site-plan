# PICC Station Precinct - Interactive Site Map

An interactive web application showcasing the Palm Island–Townsville Circular Economy & Youth Pathways Precinct site plan.

## Features

- **3-Position Image Slider**: Switch between Drawing, Photo, and Sketch views of the site
- **Interactive Map Pins**: Click on locations to see detailed information
- **Photo Galleries**: View multiple images for each location with a full-screen gallery
- **Video Embeds**: Support for YouTube, Vimeo, and direct video links
- **About Modal**: First-visit popup with project information (dismissable with "don't show again")
- **Admin Panel**: Simple content management for updating location details, images, and videos
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

### Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Admin Panel

Access the admin panel at `/admin`

- **Default password**: `picc2025` (change this in production!)
- Edit location details, add/remove images and videos
- Export data to copy to clipboard

## Image Optimization

Images have been optimized for optimal performance! ✨

### Current Sizes (Optimized)
- **Drawing Colour.webp**: 1920x1440px, 0.35MB ✅
- **Sketch.webp**: 1920x1440px, 0.37MB ✅
- **Photo.webp**: 1920x1440px, 0.55MB ✅

### Optimization Details
- **Original total**: 15.95MB
- **Optimized total**: 1.27MB
- **Reduction**: 92.0% smaller!
- **Format**: WebP with 80% quality
- **Dimensions**: 1920x1440px (4:3 ratio)

To re-optimize images in the future, run:
```bash
node scripts/optimize-images.js
```

Next.js automatically optimizes images with the `<Image>` component, and WebP format provides excellent quality at smaller file sizes.

## Deployment to Vercel

### Quick Deploy

1. Push your code to GitHub

2. Go to [vercel.com](https://vercel.com) and sign in

3. Click "New Project" and import your repository

4. Vercel will automatically detect Next.js - just click "Deploy"

5. Your site will be live at `your-project.vercel.app`

### Custom Domain

In Vercel project settings:
1. Go to "Domains"
2. Add your custom domain
3. Follow the DNS configuration instructions

## Content Management

### Updating Location Data

The simplest workflow:

1. Go to `/admin` and log in
2. Select a location and edit the content
3. Add image URLs or video URLs
4. Click "Export Data"
5. Paste the JSON into `lib/siteData.ts`
6. Commit and push to deploy

### Adding Images

**Option 1: Use URLs**
1. Upload images to your preferred hosting (Cloudinary, Imgur, etc.)
2. Add the URL in the admin panel

**Option 2: Use local files**
1. Add images to `public/images/locations/`
2. Reference as `/images/locations/your-image.jpg`

### Adding Videos

Supports:
- **YouTube**: Paste any YouTube URL
- **Vimeo**: Paste any Vimeo URL
- **Direct**: Use `.mp4` video file URLs

## Project Structure

```
picc-station-map/
├── app/
│   ├── admin/          # Admin panel
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/
│   ├── AboutModal.tsx
│   ├── ImageSlider.tsx
│   ├── InteractiveMap.tsx
│   ├── LocationSidebar.tsx
│   ├── PhotoGallery.tsx
│   └── VideoPlayer.tsx
├── lib/
│   └── siteData.ts     # Site content and location data
├── types/
│   └── index.ts        # TypeScript interfaces
└── public/
    └── images/         # Image assets
```

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

## Security Notes

⚠️ **Important for Production:**

1. **Change the admin password** in `app/admin/page.tsx`
2. Consider implementing proper authentication (NextAuth.js)
3. Set up environment variables for sensitive data
4. Enable HTTPS on your custom domain

## Support

For issues or questions, contact the development team or refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

Built with ❤️ for the Palm Island Community Company
