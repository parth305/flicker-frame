"use client";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { Textarea } from "@/components/ui/textarea";
import { ModeToggle } from "@/components/ui/modeToggle";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { updateUserInfo } from "@/service/user.service";
import Link from "next/link";

interface FormData {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | undefined;
  bio?: string;
  profilePicture?: File | null;
}

const UserInfoPage = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: undefined,
    bio: "",
    profilePicture: null,
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [calendarDate, setCalendarDate] = useState<Date | undefined>(undefined);

  const validateField = (name: string, value: string | Date | undefined) => {
    switch (name) {
      case "firstName":
      case "lastName":
        return (value as string).trim().length >= 2
          ? ""
          : "Must be at least 2 characters";
      case "dateOfBirth":
        if (!value) return "Date of birth is required";
        const dob = value as Date;
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < dob.getDate())
        ) {
          age--;
        }
        return age >= 13 ? "" : "You must be at least 13 years old";
      default:
        return "";
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const error = validateField(name, value);
    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      dateOfBirth: date,
    }));

    const error = validateField("dateOfBirth", date);
    setFormErrors((prev) => ({
      ...prev,
      dateOfBirth: error,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          duration: 5000,
          description: "File size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setFormData((prev) => ({
        ...prev,
        profilePicture: file,
      }));

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.values(formErrors).some((error) => error)) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Add your API call here to submit user info
      const response = await updateUserInfo(
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          userBio: formData.bio,
          userProfilePicUri: formData.profilePicture?.name,
          dob: formData.dateOfBirth,
        },
        localStorage.getItem("token"),
      );

      localStorage.setItem(
        "userData",
        JSON.stringify({
          userEmail: response?.data?.userEmail,
          id: response?.data?.id,
          firstName: response?.data?.userInfo?.firstName,
          lastname: response?.data?.userInfo?.lastName,
          dob: response?.data?.userIndo?.dob || new Date().toISOString(),
          // profilePicture: response?.data?.userInfo?.userProfilePicUri,
        }),
      );

      toast({
        duration: 5000,
        description: "Profile information updated successfully!",
      });

      router.push("/"); // Or wherever you want to redirect after
    } catch (error) {
      let message = "Something went wrong!";
      if (error instanceof Error && error.message) {
        message = error.message;
      }
      toast({
        duration: 5000,
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-center">
            Tell us more about yourself
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  required
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={formErrors.firstName ? "border-red-500" : ""}
                />
                {formErrors.firstName && (
                  <p className="text-xs text-red-500">{formErrors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  required
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={formErrors.lastName ? "border-red-500" : ""}
                />
                {formErrors.lastName && (
                  <p className="text-xs text-red-500">{formErrors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dateOfBirth"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dateOfBirth && "text-muted-foreground",
                      formErrors.dateOfBirth && "border-red-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateOfBirth ? (
                      format(formData.dateOfBirth, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3 border-b border-border">
                    <div className="flex gap-2">
                      <Select
                        onValueChange={(value) => {
                          const year = parseInt(value);
                          const newDate = calendarDate || new Date();
                          newDate.setFullYear(year);
                          setCalendarDate(new Date(newDate));
                        }}
                        value={
                          calendarDate?.getFullYear().toString() ||
                          new Date().getFullYear().toString()
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 100 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <Select
                        onValueChange={(value) => {
                          const month = parseInt(value);
                          const newDate = calendarDate || new Date();
                          newDate.setMonth(month);
                          setCalendarDate(new Date(newDate));
                        }}
                        value={
                          calendarDate?.getMonth().toString() ||
                          new Date().getMonth().toString()
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = new Date(0, i).toLocaleString(
                              "default",
                              { month: "long" },
                            );
                            return (
                              <SelectItem key={i} value={i.toString()}>
                                {month}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Calendar
                    mode="single"
                    selected={formData.dateOfBirth}
                    onSelect={handleDateChange}
                    defaultMonth={
                      calendarDate || formData.dateOfBirth || new Date()
                    }
                    month={calendarDate || formData.dateOfBirth || new Date()}
                    onMonthChange={(date) => {
                      setCalendarDate(date);
                    }}
                    initialFocus
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
              {formErrors.dateOfBirth && (
                <p className="text-xs text-red-500">{formErrors.dateOfBirth}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio (Optional)</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={handleInputChange}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profilePicture">Profile Picture (Optional)</Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label
                    htmlFor="profilePicture"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-6 w-6 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Click to upload
                      </p>
                    </div>
                    <Input
                      id="profilePicture"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Label>
                </div>
                {previewUrl && (
                  <div className="relative w-32 h-32">
                    <Image
                      src={previewUrl}
                      alt="Profile preview"
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                isSubmitting ||
                Object.values(formErrors).some((error) => error) ||
                !formData.firstName ||
                !formData.lastName ||
                !formData.dateOfBirth
              }
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Profile
            </Button>
          </form>

          <p className="mt-3 text-center text-sm text-muted-foreground">
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

export default UserInfoPage;
