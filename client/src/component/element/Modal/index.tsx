import React from "react";
import ReactDOM from "react-dom";

import styles from "./index.module.scss";

export const useModal = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  return {
    isVisible,
    show: React.useCallback(() => setIsVisible(true), []),
    hide: React.useCallback(() => setIsVisible(false), []),
  };
};

export default function ({
  isVisible,
  onClickOverlay,
  children,
}: {
  isVisible: boolean;
  onClickOverlay: () => void;
  children: React.ReactNode;
}) {
  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div
      className={styles.overlay}
      onClick={(event) => {
        event.stopPropagation();
        onClickOverlay();
      }}
    >
      <div
        className={styles.container}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
