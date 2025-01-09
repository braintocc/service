import { textShare } from "./textShare";
import { linkShare } from "./linkShare";
import { mediaShare } from "./mediaShare";
import { isValidCredentials } from "../../../helpers/credentials";
import { isTextShare, isLinkShare, isMediaShare } from "../../../helpers/posts";

export const blueskyStrategies = [
    {
        name: "Bluesky Text",
        site: "bluesky",
        shouldRun: (post: any, destination: any) => isTextShare(post) && post.targets.includes("Bluesky") && isValidCredentials(destination),
        run: (post: any, destination: any) => textShare(post, destination)
    },
    {
        name: "Bluesky Link",
        site: "bluesky",
        shouldRun: (post: any, destination: any) => isLinkShare(post) && post.targets.includes("Bluesky") && isValidCredentials(destination),
        run: (post: any, destination: any) => linkShare(post, destination)
    },

    {
        name: "Bluesky Media",
        site: "bluesky",
        shouldRun: (post: any, destination: any) => isMediaShare(post) && post.targets.includes("Bluesky") && isValidCredentials(destination),
        run: (post: any, destination: any) => mediaShare(post, destination)
    },
];
