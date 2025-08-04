import { fromMarkdown } from "mdast-util-from-markdown";
import { Root, RootContent } from "mdast";
import { toMarkdown } from "mdast-util-to-markdown";

export function remarkShowLineNumbers() {
  return function transformer(tree: Root) {
    for (const node of tree.children) {
      if (node.type === "code") {
        node.meta = node.meta + (node.meta ? " " : "") + "showLineNumbers";
      }
    }
  };
}

export function remarkRehypeCallout() {
  function createCallout(): {
    type: "paragraph";
    data: {
      hName: "callout";
      hProperties: {
        color: string;
        title: string;
      };
    };
    children: RootContent[];
  } {
    return {
      type: "paragraph",
      data: {
        hName: "callout",
        hProperties: {
          color: "",
          title: "",
        },
      },
      children: [],
    };
  }

  function convertNodeMarkdown(node: any): string {
    try {
      return toMarkdown(node);
    } catch {
      if (node.type === "text") return node.value;
      if (node.type === "inlineCode") return `\`${node.value}\``;
      if (node.type === "code")
        return `\`\`\`${node.lang || ""}\n${node.value}\n\`\`\``;
      if (node.type === "image") return `![${node.alt || ""}](${node.url})`;
      if (node.type === "link")
        return `[${convertNodeMarkdown({
          type: "paragraph",
          children: node.children,
        })}](${node.url})`;
      if (node.type === "strong")
        return `**${convertNodeMarkdown({
          type: "paragraph",
          children: node.children,
        })}**`;
      if (node.type === "emphasis")
        return `*${convertNodeMarkdown({
          type: "paragraph",
          children: node.children,
        })}*`;
      if (node.children)
        return node.children
          .map((child: any) => convertNodeMarkdown(child))
          .join("");
      return "";
    }
  }

  function reconstructMarkdown(nodes: any[]): string {
    return nodes.map((node) => convertNodeMarkdown(node)).join("\n\n");
  }

  function parseContent(content: string): RootContent[] {
    try {
      return fromMarkdown(content).children;
    } catch {
      return [
        {
          type: "paragraph",
          children: [{ type: "text", value: content }],
        } as RootContent,
      ];
    }
  }

  function seeIsContentLike(text: string): boolean {
    return (
      text.length > 50 ||
      text.endsWith(":") ||
      text.includes("*") ||
      text.includes("`")
    );
  }

  function addContent(content: string, calloutNodes: any[]): void {
    if (!content) return;
    if (content.startsWith(":::")) return;
    calloutNodes.push(...parseContent(content));
  }

  return function transformer(tree: Root) {
    const childrenTree: typeof tree.children = [];
    let isInCallout = false;
    let callout = createCallout();
    let calloutNodes: any[] = [];

    function flushCallout(): void {
      if (calloutNodes.length > 0) {
        const markdownContent = reconstructMarkdown(calloutNodes);
        try {
          const parsedContent = fromMarkdown(markdownContent);
          callout.children.push(...parsedContent.children);
        } catch {
          callout.children.push(...calloutNodes);
        }
      }

      if (callout.children.length > 0) {
        childrenTree.push(callout as (typeof tree.children)[0]);
      }

      isInCallout = false;
      callout = createCallout();
      calloutNodes = [];
    }

    function processSingleCallout(match: RegExpMatchArray): void {
      const singleCallout = createCallout();
      singleCallout.data.hProperties.color = match[1];
      singleCallout.data.hProperties.title = match[2]?.trim() || "";

      const content = match[3].trim();
      if (content) {
        singleCallout.children.push(...parseContent(content));
      }

      childrenTree.push(singleCallout as (typeof tree.children)[0]);
    }

    function processCalloutStart(match: RegExpMatchArray): void {
      const calloutType = match[1];
      const potentialTitle = match[2]?.trim();
      const contentAfterNewline = match[3]?.trim();

      isInCallout = true;
      callout.data.hProperties.color = calloutType;

      if (potentialTitle && seeIsContentLike(potentialTitle)) {
        callout.data.hProperties.title = "";
        calloutNodes.push(...parseContent(potentialTitle));
      } else {
        callout.data.hProperties.title = potentialTitle || "";
      }

      addContent(contentAfterNewline, calloutNodes);
    }

    for (const node of tree.children) {
      let nodeText = "";
      let isCalloutMarker = false;

      if (node.type === "paragraph") {
        nodeText = reconstructMarkdown([node]);
      }

      const singleCalloutMatch = nodeText.match(
        /^:::([^\s\n]+)(?:\s+([^\n]*))?\n([\s\S]*?)\n:::\s*$/
      );
      if (singleCalloutMatch) {
        processSingleCallout(singleCalloutMatch);
        continue;
      }

      const startMatch = nodeText.match(
        /^:::([^\s\n]+)(?:\s+([^\n]*))?\n?([\s\S]*)$/
      );
      if (startMatch) {
        processCalloutStart(startMatch);
        isCalloutMarker = true;
      }

      if (isInCallout && nodeText.includes(":::")) {
        const endMatch = nodeText.match(/^([\s\S]*?)\s*:::\s*$/);
        if (endMatch) {
          addContent(endMatch[1]?.trim(), calloutNodes);
          flushCallout();
          isCalloutMarker = true;
        }
      }

      if (nodeText.trim() === ":::" && isInCallout) {
        flushCallout();
        isCalloutMarker = true;
      }

      if (isInCallout && !isCalloutMarker) {
        calloutNodes.push(node);
      } else if (!isCalloutMarker) {
        childrenTree.push(node);
      }
    }

    if (isInCallout) {
      flushCallout();
    }

    tree.children = childrenTree;
  };
}
