# Pin Positioning System - HOW IT WORKS

## The Problem (SOLVED):
- Pins were using percentages but image scale kept changing
- Different editors saw different sizes
- Pins never stayed in the right place

## The Solution:

### 1. FIXED IMAGE DIMENSIONS
- All map images are **exactly 1920x1440 pixels**
- Container uses `aspectRatio: '1920 / 1440'` to match
- Image rendered at `width={1920} height={1440}` with `w-full h-full`
- **NO object-cover, NO object-contain** - exact pixel-perfect match

### 2. COORDINATE SYSTEM
- Pins still use percentages (0-100%) for positioning
- But now the container is ALWAYS the same aspect ratio as the image
- Percentage of container = percentage of image = CONSISTENT

### 3. HOW TO POSITION PINS

**Step 1:** Go to [http://localhost:3000/admin/pins](http://localhost:3000/admin/pins)

**Step 2:** Select a pin from the sidebar

**Step 3:** Click EXACTLY where the pin should be on the map

**Step 4:** Click "Copy Code" and paste into `lib/siteData.ts`

### 4. WHY IT WORKS NOW:

**Before:**
```
Container: 1400px wide (random size)
Image: object-contain (might be smaller with padding)
Pin at 50%: 700px from left (WRONG - not on image center)
```

**Now:**
```
Container: 1920x1440 aspect ratio (scales proportionally)
Image: EXACT same size as container
Pin at 50%: Always image center, any screen size
```

### 5. KEY RULES:

✅ Container aspect ratio EXACTLY matches image (1920:1440)
✅ Image fills container COMPLETELY (no object-fit needed)
✅ Percentages work because container = image size
✅ Works on any screen size (scales proportionally)

### 6. IF PINS ARE STILL OFF:

1. Check all images are 1920x1440 (use `file public/images/*.webp`)
2. Clear browser cache (Cmd+Shift+R)
3. Reposition pins using Pin Review tool
4. Make sure you're using the updated code

## Layer Switching (ALSO FIXED):

**Before:** Confusing slider
**Now:** Three clear buttons:
- 📷 Photo
- ✏️ Drawing
- 🖼️ Sketch

Click button to switch - pins stay in EXACT same position across all layers.
