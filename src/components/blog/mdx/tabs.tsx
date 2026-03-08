"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export const Tabs = ({ children }: { children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = React.Children.toArray(children).filter(
    (child): child is React.ReactElement =>
      React.isValidElement(child) && !!(child.props as any).title
  );

  if (tabs.length === 0) return null;

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border/40 bg-card shadow-sm">
      <div className="flex border-b border-border/40 bg-muted/30 px-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-all relative whitespace-nowrap",
              activeTab === index
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {(tab.props as any).title}
            {activeTab === index && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>
      <div className="p-6">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={cn(activeTab === index ? "block" : "hidden")}
          >
            {tab}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Tab = ({ children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className="prose prose-neutral dark:prose-invert prose-sm max-w-none">
      {children}
    </div>
  );
};
