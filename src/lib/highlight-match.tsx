import React from "react";

/**
 * 高亮匹配的搜索文本
 */
export function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query || !text) return text;
  
  // 转义正则特殊字符
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} className="bg-primary/30 text-foreground px-0.5 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

/**
 * 截取包含匹配文本的上下文
 */
export function getMatchContext(text: string, query: string, contextLength = 50): string {
  if (!query || !text) return text;
  
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);
  
  if (index === -1) {
    // 如果没找到，返回截断的文本
    return text.length > 100 ? text.slice(0, 100) + "..." : text;
  }
  
  const start = Math.max(0, index - contextLength);
  const end = Math.min(text.length, index + query.length + contextLength);
  
  let result = text.slice(start, end);
  
  if (start > 0) result = "..." + result;
  if (end < text.length) result = result + "...";
  
  return result;
}