"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { resendOtp, verifyOtp } from "@/service/auth.service";
import { ModeToggle } from "@/components/ui/modeToggle";

const OTPPage = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") as string;
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, "");
    setOtp(value);
  };

  const handleResendOTP = async () => {
    try {
      // Add your resend OTP API call here

      const response = await resendOtp(localStorage.getItem("token"));

      // Reset timer and disable resend button
      setTimer(60);
      setCanResend(false);
      toast({
        description: response.message,
      });
    } catch (error) {
      let message = "Failed to resend OTP";
      if (error instanceof Error && error.message) {
        message = error.message;
      }
      toast({
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await verifyOtp(
        {
          userEmail: email as string,
          otpValue: otp,
        },
        localStorage.getItem("token"),
      );

      toast({
        description: response.message,
      });
    } catch (error) {
      let message = "Something went wrong!";
      if (error instanceof Error && error.message) {
        message = error.message;
      }
      toast({
        description: message,
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Verify Your Email
          </CardTitle>
          <p className="text-center text-muted-foreground">
            We&apos;ve sent an OTP to{" "}
            <span className="font-medium">{email}</span>
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">OTP</Label>
            <Input
              id="otp"
              name="otp"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={handleOTPChange}
              maxLength={6}
              required
            />
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={otp.length !== 6}
          >
            Verify OTP
          </Button>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive OTP? {formatTime(timer)}
            </p>
            <Button
              variant="outline"
              onClick={handleResendOTP}
              disabled={!canResend}
              className="w-full"
            >
              Resend OTP
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default OTPPage;
