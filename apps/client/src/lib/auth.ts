const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export function redirectToCognito(): void {
  const loginUrl = process.env.NEXT_PUBLIC_COGNITO_LOGIN_URL;
  if (!loginUrl) {
    console.error("NEXT_PUBLIC_COGNITO_LOGIN_URL is not configured");
    alert("Authentication is not configured. Please contact support.");
    return;
  }
  window.location.href = loginUrl;
}

export function redirectToLogout(): void {
  window.location.href = `${API_BASE}/api/v1/auth/logout`;
}
