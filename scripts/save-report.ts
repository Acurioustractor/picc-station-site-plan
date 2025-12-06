import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { del, list, put } from '@vercel/blob';
import { defaultReport } from '../lib/defaultReport.js';

async function saveReport() {
  console.log('Deleting existing report blobs...');

  // Delete existing
  const { blobs } = await list({ prefix: 'report' });
  for (const blob of blobs) {
    await del(blob.url);
    console.log('Deleted:', blob.pathname);
  }

  console.log('Saving new report...');

  // Save new
  const blob = await put('report.json', JSON.stringify(defaultReport, null, 2), {
    access: 'public',
    addRandomSuffix: false,
  });
  console.log('Saved to:', blob.url);

  // Verify
  const response = await fetch(blob.url);
  const data = await response.json();
  console.log('Verified - First section starts with:', data.sections[0].content.substring(0, 60));
}

saveReport().catch(console.error);
