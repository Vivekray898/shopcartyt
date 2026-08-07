// app/contact/ContactClient.tsx
"use client";

import React, { useState } from "react";
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
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

// Types
type ContactData = {
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: any;
  contactOptions: Array<{
    title: string;
    description: string;
    actionText: string;
    link: string;
    icon: string;
    color: string;
  }>;
  formTitle: string;
  formSubtitle: string;
  formSuccessMessage: string;
  formErrorMessage: string;
  sidebarTitle: string;
  openingHours: Array<{ day: string; time: string }>;
  quickResponseText: string;
  socialTitle: string;
  locationsTitle: string;
  locationsSubtitle: string;
  locations: Array<{
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    hours: string;
    coordinates: string;
    mapsUrl: string;
    embedUrl: string;
    image?: any;
  }>;
  faqTitle: string;
  faqSubtitle: string;
  faqs: Array<{ question: string; answer: string }>;
};

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

const iconMap = {
  phone: Phone,
  email: Mail,
  map: MapPin,
  clock: Clock,
};

const colorMap = {
  blue: "bg-blue-50 border-blue-200 text-blue-600",
  green: "bg-emerald-50 border-emerald-200 text-emerald-600",
  purple: "bg-purple-50 border-purple-200 text-purple-600",
  orange: "bg-orange-50 border-orange-200 text-orange-600",
  red: "bg-red-50 border-red-200 text-red-600",
};

interface ContactClientProps {
  data: ContactData;
}

