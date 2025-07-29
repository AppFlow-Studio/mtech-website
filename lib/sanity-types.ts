import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { TypedObject } from "sanity";
export interface FooterQueryResult {
  Footer_Logo: SanityImageSource;
  Footer_Description: string;
  Footer_Socials: string[];
  Footer_Product_Links: {
    Footer_Product_Link_Name: string,
    Footer_Product_Link_Url: string,
  }[];
  Footer_Resource_Links: {
    Footer_Resource_Link_Name: string,
    Footer_Resource_Link_Url: string,
  }[];
  Footer_Contact_Links: {
    Footer_Contact_Link_Name: string,
    Footer_Contact_Link_Url: string,
    Footer_Resource_Link_Icon: string,
  }[];
}

export interface FooterQueryResultProps {
  data: FooterQueryResult[];
}

export interface PosSystemsQueryResultProps {
  data: PosSystemsQueryResult[];
}

export interface PosSystemsQueryResult {
  Pos_Systems: {
    POS_System_Header: string;
    POS_System_SubText: string;
    POS_System_Image: SanityImageSource;
    POS_System_Link: string;
  }[];
}

export interface TestimonialQueryResultProps {
  data: TestimonialQueryResult[];
}

export interface TestimonialQueryResult {
  Testimonial_Header: string;
  Testimonial_Cards: {
    Testimonial_Card_Review: string;
    Testimonial_Card_Rating: number;
    Testimonial_Card_Author: string;
    Testimonial_Card_SubText: string;
    Testimonial_Card_Image: SanityImageSource;
  }[];
}


export interface ReturnPolicyQueryResultProps {
  data: ReturnPolicyQueryResult[];
}

export interface ReturnPolicyQueryResult {
  ReturnPolicy_Header: string;
  ReturnPolicy_Section: {
    ReturnPolicy_Section_Header: string;
    ReturnPolicy_Section_Body: string;
  }[];
}

export interface RateCardsQueryResultProps {  
  rateCards: RateCardsQueryResult[];
}

export interface RateCardsQueryResult {
  RateCards_Header: string;
  RateCards_Rate: string;
  RateCards_Description: string;
  RateCards_CTA: string;
  RateCards_IsFeatured: boolean;
  ReturnPolicy_Section_Body: TypedObject[];
}