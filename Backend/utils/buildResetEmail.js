export const resetPasswordSubject = "Password Reset Request - BizPilot AI";

export const buildResetEmail = (fullName, resetLink) => {
  const name = fullName || "Merchant";
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 560px; margin: 0 auto; padding: 30px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; color: #1e293b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #2563eb; font-size: 24px; font-weight: 800; margin: 0;">BizPilot AI</h2>
        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Smart Business Operating System</p>
      </div>

      <div style="border-top: 1px solid #f1f5f9; padding-top: 20px;">
        <p style="font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 12px;">Hello ${name},</p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
          You recently requested to reset your account password for your BizPilot AI workspace. Click the button below to set a new password:
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetLink}" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; font-size: 14px; font-weight: 700; border-radius: 10px; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">
            Reset New Password
          </a>
        </div>

        <p style="font-size: 12px; line-height: 1.5; color: #64748b; margin-top: 24px;">
          If the button doesn't work, copy and paste this link into your web browser:<br>
          <a href="${resetLink}" style="color: #2563eb; word-break: break-all;">${resetLink}</a>
        </p>

        <p style="font-size: 12px; color: #94a3b8; margin-top: 24px;">
          <strong>Note:</strong> This password reset link will expire in <strong>15 minutes</strong>. If you did not request a password reset, please ignore this email.
        </p>
      </div>

      <div style="border-top: 1px solid #f1f5f9; margin-top: 28px; padding-top: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
        <p style="margin: 0;">&copy; 2026 BizPilot AI. All rights reserved.</p>
      </div>
    </div>
  `;
};