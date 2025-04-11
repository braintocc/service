import { mediaShare as instagramMediaShare } from "./mediaShare";
import { isValidCredentials } from "../../../helpers/credentials";
import { isMediaShare } from "../../../helpers/posts";

export const instagramStrategies = [
    {
        name: "Instagram Media",
        site: "instagram",
        shouldRun: (post: any, destination: any) => isMediaShare(post) && post.targets.includes("Instagram") && isValidCredentials(destination),
        run: (post: any, destination: any) => instagramMediaShare(post, destination)
    }
];