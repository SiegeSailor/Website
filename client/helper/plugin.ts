import { Plugin } from "unified";
import { Root, RootContent, Text } from "mdast";

export const remarkRehypeCallout: Plugin<[], Root> = () => {
  function createCallout() {
    return {
      type: "paragraph",
      data: {
        hName: "callout",
        hProperties: {
          category: "",
          title: "",
        },
      },
      children: [] as RootContent[],
    };
  }

  return (tree: Root) => {
    const childrenTree: typeof tree.children = [];

    let isInCallout = false;
    let callout = createCallout();

    function flush() {
      childrenTree.push(callout as (typeof tree.children)[0]);
      isInCallout = false;
      callout = createCallout();
    }

    for (const node of tree.children) {
      if (
        node.type === "paragraph" &&
        node.children.length === 1 &&
        node.children[0].type === "text"
      ) {
        const text = (node.children[0] as Text).value.trim();

        const match = text.match(/^:::([^\s]+)\s*(.*)?$/);
        if (match) {
          isInCallout = true;
          callout.data.hProperties.category = match[1];
          callout.data.hProperties.title = match[2] || "";
          continue;
        }

        if (text === ":::") {
          flush();
          continue;
        }
      }

      if (isInCallout) {
        callout.children.push(node);
      } else {
        childrenTree.push(node);
      }
    }

    if (isInCallout) flush();

    tree.children = childrenTree;
  };
};
