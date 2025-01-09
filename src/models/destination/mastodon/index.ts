import { textShare as mastodonTextShare } from "./textShare";
import { linkShare as mastodonLinkShare } from "./linkShare";
import { mediaShare as mastodonMediaShare } from "./mediaShare";
import { isValidCredentials } from "../../../helpers/credentials";
import { isTextShare, isLinkShare, isMediaShare } from "../../../helpers/posts";

export const mastodonStrategies = [
    {
        name: "Mastodon Text",
        site: "mastodon",
        shouldRun: (post: any, destination: any) => isTextShare(post) && post.targets.includes("Mastodon") && isValidCredentials(destination),
        run: (post: any, destination: any) => mastodonTextShare(post, destination)
    },
    {
        name: "Mastodon Link",
        site: "mastodon",
        shouldRun: (post: any, destination: any) => isLinkShare(post) && post.targets.includes("Mastodon") && isValidCredentials(destination),
        run: (post: any, destination: any) => mastodonLinkShare(post, destination)
    },

    {
        name: "Mastodon Media",
        site: "mastodon",
        shouldRun: (post: any, destination: any) => isMediaShare(post) && post.targets.includes("Mastodon") && isValidCredentials(destination),
        run: (post: any, destination: any) => mastodonMediaShare(post, destination)
    },
];
