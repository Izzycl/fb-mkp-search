import { IBaseItems, IResponseItems, ISearchItem } from "../models/Commons";
import fs from "fs";
import { get } from "lodash";
import puppeteer from "puppeteer";

export const searchItems = async (
  searchConfig: ISearchItem
): Promise<IResponseItems | null> => {
  try {
    const { searchQuery, locations } = searchConfig;
    const itemsFound: IBaseItems[] = [];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    for (const location of locations) {
      await page.goto(
        `${process.env.FACEBOOK_URL}${location}${
          process.env.FACEBOOK_OPTION
        }${searchQuery.replace(/ /g, "%20")}&exact=false`
      );
      const bodyHTML = await page.evaluate(() => document.body.outerHTML);
      const cleanData = bodyHTML.split("feed_units");
      const setupJson = JSON.parse(
        `{ "feed_units${cleanData[1].split(`,"marketplace_seo_page"`)[0]}`
      );
      const data = setupJson.feed_units;
      if (data.edges[0].node.__typename !== "MarketplaceSearchFeedNoResults") {
        data.edges.map((node: any, idx: number) => {
          console.log(node);
          itemsFound.push({
            ide: get(node, "node.listing.id", 0),
            title: get(node, "node.listing.marketplace_listing_title", ""),
            link: `https://www.facebook.com/marketplace/item/${get(
              node,
              "node.listing.id",
              ""
            )}`,
            image: get(
              node,
              "node.listing.primary_listing_photo.image.uri",
              ""
            ),
            price: get(node, "node.listing.listing_price.formatted_amount", 0),
          });
        });
      }
    }

    await browser.close();
    return {
      items: itemsFound,
      quantity: itemsFound.length,
      query: searchQuery,
      locations,
    } as IResponseItems;
  } catch (error) {
    throw new Error(error);
  }
};
