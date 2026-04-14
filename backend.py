"""
Simple Flask backend for Noise Mate waitlist form handling
Install dependencies: pip install flask flask-cors python-dotenv
Set environment variables for email configuration (SMTP details)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configuration
ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', 'forms@noisemate.co.uk')
SMTP_SERVER = os.getenv('SMTP_SERVER', 'mail.privateemail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
SENDER_EMAIL = os.getenv('SENDER_EMAIL', 'forms@noisemate.co.uk')
SENDER_PASSWORD = os.getenv('SENDER_PASSWORD', 'your-namecheap-password')

# Store submissions (in production, use a database)
submissions = []


def send_email(to_email, subject, html_content):
    """Send email using SMTP"""
    try:
        message = MIMEMultipart('alternative')
        message['Subject'] = subject
        message['From'] = SENDER_EMAIL
        message['To'] = to_email

        part = MIMEText(html_content, 'html')
        message.attach(part)

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, to_email, message.as_string())

        return True
    except Exception as e:
        print(f"Email sending error: {e}")
        return False


@app.route('/api/waitlist', methods=['POST'])
def waitlist():
    """Handle waitlist signup"""
    try:
        data = request.json

        # Validate required fields
        if not data.get('firstName') or not data.get('email') or not data.get('source'):
            return jsonify({'error': 'Missing required fields'}), 400

        # Store submission
        submission = {
            'firstName': data.get('firstName'),
            'lastName': data.get('lastName', ''),
            'email': data.get('email'),
            'source': data.get('source'),
            'message': data.get('message', ''),
            'timestamp': data.get('timestamp')
        }
        submissions.append(submission)

        # Send confirmation email to user
        user_html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #164c78;">Welcome to Noise Mate! 🎵</h2>
                <p>Hi {data.get('firstName')},</p>
                <p>Thank you for joining the Noise Mate waitlist! We're excited to have you on board.</p>
                <p>You'll be among the first to know when we launch. In the meantime, stay updated with our latest news and feature announcements.</p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 2rem 0;">
                <p><strong>How you found us:</strong> {data.get('source')}</p>
                <p style="color: #666; font-size: 0.9rem;">Questions? Email us at support@noisemate.co.uk</p>
                <p style="color: #999; font-size: 0.85rem;">© 2026 Noise Mate. All rights reserved.</p>
            </body>
        </html>
        """

        send_email(data.get('email'), 'Welcome to Noise Mate Waitlist! 🎵', user_html)

        # Send notification to admin
        admin_html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <h2>New Waitlist Signup</h2>
                <p><strong>Name:</strong> {data.get('firstName')} {data.get('lastName', '')}</p>
                <p><strong>Email:</strong> {data.get('email')}</p>
                <p><strong>Source:</strong> {data.get('source')}</p>
                <p><strong>Message:</strong> {data.get('message', 'N/A')}</p>
                <p><strong>Timestamp:</strong> {data.get('timestamp')}</p>
            </body>
        </html>
        """

        send_email(ADMIN_EMAIL, f'New Waitlist Signup - {data.get("firstName")}', admin_html)

        return jsonify({
            'success': True,
            'message': 'Successfully joined the waitlist!'
        }), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/send-email', methods=['POST'])
def send_email_endpoint():
    """Send custom email"""
    try:
        data = request.json
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #2563EB;">Thank you for joining Noise Mate!</h2>
                <p>Hi {data.get('name')},</p>
                <p>Welcome to our waitlist. We'll keep you updated as we approach launch.</p>
                <p style="color: #999; font-size: 0.85rem;">© 2026 Noise Mate</p>
            </body>
        </html>
        """
        
        success = send_email(data.get('to'), 'Noise Mate Waitlist Confirmation', html_content)
        
        if success:
            return jsonify({'success': True}), 200
        else:
            return jsonify({'error': 'Failed to send email'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/submissions', methods=['GET'])
def get_submissions():
    """Get all submissions (admin only - add authentication in production)"""
    return jsonify({'submissions': submissions}), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)
