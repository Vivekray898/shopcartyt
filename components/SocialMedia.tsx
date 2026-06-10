import { Facebook, Github, Linkedin, Slack, Youtube } from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";
interface Props {
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
  links?: Array<{ platform?: string; url?: string }>;
}

const defaultLinks = [
  {
    platform: "Youtube",
    url: "https://www.youtube.com/@reactjsBD",
  },
  {
    platform: "Github",
    url: "https://www.youtube.com/@reactjsBD",
  },
  {
    platform: "Linkedin",
    url: "https://www.youtube.com/@reactjsBD",
  },
  {
    platform: "Facebook",
    url: "https://www.youtube.com/@reactjsBD",
  },
  {
    platform: "Slack",
    url: "https://www.youtube.com/@reactjsBD",
  },
];

const getIcon = (platform?: string) => {
  switch (platform?.toLowerCase()) {
    case "youtube":
      return <Youtube className="w-5 h-5" />;
    case "github":
      return <Github className="w-5 h-5" />;
    case "linkedin":
      return <Linkedin className="w-5 h-5" />;
    case "facebook":
      return <Facebook className="w-5 h-5" />;
    case "slack":
      return <Slack className="w-5 h-5" />;
    default:
      return <Github className="w-5 h-5" />;
  }
};

const SocialMedia = ({
  className,
  iconClassName,
  tooltipClassName,
  links,
}: Props) => {
  const items = links?.length ? links : defaultLinks;

  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-3.5", className)}>
        {items?.map((item) => (
          <Tooltip key={item?.platform}>
            <TooltipTrigger asChild>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={item?.url ?? "#"}
                className={cn(
                  "p-2 border rounded-full hover:text-white hover:border-shop_light_green hoverEffect",
                  iconClassName
                )}
              >
                {getIcon(item?.platform)}
              </Link>
            </TooltipTrigger>
            <TooltipContent
              className={cn(
                "bg-white text-darkColor font-semibold",
                tooltipClassName
              )}
            >
              {item?.platform}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default SocialMedia;
