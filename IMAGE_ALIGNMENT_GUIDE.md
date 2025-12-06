# Image Alignment Issue & Solution

## THE PROBLEM

Your three map layers (Photo, Drawing, Sketch) are not aligned properly. Even though they're all 1920x1440 pixels, the **content within each image** is positioned differently. This causes pins to appear in the wrong locations when you switch between layers.

## WHY IT HAPPENS

When you export or crop images from different sources (Photoshop, Figma, etc.), each export might:
- Be cropped at slightly different positions
- Have different margins/padding
- Be scaled slightly differently
- Have different alignment reference points

Think of it like three transparent sheets stacked on top of each other - if the sheets themselves are the same size but the drawings on them aren't lined up, nothing will match.

## HOW TO CHECK THE ALIGNMENT

1. Go to: [http://localhost:3003/admin/alignment](http://localhost:3003/admin/alignment)
2. Use the opacity sliders to overlay all three images
3. Look for key landmarks (roads, buildings, corners) that should align
4. If they don't perfectly overlap, your images need to be re-exported

**Visual Test:**
- Set Photo to 100%, Drawing to 50%, Sketch to 0%
- Do the edges of buildings match exactly?
- Set Photo to 50%, Drawing to 50%, Sketch to 0%
- Do roads and paths overlay perfectly?
- Repeat with different combinations

## THE SOLUTION

You need to re-export all three images from your design software with **identical alignment**.

### Option 1: Manual Re-export (Recommended)

**In Photoshop/Figma/Illustrator:**

1. **Create a reference layer** with guides/markers at:
   - All four corners
   - Center point
   - Key landmarks (roads, buildings)

2. **Align all three layers** to these reference points

3. **Set up your canvas:**
   - Exact size: 1920x1440 pixels
   - No padding/margins
   - Same zoom/scale for all exports

4. **Export each layer individually:**
   - Turn off other layers
   - Export entire canvas (not selection)
   - Same export settings for all three
   - Format: WebP or PNG
   - Quality: 90%

5. **Important**: Use the **exact same crop/export settings** for all three images

### Option 2: Script-Based Alignment

If you have reference points that should align, you can use ImageMagick to adjust:

```bash
# Install ImageMagick if needed
brew install imagemagick

# Example: shift drawing layer 10px right, 5px down
convert "public/images/Drawing Colour.webp" -background transparent -extent 1920x1440+10+5 "public/images/Drawing Colour-aligned.webp"

# Example: scale sketch layer by 1% and shift
convert "public/images/Sketch.webp" -resize 101% -gravity center -extent 1920x1440 "public/images/Sketch-aligned.webp"
```

**Note**: This requires knowing the exact pixel offsets. The alignment tool can help you estimate these.

### Option 3: Use Alignment Software

Tools like [Hugin](http://hugin.sourceforge.net/) or [Photomerge](https://helpx.adobe.com/photoshop/using/create-panoramic-images-photomerge.html) can automatically align images:

1. Import all three images
2. Let the software detect alignment points
3. Export aligned versions

## CHECKLIST BEFORE RE-EXPORTING

- [ ] All layers use the same coordinate system
- [ ] Canvas size is exactly 1920x1440 for all
- [ ] No margins or padding around images
- [ ] Reference guides are in place
- [ ] All layers aligned to the same anchor point (top-left recommended)
- [ ] Zoom level is the same (100% recommended)
- [ ] Export settings are identical

## AFTER RE-EXPORTING

1. Replace the files in `/public/images/`:
   - `Photo.webp`
   - `Drawing Colour.webp`
   - `Sketch.webp`

2. Clear your browser cache (Cmd+Shift+R)

3. Test alignment at: [http://localhost:3003/admin/alignment](http://localhost:3003/admin/alignment)

4. Verify pins stay in the correct position when switching layers on the main map

## TECHNICAL DETAILS

The app uses a percentage-based positioning system:
- Container aspect ratio: exactly 1920:1440
- Images render at exact size (no object-fit)
- Pin coordinates are percentages (0-100%)
- When images are aligned, percentage positions work across all layers

**What this means:**
- Pin at (50%, 50%) should be center of all three images
- Pin at (25%, 75%) should be bottom-left quadrant center of all three images
- If the actual content in your images is shifted, pins won't match

## STILL HAVING ISSUES?

1. Check the dev console for errors
2. Verify all images are exactly 1920x1440: `file public/images/*.webp`
3. Use the alignment tool's crosshairs to check center points
4. Try exporting with different software
5. Consider creating the images from scratch with proper alignment from the start

## PREVENTION FOR FUTURE UPDATES

When adding new map layers or updating existing ones:
1. Always use the alignment reference layer
2. Export all layers at the same time
3. Test alignment immediately after export
4. Keep a "master" file with all layers properly aligned
