import { textShare as substackTextShare } from "./textShare";
import { linkShare as substackLinkShare } from "./linkShare";
import { mediaShare as substackMediaShare } from "./mediaShare";
import { isValidCredentials } from "../../../helpers/credentials";
import { isTextShare, isLinkShare, isMediaShare } from "../../../helpers/posts";

export const substackStrategies = [
    {
        name: "Substack Text",
        site: "substack",
        shouldRun: (post: any, destination: any) => isTextShare(post) && post.targets.includes("Substack") && isValidCredentials(destination),
        run: (post: any, destination: any) => substackTextShare(post, destination)
    },
    {
        name: "Substack Link",
        site: "substack",
        shouldRun: (post: any, destination: any) => isLinkShare(post) && post.targets.includes("Substack") && isValidCredentials(destination),
        run: (post: any, destination: any) => substackLinkShare(post, destination)
    },

    {
        name: "Substack Media",
        site: "substack",
        shouldRun: (post: any, destination: any) => isMediaShare(post) && post.targets.includes("Substack") && isValidCredentials(destination),
        run: (post: any, destination: any) => substackMediaShare(post, destination)
    },
];
