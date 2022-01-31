import { ILocation } from "../models/Commons";
import locationsFile from "../utils/location.json";

export const getLocations = async (search: string) => {
  const textToSearch = search.trim().toLowerCase();
  return locationsFile.filter((e: ILocation) =>
    e.name.toLowerCase().match(textToSearch)
  );
};
