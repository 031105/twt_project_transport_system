import emailjs from '@emailjs/browser';

class EmailService {
  constructor() {
    this.serviceId = 'service_zdk8m9i';
    this.publicKey = 'M0mQX4l49-XmuzBLw';
    this.templates = {
      validation: 'template_hzt5pok', // For OTP verification and password reset
      booking: 'template_01nl5co'     // For booking confirmations
    };
    
    // Initialize EmailJS
    emailjs.init(this.publicKey);
  }

  /**
   * Send OTP for email verification during signup
   */
  async sendEmailVerification(email, firstName, otpCode) {
    const templateParams = {
      to_email: email,
      to_name: firstName,
      email_title: 'Email Verification - TransportBook',
      email_subject: 'Verify Your Email Address',
      greeting_message: `Hi ${firstName},`,
      email_type: 'verification',
      is_otp: 'true',
      otp_code: otpCode,
      verification_code: otpCode, // Alternative parameter name
      main_message: `Welcome to TransportBook! Please enter this verification code to complete your account setup and start booking your journeys.

Your verification code: ${otpCode}`,
      action_text: 'Verify Email',
      action_url: `${window.location.origin}/verify-email`,
      expiry_message: 'This verification code expires in 15 minutes for security purposes.',
      support_message: 'If you didn\'t create an account with us, please ignore this email.',
      company_name: 'TransportBook'
    };

    console.log('Sending email verification with OTP code:', otpCode);
    console.log('Full template params:', templateParams);
    return this.sendEmail(this.templates.validation, templateParams);
  }

  /**
   * Send temporary password for password reset
   */
  async sendTempPassword(email, firstName, tempPassword) {
    const templateParams = {
      to_email: email,
      to_name: firstName,
      email_title: 'Password Reset - TransportBook',
      email_subject: 'Your Temporary Password',
      greeting_message: `Hi ${firstName},`,
      email_type: 'password_reset',
      is_temp_password: 'true',
      temp_password: tempPassword,
      temporary_password: tempPassword, // Alternative parameter name
      main_message: `You requested a password reset for your TransportBook account. Use this temporary password to log in and then update your password immediately.

Your temporary password: ${tempPassword}

This password expires in 30 minutes for security purposes.`,
      action_text: 'Log In Now',
      action_url: `${window.location.origin}/login`,
      expiry_message: 'This temporary password expires in 30 minutes for security purposes.',
      support_message: 'If you didn\'t request a password reset, please contact our support team immediately.',
      company_name: 'TransportBook'
    };

    console.log('Sending temp password with params:', tempPassword);
    console.log('Full template params:', templateParams);
    return this.sendEmail(this.templates.validation, templateParams);
  }

  /**
   * Send booking confirmation email
   */
  async sendBookingConfirmation(bookingData) {
    const {
      passenger_email,
      passenger_name,
      passenger_phone,
      booking_reference,
      trip,
      total_amount,
      travel_date,
      seat_numbers,
      passenger_count
    } = bookingData;

    const templateParams = {
      to_email: passenger_email,
      to_name: passenger_name.split(' ')[0], // First name
      booking_reference: booking_reference,
      
      // Trip details
      origin_city: trip.origin_city || trip.originLocation?.city || 'Origin',
      destination_city: trip.destination_city || trip.destinationLocation?.city || 'Destination',
      departure_time: this.formatTime(trip.departure_time || trip.departureDatetime),
      arrival_time: this.formatTime(trip.arrival_time || trip.estimatedArrivalDatetime || trip.arrivalDatetime),
      travel_date: this.formatDate(travel_date || trip.departureDatetime),
      
      // Booking details
      total_amount: parseFloat(total_amount).toFixed(2),
      vehicle_type: trip.vehicle_type || trip.vehicleType?.name || 'Luxury Coach',
      seat_numbers: Array.isArray(seat_numbers) ? seat_numbers.join(', ') : seat_numbers || 'Assigned',
      
      // Passenger details
      passenger_name: passenger_name,
      passenger_email: passenger_email,
      passenger_phone: passenger_phone || 'Not provided',
      passenger_count: passenger_count || 1,
      
      // Additional info
      company_name: 'TransportBook',
      support_email: 'support@transportbook.com',
      qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking_reference}`,
      
      // Instructions
      checkin_instructions: 'Please arrive at the terminal at least 15 minutes before departure time.',
      cancellation_policy: 'Free cancellation up to 24 hours before departure.',
      contact_support: 'For any assistance, contact us at support@transportbook.com'
    };

    console.log('Sending booking confirmation with params:', templateParams);
    return this.sendEmail(this.templates.booking, templateParams);
  }

  /**
   * Core email sending method
   */
  async sendEmail(templateId, templateParams) {
    try {
      console.log(`Sending email using template: ${templateId}`);
      console.log('Service ID:', this.serviceId);
      console.log('Template params:', templateParams);
      
      const result = await emailjs.send(
        this.serviceId,
        templateId,
        templateParams,
        this.publicKey
      );
      
      console.log('Email sent successfully:', result);
      return { 
        success: true, 
        data: result,
        message: 'Email sent successfully'
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send email',
        details: error
      };
    }
  }

  /**
   * Utility methods for formatting
   */
  formatTime(dateTimeString) {
    if (!dateTimeString) return 'TBD';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('en-MY', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'TBD';
    }
  }

  formatDate(dateString) {
    if (!dateString) return 'TBD';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-MY', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      });
    } catch (error) {
      return 'TBD';
    }
  }

  /**
   * Generate a secure 6-digit OTP
   */
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Generate a secure temporary password
   */
  generateTempPassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}

export default new EmailService(); 