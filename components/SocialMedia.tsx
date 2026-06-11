"use client";

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
  links?: Array<{ platform?: string | null; url?: string | null }>;
}

const defaultLinks = [
  { platform: "Youtube", url: "https://www.youtube.com/@reactjsBD" },
  { platform: "Github", url: "https://github.com" },
  { platform: "Linkedin", url: "https://linkedin.com" },
  { platform: "Facebook", url: "https://facebook.com" },
  { platform: "Slack", url: "https://slack.com" },
];

const getIcon = (platform?: string | null) => {
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
  const items = links && links.length > 0 ? links : defaultLinks;

  return (
    <TooltipProvider>
      <div className={cn("flex flex-wrap items-center gap-3.5", className)}>
        {items?.map((item, index) => (
          <Tooltip key={item?.platform || index}>
            <TooltipTrigger asChild>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={item?.url ?? "#"}
                className={cn(
                  "p-2 border rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105",
                  // FIXED: Removed absolute 'text-white/70' so iconClassName overrides work perfectly!
                  iconClassName
                )}
              >
                {getIcon(item?.platform)}
              </Link>
            </TooltipTrigger>
            <TooltipContent
              className={cn(
                "bg-white text-darkColor font-semibold shadow-md",
                tooltipClassName
              )}
            >
              {item?.platform || "Social Link"}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default SocialMedia;