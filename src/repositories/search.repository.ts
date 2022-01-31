import {
  IBaseItems,
  ILocation,
  IResponseItems,
  ISearchItem,
} from "../models/Commons";
import fs from "fs";
import { concat, get, isEqual, merge } from "lodash";
import puppeteer from "puppeteer";
import locationFile from "../utils/location.json";
import { Product } from "../models/Product";

const saveNewsLocationsIfFoundItems = async (items: IBaseItems[]) => {
  try {
    const newLocation: ILocation[] = items.map((val: IBaseItems) => {
      return {
        id: val.idLocation,
        name: val.location,
      };
    });
    const saveLocal: ILocation[] = [
      ...newLocation.filter(
        (v, i, a) => a.findIndex((t) => t.id === v.id) === i
      ),
      ...locationFile,
    ].filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
    fs.writeFile(
      "./src/utils/location.json",
      JSON.stringify(saveLocal),
      (err) => {
        err ? console.log(err) : console.log("ok json locations");
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const searchItems = async (
  searchConfig: ISearchItem
): Promise<IResponseItems | null> => {
  try {
    const { searchQuery, locations } = searchConfig;
    const itemsFound: IBaseItems[] = [];
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    for (const location of locations) {
      await page.goto(
        `${process.env.FACEBOOK_URL}${location}${
          process.env.FACEBOOK_OPTION
        }${searchQuery.replace(/ /g, "%20")}&exact=false`
      );
      const bodyHTML = await page.evaluate(() => document.body.outerHTML);
      // fs.writeFile("./log.html", bodyHTML, () => {});
      const cleanData = bodyHTML.split("feed_units");
      const setupJson = JSON.parse(
        `{ "feed_units${cleanData[1].split(`,"marketplace_seo_page"`)[0]}`
      );
      const data = setupJson.feed_units;
      if (data.edges[0].node.__typename !== "MarketplaceSearchFeedNoResults") {
        data.edges.map((node: any) => {
          itemsFound.push(new Product(node));
        });
      }
    }
    await saveNewsLocationsIfFoundItems(itemsFound);
    await browser.close();
    return {
      items: itemsFound.filter(
        (v, i, a) => a.findIndex((t) => t.ide === v.ide) === i
      ),
      quantity: itemsFound.length,
      query: searchQuery,
      locations,
    } as IResponseItems;
  } catch (error) {
    throw new Error(error);
  }
};
