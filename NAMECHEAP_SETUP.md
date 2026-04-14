# Namecheap Private Email Setup for Noise Mate

## Step 1: Get Your Email Password

### Option A: Login to Namecheap Dashboard
1. Go to https://www.namecheap.com and login
2. Go to **Account → Email Settings**
3. Click on your email (forms@noisemate.co.uk)
4. You'll see your configured password (or reset it if needed)

### Option B: Reset Password (if you don't have it)
1. Login to https://privateemail.com
2. Click **Settings** → **Change Password**
3. Enter and confirm your new password

## Step 2: Create .env File

Create a file named `.env` in the same directory as `backend.py`:

```env
ADMIN_EMAIL=forms@noisemate.co.uk
SMTP_SERVER=mail.privateemail.com
SMTP_PORT=587
SENDER_EMAIL=forms@noisemate.co.uk
SENDER_PASSWORD=your-actual-password
```

Replace `your-actual-password` with your actual Namecheap email password.

## Step 3: Install Python Dependencies

```bash
pip install flask flask-cors python-dotenv
```

## Step 4: Run the Backend

```bash
python backend.py
```

You should see:
```
* Running on http://127.0.0.1:5000
```

## Step 5: Test the Form

1. Open http://localhost:8000 in your browser
2. Scroll to "Join the Noise Mate Waitlist" form
3. Fill in the form with test data
4. Click "Join Waitlist"
5. You should see a success message
6. Check your email (forms@noisemate.co.uk) for test submission

## Troubleshooting

### "Connection refused" or "timed out"
- Check that SMTP_SERVER is: `mail.privateemail.com`
- Check that SMTP_PORT is: `587`
- Ping the server: `ping mail.privateemail.com`

### "Authentication failed" / "Invalid credentials"
- Double-check your password in the .env file
- Make sure there are no spaces before/after the password
- Try resetting your password in privateemail.com

### "SSL/TLS connection error"
- Verify SMTP_PORT is 587 (not 465)
- Make sure python-dotenv is installed

### Still having issues?
Email support@noisemate.co.uk or check your Namecheap email settings

## Email Flow

When someone submits the form:

1. **User receives**: Confirmation email to their address
   - Subject: "Welcome to Noise Mate Waitlist! 🎵"
   - From: forms@noisemate.co.uk
   - Content: Thank you message + next steps

2. **Admin receives**: Notification to forms@noisemate.co.uk
   - Subject: "New Waitlist Signup - [First Name]"
   - Content: Full submission details (name, email, source, message, timestamp)

## Important Security Notes

- **Never** commit .env file to Git (it's already in .gitignore)
- Keep your password secret
- For production, use environment variables instead of files
- Consider rotating password periodically

## Next Steps

Once the backend is working:
- Deploy to production (Heroku, AWS, DigitalOcean, etc.)
- Set up database to store submissions
- Configure monitoring/logging
- Add rate limiting to prevent spam

Need help? Check the main FORM_SETUP.md file for more details.
