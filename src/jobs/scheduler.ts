import cron from 'node-cron';
import { CleanupTokensJob } from './CleanupTokensJob';

export function startScheduledJobs(): void {
  console.log('📅 Starting scheduled jobs...');

  cron.schedule('0 2 * * *', async () => {
    console.log('🔄 Running token cleanup job...');

    try {
      const job = new CleanupTokensJob();
      await job.run();
    } catch (error) {
      console.error('❌ Token cleanup failed:', error);
    }
  });
}

export function stopScheduledJobs(): void {
  console.log('🛑 Stopping scheduled jobs...');

  cron.getTasks().forEach((task: { stop: () => any }) => task.stop());
}
