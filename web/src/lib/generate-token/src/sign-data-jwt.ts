import fs from 'fs';
import jsonwebtoken from 'jsonwebtoken';

export default function signData(payload: any, signOptions: jsonwebtoken.SignOptions, privateKey: string): string {
  const token = jsonwebtoken.sign(payload, privateKey, signOptions);
  return token;
}

const privateKeyPem = fs.readFileSync('./keys/rsa-cif-2048.key', 'utf8');

const [,, ...args] = process.argv;

const issuer = args[0].split('=')[1];
const audience = args[1].split('=')[1];
const subject = args[2].split('=')[1];
const companyId = args[3].split('=')[1];

const signOptions: jsonwebtoken.SignOptions = {
  algorithm: 'RS256',
  expiresIn: '1h',
  issuer: issuer,
  audience: audience,
  subject: subject,
};

const payload = {
  companyId: companyId,
};

const token = signData(payload, signOptions, privateKeyPem);

console.log(token);