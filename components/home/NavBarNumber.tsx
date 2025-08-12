'use server'
import { sanityFetch } from "@/utils/sanity/lib/live";
import { Phone } from "lucide-react";
import { defineQuery } from "next-sanity";
import Link from "next/link";
const Footer_Query = defineQuery(`*[_type == 'Footer']`)
import { FooterQueryResultProps } from "@/lib/sanity-types";

const options = { next: { revalidate: 30 } };
const NavBarNumber = async () => {
    const FooterData = await sanityFetch({
        query: Footer_Query,
        ...options,
    });
    const phoneNumber = FooterData.data[0].Footer_Contact_Links.find((link: any) => link.Footer_Resource_Link_Icon === "phone");
    return phoneNumber;
    
};

export default NavBarNumber;