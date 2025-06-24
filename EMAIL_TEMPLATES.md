# EmailJS Templates for TransportBook

This document contains the flexible HTML templates you should use in your EmailJS templates.

## Template 1: Authentication Template (template_hzt5pok)
**Use for:** Email verification and password reset

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{email_title}}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; margin-top: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 3px solid #0066cc; }
        .header h1 { color: #0066cc; margin: 0; }
        .content { padding: 30px 0; }
        .otp-section { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: #0066cc; letter-spacing: 5px; font-family: monospace; }
        .temp-password-section { background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; }
        .temp-password { font-size: 24px; font-weight: bold; color: #856404; font-family: monospace; margin: 10px 0; }
        .action-button { background: #0066cc; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; }
        .footer { border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px; }
        .warning { color: #856404; }
        .security-note { color: #0066cc; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🚌 {{company_name}}</h1>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <h2 style="color: #333;">{{email_subject}}</h2>
            <p style="color: #666; font-size: 16px;">{{greeting_message}}</p>
            
            <!-- OTP Section (conditional) -->
            {{#if is_otp}}
            <div class="otp-section">
                <h3 style="color: #333; margin-bottom: 10px;">Your Verification Code</h3>
                <div class="otp-code">{{otp_code}}</div>
                <p style="color: #666; margin-top: 10px; font-size: 14px;">
                    {{expiry_message}}
                </p>
            </div>
            {{/if}}
            
            <!-- Temporary Password Section (conditional) -->
            {{#if is_temp_password}}
            <div class="temp-password-section">
                <h3 class="warning">Temporary Password</h3>
                <p class="warning">Your temporary password is:</p>
                <div class="temp-password">{{temp_password}}</div>
                <p class="warning" style="font-size: 14px;">
                    ⚠️ {{expiry_message}}
                </p>
            </div>
            {{/if}}
            
            <p style="color: #666;">{{main_message}}</p>
            
            <!-- Action Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{action_url}}" class="action-button">{{action_text}}</a>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p>{{support_message}}</p>
            <p>© 2024 {{company_name}}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

### Variables for Authentication Template:
- `{{to_email}}` - Recipient email
- `{{to_name}}` - Recipient name
- `{{email_title}}` - Email title for browser tab
- `{{email_subject}}` - Main heading
- `{{greeting_message}}` - Greeting text
- `{{company_name}}` - Company name (TransportBook)
- `{{is_otp}}` - Boolean to show OTP section
- `{{otp_code}}` - 6-digit verification code
- `{{is_temp_password}}` - Boolean to show temp password section
- `{{temp_password}}` - Temporary password
- `{{main_message}}` - Main email content
- `{{action_url}}` - Button URL
- `{{action_text}}` - Button text
- `{{expiry_message}}` - Expiration warning
- `{{support_message}}` - Support/help text

---

## Template 2: Booking Confirmation Template (template_01nl5co)
**Use for:** Booking confirmations

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation - {{booking_reference}}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 10px; margin-top: 20px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #0066cc, #004499); color: white; padding: 30px; text-align: center; }
        .ref-section { background: #e8f4f8; padding: 20px; text-align: center; border-bottom: 1px solid #ddd; }
        .content { padding: 30px; }
        .route-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .route-details { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .location { text-align: center; flex: 1; }
        .arrow { flex: 0 0 50px; text-align: center; color: #0066cc; font-size: 20px; }
        .price-section { text-align: center; padding-top: 20px; border-top: 1px solid #ddd; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
        .qr-section { text-align: center; margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; }
        .qr-code { background: white; padding: 20px; border-radius: 8px; display: inline-block; }
        .important-info { background: #e3f2fd; padding: 20px; margin: 0 30px; border-radius: 8px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
        .bold { font-weight: bold; }
        .large-price { font-size: 24px; font-weight: bold; color: #0066cc; }
        .ref-code { font-size: 24px; font-weight: bold; color: #333; margin: 10px 0; font-family: monospace; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1 style="margin: 0; font-size: 28px;">🎉 Booking Confirmed!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your journey awaits</p>
        </div>
        
        <!-- Booking Reference -->
        <div class="ref-section">
            <h2 style="color: #0066cc; margin: 0;">Booking Reference</h2>
            <div class="ref-code">{{booking_reference}}</div>
        </div>
        
        <!-- Trip Details -->
        <div class="content">
            <h3 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">Trip Details</h3>
            
            <!-- Route Information -->
            <div class="route-info">
                <div class="route-details">
                    <div class="location">
                        <div style="font-size: 18px; font-weight: bold; color: #333;">{{origin_city}}</div>
                        <div style="color: #666; font-size: 14px;">{{departure_time}}</div>
                    </div>
                    <div class="arrow">→</div>
                    <div class="location">
                        <div style="font-size: 18px; font-weight: bold; color: #333;">{{destination_city}}</div>
                        <div style="color: #666; font-size: 14px;">{{arrival_time}}</div>
                    </div>
                </div>
                
                <div class="price-section">
                    <div class="large-price">RM {{total_amount}}</div>
                    <div style="color: #666; font-size: 14px;">Total Amount</div>
                </div>
            </div>
            
            <!-- Booking Information Grid -->
            <div class="info-grid">
                <div>
                    <h4 style="color: #333; margin-bottom: 15px;">📅 Travel Information</h4>
                    <p style="margin: 5px 0;"><strong>Date:</strong> {{travel_date}}</p>
                    <p style="margin: 5px 0;"><strong>Departure:</strong> {{departure_time}}</p>
                    <p style="margin: 5px 0;"><strong>Vehicle:</strong> {{vehicle_type}}</p>
                    <p style="margin: 5px 0;"><strong>Seats:</strong> {{seat_numbers}}</p>
                </div>
                
                <div>
                    <h4 style="color: #333; margin-bottom: 15px;">👤 Passenger Details</h4>
                    <p style="margin: 5px 0;"><strong>Name:</strong> {{passenger_name}}</p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> {{passenger_email}}</p>
                    <p style="margin: 5px 0;"><strong>Phone:</strong> {{passenger_phone}}</p>
                    <p style="margin: 5px 0;"><strong>Passengers:</strong> {{passenger_count}}</p>
                </div>
            </div>
            
            <!-- QR Code -->
            <div class="qr-section">
                <h4 style="color: #333;">Quick Check-in QR Code</h4>
                <div class="qr-code">
                    <img src="{{qr_code_url}}" alt="QR Code" style="display: block; width: 150px; height: 150px;">
                </div>
                <p style="color: #666; font-size: 12px; margin-top: 10px;">Show this QR code at the terminal for quick check-in</p>
            </div>
        </div>
        
        <!-- Important Information -->
        <div class="important-info">
            <h4 style="color: #1976d2; margin-bottom: 15px;">📋 Important Information</h4>
            <ul style="color: #333; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">{{checkin_instructions}}</li>
                <li style="margin-bottom: 8px;">Bring a valid ID for boarding verification</li>
                <li style="margin-bottom: 8px;">{{cancellation_policy}}</li>
                <li style="margin-bottom: 8px;">Keep this booking reference for your records</li>
            </ul>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p style="margin: 5px 0;">{{contact_support}}</p>
            <p style="margin: 5px 0;">© 2024 {{company_name}}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

### Variables for Booking Template:
- `{{to_email}}` - Recipient email
- `{{to_name}}` - Recipient first name
- `{{booking_reference}}` - Booking reference number
- `{{origin_city}}` - Departure city
- `{{destination_city}}` - Arrival city
- `{{departure_time}}` - Departure time
- `{{arrival_time}}` - Arrival time
- `{{travel_date}}` - Travel date
- `{{total_amount}}` - Total price
- `{{vehicle_type}}` - Vehicle type
- `{{seat_numbers}}` - Seat numbers (comma-separated)
- `{{passenger_name}}` - Passenger full name
- `{{passenger_email}}` - Passenger email
- `{{passenger_phone}}` - Passenger phone
- `{{passenger_count}}` - Number of passengers
- `{{company_name}}` - Company name (TransportBook)
- `{{support_email}}` - Support email
- `{{qr_code_url}}` - QR code image URL
- `{{checkin_instructions}}` - Check-in instructions
- `{{cancellation_policy}}` - Cancellation policy
- `{{contact_support}}` - Support contact info

---

## Setup Instructions

1. **Login to EmailJS Dashboard**: Go to https://dashboard.emailjs.com/
2. **Create Templates**: 
   - Copy the HTML from Template 1 into template_hzt5pok
   - Copy the HTML from Template 2 into template_01nl5co
3. **Test Templates**: Use the EmailJS test feature to ensure templates render correctly
4. **Verify Variables**: Make sure all template variables are properly mapped

## Usage Examples

### Email Verification Example:
```javascript
const templateParams = {
  to_email: 'user@example.com',
  to_name: 'John',
  email_title: 'Email Verification - TransportBook',
  email_subject: 'Verify Your Email Address',
  greeting_message: 'Hi John,',
  company_name: 'TransportBook',
  is_otp: 'true',
  otp_code: '123456',
  main_message: 'Welcome to TransportBook! Please enter this verification code to complete your account setup.',
  action_url: 'https://yoursite.com/verify-email',
  action_text: 'Verify Email',
  expiry_message: 'This verification code expires in 15 minutes for security purposes.',
  support_message: 'If you didn\'t create an account with us, please ignore this email.'
};
```

### Password Reset Example:
```javascript
const templateParams = {
  to_email: 'user@example.com',
  to_name: 'John',
  email_title: 'Password Reset - TransportBook',
  email_subject: 'Your Temporary Password',
  greeting_message: 'Hi John,',
  company_name: 'TransportBook',
  is_temp_password: 'true',
  temp_password: 'TempPass123',
  main_message: 'You requested a password reset. Use this temporary password to log in.',
  action_url: 'https://yoursite.com/login',
  action_text: 'Log In Now',
  expiry_message: 'This temporary password expires in 30 minutes for security purposes.',
  support_message: 'If you didn\'t request a password reset, please contact our support team immediately.'
};
``` 