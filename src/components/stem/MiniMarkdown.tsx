import React from 'react';

/**
 * Minimal Markdown → JSX renderer for the tutorial content imported from
 * the real project catalog (src/data/projectCatalog.ts). Covers exactly
 * what that content uses — headers, bold, inline/fenced code, lists — not
 * a general-purpose Markdown engine, so no extra dependency for one field.
 */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-bold text-stem-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={`${keyPrefix}-${i}`} className="bg-stem-mist text-stem-coral px-1.5 py-0.5 rounded text-[0.85em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={`${keyPrefix}-${i}`}>{part}</React.Fragment>;
  });
}

export const MiniMarkdown: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];
  let codeBuffer: string[] | null = null;
  let codeLang = '';

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      blocks.push(
        <ul key={key} className="list-disc list-inside space-y-1 my-2">
          {listItems.map((item, i) => (
            <li key={i} className="text-sm font-body-stem text-stem-ink-soft">
              {renderInline(item, `${key}-${i}`)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, idx) => {
    const key = `b${idx}`;

    if (line.trim().startsWith('```')) {
      if (codeBuffer === null) {
        flushList(key);
        codeBuffer = [];
        codeLang = line.trim().slice(3);
      } else {
        blocks.push(
          <pre key={key} className="bg-stem-ink text-stem-mist rounded-xl p-4 overflow-x-auto text-xs my-3">
            <code>{codeBuffer.join('\n')}</code>
          </pre>
        );
        codeBuffer = null;
        codeLang = '';
      }
      return;
    }
    if (codeBuffer !== null) {
      codeBuffer.push(line);
      return;
    }

    if (line.startsWith('### ')) {
      flushList(key);
      blocks.push(
        <h4 key={key} className="font-display font-bold text-sm text-stem-ink mt-4 mb-1">
          {renderInline(line.slice(4), key)}
        </h4>
      );
    } else if (line.startsWith('## ')) {
      flushList(key);
      blocks.push(
        <h3 key={key} className="font-display font-extrabold text-base text-stem-ink mt-5 mb-2">
          {renderInline(line.slice(3), key)}
        </h3>
      );
    } else if (line.startsWith('# ')) {
      flushList(key);
      blocks.push(
        <h2 key={key} className="font-display font-extrabold text-lg text-stem-teal mt-2 mb-2">
          {renderInline(line.slice(2), key)}
        </h2>
      );
    } else if (/^[-*]\s+/.test(line.trim())) {
      listItems.push(line.trim().replace(/^[-*]\s+/, ''));
    } else if (line.trim() === '') {
      flushList(key);
    } else {
      flushList(key);
      blocks.push(
        <p key={key} className="text-sm font-body-stem text-stem-ink-soft leading-relaxed my-1">
          {renderInline(line, key)}
        </p>
      );
    }
  });
  flushList('end');
  void codeLang;

  return <div>{blocks}</div>;
};
