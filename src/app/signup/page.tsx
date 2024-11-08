"use client";
import React, { FormEvent, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import { checkUserNameAvailablity, signup } from "@/service/auth.service";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const debouncedUsernameCheck = useCallback(
    debounce(async (username: string) => {
      if (username.length < 3) {
        setUsernameError("Min 3 characters required");
        setUsernameAvailable(false);
        setIsChecking(false);
        return;
      }

      try {
        const data = await checkUserNameAvailablity(username);

        if (data.data.userExists) {
          setUsernameError("Username taken");
          setUsernameAvailable(false);
        } else {
          setUsernameError("");
          setUsernameAvailable(true);
        }
      } catch (error) {
        if (error instanceof Error) {
          setUsernameError(error.message);
        } else {
          setUsernameError("An unexpected error occurred");
        }
        setUsernameAvailable(false);
      } finally {
        setIsChecking(false); // Stop the loader when done
      }
    }, 500),
    [],
  );
  const validateField = (name: string, value: string) => {
    switch (name) {
      case "username":
        const usernameRegex = /^[A-Za-z][A-Za-z0-9_]*$/; // Starts with letter and allows letters, digits, and underscores
        return usernameRegex.test(value)
          ? ""
          : "Username must start with a letter and can only contain letters, digits, and underscores";

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? "" : "Invalid email address";
      case "password":
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(value)
          ? ""
          : "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character";
      case "confirmPassword":
        return value === formData.password ? "" : "Passwords do not match";
      default:
        return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Handle username validation
    if (name === "username") {
      // Clear previous errors immediately
      setUsernameError("");

      if (!value) {
        setUsernameAvailable(false);
        setIsChecking(false);
      } else {
        const error = validateField(name, value);
        if (error) {
          setUsernameError(error);
          setUsernameAvailable(false);
          setIsChecking(false); // Stop the loader on error
        } else {
          setIsChecking(true); // Start the loader for API check
          debouncedUsernameCheck(value);
        }
      }
    }
    // Handle other field validations
    else {
      const error = validateField(name, value);
      setFormErrors((prev) => ({
        ...prev,
        [name]: error,
      }));

      // Special handling for confirm password when password changes
      if (name === "password" && formData.confirmPassword) {
        setFormErrors((prev) => ({
          ...prev,
          confirmPassword:
            formData.confirmPassword === value ? "" : "Passwords do not match",
        }));
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (
        !usernameAvailable ||
        Object.values(formErrors).some((error) => error)
      ) {
        return;
      }
      const data = await signup({
        userName: formData.username,
        userPassword: formData.password,
        userEmail: formData.email,
      });

      localStorage.setItem("token", data.data.accessToken);
      toast({
        description: data.message,
      });

      const params = new URLSearchParams();
      params.set("email", data.data.userEmail);
      router.push(`/otp?${params.toString()}`);
    } catch (error) {
      let message = "Somethign went wrong!";
      if (error instanceof Error && error.message) {
        message = error.message;
      }
      toast({
        description: message,
        variant: "destructive",
      });
    }
  };

  // Rest of your component remains the same...
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
                  name="username"
                  type="text"
                  placeholder="John Doe"
                  value={formData.username}
                  onChange={handleInputChange}
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
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className={
                  formErrors.email
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {formErrors.email && (
                <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={
                    formErrors.password
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
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
              {formErrors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={
                    formErrors.confirmPassword
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {formErrors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                !usernameAvailable ||
                isChecking ||
                Object.values(formErrors).some((error) => error) ||
                !formData.confirmPassword
              }
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
