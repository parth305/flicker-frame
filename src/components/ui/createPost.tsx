"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  AtSign,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  MapPin,
  Plus,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ModeToggle } from "./modeToggle";
import UserTagDialog from "./userTagDialog";

export interface IUser {
  id: number;
  name: string;
  username: string;
  avatar: string;
}

export const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [taggedUsers, setTaggedUsers] = useState<IUser[]>([]);

  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) return;

    // Check if adding new files would exceed the limit
    if (selectedImages.length + files.length > MAX_FILES) {
      alert(`You can only upload up to ${MAX_FILES} images`);
      return;
    }

    // Validate each file
    const validFiles = Array.from(files).filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name} is larger than 10MB`);
        return false;
      }
      return true;
    });

    // Create object URLs for valid files
    const newImageUrls = validFiles.map((file) => URL.createObjectURL(file));

    setSelectedImages((prev) => [...prev, ...newImageUrls]);
    // Move to the first newly added image
    setCurrentImageIndex(selectedImages.length);
  };

  const removeCurrentImage = () => {
    const imageToRemove = selectedImages[currentImageIndex];
    URL.revokeObjectURL(imageToRemove);

    setSelectedImages((prev) =>
      prev.filter((_, index) => index !== currentImageIndex),
    );

    // Adjust current index if necessary
    if (currentImageIndex >= selectedImages.length - 1) {
      setCurrentImageIndex(Math.max(selectedImages.length - 2, 0));
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === selectedImages.length - 1 ? 0 : prev + 1,
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedImages.length - 1 : prev - 1,
    );
  };

  const handleUserTag = (user: IUser) => {
    setTaggedUsers((prev) => {
      const isAlreadyTagged = prev.some((u) => u.id === user.id);
      if (isAlreadyTagged) {
        return prev.filter((u) => u.id !== user.id);
      }
      return [...prev, user];
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="max-w-2xl mx-auto">
        <Card className="backdrop-blur-lg bg-white/70 dark:bg-gray-900/50 border border-white/20 dark:border-gray-900 shadow-2xl rounded-lg">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-8">
              <Avatar className="h-14 w-14 ring-2 ring-purple-100 ring-offset-2">
                <AvatarImage
                  className="w-full h-full object-cover"
                  src="/avatar.jpeg"
                  alt="User"
                  draggable={false}
                />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Create New Post
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Share your moments with the world
                </p>
              </div>
            </div>

            {/* Image Upload Area */}
            <div className="mb-8">
              {selectedImages.length > 0 ? (
                <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-purple-200 dark:border-gray-700">
                  <div className="relative w-full h-96">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full flex items-center justify-center">
                        <Image
                          src={selectedImages[currentImageIndex]}
                          alt={`Selected ${currentImageIndex + 1}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Navigation buttons */}
                  {selectedImages.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/30 border border-white/20"
                        onClick={previousImage}
                      >
                        <ChevronLeft className="h-4 w-4 text-white" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/30 border border-white/20"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4 text-white" />
                      </Button>
                    </>
                  )}

                  {/* Image counter and upload more button */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center space-x-4">
                    <div className="bg-black/30 backdrop-blur-md px-2 py-1 rounded-full">
                      <p className="text-white text-sm">
                        {currentImageIndex + 1} / {selectedImages.length}
                      </p>
                    </div>
                    {selectedImages.length < MAX_FILES && (
                      <label className="cursor-pointer bg-black/30 backdrop-blur-md px-2 py-1 rounded-full flex items-center space-x-1">
                        <Plus className="h-4 w-4 text-white" />
                        <span className="text-white text-sm">Add More</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleImageSelect}
                        />
                      </label>
                    )}
                  </div>

                  {/* Remove current image button */}
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-3 right-3 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/30 border border-white/20"
                    onClick={removeCurrentImage}
                  >
                    <X className="h-4 w-4 text-white" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-96 border-2 border-dashed border-purple-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-purple-50/50 dark:hover:bg-gray-700 transition-all duration-300">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="p-4 rounded-full bg-purple-50 dark:bg-gray-700 mb-4">
                      <ImagePlus className="h-8 w-8 text-purple-500 dark:text-gray-300" />
                    </div>
                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Upload up to 5 images (PNG, JPG, GIF up to 10MB each)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                  />
                </label>
              )}
            </div>

            {/* Caption Input */}
            <Textarea
              placeholder="Write a caption..."
              className="mb-6 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-purple-100 dark:border-gray-600 focus:border-purple-200 dark:focus:border-gray-500 focus:ring-purple-200 resize-none min-h-[120px]"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTagDialogOpen(true)}
                className="flex items-center bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-purple-100 dark:border-gray-600 hover:bg-purple-50/50 dark:hover:bg-gray-700"
              >
                <AtSign className="h-4 w-4 mr-2 text-purple-500 dark:text-gray-300" />
                Tag People
                {taggedUsers.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 dark:bg-gray-600 text-purple-600 dark:text-gray-200 rounded-full">
                    {taggedUsers.length}
                  </span>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-purple-100 dark:border-gray-600 hover:bg-purple-50/50 dark:hover:bg-gray-700"
              >
                <MapPin className="h-4 w-4 mr-2 text-purple-500 dark:text-gray-300" />
                Add Location
              </Button>
            </div>

            {/* Tagged Users Preview */}
            {taggedUsers.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {taggedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-gray-700 text-sm"
                  >
                    <span className="text-purple-600 dark:text-purple-300">
                      @{user.username}
                    </span>
                    <button
                      onClick={() => handleUserTag(user)}
                      className="text-purple-400 hover:text-purple-600 dark:text-purple-300 dark:hover:text-purple-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <UserTagDialog
              open={isTagDialogOpen}
              onOpenChange={setIsTagDialogOpen}
              onSelectUser={handleUserTag}
              selectedUsers={taggedUsers}
            />

            {/* Submit Button */}
            <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg dark:shadow-gray-800">
              Share Post
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePost;
