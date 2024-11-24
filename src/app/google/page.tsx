"use client";
import React, { Suspense, useEffect } from "react";
import { verifyGoogle } from "@/service/auth.service";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const GoogleAuth = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") as string;
  const router = useRouter();

  const handleVerifyGoogle = async (code: string) => {
    try {
      const response = await verifyGoogle(code);

      localStorage.setItem("token", response?.data?.accessToken);

      if (response.data.isUserInfoExists) {
        localStorage.setItem(
          "userData",
          JSON.stringify({
            userEmail: response?.data?.userEmail,
            id: response?.data?.id,
            firstName: response?.data?.userInfo?.firstName,
            lastName: response?.data?.userInfo?.lastName,
            dob: response?.data?.userInfo?.dob || new Date().toISOString(),
          }),
        );
        router.push("/");
      } else {
        router.push("user-info");
      }
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (code !== null) {
      handleVerifyGoogle(code);
    }
  }, [code]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 rounded-md bg-white shadow-lg">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
        <p className="mt-4 text-center text-lg text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

const GoogleAuthWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <GoogleAuth />
  </Suspense>
);

export default GoogleAuthWrapper;
