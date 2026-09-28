"use client";

import { useState, useEffect } from "react";
import { Message } from "@/types";
import { md } from "./md";

export function PostContent({
  content,
  title,
  description,
  createdAt
}: {
  title: string;
  content: string;
  description?: string;
  createdAt?: number | string | { _seconds: number; _nanoseconds: number };
}) {
  const [formattedDate, setFormattedDate] = useState<{ month: string; day: number } | null>(null);
  const [isValidDate, setIsValidDate] = useState(false);

  useEffect(() => {
    // Handle different timestamp formats (number, string, or Firebase Timestamp)
    let date: Date | null = null;
    if (createdAt) {
      if (typeof createdAt === 'object' && '_seconds' in createdAt) {
        // Firebase Timestamp format
        const timestamp = createdAt as { _seconds: number; _nanoseconds: number };
        date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
      } else if (typeof createdAt === 'string') {
        // String timestamp
        date = new Date(parseInt(createdAt));
      } else if (typeof createdAt === 'number') {
        // Number timestamp
        date = new Date(createdAt);
      }
    }
    
    if (date && !isNaN(date.getTime())) {
      setIsValidDate(true);
      setFormattedDate({
        month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
        day: date.getDate()
      });
    } else {
      setIsValidDate(false);
      setFormattedDate(null);
    }
  }, [createdAt]);

  return (
    <div className="px-6 pt-4">
      <div className="py-2 border-b border-gray-300 flex items-center">
        {isValidDate && formattedDate && (
          <div className="mr-4 flex flex-col items-center bg-gray-100 rounded-lg p-2 min-w-[80px]">
            <div className="text-xs text-gray-600 uppercase font-medium pb-1 border-b border-gray-300">
              {formattedDate.month}
            </div>
            <div className="text-2xl font-bold text-gray-900 pt-1">
              {formattedDate.day}
            </div>
          </div>
        )}
        <span className="font-bold text-black text-xl min-[480px]:text-2xl lg:text-3xl">
          {title}
        </span>
      </div>
      <p className="italic text-gray-600 mt-2 mb-6">
        {description}
      </p>
      <div
        className="py-6 message"
        dangerouslySetInnerHTML={{ __html: md.render(content ?? "No content") }}
      />
    </div>
  );
}
