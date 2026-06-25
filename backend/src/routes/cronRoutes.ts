import { Router, Request, Response } from 'express';

const router = Router();

router.get('/remind-timesheets', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (process.env.NODE_ENV === 'production' && !process.env.CRON_SECRET) {
      console.error('CRON_SECRET is not defined in environment variables.');
      return res.status(500).json({ error: 'Configuration Error' });
    }

    if (
      process.env.NODE_ENV === 'production' &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!slackWebhookUrl) {
      console.warn('CRON: SLACK_WEBHOOK_URL is not defined.');
      return res.status(500).json({ error: 'Webhook URL not configured' });
    }

    const message = {
      text: "Hey team, it's 5:45 PM! Don't forget to submit your timesheet before logging off: https://sprintos.innonsh.com/signin"
    };

    const response = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      throw new Error(`Slack API responded with ${response.status}`);
    }

    console.log('CRON: Slack timesheet reminder sent successfully.');
    res.status(200).json({ success: true, message: 'Reminder sent' });
  } catch (error) {
    console.error('CRON Error sending reminder:', error);
    res.status(500).json({ error: 'Failed to send reminder' });
  }
});

export default router;
