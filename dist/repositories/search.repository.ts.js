"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchItems = void 0;
const lodash_1 = require("lodash");
const puppeteer_1 = __importDefault(require("puppeteer"));
const searchItems = (searchConfig) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchQuery, locations } = searchConfig;
        const itemsFound = [];
        const browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        for (const location of locations) {
            yield page.goto(`${process.env.FACEBOOK_URL}${location}${process.env.FACEBOOK_OPTION}${searchQuery.replace(/ /g, "%20")}&exact=false`);
            const bodyHTML = yield page.evaluate(() => document.body.outerHTML);
            const cleanData = bodyHTML.split("feed_units");
            const setupJson = JSON.parse(`{ "feed_units${cleanData[1].split(`,"marketplace_seo_page"`)[0]}`);
            const data = setupJson.feed_units;
            if (data.edges[0].node.__typename !== "MarketplaceSearchFeedNoResults") {
                data.edges.map((node) => {
                    itemsFound.push({
                        ide: (0, lodash_1.get)(node, "node.listing.id", 0),
                        title: (0, lodash_1.get)(node, "node.listing.marketplace_listing_title", ""),
                        link: `https://www.facebook.com/marketplace/item/${(0, lodash_1.get)(node, "node.listing.id", "")}`,
                        image: (0, lodash_1.get)(node, "node.listing.primary_listing_photo.image.uri", ""),
                        price: (0, lodash_1.get)(node, "node.listing.listing_price.formatted_amount", 0),
                    });
                });
            }
        }
        yield browser.close();
        return {
            items: itemsFound,
            quantity: itemsFound.length,
            query: searchQuery,
            locations,
        };
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.searchItems = searchItems;
//# sourceMappingURL=search.repository.ts.js.map