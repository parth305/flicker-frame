"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  MoreHorizontal,
  ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { AddComment } from "../comments/addComment";
import { CommentsComponent } from "../comments/comment";
import ShareDialog from "../common/shareDialog";

export interface User {
  id: number;
  name: string;
  username: string;
  avatar: string;
}
export interface Comment {
  id: number;
  user: User;
  createdAt: string;
  content: string;
}

interface PostCardProps {
  user: User;
  images: string[];
  caption: string;
  taggedUsers: {
    id: number;
    username: string;
  }[];
  comments: Comment[];
}

const PostCard: React.FC<PostCardProps> = ({
  user,
  images,
  caption,
  taggedUsers,
  comments,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [isCommentInputOpen, setIsCommentInputOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);

  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOptionsMenuOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOptionsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOptionsMenuOpen]);

  const handleClick = () => {
    setLiked(!liked);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const toggleOptionsMenu = () => {
    setIsOptionsMenuOpen((prev) => !prev);
  };

  const toggleCommentInput = () => {
    setIsCommentInputOpen((prev) => !prev);
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    console.log("New comment:", newComment);
    setNewComment("");
    setIsCommentInputOpen(false);
  };

  return (
    <Card className="rounded-lg shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <p className="text-sm pt-1 text-gray-500 dark:text-gray-400">
                @{user.username}
              </p>
            </div>
          </div>
          <div className="relative">
            <Button
              ref={buttonRef}
              variant="ghost"
              size="icon"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={toggleOptionsMenu}
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
            {isOptionsMenuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg p-2 w-48 z-10"
              >
                <Button
                  variant="ghost"
                  className="w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative rounded-lg overflow-hidden h-80">
          <Image
            fill
            src={images[currentImageIndex]}
            alt={`Post by ${user.name}`}
            draggable={false}
            className="w-full h-full object-contain bg-black"
          />

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/40 text-white"
                onClick={previousImage}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/40 text-white"
                onClick={nextImage}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>

        <div className="px-4 pt-4 space-y-4">
          <p className="text-gray-800 dark:text-gray-200">{caption}</p>

          {taggedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {taggedUsers.map((user) => (
                <Badge
                  key={user.id}
                  variant="outline"
                  className="bg-purple-50 dark:bg-gray-700 text-purple-600 dark:text-purple-300"
                >
                  @{user.username}
                </Badge>
              ))}
            </div>
          )}

          <Separator className="my-4" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClick}
                className={`text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300 ${
                  liked ? "text-blue-500 dark:text-blue-400" : ""
                }`}
              >
                <ThumbsUp
                  className={`h-10 w-10 transition-all duration-300 ${liked ? "fill-current text-blue-500 dark:text-blue-400" : "fill-transparent text-gray-500 dark:text-gray-400"}`}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={toggleCommentInput}
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
              <ShareDialog url="http://localhost:3000/post/create" />
            </div>
          </div>

          {isCommentInputOpen && (
            <AddComment
              commentInputRef={commentInputRef}
              handleCommentChange={handleCommentChange}
              handleCommentSubmit={handleCommentSubmit}
              newComment={newComment}
              setIsCommentInputOpen={setIsCommentInputOpen}
              user={user}
            />
          )}

          {comments.length > 0 && <CommentsComponent comments={comments} />}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
