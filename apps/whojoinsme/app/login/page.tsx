"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { FaArrowAltCircleUp } from "react-icons/fa";

import { LumaAuthApiService } from "@/lib/Api";
import { Input } from "@/components/Input";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("lumaAuthToken");
    if (authToken) {
      router.push("/dashboard");
    }
  }, [router]);

  const requestCodeMutation = useMutation({
    mutationFn: async (email: string) => {
      const lumaApi = new LumaAuthApiService();
      return lumaApi.requestEmailCode(email);
    },
    onSuccess: () => {
      setCodeSent(true);
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: async ({ email, code }: { email: string; code: string }) => {
      const lumaApi = new LumaAuthApiService();
      return lumaApi.verifyEmailCode(email, code);
    },
    onSuccess: ({ authToken }) => {
      localStorage.setItem("lumaAuthToken", authToken);
      router.push("/dashboard");
    },
  });

  const requestCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) return;

    requestCodeMutation.mutate(email);
  };

  const verifyCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code) return;

    verifyCodeMutation.mutate({ email, code });

    //set the email in local storage
    localStorage.setItem("lumaEmail", email);
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 p-4">
      <div className="grid place-items-center">
        <Logo />
        <p className="text-sm text-white/50">
          Analyze who joins your Luma events...
        </p>
      </div>

      {!codeSent ? (
        <form onSubmit={requestCode} className="w-full max-w-md text-center">
          <div className="flex gap-3">
            <Input
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Luma email"
              required
              onSubmit={requestCode}
              className=""
              disabled={requestCodeMutation.isPending}
            />
            <button
              type="submit"
              className="disabled:cursor-not-allowed"
              disabled={requestCodeMutation.isPending}
            >
              <FaArrowAltCircleUp className="h-[49px] w-[49px] text-[#787878] transition-colors hover:text-[#888888] disabled:opacity-50" />
            </button>
          </div>

          {requestCodeMutation.error && (
            <p className="mt-2 text-red-500">
              {requestCodeMutation.error.message}
            </p>
          )}
        </form>
      ) : (
        <form onSubmit={verifyCode} className="w-full max-w-md">
          <div className="flex gap-3">
            <Input
              type="text"
              value={code}
              onChange={setCode}
              placeholder="Verification code"
              required
              disabled={verifyCodeMutation.isPending}
            />
            <button
              type="submit"
              className="disabled:cursor-not-allowed"
              disabled={verifyCodeMutation.isPending}
            >
              <FaArrowAltCircleUp className="h-[49px] w-[49px] text-[#787878] transition-colors hover:text-[#888888] disabled:opacity-50" />
            </button>
          </div>

          {verifyCodeMutation.error && (
            <p className="mt-2 text-red-500">
              {verifyCodeMutation.error.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
