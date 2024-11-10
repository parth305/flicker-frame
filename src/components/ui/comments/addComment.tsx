import { SendHorizonal, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Button } from "../button";
import { User } from "../posts/postCard";

export const AddComment: React.FC<{
  user: User;
  commentInputRef: React.RefObject<HTMLTextAreaElement>;
  newComment: string;
  handleCommentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setIsCommentInputOpen: (value: React.SetStateAction<boolean>) => void;
  handleCommentSubmit: () => void;
}> = ({
  user,
  commentInputRef,
  newComment,
  setIsCommentInputOpen,
  handleCommentChange,
  handleCommentSubmit,
}) => {
  return (
    <div className="flex items-start space-x-4 animate-fade-in">
      <Avatar>
        <AvatarImage
          src={user.avatar}
          alt={user.name}
          className="w-full h-full object-cover"
        />
        <AvatarFallback>{user.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <textarea
          ref={commentInputRef}
          value={newComment}
          onChange={handleCommentChange}
          placeholder="Add a comment..."
          className="w-full bg-gray-100 dark:bg-gray-800 rounded-md border-none focus:ring-0 resize-none p-2"
          rows={2}
        />
        <div className="flex justify-end space-x-2 mt-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            onClick={() => setIsCommentInputOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white"
            onClick={handleCommentSubmit}
          >
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
