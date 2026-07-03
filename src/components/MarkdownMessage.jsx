import React, { useState } from "react";
import { IoCopyOutline, IoCheckmark } from "react-icons/io5";

export default function MarkdownMessage({ content = "" }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!content) return null;

  // Split content by code blocks: ```[language]\n[code]\n```
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3.5 text-sm leading-relaxed tracking-normal text-slate-800 dark:text-slate-200">
      {parts.map((part, index) => {
        if (part.startsWith("```")) {
          // Parse code block
          const lines = part.split("\n");
          const firstLine = lines[0].replace("```", "").trim();
          const language = firstLine || "code";
          const code = lines.slice(1, lines.length - 1).join("\n");

          return (
            <div
              key={index}
              className="my-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-900 text-slate-100 shadow-md font-mono text-[13px]"
            >
              {/* Code header bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-slate-950 text-slate-400 text-xs border-b border-slate-800 select-none">
                <span className="font-semibold uppercase tracking-wider">{language}</span>
                <button
                  onClick={() => copyToClipboard(code, index)}
                  className="flex items-center gap-1 hover:text-white transition-colors duration-200"
                >
                  {copiedIndex === index ? (
                    <>
                      <IoCheckmark size={14} className="text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <IoCopyOutline size={14} />
                      <span>Copy code</span>
                    </>
                  )}
                </button>
              </div>
              {/* Code lines container */}
              <pre className="p-4 overflow-x-auto whitespace-pre scrolling-touch">
                <code className="block text-slate-200">{code}</code>
              </pre>
            </div>
          );
        } else {
          // Parse inline text (bold, lists, inline code)
          const textLines = part.split("\n");
          return textLines.map((line, lineIdx) => {
            if (!line.trim()) return <div key={`${index}-${lineIdx}`} className="h-2" />;

            // Render bullet points
            if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
              const bulletText = line.replace(/^[-*]\s+/, "");
              return (
                <li key={`${index}-${lineIdx}`} className="ml-4 list-disc marker:text-brand-indigo">
                  {parseInlineFormatting(bulletText)}
                </li>
              );
            }

            // Render numbered lists
            if (/^\d+\.\s+/.test(line.trim())) {
              const numberText = line.replace(/^\d+\.\s+/, "");
              const number = line.match(/^\d+/)[0];
              return (
                <div key={`${index}-${lineIdx}`} className="flex gap-2 ml-1">
                  <span className="font-bold text-brand-indigo">{number}.</span>
                  <div>{parseInlineFormatting(numberText)}</div>
                </div>
              );
            }

            // Render regular paragraph line
            return <p key={`${index}-${lineIdx}`}>{parseInlineFormatting(line)}</p>;
          });
        }
      })}
    </div>
  );
}

// Function to handle inline markdown features: bold (**text**) and inline code (`code`)
function parseInlineFormatting(text) {
  // Regex to split by bold asterisks or inline code backticks
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-extrabold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    } else if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded-md font-mono text-xs bg-slate-100 dark:bg-slate-800 text-brand-purple font-semibold border border-slate-200/50 dark:border-slate-700/50"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
