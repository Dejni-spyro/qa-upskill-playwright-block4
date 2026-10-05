import type { APIRequestContext } from '@playwright/test';

const apiBaseUrl = process.env.PUBLIC_API_URL ?? 'http://localhost:4000';

export type NewUser = {
  fullName: string;
  email: string;
  password: string;
  role: 'User';
};

type LoginPayload = { token: string };
type CreatedUser = { id: number };

export class UsersApi {
  private token?: string;

  constructor(private readonly request: APIRequestContext) {}

  async authenticateAsAdmin(): Promise<void> {
    const password = process.env.QA_UPSKILL_ADMIN_PASSWORD;
    if (!password) {
      throw new Error('Set QA_UPSKILL_ADMIN_PASSWORD before running tests.');
    }

    const response = await this.request.post(`${apiBaseUrl}/auth/login`, {
      data: {
        email:
          process.env.QA_UPSKILL_ADMIN_EMAIL ?? 'admin@qaupskill.local',
        password,
      },
    });

    if (!response.ok()) {
      throw new Error(`Admin login returned HTTP ${response.status()}.`);
    }

    this.token = ((await response.json()) as LoginPayload).token;
  }

  async create(user: NewUser): Promise<number> {
    const response = await this.request.post(`${apiBaseUrl}/people`, {
      headers: this.authorizationHeader(),
      data: user,
    });

    if (response.status() !== 201) {
      throw new Error(`Creating a user returned HTTP ${response.status()}.`);
    }

    return ((await response.json()) as CreatedUser).id;
  }

  async remove(userId: number): Promise<void> {
    const response = await this.request.delete(
      `${apiBaseUrl}/people/${userId}`,
      { headers: this.authorizationHeader() },
    );

    if (![204, 404].includes(response.status())) {
      throw new Error(`Deleting a user returned HTTP ${response.status()}.`);
    }
  }

  private authorizationHeader(): Record<string, string> {
    if (!this.token) {
      throw new Error('Authenticate the API client first.');
    }

    return { Authorization: `Bearer ${this.token}` };
  }
}

export function buildTestUser(): NewUser {
  const runId = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;

  return {
    fullName: `Playwright User ${runId}`,
    email: `pw-${runId}@qaupskill.local`,
    password: 'PwTest123!',
    role: 'User',
  };
}
