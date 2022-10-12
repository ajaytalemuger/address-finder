import { Map, Overlay } from "ol";

export type Address = {
  result_type: string;
  country: string;
  state: string;
  formatted: string;
};

export type AddressApiResult = {
  success: boolean;
  address: Address | undefined;
};

export type StateFields = {
  olMap: Map | undefined;
  address: Address | undefined;
  addressOverlay: Overlay | undefined;
};

export type AddressPopupProps = {
  address: Address;
  onClose: Function;
};
