// source: https://gist.github.com/ziluvatar/a3feb505c4c0ec37059054537b38fc48
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { secretOrPrivateKey, secretOrPublicKey } from '../constants';

interface RefreshOptions {
  verify?: Exclude<VerifyOptions, 'jwtid'>,
  jwtid?: string
}
interface GenerateJWTParams {
  allowedRoles: string[]
  defaultRole: string
  otherClaims?: Record<string, string>
  expiresIn?: string
}

class TokenGenerator {
  secretOrPrivateKey;
  secretOrPublicKey;
  options; //algorithm + keyid + noTimestamp + expiresIn + notBefore
  constructor(secretOrPrivateKey: string, secretOrPublicKey: string, options: SignOptions) {
    this.secretOrPrivateKey = secretOrPrivateKey;
    this.secretOrPublicKey = secretOrPublicKey;
    this.options = options;
  }
  sign(payload: string | object | Buffer, signOptions: SignOptions) {
    const jwtSignOptions = Object.assign({}, signOptions, this.options);
    return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
  }
  verify(token: string, options?: VerifyOptions & { complete?: boolean }) {
    return jwt.verify(token, this.secretOrPublicKey, options)
  }
  refresh(token: string, refreshOptions?: RefreshOptions) {
    const verified = jwt.verify(token, this.secretOrPublicKey, refreshOptions?.verify || {});
    if (typeof verified !== 'string') {
      if ("payload" in verified) {
        delete verified.payload.iat;
        delete verified.payload.exp;
        delete verified.payload.nbf;
        delete verified.payload.jti; //We are generating a new token, if you are using jwtid during signing, pass it in refreshOptions
      }
      else {
        delete verified.iat;
        delete verified.exp;
        delete verified.nbf;
        delete verified.jti; //We are generating a new token, if you are using jwtid during signing, pass it in refreshOptions
      }
    }
    const jwtSignOptions = Object.assign({}, this.options, { jwtid: refreshOptions?.jwtid });
    // The first signing converted all needed options into claims, they are already in the payload
    return jwt.sign(verified, this.secretOrPrivateKey, jwtSignOptions);
  }
  signWithClaims(params: GenerateJWTParams) {
    const payload = {
      "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": params.allowedRoles,
        "x-hasura-default-role": params.defaultRole,
        ...params.otherClaims,
      },
    }
    return this.sign(payload, {
      expiresIn: params.expiresIn || '1m',
    })
  }

}

const tokenGenerator = new TokenGenerator(secretOrPrivateKey, secretOrPublicKey, { algorithm: 'HS256', keyid: '1', noTimestamp: false, expiresIn: '1m' })

export default tokenGenerator;