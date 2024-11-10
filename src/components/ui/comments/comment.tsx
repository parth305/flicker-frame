import { MoreHorizontal, ThumbsUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Button } from "../button";
import ShareDialog from "../common/shareDialog";
import { Comment } from "../posts/postCard";

export const CommentsComponent: React.FC<{
  comments: Comment[];
}> = ({ comments }) => {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>(
    {},
  );
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      comments.forEach((comment) => {
        if (openMenus[comment.id]) {
          const menuElement = menuRefs.current[comment.id];
          const buttonElement = buttonRefs.current[comment.id];

          if (
            menuElement &&
            buttonElement &&
            !menuElement.contains(event.target as Node) &&
            !buttonElement.contains(event.target as Node)
          ) {
            setOpenMenus((prev) => ({
              ...prev,
              [comment.id]: false,
            }));
          }
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [comments, openMenus]);

  const handleLike = (commentId: number) => {
    setLikedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const toggleOptionsMenu = (commentId: number) => {
    setOpenMenus((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const setButtonRef =
    (commentId: number) => (el: HTMLButtonElement | null) => {
      buttonRefs.current[commentId] = el;
    };

  const setMenuRef = (commentId: number) => (el: HTMLDivElement | null) => {
    menuRefs.current[commentId] = el;
  };

  return (
    <div className="space-y-4 mt-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex items-start space-x-4 animate-fade-in"
        >
          <Avatar>
            <AvatarImage
              src={comment.user.avatar}
              alt={comment.user.name}
              className="w-full h-full object-cover"
            />
            <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between relative">
              <div>
                <p className="font-medium">{comment.user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {comment.createdAt}
                </p>
              </div>
              <div className="relative">
                <Button
                  ref={setButtonRef(comment.id)}
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => toggleOptionsMenu(comment.id)}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
                {openMenus[comment.id] && (
                  <div
                    ref={setMenuRef(comment.id)}
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
            <p className="text-gray-800 dark:text-gray-200 mt-2">
              {comment.content}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleLike(comment.id)}
                className={`text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300 ${
                  likedComments[comment.id]
                    ? "text-blue-500 dark:text-blue-400"
                    : ""
                }`}
              >
                <ThumbsUp
                  className={`h-5 w-5 transition-all duration-300 ${
                    likedComments[comment.id]
                      ? "fill-current text-blue-500 dark:text-blue-400"
                      : "fill-transparent text-gray-500 dark:text-gray-400"
                  }`}
                />
              </Button>
              <ShareDialog url="http://localhost:3000/post/create" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentsComponent;
