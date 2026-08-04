import { SendLoginNotificationMailParams } from '../email.types';

export const getLoginAlertTemplate = (params: SendLoginNotificationMailParams): string => {
  const {
    userName,
    userEmail,
    userRole,
    department,
    loginTime,
    ipAddress,
    deviceName,
    userAgent,
  } = params;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>User Login Alert - Innonsh SprintOS</title>
    <style>
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        background-color: #0f172a;
        margin: 0;
        padding: 40px 16px;
        color: #f8fafc;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #1e293b;
        border-radius: 12px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        border: 1px solid #334155;
      }
      .header {
        background: linear-gradient(135deg, #4f46e5 0%, #312e81 100%);
        padding: 32px 40px;
        text-align: left;
      }
      .brand {
        font-size: 20px;
        font-weight: 800;
        color: #ffffff;
        letter-spacing: -0.02em;
      }
      .badge {
        display: inline-block;
        margin-top: 10px;
        padding: 4px 12px;
        background-color: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.25);
        border-radius: 20px;
        color: #e0e7ff;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      .content {
        padding: 36px 40px;
      }
      .title {
        font-size: 22px;
        font-weight: 700;
        color: #ffffff;
        margin: 0 0 12px 0;
      }
      .subtitle {
        font-size: 14px;
        color: #94a3b8;
        margin: 0 0 28px 0;
        line-height: 1.5;
      }
      .user-card {
        background-color: #0f172a;
        border: 1px solid #334155;
        border-radius: 8px;
        padding: 20px 24px;
        margin-bottom: 24px;
      }
      .user-name {
        font-size: 18px;
        font-weight: 700;
        color: #6366f1;
        margin-bottom: 4px;
      }
      .user-email {
        font-size: 14px;
        color: #cbd5e1;
      }
      .meta-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #1e293b;
      }
      .label {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #64748b;
        font-weight: 600;
        margin-bottom: 4px;
      }
      .value {
        font-size: 14px;
        color: #e2e8f0;
        font-weight: 500;
      }
      .agent-box {
        background-color: #0f172a;
        border: 1px solid #334155;
        border-radius: 8px;
        padding: 16px 20px;
        font-family: monospace;
        font-size: 12px;
        color: #94a3b8;
        word-break: break-all;
      }
      .footer {
        padding: 24px 40px;
        background-color: #0f172a;
        border-top: 1px solid #334155;
        text-align: center;
        color: #64748b;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="brand">Innonsh SprintOS</div>
        <div class="badge">Security & Access Notification</div>
      </div>
      <div class="content">
        <div class="title">User Authentication Event</div>
        <div class="subtitle">
          A monitored team member has successfully logged into the SprintOS platform. Below are the details of this session.
        </div>

        <div class="user-card">
          <div class="user-name">${userName}</div>
          <div class="user-email">${userEmail}</div>
          
          <div class="meta-grid">
            <div>
              <div class="label">Role</div>
              <div class="value">${userRole}</div>
            </div>
            <div>
              <div class="label">Department</div>
              <div class="value">${department}</div>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 24px;">
          <div class="user-card" style="margin-bottom: 0;">
            <div class="label">Timestamp</div>
            <div class="value" style="margin-bottom: 12px;">${loginTime}</div>
            
            <div class="meta-grid">
              <div>
                <div class="label">IP Address</div>
                <div class="value">${ipAddress || 'Unknown'}</div>
              </div>
              <div>
                <div class="label">Device / OS</div>
                <div class="value">${deviceName}</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="label" style="margin-bottom: 8px;">User Agent Details</div>
          <div class="agent-box">${userAgent || 'N/A'}</div>
        </div>
      </div>
      <div class="footer">
        Automated Security Notification &bull; Innonsh SprintOS Operations &bull; ${new Date().getFullYear()}
      </div>
    </div>
  </body>
  </html>
  `;
};
