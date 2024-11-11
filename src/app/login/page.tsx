"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation"; // Correct import for navigation in App Router

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
import { Checkbox } from "@/components/ui/checkbox";
import { ModeToggle } from "@/components/ui/modeToggle";
import { login } from "@/service/auth.service";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password
  const [loading, setLoading] = useState(false); // State to manage loading
  const [error, setError] = useState<string | null>(null); // State for general error handling
  const [emailError, setEmailError] = useState(""); // State for email validation error
  const [passwordError, setPasswordError] = useState(""); // State for password validation error
  const router = useRouter(); // Use router from next/navigation for App Router

  const { toast } = useToast();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Password validation regex (at least 1 lowercase, 1 uppercase, 1 number, 1 special character, minimum 8 characters)
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Validate email on every input change
  const validateEmail = (value: string) => {
    if (!emailRegex.test(value)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError(""); // Clear error if email is valid
    }
    setEmail(value);
  };

  // Validate password on every input change
  const validatePassword = (value: string) => {
    if (!passwordRegex.test(value)) {
      setPasswordError(
        "Password must be at least 8 characters, with a mix of upper/lowercase letters, a number, and a special character.",
      );
    } else {
      setPasswordError(""); // Clear error if password is valid
    }
    setPassword(value);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    // Check if both email and password are valid before submitting
    if (!emailError && !passwordError) {
      try {
        const response = await login({
          userEmail: email,
          userPassword: password,
        });

        localStorage.setItem("token", response.data.accessToken);

        if (response.data.isEmailVerified === false) {
          toast({
            duration: 5000,
            description: "Please verify your email!",
            variant: "destructive",
          });

          const params = new URLSearchParams();
          params.set("email", email);
          router.push(`/otp?${params.toString()}`);
          return;
        }

        if (response.data.isUserInfoExists === false) {
          toast({
            duration: 5000,
            description: "Please fill user information!",
            variant: "destructive",
          });
          router.push("/userInfo");
          return;
        }

        delete response.data.accessToken;

        localStorage.setItem("userData", JSON.stringify(response.data));

        toast({
          duration: 5000,
          description: "Successfully logged in!",
          variant: "default",
        });

        // Redirect to homepage
        router.push("/");
      } catch (error) {
        let msg = "Something Went Wrong!";
        if (error instanceof Error) {
          msg = error.message;
        }
        toast({
          duration: 5000,
          description: msg,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Login to Your Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => validateEmail(e.target.value)} // Validate as user types
                required
                className={`${
                  emailError ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500`} // Apply red border on error
              />
              {emailError && (
                <p className="mt-1 text-xs text-red-500">{emailError}</p> // Display email error message
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => validatePassword(e.target.value)} // Validate as user types
                  required
                  className={`${
                    passwordError ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500`} // Apply red border on error
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
              {passwordError && (
                <p className="mt-1 text-xs text-red-500">{passwordError}</p> // Display password error message
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal cursor-pointer"
                >
                  Remember me
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            {error && (
              <p className="mt-2 text-center text-sm text-red-500">{error}</p>
            )}
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
              <FaGoogle className="h-5 w-5" />
            </Button>
            <Button variant="outline" className="w-full">
              <FaFacebook className="h-5 w-5" />
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
};

export default LoginPage;
