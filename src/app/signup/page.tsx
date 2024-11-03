"use client";

import React, { FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { RiFacebookFill } from "react-icons/ri";
import { debounce } from "lodash";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { ModeToggle } from "@/components/ui/modeToggle";
const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(false);

  // Debounced function to check username availability
  const checkUsername = debounce(async (username: string) => {
    if (username.length < 3) {
      setUsernameError("Min 3 characters required");
      setUsernameAvailable(false);
      return;
    }

    setIsChecking(true);
    try {
      // Replace with your actual API endpoint

      const response = await fetch(
        `http://localhost:3000/api/v1/auth/exists/${username}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error checking username");
      }

      if (data.data.userExists) {
        setUsernameError("Username taken");
        setUsernameAvailable(false);
      } else {
        setUsernameError("");
        setUsernameAvailable(true);
      }
    } catch (error) {
      // Use 'unknown' type and assert the error to be an instance of Error
      if (error instanceof Error) {
        setUsernameError(error.message);
      } else {
        setUsernameError("An unexpected error occurred");
      }
      setUsernameAvailable(false);
    } finally {
      setIsChecking(false);
    }
  }, 500);

  useEffect(() => {
    if (username) {
      checkUsername(username);
    } else {
      setUsernameError("");
      setUsernameAvailable(false);
    }

    return () => {
      checkUsername.cancel();
    };
  }, [username, checkUsername]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!usernameAvailable) {
      return;
    }
    console.log("Signup submitted");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder="John Doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`${
                    usernameError
                      ? "border-red-500 focus-visible:ring-red-500"
                      : usernameAvailable
                        ? "border-green-500 focus-visible:ring-green-500"
                        : ""
                  } pr-8`}
                />
                {isChecking && (
                  <Loader2 className="h-4 w-4 animate-spin absolute right-2 bottom-1/4 text-gray-500" />
                )}
              </div>
              {usernameError && (
                <p className="text-sm text-red-500 mt-1">{usernameError}</p>
              )}
              {usernameAvailable && (
                <p className="text-sm text-green-500 mt-1">
                  Username available!
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!usernameAvailable || isChecking}
            >
              Sign Up
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">
              <FaGoogle className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button variant="outline" className="w-full">
              <RiFacebookFill className="mr-2 h-4 w-4" />
              Facebook
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
};

export default SignupPage;
