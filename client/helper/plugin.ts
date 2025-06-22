import { Plugin } from "unified";
import { Root, RootContent, Text } from "mdast";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toMarkdown } from "mdast-util-to-markdown";

export const remarkRehypeCallout: Plugin<[], Root> = () => {
  function createCallout() {
    return {
      type: "paragraph",
      data: {
        hName: "callout",
        hProperties: {
          color: "",
          title: "",
        },
      },
      children: [] as RootContent[],
    };
  }

  function nodeToMarkdown(node: any): string {
    try {
      return toMarkdown(node);
    } catch {
      if (node.type === "text") return node.value;
      if (node.type === "inlineCode") return `\`${node.value}\``;
      if (node.type === "code")
        return `\`\`\`${node.lang || ""}\n${node.value}\n\`\`\``;
      if (node.type === "image") return `![${node.alt || ""}](${node.url})`;
      if (node.type === "link")
        return `[${nodeToMarkdown({
          type: "paragraph",
          children: node.children,
        })}](${node.url})`;
      if (node.type === "strong")
        return `**${nodeToMarkdown({
          type: "paragraph",
          children: node.children,
        })}**`;
      if (node.type === "emphasis")
        return `*${nodeToMarkdown({
          type: "paragraph",
          children: node.children,
        })}*`;
      if (node.children) {
        return node.children
          .map((child: any) => nodeToMarkdown(child))
          .join("");
      }
      return "";
    }
  }

  function reconstructMarkdown(nodes: any[]): string {
    return nodes.map((node) => nodeToMarkdown(node)).join("\n\n");
  }

  return (tree: Root) => {
    const childrenTree: typeof tree.children = [];
    let isInCallout = false;
    let callout = createCallout();
    let calloutNodes: any[] = [];

    function flush() {
      if (calloutNodes.length > 0) {
        const markdownContent = reconstructMarkdown(calloutNodes);
        try {
          const parsedContent = fromMarkdown(markdownContent);
          callout.children.push(...parsedContent.children);
        } catch (error) {
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

    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];

      let nodeText = "";
      let isCalloutMarker = false;

      if (node.type === "paragraph") {
        nodeText = reconstructMarkdown([node]);
      }

      const singleCalloutMatch = nodeText.match(
        /^:::([^\s\n]+)(?:\s+([^\n]*))?\n([\s\S]*?)\n:::\s*$/
      );
      if (singleCalloutMatch) {
        const singleCallout = createCallout();
        singleCallout.data.hProperties.color = singleCalloutMatch[1];
        singleCallout.data.hProperties.title =
          singleCalloutMatch[2]?.trim() || "";

        const content = singleCalloutMatch[3].trim();
        if (content) {
          try {
            const parsedContent = fromMarkdown(content);
            singleCallout.children.push(...parsedContent.children);
          } catch {
            singleCallout.children.push({
              type: "paragraph",
              children: [{ type: "text", value: content }],
            } as RootContent);
          }
        }

        childrenTree.push(singleCallout as (typeof tree.children)[0]);
        continue;
      }

      const startMatch = nodeText.match(
        /^:::([^\s\n]+)(?:\s+([^\n]*))?\n?(.*)$/s
      );

      if (startMatch) {
        const calloutType = startMatch[1];
        const potentialTitle = startMatch[2]?.trim();
        const contentAfterNewline = startMatch[3]?.trim();

        isInCallout = true;
        callout.data.hProperties.color = calloutType;

        const looksLikeContent =
          potentialTitle &&
          (potentialTitle.length > 50 || // Too long for a typical title
            potentialTitle.endsWith(":") || // Ends with colon (likely content)
            potentialTitle.includes("*") || // Contains markdown formatting
            potentialTitle.includes("`")); // Contains inline code

        if (looksLikeContent) {
          callout.data.hProperties.title = "";

          try {
            const parsedContent = fromMarkdown(potentialTitle);
            calloutNodes.push(...parsedContent.children);
          } catch {
            calloutNodes.push({
              type: "paragraph",
              children: [{ type: "text", value: potentialTitle }],
            });
          }
        } else {
          callout.data.hProperties.title = potentialTitle || "";
        }

        if (contentAfterNewline && !contentAfterNewline.startsWith(":::")) {
          try {
            const parsedContent = fromMarkdown(contentAfterNewline);
            calloutNodes.push(...parsedContent.children);
          } catch {
            calloutNodes.push({
              type: "paragraph",
              children: [{ type: "text", value: contentAfterNewline }],
            });
          }
        }

        isCalloutMarker = true;
      }

      if (isInCallout && nodeText.includes(":::")) {
        const endMatch = nodeText.match(/^(.*?)\s*:::\s*$/s);
        if (endMatch) {
          const contentBeforeEnd = endMatch[1]?.trim();
          if (contentBeforeEnd) {
            try {
              const parsedContent = fromMarkdown(contentBeforeEnd);
              calloutNodes.push(...parsedContent.children);
            } catch {
              calloutNodes.push({
                type: "paragraph",
                children: [{ type: "text", value: contentBeforeEnd }],
              });
            }
          }

          flush();
          isCalloutMarker = true;
        }
      }

      if (nodeText.trim() === ":::" && isInCallout) {
        flush();
        isCalloutMarker = true;
      }

      // Handle content
      if (isInCallout && !isCalloutMarker) {
        calloutNodes.push(node);
      } else if (!isCalloutMarker) {
        childrenTree.push(node);
      }
    }

    if (isInCallout) {
      flush();
    }

    tree.children = childrenTree;
  };
};
