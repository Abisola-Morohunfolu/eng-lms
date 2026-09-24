export interface OAuthUser {
  provider: "google";
  providerId: string;
  email: string;
  fullName: string;
  picture?: string;
}
