import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { IUser } from "./createPost";

// Mock user data - replace with your actual user data source
const USERS = [
  {
    id: 1,
    name: "Alice Johnson",
    username: "alice_j",
    avatar: "/api/placeholder/32/32",
  },
  {
    id: 2,
    name: "Bob Smith",
    username: "bobsmith",
    avatar: "/api/placeholder/32/32",
  },
  {
    id: 3,
    name: "Carol White",
    username: "carol_w",
    avatar: "/api/placeholder/32/32",
  },
  {
    id: 4,
    name: "David Brown",
    username: "david.b",
    avatar: "/api/placeholder/32/32",
  },
  {
    id: 5,
    name: "Emma Davis",
    username: "emma_davis",
    avatar: "/api/placeholder/32/32",
  },
];

export const UserTagDialog = ({
  open,
  onOpenChange,
  onSelectUser,
  selectedUsers = [],
}: {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onSelectUser: (user: IUser) => void;
  selectedUsers: IUser[];
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white/70 dark:bg-gray-900/50 backdrop-blur-lg border border-white/20 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Tag People
          </DialogTitle>
        </DialogHeader>

        <Command className="rounded-lg border border-purple-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50">
          <CommandInput
            placeholder="Search people..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-9 border-0 focus:ring-0 bg-transparent"
          />

          <CommandList className="max-h-[300px] overflow-auto">
            <CommandEmpty className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No users found.
            </CommandEmpty>

            <CommandGroup>
              {filteredUsers.map((user) => {
                const isSelected = selectedUsers.some((u) => u.id === user.id);

                return (
                  <CommandItem
                    key={user.id}
                    onSelect={() => onSelectUser(user)}
                    className="flex items-center space-x-3 px-4 py-2 cursor-pointer hover:bg-purple-50/50 dark:hover:bg-gray-700/50"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        @{user.username}
                      </p>
                    </div>

                    {isSelected && (
                      <Check className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default UserTagDialog;
