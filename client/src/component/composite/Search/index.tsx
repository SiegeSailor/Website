import React from "react";
import * as ReactIconsCI from "react-icons/ci";

import Button from "@/component/element/Button";
import Input from "@/component/element/Input";
import styles from "./index.module.scss";
import Key from "@/component/element/Key";
import Modal, { useModal } from "@/component/element/Modal";

export default function () {
  const { isVisible, show, hide } = useModal();
  return (
    <div className={styles.container}>
      <Button
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
      <Button format="outline" size="small" icon={<ReactIconsCI.CiChat1 />} />

      <Modal isVisible={isVisible} onClickOverlay={hide}>
        <Input />
      </Modal>
    </div>
  );
}
