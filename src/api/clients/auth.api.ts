import { BaseApiClient } from './base-api-client';
import { AuthCredentials, AuthTokenResponse } from '../types/booking.types';

export class AuthApiClient extends BaseApiClient {
  private readonly authPath = '/auth';

  async createToken(credentials: AuthCredentials): Promise<string> {
    const response = await this.post(this.authPath, credentials);
    const body = await this.expectJson<AuthTokenResponse>(response, 200);
    return body.token;
  }
}