import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ITokenService,
  IssuedTokens,
  TokenPayload,
} from './token.interface.js';

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signAccessToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('environment.jwt.secret'),
      expiresIn: this.configService.get<string>('environment.jwt.expiresIn') as any,
    });
  }

  async signRefreshToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('environment.jwt.refreshSecret'),
      expiresIn: this.configService.get<string>(
        'environment.jwt.refreshExpiresIn',
      ) as any,
    });
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    return this.jwtService.verifyAsync<TokenPayload>(token, {
      secret: this.configService.get<string>('environment.jwt.secret'),
    });
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    return this.jwtService.verifyAsync<TokenPayload>(token, {
      secret: this.configService.get<string>('environment.jwt.refreshSecret'),
    });
  }

  async issueTokens(payload: TokenPayload): Promise<IssuedTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(payload),
      this.signRefreshToken(payload),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn:
        this.configService.get<string>('environment.jwt.expiresIn') || '1d',
    };
  }
}
