/**
* File: src/auth.ts
 * 
 * Authentication Module for Keka HRIS API Integration
 * 
 * This module handles all authentication-related functionality for interacting with
 * the Keka HRIS API, including:
 * - Configuration validation and management
 * - OAuth token acquisition and caching
 * - API URL construction
 * 
 * The Keka API uses OAuth 2.0 for authentication. This module implements
 * the client credentials flow to obtain access tokens.
 * 
 * @author Your Name
 * @version 1.0.0
 */

/**
 * Configuration interface for Keka API authentication.
 * 
 * This interface defines all required configuration parameters
 * that must be provided through environment variables.
 */
export interface KekaConfig {
  environment: string;    // The Keka environment (dev, staging, prod)
  grant_type: string;     // OAuth grant type (typically "kekaapi")
  scope: string;          // OAuth scope (typically "kekaapi")
  client_id: string;      // OAuth client ID provided by Keka
  client_secret: string;  // OAuth client secret provided by Keka
  api_key: string;        // Keka API key for request authorization
  company: string;        // Company name in Keka
}

/**
 * Validates and retrieves configuration from environment variables.
 * 
 * This function ensures that all required environment variables are present
 * and creates a properly structured configuration object. It throws a detailed
 * error if any required variables are missing.
 * 
 * @param {any} env - The environment object containing configuration variables
 * @returns {KekaConfig} A validated configuration object
 * @throws {Error} If any required configuration is missing
 */
export function getConfig(env: any): KekaConfig {
  // Define a list of all required environment variables
  const requiredVars = [
    'ENVIRONMENT',
    'KEKA_GRANT_TYPE', 
    'KEKA_SCOPE', 
    'KEKA_CLIENT_ID', 
    'KEKA_CLIENT_SECRET', 
    'KEKA_API_KEY',
    'COMPANY'
  ];
  
  // Check if any variables are missing
  const missing = requiredVars.filter(key => !env[key]);
  
  // If any variables are missing, throw a detailed error
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  // Return a fully validated configuration object
  return {
    environment: env.ENVIRONMENT,
    grant_type: env.KEKA_GRANT_TYPE,
    scope: env.KEKA_SCOPE,
    client_id: env.KEKA_CLIENT_ID,
    client_secret: env.KEKA_CLIENT_SECRET,
    api_key: env.KEKA_API_KEY,
    company: env.COMPANY,
  };
}

/**
 * Gets a cached token or fetches a new one if needed.
 * 
 * This function first checks if a valid token is already cached for the
 * current environment and company. If not, it fetches a new token from
 * the Keka API. This helps reduce API calls and improves performance.
 * 
 * @param {any} env - Environment variables
 * @param {object} state - Server state containing cached tokens
 * @returns {Promise<string>} The auth token
 * @throws {Error} If token acquisition fails
 */
export async function getAuthToken(env: any, state: { activeTokens: Record<string, string> }): Promise<string> {
  // Get validated configuration
  const config = getConfig(env);
  
  // Create a unique cache key for this environment and company
  const cacheKey = `${config.company}-${config.environment}`;
  
  // Check if we have a cached token
  if (state.activeTokens && state.activeTokens[cacheKey]) {
    // Use the cached token (optimization)
    return state.activeTokens[cacheKey];
  }
  
  // No cached token found, fetch a new one from the API
  const token = await fetchToken(config);
  
  // We would update the state here, but since we're using the McpAgent,
  // we need to return the token and let the caller update the state
  return token;
}

/**
 * Fetch a new token from the Keka API.
 * 
 * This function implements the OAuth client credentials flow to obtain
 * an access token from the Keka API. It constructs the token endpoint URL
 * dynamically based on the environment configuration.
 * 
 * @param {KekaConfig} config - The configuration to use
 * @returns {Promise<string>} A valid auth token
 * @throws {Error} If token acquisition fails
 * @private
 */
async function fetchToken(config: KekaConfig): Promise<string> {
  try {
    // Create form data for the token request
    const formData = new URLSearchParams();
    formData.append('grant_type', config.grant_type);
    formData.append('scope', config.scope);
    formData.append('client_id', config.client_id);
    formData.append('client_secret', config.client_secret);
    
    // Build the token endpoint URL dynamically based on environment
    const tokenEndpoint = `https://login.${config.environment}.com/connect/token`;
    
    // Make the token request
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Keka-APIKey': config.api_key,
      },
      body: formData.toString(),
    });
    
    // Handle error responses
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token acquisition failed: ${response.status} - ${errorText}`);
    }
    
    // Parse the response to get the token
    const data = await response.json() as { access_token: string };
    return data.access_token;
  } catch (error) {
    // Log the error and throw a more descriptive error
    console.error('Error acquiring token:', error);
    const errorMessage = (error instanceof Error) ? error.message : String(error);
    throw new Error(`Failed to acquire authentication token: ${errorMessage}`);
  }
}
 
/**
 * Updates the token cache with a new token.
 * 
 * This function is called after successfully obtaining a new token to
 * store it in the server's state. This ensures we don't make unnecessary
 * API calls for subsequent requests.
 * 
 * @param {object} state - Server state
 * @param {any} env - Environment variables
 * @param {string} token - The token to cache
 * @returns {object} Updated server state
 */
export function updateTokenCache(
  state: { activeTokens: Record<string, string> }, 
  env: any, 
  token: string
): { activeTokens: Record<string, string> } {
  // Get validated configuration
  const config = getConfig(env);
  
  // Create a unique cache key for this environment and company
  const cacheKey = `${config.company}-${config.environment}`;
  
  // Return updated state with the new token
  return {
    ...state,
    activeTokens: {
      ...state.activeTokens,
      [cacheKey]: token,
    }
  };
}

/**
 * Utility function to get the base URL for Keka API.
 * 
 * This function constructs the base URL for the Keka API based on
 * the company and environment configuration.
 * 
 * @param {any} env - Environment variables
 * @returns {string} The base API URL
 */
export function getApiBaseUrl(env: any): string {
  // Get validated configuration
  const config = getConfig(env);
  
  // Construct and return the API base URL
  return `https://${config.company}.${config.environment}.keka.com/api/v1`;
}
