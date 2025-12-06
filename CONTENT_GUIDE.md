# Content Management Guide
## PICC Station Site Plan - Interactive Map

This guide walks you through adding and managing content for your interactive map.

---

## 📍 Part 1: Adding New Location Pins

### Step 1: Add the Location Data

Edit `lib/siteData.ts` and add a new location object to the `locations` array:

```typescript
{
  id: "new-location",  // Unique ID (lowercase, use hyphens)
  x: 50,  // Temporary X position (0-100, we'll position it properly next)
  y: 50,  // Temporary Y position (0-100, we'll position it properly next)
  title: "New Location Name",
  type: "building",  // Options: 'building', 'nature', 'utility', 'infrastructure'
  description: "Short description that appears on the map pin hover",
  overview: "Detailed overview of the current state and work to be done",
  futureScope: "Description of future plans and potential for this location",
  images: [],
  videos: [],
  completionPercentage: 0,
  tasks: [],
  notes: []
}
```

### Step 2: Position the Pin Accurately

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open the Pin Position Review tool:**
   - Navigate to `http://localhost:3000/admin/pins`
   - Login with password: `picc2025`

3. **Position your new pin:**
   - Find "New Location Name" in the sidebar
   - Click it to select it
   - Click on the map exactly where it should be located
   - Repeat for any other pins that need adjustment

4. **Export the updated positions:**
   - Click "Copy Code" button
   - The coordinates will be copied to your clipboard

5. **Update siteData.ts:**
   - Paste the new coordinates into `lib/siteData.ts`
   - Replace the x and y values for your location

---

## 🖼️ Part 2: Adding Images

### Method A: Using the Admin Panel (Recommended)

1. **Add images to the public folder:**
   ```bash
   # Place your images in:
   public/images/locations/[location-id]/

   # Example:
   public/images/locations/kitchen-block/before-1.jpg
   public/images/locations/kitchen-block/progress-1.jpg
   ```

2. **Use the Admin Panel:**
   - Go to `http://localhost:3000/admin`
   - Login with password: `picc2025`
   - Select a location from the sidebar
   - Click the "Media" tab
   - In the Images section, click "Add Image"
   - Fill in the image details:
     - **URL**: `/images/locations/kitchen-block/before-1.jpg`
     - **Caption**: "Kitchen before renovation"
     - **Description**: "Detailed description..."
     - **Category**: Select 'before', 'during', 'after', or 'general'
     - **Date Taken**: Select date
     - **Photographer**: Optional

3. **For Before/After Comparisons:**
   - Add two images
   - Set one as category: `before`
   - Set the other as category: `after`
   - Enable "Is Before/After Pair" checkbox
   - They will automatically display side-by-side with a slider!

### Method B: Manual Edit

Edit `lib/siteData.ts`:

```typescript
images: [
  {
    url: '/images/locations/kitchen-block/photo1.jpg',
    caption: 'Kitchen Block - Before',
    description: 'Original state of the kitchen facility',
    photographer: 'John Smith',
    dateTaken: '2024-01-15',
    category: 'before'
  },
  {
    url: '/images/locations/kitchen-block/photo2.jpg',
    caption: 'Kitchen Block - After',
    description: 'Renovated kitchen ready for training',
    photographer: 'John Smith',
    dateTaken: '2024-06-20',
    category: 'after',
    isBeforeAfter: true,
    beforeAfterPair: '/images/locations/kitchen-block/photo1.jpg'
  }
]
```

---

## 🎥 Part 3: Adding Videos

### Using the Admin Panel:

1. Go to `http://localhost:3000/admin`
2. Select a location
3. Click "Media" tab
4. Click "Add Video"
5. Enter:
   - **Video URL**: YouTube, Vimeo, or direct video URL
   - **Title**: "Progress Update - January 2025"
   - **Description**: "Overview of work completed"
   - **Category**: "Progress Update", "Interview", "Tour", etc.

### Supported Video Types:

- **YouTube**: `https://youtube.com/watch?v=VIDEO_ID`
- **Vimeo**: `https://vimeo.com/VIDEO_ID`
- **Direct**: `/videos/my-video.mp4` (place in `public/videos/`)

### Manual Edit:

```typescript
videos: [
  {
    id: "video-1",
    title: "Kitchen Block Progress Update",
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    type: "youtube",
    thumbnail: "/images/video-thumbnails/kitchen-thumb.jpg",  // Optional
    description: "Monthly progress update showing kitchen renovation",
    category: "Progress Update"
  }
]
```

---

## ✅ Part 4: Adding Tasks & Completion Tracking

### Using the Admin Panel:

1. Go to `http://localhost:3000/admin`
2. Select a location
3. Click "Tasks" tab
4. Click "Add Task"
5. Fill in:
   - **Title**: "Install commercial kitchen equipment"
   - **Description**: "Source and install ovens, stoves, refrigeration"
   - **Status**: 'not-started', 'in-progress', or 'completed'
   - **Completed Date**: (if status is 'completed')

