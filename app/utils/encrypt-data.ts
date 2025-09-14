import CryptoJS from "crypto-js";

const ENC_KEY = process.env.ENC_SECRET_KEY || "default-secret";

export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, ENC_KEY).toString();
}

export function decrypt(cipherText: string): string {
  const bytes = CryptoJS.AES.decrypt(cipherText, ENC_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
  