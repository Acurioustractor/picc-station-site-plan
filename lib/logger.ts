import fs from 'fs/promises';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'activity.log');

export interface ActivityLog {
  timestamp: string;
  action: string;
  details: Record<string, any>;
}

/**
 * Ensure log directory exists
 */
async function ensureLogDir() {
  try {
    await fs.access(LOG_DIR);
  } catch {
    await fs.mkdir(LOG_DIR, { recursive: true });
  }
}

/**
 * Log an activity to the activity log file
 */
export async function logActivity(
  action: string,
  details: Record<string, any> = {}
): Promise<void> {
  try {
    await ensureLogDir();

    const logEntry: ActivityLog = {
      timestamp: new Date().toISOString(),
      action,
      details,
    };

    const logLine = JSON.stringify(logEntry) + '\n';

    await fs.appendFile(LOG_FILE, logLine, 'utf-8');
  } catch (error) {
    console.error('Failed to write activity log:', error);
    // Don't throw - logging failures shouldn't break the app
  }
}

/**
 * Read recent activity logs
 */
export async function getRecentLogs(limit: number = 100): Promise<ActivityLog[]> {
  try {
    await ensureLogDir();

    const content = await fs.readFile(LOG_FILE, 'utf-8');
    const lines = content.trim().split('\n').filter(Boolean);

    const logs = lines
      .slice(-limit)
      .map((line) => {
        try {
          return JSON.parse(line) as ActivityLog;
        } catch {
          return null;
        }
      })
      .filter((log): log is ActivityLog => log !== null)
      .reverse(); // Most recent first

    return logs;
  } catch (error) {
    // If file doesn't exist yet, return empty array
    if ((error as any).code === 'ENOENT') {
      return [];
    }
    console.error('Failed to read activity logs:', error);
    return [];
  }
}

/**
 * Clear old logs (keep last N days)
 */
export async function cleanupOldLogs(daysToKeep: number = 30): Promise<void> {
  try {
    const logs = await getRecentLogs(10000); // Get all logs
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const recentLogs = logs.filter((log) => {
      const logDate = new Date(log.timestamp);
      return logDate > cutoffDate;
    });

    // Rewrite log file with only recent logs
    const content = recentLogs.map((log) => JSON.stringify(log)).join('\n') + '\n';
    await fs.writeFile(LOG_FILE, content, 'utf-8');

    console.log(`Cleaned up logs, kept ${recentLogs.length} entries from last ${daysToKeep} days`);
  } catch (error) {
    console.error('Failed to cleanup old logs:', error);
  }
}
