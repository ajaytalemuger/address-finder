import express, { Request, Response } from "express";
import axios from "axios";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

const apiAddress = express.Router();

type Address = {
  result_type: string;
  country: string;
  state: string;
  formatted: string;
};

apiAddress.get("/", async (req: Request, res: Response) => {
  const { lat, lon } = req.query;

  // inital address to send in case of invalid coordinates or coordinates with no address is provided
  let address: Address = {
    result_type: "unknown",
    country: "",
    state: "",
    formatted: "",
  };

  try {
    const response = await axios.get(
      `${process.env.REVESE_GEOCODE_API}?lat=${lat}&lon=${lon}&apiKey=${process.env.REVESE_GEOCODE_API_KEY}`
    );
    const apiResult = response.data;

    const addressDetails = apiResult.features?.[0]?.properties;

    // if address is found for the given coordinates then extract the relevant fields
    if (addressDetails && addressDetails.result_type !== "unknown") {
      address = {
        result_type: addressDetails.result_type,
        country: addressDetails.country,
        state: addressDetails.state,
        formatted: addressDetails.formatted,
      };
    }

    res.send(address);
  } catch (error) {
    console.log("Error while getting address ", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
});

export default apiAddress;
