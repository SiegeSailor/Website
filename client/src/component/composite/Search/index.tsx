import React from "react";
import { CiSearch } from "react-icons/ci";
import { Button, ButtonGroup } from "@heroui/button";

import styles from "./index.module.scss";
import Modal, { useModal } from "@/component/element/Modal";

export default function () {
  const { isVisible, show, hide } = useModal();
  return (
    <div className={styles.container}>
      <Button>fdsa</Button>
      {/* <Button
        format="outline"
        size="small"
        icon={<ReactIconsCI.CiSearch />}
        text={
          <>
            Type <Key text="/" /> to search
          </>
        }
        onClick={() => {
          show();
        }}
      />
      <Button format="outline" size="small" icon={<ReactIconsCI.CiChat1 />} /> */}

      <Modal isVisible={isVisible} onClickOverlay={hide}>
        {/* <Input /> */}
        <></>
      </Modal>
    </div>
  );
}
