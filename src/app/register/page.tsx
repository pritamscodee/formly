"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(data: RegisterForm) {
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Registration failed");
      return;
    }

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    router.push("/forms");
  }

  return (
    <div className="flex min-h-screen">
      {/* Left: illustration band */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-[#eeece7] p-12">
        <div className="relative w-full max-w-md">
          <img
            src="/signup.svg"
            alt=""
            width={525}
            height={728}
            className="h-auto w-full"
          />
        </div>
      </div>

      {/* Right: form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-white p-6">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#17171c]">
              <span className="text-sm font-bold text-white">F</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-[#212121]">
              Formly
            </span>
          </Link>

          <h1 className="text-[clamp(28px,4vw,48px)] font-[400] leading-[1.2] tracking-[-0.01em] text-[#212121]">
            Create account
          </h1>
          <p className="mt-2 text-base leading-[1.5] text-[#616161]">
            Get started with Formly
          </p>

          <div className="mt-8 rounded-[16px] border border-[#d9d9dd] bg-white p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {error && (
                  <div className="rounded-lg border border-[#b30000]/20 bg-[#b30000]/10 px-3 py-2 text-sm text-[#b30000]">
                    {error}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-[400] text-[#212121]">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-[400] text-[#212121]">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-[400] text-[#212121]">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full rounded-[9999px] bg-[#17171c] text-white hover:bg-[#2c2c35] text-sm font-[500] h-10"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Creating account..."
                    : "Create account"}
                </Button>

                <p className="text-center text-sm text-[#616161]">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-[#212121] underline-offset-4 transition-colors hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
