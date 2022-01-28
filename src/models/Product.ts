import { get } from "lodash";
import { IBaseItems } from "./Commons";

interface ProductDoc extends IBaseItems {
  ide: number;
  title: string;
  image: string;
  price: number;
  link: string;
  location: string;
  idLocation: string;
}

export class Product implements ProductDoc {
  ide: number;
  title: string;
  image: string;
  price: number;
  link: string;
  location: string;
  idLocation: string;
  constructor(params: Partial<ProductDoc>) {
    this.ide = get(params, "node.listing.id", "");
    this.title = get(params, "node.listing.marketplace_listing_title", "");
    this.link = `https://www.facebook.com/marketplace/item/${get(
      params,
      "node.listing.id",
      ""
    )}`;
    this.image = get(
      params,
      "node.listing.primary_listing_photo.image.uri",
      ""
    );
    this.price = get(params, "node.listing.listing_price.formatted_amount", "");
    this.location = get(
      params,
      "node.listing.location.reverse_geocode.city_page.display_name",
      ""
    );
    this.idLocation = get(
      params,
      "node.listing.location.reverse_geocode.city_page.id",
      ""
    );
  }
}
