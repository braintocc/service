import { env } from "bun";
import { jwtVerify, createRemoteJWKSet } from "jose";
import Logger from "../helpers/logger";
import { getConfiguration } from "../helpers/config";

function getToken(headers: any) {
  if (
    headers && headers.authorization &&
    headers.authorization.startsWith("Bearer ")
  ) {
    return headers.authorization.split(" ")[1];
  }
}

export async function checkJwt(req:any, res: any, next: any) {
  if(env.NODE_ENV === "test")
    return next()
  
  const rcvdJwt = getToken(req.headers);
  const config = getConfiguration()
  const JWKS = createRemoteJWKSet(
    new URL(`https://${config.AUTH0_DOMAIN}/.well-known/jwks.json`)
  );

  try {
    await jwtVerify(rcvdJwt, JWKS);
    next()
  } catch (error) {
    Logger.error(error)
    return res.status(401).send();
  }
}
