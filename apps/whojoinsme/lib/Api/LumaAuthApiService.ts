export class LumaAuthApiService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API request failed");
    }
    return response.json();
  }

  async requestEmailCode(email: string): Promise<void> {
    const response = await fetch("/api/luma/auth/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    await this.handleResponse(response);
  }

  async verifyEmailCode(
    email: string,
    code: string
  ): Promise<{ authToken: string; data: any }> {
    const response = await fetch("/api/luma/auth/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });
    return this.handleResponse(response);
  }
}
