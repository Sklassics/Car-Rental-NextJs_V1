"use client";

import 'react-day-picker/dist/style.css';
import type * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
// import { cn } from "@/lib/utils";
// import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const cn = (...classes: (string | undefined | null | boolean)[]): string => {
  return classes.filter(Boolean).join(' ');
};

interface ButtonVariantProps {
  variant: "outline" | "ghost";
}

const buttonVariants = ({ variant }: ButtonVariantProps): string => {
  const variants = {
    outline: "border border-white/20 bg-transparent hover:bg-white/10",
    ghost: "bg-transparent hover:bg-white/10"
  };
  return variants[variant] || "";
};

function Calendar({ 
  className, 
  classNames, 
  showOutsideDays = true, 
...props 
}: CalendarProps) {
  return (
    <DayPicker
      animate
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-transparent w-full", className)}
      classNames={{
        // months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        // month: "flex flex-col space-y-4 w-full max-w-sm mx-auto",
        // caption: "flex flex-row items-center justify-between pt-2 mb-4 gap-2",
        caption_label: "text-lg font-bold text-white tracking-wide  flex-1",
        // nav: "hidden",
        // nav_button: cn(
        //   buttonVariants({ variant: "outline" }),
        //   "h-8 w-8 bg-transparent p-0 opacity-80 hover:opacity-100 border-white/20 text-white hover:bg-white/10 transition-all duration-200 rounded-lg"
        // ),
        // nav_button_previous: "order-13",
        // nav_button_next: "",
        // table: "w-full border-collapse space-y-1",
        head_row: "",
        head_cell: "text-white-300 font-semibold text-xs uppercase tracking-wider h-8 text-center",
        row: "",
        cell: "relative text-center align-middle focus-within:relative focus-within:z-20 h-8 w-8 p-0",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-medium text-white hover:bg-white/15 hover:text-white transition-all duration-200 rounded-lg text-center text-sm"
        ),
        day_range_end: "day-range-end",
        day_selected: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 focus:from-blue-500 focus:to-purple-600 shadow-lg shadow-purple-500/30 font-semibold",
        day_today: "bg-white/20 text-white font-bold border border-white/40 shadow-md",
        day_outside: "text-gray-500 opacity-40 hover:bg-white/10 hover:opacity-60",
        day_disabled: "text-gray-600 opacity-25 cursor-not-allowed hover:bg-transparent",
        day_range_middle: "aria-selected:bg-purple-500/30 aria-selected:text-white",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
