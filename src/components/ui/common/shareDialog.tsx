import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import {
  Copy,
  Facebook,
  Link as LinkIcon,
  Mail,
  MessageCircle,
  Share2,
  X,
} from "lucide-react";
import WhatsAppIcon from "./whatsappIcon";

const ShareDialog = ({ url = window.location.href }) => {
  const { toast } = useToast();
  const handleShare = (platform: string) => {
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`,
      email: `mailto:?body=${encodeURIComponent(url)}`,
      messenger: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=YOUR_APP_ID`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank");
      toast({
        description: `Shared via ${platform}`,
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        description: "Link copied to clipboard",
      });
    } catch {
      toast({
        variant: "destructive",
        description: "Failed to copy link",
      });
    }
  };

  const shareButtons = [
    {
      icon: Facebook,
      label: "Facebook",
      action: () => handleShare("facebook"),
    },
    { icon: X, label: "X", action: () => handleShare("twitter") },
    {
      icon: WhatsAppIcon,
      label: "WhatsApp",
      action: () => handleShare("whatsapp"),
    },
    {
      icon: MessageCircle,
      label: "Messenger",
      action: () => handleShare("messenger"),
    },
    { icon: Mail, label: "Email", action: () => handleShare("email") },
    { icon: LinkIcon, label: "Copy link", action: copyToClipboard },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
        </DialogHeader>

        <div className="flex items-center space-x-2 mb-4">
          <div className="grid flex-1 gap-2">
            <Input readOnly value={url} className="flex-1" />
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  //   onClick={copyToClipboard}
                  onClick={() => {
                    toast({
                      title: "Uh oh! Something went wrong.",
                      description: "There was a problem with your request.",
                    });
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy link</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {shareButtons.map(({ icon: Icon, label, action }) => (
            <TooltipProvider key={label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-24"
                    onClick={action}
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Icon className="h-6 w-6" />
                      <span className="text-xs">{label}</span>
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share via {label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
