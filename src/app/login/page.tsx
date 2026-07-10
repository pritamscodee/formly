"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginForm) {
    setError("");
    const { error: signInError } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (signInError) {
      setError("Invalid email or password");
    } else {
      router.push("/forms");
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left: illustration band */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-[#eeece7] p-12">
        <div className="relative w-full max-w-md">
          <img
            src="/login.svg"
            alt=""
            width={664}
            height={799}
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
            Welcome back
          </h1>
          <p className="mt-2 text-base leading-[1.5] text-[#616161]">
            Sign in to your account
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
                  {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
                </Button>

                <p className="text-center text-sm text-[#616161]">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-[#212121] underline-offset-4 transition-colors hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </Form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#d9d9dd]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-3 text-[#93939f]">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/forms" })}
              className="flex w-full items-center justify-center gap-3 rounded-[9999px] border border-[#d9d9dd] bg-white px-4 py-2.5 text-sm font-[500] text-[#212121] transition-colors hover:bg-[#f5f5f5]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
