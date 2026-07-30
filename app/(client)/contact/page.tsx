// app/contact/page.tsx
"use client";

import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Navigation,
  ExternalLink
} from 'lucide-react';

// Types
type FormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type FormErrors = {
  [K in keyof FormData]?: string;
};

type StoreLocation = {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  hours: string;
  coordinates: string;
  mapsUrl: string;
  embedUrl: string;
};

const ContactPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const storeLocations: StoreLocation[] = [
    {
      id: 1,
      name: "Fundgrube Aßweiler",
      address: "Aßweiler",
      city: "Aßweiler, Germany",
      phone: "+4917632853448",
      email: "assweiler@fundgrube.com",
      hours: "Mon-Sat: 9:00 - 20:00",
      coordinates: "49.2134, 7.1801",
      mapsUrl: "https://www.google.com/maps?q=Fundgrube+Sonderpostenmarkt+A%C3%9Fweiler",
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2606.322878516748!2d7.1800750767101915!3d49.2134034756573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4795cdce6b678f33%3A0x302e33a329f835f9!2sFundgrube%20Sonderpostenmarkt%2C%20Blumen%2C%20Gartencenter%2C%20A%C3%9Fweiler!5e0!3m2!1sen!2sin!4v1785411348624!5m2!1sen!2sin"
    },
    {
      id: 2,
      name: "Best Preis Blieskastel",
      address: "Blieskastel",
      city: "Blieskastel, Germany",
      phone: "+4917632853448",
      email: "blieskastel@fundgrube.com",
      hours: "Mon-Sat: 9:00 - 20:00",
      coordinates: "49.2472, 7.3632",
      mapsUrl: "https://www.google.com/maps?q=Best+Preis+Textil+Schreibware+Baumarkt+Blieskastel",
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2604.5416189021976!2d7.363204976711802!3d49.24717927326737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4795d123d15c4abb%3A0xad008301e167ed7!2sBest%20Preis%20Textil%20Schreibware%20Baumarkt%20Artikel!5e0!3m2!1sen!2sin!4v1785411367261!5m2!1sen!2sin"
    }
  ];

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.length > 1000) {
      newErrors.message = 'Message cannot exceed 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission - Updated to use API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Send data to your API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      // Success
      setSubmitStatus('success');
      setSubmitMessage('Thank you for your message! We will get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Quick contact options
  const contactOptions = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Mon-Sat from 9am to 8pm",
      action: "+4917632853448",
      link: "tel:+4917632853448",
      color: "bg-blue-50 border-blue-200 text-blue-600"
    },
    {
      icon: Mail,
      title: "Email Us",
      description: "We'll respond within 24h",
      action: "info@fundgrube.com",
      link: "mailto:info@fundgrube.com",
      color: "bg-emerald-50 border-emerald-200 text-emerald-600"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Two convenient locations",
      action: "Get Directions",
      link: "#stores",
      color: "bg-purple-50 border-purple-200 text-purple-600"
    }
  ];

  // Social media links
  const socialLinks = [
    { icon: Facebook, name: 'Facebook', url: '#' },
    { icon: Instagram, name: 'Instagram', url: '#' },
    { icon: Youtube, name: 'YouTube', url: '#' },
    { icon: Twitter, name: 'Twitter', url: '#' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-shop_light_green to-emerald-600 text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl">
              Have questions about our products or services? We'd love to hear from you. 
              Reach out through any of the channels below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Options Cards */}
      <section className="container mx-auto px-4 max-w-7xl -mt-8 relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          {contactOptions.map((option, index) => (
            <a
              key={index}
              href={option.link}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex items-start gap-4 border border-slate-100 hover:border-shop_light_green/30 hover:-translate-y-1"
            >
              <div className={`p-3 rounded-xl ${option.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors flex-shrink-0`}>
                <option.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 group-hover:text-shop_light_green transition-colors">
                  {option.title}
                </h3>
                <p className="text-sm text-slate-500">{option.description}</p>
                <p className="text-sm font-medium text-slate-700 mt-1 group-hover:text-shop_light_green transition-colors">
                  {option.action}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Main Contact Form & Info Section */}
      <section className="container mx-auto px-4 max-w-7xl py-12 md:py-20">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Send us a Message</h2>
                <p className="text-slate-500 mt-2">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              {/* Success/Error Message */}
              {submitStatus !== 'idle' && (
                <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
                  submitStatus === 'success' 
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {submitStatus === 'success' ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm">{submitMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.name ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:border-shop_light_green'
                      } focus:ring-2 focus:ring-shop_light_green/20 focus:outline-none transition-colors bg-slate-50/50`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.email ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:border-shop_light_green'
                      } focus:ring-2 focus:ring-shop_light_green/20 focus:outline-none transition-colors bg-slate-50/50`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:border-shop_light_green'
                    } focus:ring-2 focus:ring-shop_light_green/20 focus:outline-none transition-colors bg-slate-50/50`}
                    placeholder="+4917632853448"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.subject ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:border-shop_light_green'
                    } focus:ring-2 focus:ring-shop_light_green/20 focus:outline-none transition-colors bg-slate-50/50`}
                    placeholder="How can we help you?"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.message ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:border-shop_light_green'
                    } focus:ring-2 focus:ring-shop_light_green/20 focus:outline-none transition-colors bg-slate-50/50 resize-none`}
                    placeholder="Write your message here..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.message}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-slate-400">
                    {formData.message.length}/1000 characters
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-shop_light_green hover:bg-shop_light_green/90 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Store Hours */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-shop_light_green/10">
                  <Clock className="w-5 h-5 text-shop_light_green" />
                </div>
                <h3 className="font-semibold text-slate-800">Store Hours</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Monday - Saturday</span>
                  <span className="font-medium text-slate-800">9:00 - 20:00</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Sunday</span>
                  <span className="font-medium text-slate-800">Closed</span>
                </div>
              </div>
            </div>

            {/* Quick Response */}
            <div className="bg-gradient-to-br from-shop_light_green/10 to-emerald-50 rounded-2xl p-6 border border-shop_light_green/20">
              <h4 className="font-semibold text-slate-800 mb-2">Quick Response</h4>
              <p className="text-sm text-slate-600">
                We typically respond within 24 hours during business days.
              </p>
              <div className="mt-4 flex gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/80 rounded-full text-xs font-medium text-slate-700">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  Fast reply
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/80 rounded-full text-xs font-medium text-slate-700">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  Friendly support
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-4">Connect With Us</h3>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-50 hover:bg-shop_light_green/10 text-slate-600 hover:text-shop_light_green transition-all duration-300 hover:scale-110"
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Locations Section */}
      <section id="stores" className="bg-slate-50 py-16 md:py-20 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Our Store Locations
            </h2>
            <p className="text-slate-500">
              Visit us at one of our convenient locations. We'd love to serve you in person!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {storeLocations.map((location) => (
              <div
                key={location.id}
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 group"
              >
                <div className="relative h-64">
                  <iframe
                    src={location.embedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title={location.name}
                    className="w-full"
                  />
                  <a
                    href={location.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 bg-white/95 hover:bg-white text-slate-800 px-4 py-2 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 border border-slate-200 hover:border-shop_light_green"
                  >
                    <Navigation className="w-4 h-4 text-shop_light_green" />
                    Get Directions
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {location.name}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2 text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span>{location.city}</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <a href={`tel:${location.phone}`} className="hover:text-shop_light_green transition-colors">
                        {location.phone}
                      </a>
                    </div>
                    <div className="flex items-start gap-2 text-slate-600">
                      <Mail className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <a href={`mailto:${location.email}`} className="hover:text-shop_light_green transition-colors">
                        {location.email}
                      </a>
                    </div>
                    <div className="flex items-start gap-2 text-slate-600">
                      <Clock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span>{location.hours}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 max-w-7xl py-16 md:py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500">
            Find quick answers to the most common questions our customers ask.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {[
            {
              q: "What are your store hours?",
              a: "Our stores are open Monday through Saturday from 9:00 AM to 8:00 PM. We are closed on Sundays."
            },
            {
              q: "Do you offer online shopping?",
              a: "Yes! You can browse our products online and place orders for pickup or delivery. Visit our shop section to get started."
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept cash, credit/debit cards (Visa, Mastercard, American Express), and mobile payments (Apple Pay, Google Pay)."
            },
            {
              q: "Can I return or exchange items?",
              a: "Yes, we offer a 30-day return policy for most items. Please bring your receipt and the original packaging for a smooth return process."
            },
            {
              q: "Do you offer gift cards?",
              a: "Absolutely! Our gift cards are available in various denominations and can be purchased at any of our store locations."
            }
          ].map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-slate-100"
            >
              <h4 className="font-semibold text-slate-800 mb-2">
                {faq.q}
              </h4>
              <p className="text-slate-600 text-sm">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ContactPage;