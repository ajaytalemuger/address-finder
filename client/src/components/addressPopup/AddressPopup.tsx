import React, { SyntheticEvent } from "react";
import { AddressPopupProps } from "../../types";
import { RESULT_TYPE_UNKNOWN } from "../../constants";

import "./AddressPopup.css";

const AddressPopup = (props: AddressPopupProps) => {
  const { address, onClose } = props;

  const handleClose = (event: SyntheticEvent) => {
    event.preventDefault();
    onClose();
  };

  if (!address) {
    return <></>;
  }

  return (
    <div className="addressPopup">
      <a href="#" className="addressPopupCloser" onClick={handleClose}></a>
      {address.result_type === RESULT_TYPE_UNKNOWN
        ? "Address not found"
        : `${address.formatted}`}
    </div>
  );
};

export default AddressPopup;
