# Newsletter Email Setup Guide

## 🔧 Setup Email Configuration

The newsletter sending feature requires proper Gmail configuration. Follow these steps:

### 1. Create .env File

Create a `.env` file in the root directory with your Gmail credentials:

```env
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
PORT=5000
NODE_ENV=development
```

### 2. Get Gmail App Password

**Important:** You need to use a Gmail App Password, not your regular password!

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Go to **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Enter a name like "Newsletter App"
6. Copy the generated 16-character password
7. Use this password in your `.env` file

### 3. Install Dependencies

```bash
npm install express nodemailer node-cron cors dotenv
```

### 4. Start the Backend

```bash
node newsletter-backend.cjs
```

### 5. Verify Setup

When you start the backend, you should see:

- ✅ Email server is ready to send messages
- ✅ Newsletter backend running on http://localhost:5000

If you see warnings about email configuration, check your `.env` file.

## 🚨 Common Issues & Solutions

### Issue: "Email service not configured"

**Solution:** Create the `.env` file with correct Gmail credentials

### Issue: "Invalid login" or "Authentication failed"

**Solution:**

- Use Gmail App Password, not regular password
- Enable 2-Step Verification on your Google account
- Make sure your Gmail account allows "less secure app access" or use App Password

### Issue: "Network error" or "Connection timeout"

**Solution:**

- Check your internet connection
- Make sure the backend server is running on port 5000
- Verify the frontend is calling the correct URL

### Issue: "Campaign status shows 'stopped'"

**Solution:**

- Check the backend console for detailed error messages
- Verify email configuration in `.env` file
- Test with a simple email first

## 📧 Testing Email Sending

1. Start the backend server
2. Go to Newsletter Campaigns in the admin panel
3. Create a test campaign
4. Select subscribers and click "Start"
5. Check the backend console for sending status
6. Check recipient email inbox

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Use Gmail App Passwords for better security
- Regularly rotate your app passwords
- Consider using environment variables in production

## 📝 Troubleshooting

If emails still don't send:

1. **Check backend logs** for specific error messages
2. **Test Gmail credentials** manually
3. **Verify .env file** is in the correct location
4. **Restart the backend** after making changes
5. **Check Gmail account** for any security blocks

## 🎯 Success Indicators

When everything works correctly:

- Backend shows "✅ Email server is ready to send messages"
- Campaign status changes from "running" to "completed"
- Recipients receive emails in their inbox
- Backend console shows "✅ Newsletter sent successfully"
