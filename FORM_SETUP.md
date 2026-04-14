# Noise Mate Waitlist Form - Backend Setup Guide

## Overview
The waitlist form is now fully functional with both frontend and backend components.

## Frontend (index.html)
- Form validation
- Error/success messages
- Smooth UX with loading states

## Backend Setup (backend.py)

### 1. Install Dependencies
```bash
pip install flask flask-cors python-dotenv
```

### 2. Configure Email Settings
Create a `.env` file in the same directory as `backend.py`:

```env
ADMIN_EMAIL=forms@noisemate.co.uk
SMTP_SERVER=mail.privateemail.com
SMTP_PORT=587
SENDER_EMAIL=forms@noisemate.co.uk
SENDER_PASSWORD=your-namecheap-password
```

**For Namecheap Private Email (Recommended):**
- SMTP Server: `mail.privateemail.com`
- SMTP Port: `587`
- Email: `forms@noisemate.co.uk`
- Password: Your Namecheap email password
- See [NAMECHEAP_SETUP.md](NAMECHEAP_SETUP.md) for detailed instructions

### 3. Run the Backend Server
```bash
python backend.py
```

The server will start on `http://localhost:5000`

### 4. Alternative: Use a Third-Party Service

Instead of running your own backend, you can use:

**Option A: Formspree**
- No backend setup needed
- Visit https://formspree.io
- Create a form, get a form ID
- Replace the form action in HTML

**Option B: EmailJS**
- Frontend-only solution
- Visit https://www.emailjs.com
- Get API keys
- Add EmailJS script to HTML

### Current Configuration
The form will:
1. Validate required fields (First Name, Email, How You Heard)
2. Send data to `/api/waitlist` endpoint
3. Send confirmation email to user
4. Send notification to admin
5. Return success/error message to user

### API Endpoints

**POST /api/waitlist**
- Accepts: JSON with firstName, lastName, email, source, message
- Returns: Success response or error
- Side effects: Sends 2 emails (user confirmation + admin notification)

**POST /api/send-email**
- Accepts: JSON with to, name, source, message
- Returns: Success response or error

**GET /api/submissions**
- Returns: List of all submissions (no auth - add in production!)

### Production Deployment

For production, consider:
1. **Database:** Store submissions in PostgreSQL, MongoDB, or Firebase
2. **Email Service:** Use SendGrid, Mailgun, or Twilio SendGrid
3. **Authentication:** Add API key validation
4. **Rate Limiting:** Prevent spam submissions
5. **CORS:** Configure proper CORS headers
6. **HTTPS:** Always use HTTPS in production

### Example Deployment on Heroku

```bash
# Install Heroku CLI
heroku login
heroku create noise-mate-backend
heroku config:set ADMIN_EMAIL="..."
heroku config:set SENDER_EMAIL="..."
heroku config:set SENDER_PASSWORD="..."
git push heroku main
```

### Testing the Form

1. Ensure backend is running: `python backend.py`
2. Open http://localhost:8000 (your website)
3. Scroll to waitlist form
4. Fill in the form
5. Submit and check for success message
6. Check email inbox for confirmation

## Troubleshooting

**Form submission fails:**
- Check browser console for errors (F12)
- Ensure backend is running on port 5000
- Check CORS configuration

**No emails received:**
- Verify SMTP credentials
- Check spam/junk folder
- Check backend logs for errors

**CORS errors:**
- Ensure `flask-cors` is installed
- Check CORS settings match your domain

Need help? Email support@noisemate.co.uk
