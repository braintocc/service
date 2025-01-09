import { textShare as twitterTextShare } from "./textShare";
import { linkShare as twitterLinkShare } from "./linkShare";
import { isValidCredentials } from "../../../helpers/credentials";
import { isTextShare, isLinkShare } from "../../../helpers/posts";

export const twitterStrategies = [
    {
        name: "Twitter Text",
        site: "twitter",
        shouldRun: (post: any, destination: any) => isTextShare(post) && post.targets.includes("Twitter") && isValidCredentials(destination),
        run: (post: any, destination: any) => twitterTextShare(post, destination)
    },
    {
        name: "Twitter Link",
        site: "twitter",
        shouldRun: (post: any, destination: any) => isLinkShare(post) && post.targets.includes("Twitter") && isValidCredentials(destination),
        run: (post: any, destination: any) => twitterLinkShare(post, destination)
    },
];