export default function ContactClient({ data }: ContactClientProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [submitMessage, setSubmitMessage] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name ist erforderlich";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name muss mindestens 2 Zeichen lang sein";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-Mail ist erforderlich";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein";
    }

    if (formData.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = "Bitte geben Sie eine gültige Telefonnummer ein";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Betreff ist erforderlich";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Nachricht ist erforderlich";
    } else if (formData.message.length < 10) {
      newErrors.message = "Nachricht muss mindestens 10 Zeichen lang sein";
    } else if (formData.message.length > 1000) {
      newErrors.message = "Nachricht darf 1000 Zeichen nicht überschreiten";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Formularübermittlung fehlgeschlagen");
      }

      setSubmitStatus("success");
      setSubmitMessage(data.formSuccessMessage);

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
      setSubmitMessage(data.formErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const socialLinks = [
    { icon: Facebook, name: "Facebook", url: "#" },
    { icon: Instagram, name: "Instagram", url: "#" },
    { icon: Youtube, name: "YouTube", url: "#" },
    { icon: Twitter, name: "Twitter", url: "#" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-shop_light_green to-emerald-600 text-white py-16 md:py-24">
        {data.heroImage && (
          <div className="absolute inset-0">
            <Image
              src={urlFor(data.heroImage).url()}
              alt={data.heroTitle}
              fill
              className="object-cover opacity-20"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {data.heroTitle}
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl">
              {data.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Options Cards */}
      <section className="container mx-auto px-4 max-w-7xl -mt-8 relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          {data.contactOptions.map((option, index) => {
            const Icon = iconMap[option.icon as keyof typeof iconMap] || Phone;
            const colorClass =
              colorMap[option.color as keyof typeof colorMap] || colorMap.blue;

            return (
              <a
                key={index}
                href={option.link}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex items-start gap-4 border border-slate-100 hover:border-shop_light_green/30 hover:-translate-y-1"
              >
                <div
                  className={`p-3 rounded-xl ${colorClass} bg-opacity-10 group-hover:bg-opacity-20 transition-colors flex-shrink-0`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 group-hover:text-shop_light_green transition-colors">
                    {option.title}
                  </h3>
                  <p className="text-sm text-slate-500">{option.description}</p>
                  {option.actionText && (
                    <p className="text-sm font-medium text-slate-700 mt-1 group-hover:text-shop_light_green transition-colors">
                      {option.actionText}
                    </p>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Main Contact Form & Info Section */}
      <section className="container mx-auto px-4 max-w-7xl py-12 md:py-20">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                  {data.formTitle}
                </h2>
                <p className="text-slate-500 mt-2">{data.formSubtitle}</p>
              </div>

              {/* Success/Error Message */}
              {submitStatus !== "idle" && (
                <div
                  className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
                    submitStatus === "success"
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  {submitStatus === "success" ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm">{submitMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Vollständiger Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.name
                          ? "border-red-300 focus:ring-red-500"
                          : "border-slate-200 focus:border-shop_light_green"
                      } focus:ring-2 focus:ring-shop_light_green/20 focus:outline-none transition-colors bg-slate-50/50`}
                      placeholder="Max Mustermann"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      E-Mail-Adresse *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.email
                          ? "border-red-300 focus:ring-red-500"
                          : "border-slate-200 focus:border-shop_light_green"
                      } focus:ring-2 focus:ring-shop_light_green/20 focus:outline-none transition-colors bg-slate-50/50`}
                      placeholder="max@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Telefonnummer (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.phone
                        ? "border-red-300 focus:ring-red-500"
                        : "border-slate-200 focus:border-shop_light_green"
                    } focus:ring-2 focus:ring-shop_light_green/20 focus:outline-none transition-colors bg-slate-50/50`}
                    placeholder="+49 176 32853448"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Betreff *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.subject
                        ? "border-red-300 focus:ring-red-500"
                        : "border-slate-200 focus:border-shop_light_green"
                    } focus:ring-2 focus:ring-shop_light_green/20 focus:outline-none transition-colors bg-slate-50/50`}
                    placeholder="Wie können wir Ihnen helfen?"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Nachricht *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.message
                        ? "border-red-300 focus:ring-red-500"
                        : "border-slate-200 focus:border-shop_light_green"
                    } focus:ring-2 focus:ring-shop_light_green/20 focus:outline-none transition-colors bg-slate-50/50 resize-none`}
                    placeholder="Schreiben Sie hier Ihre Nachricht..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.message}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-slate-400">
                    {formData.message.length}/1000 Zeichen
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-shop_light_green hover:bg-shop_light_green/90 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Nachricht senden
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-shop_light_green/10">
                  <Clock className="w-5 h-5 text-shop_light_green" />
                </div>
                <h3 className="font-semibold text-slate-800">
                  {data.sidebarTitle}
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                {data.openingHours.map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-between py-2 ${
                      index < data.openingHours.length - 1
                        ? "border-b border-slate-100"
                        : ""
                    }`}
                  >
                    <span className="text-slate-600">{item.day}</span>
                    <span className="font-medium text-slate-800">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-shop_light_green/10 to-emerald-50 rounded-2xl p-6 border border-shop_light_green/20">
              <h4 className="font-semibold text-slate-800 mb-2">
                Schnelle Antwort
              </h4>
              <p className="text-sm text-slate-600">{data.quickResponseText}</p>
              <div className="mt-4 flex gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/80 rounded-full text-xs font-medium text-slate-700">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  Schnelle Antwort
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/80 rounded-full text-xs font-medium text-slate-700">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  Freundlicher Support
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-4">
                {data.socialTitle}
              </h3>
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
      <section
        id="stores"
        className="bg-slate-50 py-16 md:py-20 border-t border-slate-200"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              {data.locationsTitle}
            </h2>
            <p className="text-slate-500">{data.locationsSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {data.locations.map((location) => (
              <div
                key={location.name}
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
                    Route planen
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
                      <a
                        href={`tel:${location.phone}`}
                        className="hover:text-shop_light_green transition-colors"
                      >
                        {location.phone}
                      </a>
                    </div>
                    <div className="flex items-start gap-2 text-slate-600">
                      <Mail className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <a
                        href={`mailto:${location.email}`}
                        className="hover:text-shop_light_green transition-colors"
                      >
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
            {data.faqTitle}
          </h2>
          <p className="text-slate-500">{data.faqSubtitle}</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {data.faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-slate-100"
            >
              <h4 className="font-semibold text-slate-800 mb-2">
                {faq.question}
              </h4>
              <p className="text-slate-600 text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}