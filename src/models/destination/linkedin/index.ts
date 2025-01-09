import { textShare as LinkedInTextShare } from "./textShare";
import { linkShare as LinkedInLinkShare } from "./linkShare";
import { mediaShare as LinkedInMediaShare } from "./mediaShare";
import { isValidCredentials } from "../../../helpers/credentials";
import { isTextShare, isLinkShare, isMediaShare } from "../../../helpers/posts";

export const linkedInStrategies = [
    {
        name: "LinkedIn Text",
        site: "linkedin",
        shouldRun: (post: any, destination: any) => isTextShare(post) && post.targets.includes("LinkedIn") && isValidCredentials(destination),
        run: (post: any, destination: any) => LinkedInTextShare(post, destination)
    },
    {
        name: "LinkedIn Link",
        site: "linkedin",
        shouldRun: (post: any, destination: any) => isLinkShare(post) && post.targets.includes("LinkedIn") && isValidCredentials(destination),
        run: (post: any, destination: any) => LinkedInLinkShare(post, destination)
    },

    {
        name: "LinkedIn Media",
        site: "linkedin",
        shouldRun: (post: any, destination: any) => isMediaShare(post) && post.targets.includes("LinkedIn") && isValidCredentials(destination),
        run: (post: any, destination: any) => LinkedInMediaShare(post, destination)
    },
];