### Manual Edit:

```typescript
completionPercentage: 35,  // Overall completion (0-100)
tasks: [
  {
    id: "task-1",
    title: "Security gate installation",
    description: "Install secure gating system at main entry",
    status: "completed",
    order: 1,
    completedDate: "2024-12-01"
  },
  {
    id: "task-2",
    title: "Clear overgrowth",
    description: "Bring in bobcat/slasher to clear scrub",
    status: "in-progress",
    order: 2
  }
]
```

---

## 📝 Part 5: Adding Project Notes

Project notes are categorized updates with timelines. Great for documenting progress, challenges, and next steps.

### Manual Edit:

```typescript
notes: [
  {
    id: "note-1",
    category: "progress",  // Options: 'progress', 'challenges', 'next-steps'
    content: "Successfully secured the main gate and established caretaker presence on site",
    date: "2024-12-01",
    author: "Project Manager"
  },
  {
    id: "note-2",
    category: "challenges",
    content: "Discovered additional mold damage in Train Carriage #3 - will need specialist assessment",
    date: "2024-12-05",
    author: "Site Inspector"
  },
  {
    id: "note-3",
    category: "next-steps",
    content: "Schedule equipment delivery for kitchen block - aim for mid-January 2025",
    date: "2024-12-03",
    author: "Procurement Team"
  }
]
```

### Note Categories:
- **progress**: ✅ Green - Achievements and completed work
- **challenges**: ⚠️ Amber - Issues encountered
- **next-steps**: 📅 Blue - Upcoming tasks and plans

---

## 🎨 Part 6: Image Optimization (Optional but Recommended)

To keep your site fast, optimize images before adding them:

1. **Place original images** in `public/images/` folder

2. **Update the optimizer config** in `scripts/optimize-images.js`:
   ```javascript
   const images = [
     {
       input: path.join(__dirname, '../public/images/your-image.jpg'),
       outputName: 'your-image',
     },
   ];
   ```

3. **Run the optimizer:**
   ```bash
   npm run optimize-images
   ```

4. **Use the optimized .webp files** in your image URLs

---

## 📊 Part 7: Using the Admin Panel

The admin panel provides a GUI for managing most content:

### Access:
- **URL**: `http://localhost:3000/admin`
- **Password**: `picc2025`

### Features:

1. **Basic Info Tab**:
   - Edit title, type, description
   - Update overview and future scope

2. **Tasks Tab**:
   - Add/edit/remove tasks
   - Update task status
   - Set completion dates

3. **Media Tab**:
   - Add images with full metadata
   - Add videos (YouTube/Vimeo/Direct)
   - Manage before/after pairs

4. **Export Data**:
   - Click "Export Data" button
   - Copy the JSON
   - Paste into `lib/siteData.ts`

### Pin Review Tool:
- **URL**: `http://localhost:3000/admin/pins`
- Dedicated interface for positioning pins accurately
- Click pin → Click map → Export coordinates

---

## 🚀 Quick Start Checklist

### Adding Your First Location:

- [ ] Add location object to `lib/siteData.ts`
- [ ] Use Pin Review tool to position it accurately
- [ ] Add 2-3 photos to `public/images/locations/[location-id]/`
- [ ] Add image metadata via admin panel
- [ ] Add 2-3 tasks to track progress
- [ ] Add a progress note with today's date
- [ ] Set completion percentage
- [ ] Test by clicking the pin on the map!

---

## 🎯 Best Practices

1. **Images**:
   - Use descriptive filenames
   - Keep images under 2MB (use optimizer)
   - Add captions for accessibility
   - Use before/after pairs to show progress

2. **Videos**:
   - YouTube/Vimeo preferred (better performance)
   - Add descriptions for context
   - Use categories to organise

3. **Tasks**:
   - Break large tasks into smaller ones
   - Keep titles clear and actionable
   - Update status regularly
   - Set completion dates when finished

4. **Notes**:
   - Add notes regularly (weekly/monthly)
   - Use all three categories
   - Be specific about progress
   - Include dates and authors

5. **Pins**:
   - Use Pin Review tool for accuracy
   - Test on different screen sizes
   - Choose appropriate pin type/color

---

## 🆘 Troubleshooting

**Pins not showing?**
- Check the location has valid x/y coordinates
- Ensure x and y are between 0-100
- Restart dev server

**Images not loading?**
- Check file path starts with `/images/`
- Verify file exists in `public/images/`
- Check file extension matches (.jpg, .png, .webp)

**Admin panel won't save?**
- Click "Export Data" and manually copy to siteData.ts
- This is expected - admin is for editing only
- Real save functionality requires a backend

---

## 📞 Need Help?

- Check the console for errors: Press F12 in browser
- Read error messages carefully
- Check file paths are correct
- Ensure all IDs are unique

Happy mapping! 🗺️
