export async function toDataURL(url: string) {
    let response = await fetch(url);
    let contentType = response.headers.get("Content-Type");
    let buffer = Buffer.from(await response.arrayBuffer());
    return "data:" + contentType + ';base64,' + buffer.toString('base64');
}
