// src/app/contact/page.tsx
"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import api, { post } from "@/lib/api"; // Ensure your api lib is correctly imported

type FormState = {
  name: string;
  email: string;
  phone: string;
  comment: string;
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    comment: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: Partial<FormState> = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Valid email required.";
    if (form.phone && !/^\+?\d{7,15}$/.test(form.phone))
      errs.phone = "Enter a valid phone number.";
    if (!form.comment.trim()) errs.comment = "Please leave a message.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await post("/contact/submit", form);

      if (response.message === "Contact message submitted successfully.") {
        Swal.fire({
          icon: "success",
          title: "Message Sent",
          text: "We’ve received your message and will be in touch soon.",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
          background: "#fff",
          didOpen: () => {
            Swal.showLoading();
          },
        });
        setForm({ name: "", email: "", phone: "", comment: "" });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Something went wrong. Please try again later.",
          confirmButtonText: "OK",
        });
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const fieldErrors: Partial<FormState> = {};
        for (const err of error.response.data.errors) {
          fieldErrors[err.field as keyof FormState] = err.msg;
        }
        setErrors(fieldErrors);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Unable to send message.",
          confirmButtonText: "OK",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white flex flex-col items-center py-12">
      <h1 className="text-4xl font-serif text-black mb-6">Contact Us</h1>
      <Card className="max-w-5xl w-full shadow-lg rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left info panel */}
        <div className="bg-black text-white p-8 space-y-6">
          <CardTitle className="text-2xl">Get in touch</CardTitle>
          <p>
            Have questions? We’re here to help. Fill out the form, or reach us
            directly via:
          </p>
          <ul className="space-y-4">
            <li className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>support@Zexa Store.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>123 Zexa Store Street, Mumbai, India</span>
            </li>
          </ul>
        </div>

        {/* Right form panel */}
        <CardContent className="p-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-black mb-1"
              >
                Name
              </label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black mb-1"
              >
                Email *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-black mb-1"
              >
                Phone number
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={handleChange}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Comment */}
            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-black mb-1"
              >
                Comment
              </label>
              <Textarea
                id="comment"
                name="comment"
                placeholder="How can we help you?"
                value={form.comment}
                onChange={handleChange}
                rows={5}
                className={errors.comment ? "border-red-500" : ""}
              />
              {errors.comment && (
                <p className="mt-1 text-xs text-red-600">{errors.comment}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-black hover:bg-gray-800 text-white"
            >
              <Send className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Sending..." : "Send Message"}</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
