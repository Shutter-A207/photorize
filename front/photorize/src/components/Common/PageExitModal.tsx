import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

export default function PageExitModal() {
  const [visible, setVisible] = useState<boolean>(false);

  const footerContent = (
    <div>
      <Button
        label="No"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        className="p-button-text"
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        onClick={() => setVisible(false)}
        autoFocus
      />
    </div>
  );

  return (
    <div className="card flex justify-content-center">
      <Button
        label="Show"
        icon="pi pi-external-link"
        onClick={() => setVisible(true)}
      />
      <Dialog
        header="Header"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
        footer={footerContent}
      >
        <p className="m-0">
          이 페이지를 나가시겠습니까? 변경 사항이 저장되지 않을 수 있습니다.
        </p>
      </Dialog>
    </div>
  );
}
