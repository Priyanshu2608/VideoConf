"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "./ui/button";

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  buttonText: string;
  handleClick: () => void | Promise<void>;
  children?: React.ReactNode;
  image?: string;
  buttonIcon?: string;
}

const MeetingModal = ({
  isOpen,
  onClose,
  title,
  className,
  buttonText,
  handleClick,
  children,
  image,
  buttonIcon,
}: MeetingModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // Only close when user manually closes modal (ESC / outside click)
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 border-none bg-[var(--color-dark-1)] px-6 py-9 text-white">
        <DialogHeader>
          {/* REQUIRED for Radix accessibility */}
          <DialogTitle className={cn("text-3xl font-bold leading-[42px]", className)}>
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {image && (
            <div className="flex justify-center">
              <Image src={image} alt="image" width={72} height={72} />
            </div>
          )}

          {children}

          <Button
            className="bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0"
            onClick={async () => {
              await handleClick(); // create meeting + navigate
            }}
          >
            {buttonIcon && (
              <Image
                src={buttonIcon}
                alt="button icon"
                width={13}
                height={13}
              />
            )}{" "}
            &nbsp;
            {buttonText || "Schedule Meeting"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
