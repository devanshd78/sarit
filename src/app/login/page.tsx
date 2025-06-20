"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { post } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    setError(null);

    // basic client-side validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      // use your axios helper instead of fetch
      const body = await post<{ token: string }>("/auth/login", {
        email,
        mobile,
      });

      // store JWT and redirect
      localStorage.setItem("token", body.token);
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="py-6 text-center">
            <Image
              src="/assets/sarit-logo-color.svg"
              alt="Sarit Logo"
              width={120}
              height={40}
              className="mx-auto mb-4"
            />
            <CardTitle className="text-2xl font-bold">
              Welcome Back
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mobile Number
              </label>
              <Input
                id="mobile"
                type="tel"
                placeholder="10-digit mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={loading}
              />
            </div>

            <Button
              className="w-full"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in…" : "Login"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
