// for sanity client
import sanityClient from "@sanity/client";
import ImageUrlBuilder from "@sanity/image-url";

export const client = sanityClient({
    projectId: '54y08kqm',
    dataset: 'production',
    apiVersion: '2022-12-26',
    useCdn: false,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN
})

const builder = ImageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);