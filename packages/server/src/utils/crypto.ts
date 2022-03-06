import { serialize } from "cookie";
import crypto from "crypto"
import { promisify } from "util"
import tokenGenerator from "./TokenGenerator";
import { Response } from 'express';

const scrypt = promisify(crypto.scrypt)

export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(8).toString("hex")
  const derivedKey = await scrypt(password, salt, 64) as Buffer;
  return salt + ":" + derivedKey.toString("hex")
}

export async function checkPassword(plaintextPassword: string, hashedPassword: string) {
  const [salt, key] = hashedPassword.split(":")
  const derivedKey = (await scrypt(plaintextPassword, salt, 64)) as NodeJS.ArrayBufferView
  return crypto.timingSafeEqual(Buffer.from(key, "hex"), derivedKey)
}

export function sha256(value: string) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex")
}

export function uuidv4(): string {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (c ^ (crypto.webcrypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  )
}

export const FINGERPRINT_COOKIE_NAME = "__User-Fgp"
export const FINGERPRINT_COOKIE_MAX_AGE = 60 * 60 * 8 // 8 hours
export function setFingerprintCookieAndSignJwt(fingerprint: string, res: Response, user: { id: number }) {
  res.setHeader(
    "Set-Cookie",
    serialize(FINGERPRINT_COOKIE_NAME, fingerprint, {
      path: "/",
      maxAge: FINGERPRINT_COOKIE_MAX_AGE,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
    })
  )

  return tokenGenerator.signWithClaims({
    allowedRoles: ["user"],
    defaultRole: "user",
    expiresIn: "5m",
    otherClaims: {
      "X-Hasura-User-Id": String(user.id),
      "X-User-Fingerprint": sha256(fingerprint),
    },
  })
}
