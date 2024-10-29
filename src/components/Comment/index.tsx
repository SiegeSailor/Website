import React from "react";
import Giscus from "@giscus/react";

import styles from "./styles.module.scss";

function useIsAppeared(className: string) {
  const [isAppeared, setIsAppeared] = React.useState(false);

  React.useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          const iframes = document.querySelectorAll("iframe");
          iframes.forEach((iframe) => {
            try {
              const element = iframe.contentDocument?.querySelector(
                `.${className}`
              );
              if (element) {
                setIsAppeared(true);
                observer.disconnect();
              }
            } catch (error) {
              console.error("Error accessing iframe content:", error);
            }
          });
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [className]);

  return isAppeared;
}

export default function Comments(): JSX.Element {
  const isAppeared = useIsAppeared("gsc-reactions");
  console.log("===========> isAppeared", isAppeared);
  return (
    <div className={styles.module}>
      <div className={styles.container}>
        <Giscus
          category="Comments"
          categoryId="DIC_kwDOM7PwvM4CjE_u"
          emitMetadata="1"
          id="comments"
          inputPosition="top"
          lang="en"
          loading="lazy"
          mapping="title"
          reactionsEnabled="1"
          repo="siegesailor/Website"
          repoId="R_kgDOM7PwvA="
          strict="0"
          theme="preferred_color_scheme"
        />
      </div>
    </div>
  );
}
