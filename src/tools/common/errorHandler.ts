/**
 * Enhanced error handler that captures response body details
 * @param res - The fetch response object
 * @param method - HTTP method (GET, POST, PUT, etc.)
 * @param url - The request URL
 */
export async function handleApiError(
  res: Response,
  method: string,
  url: string
): Promise<never> {
  let errorBody: any = {};
  try {
    errorBody = await res.json();
  } catch {
    // If response body is not JSON, ignore
  }

  const errorMessage = [
    `${method} ${url} failed: ${res.status} ${res.statusText}`,
    errorBody && Object.keys(errorBody).length > 0
      ? `Response: ${JSON.stringify(errorBody, null, 2)}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  throw new Error(errorMessage);
}