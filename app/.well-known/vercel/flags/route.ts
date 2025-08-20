
// Start of Selection
import { getProviderData, createFlagsDiscoveryEndpoint } from 'flags/next';
import * as flags from '../../../../flags';
// End of Selection

export const runtime = 'edge';
export const dynamic = 'force-dynamic'; // defaults to auto

// This function handles the authorization check for you
export const GET = createFlagsDiscoveryEndpoint(async (request) => {
  // Get the flags_site cookie
  const flagsSite = request.cookies.get('flags_site')?.value;

  // If the cookie exists and has a value, fetch flags from that URL and merge with local flags
  if (flagsSite) {
    const authHeader = request.headers.get('authorization');

    // Create headers for the external request
    const headers = new Headers();
    if (authHeader) {
      headers.set('Authorization', authHeader);
    }

    try {
      // Fetch flags from the external site
      const url = new URL(`${flagsSite}/.well-known/vercel/flags`);
      const response = await fetch(url, { headers });

      if (!response.ok) {
        console.warn(`Failed to fetch flags from ${flagsSite}: ${response.status}`);
        // Fall back to local flags only
        return await getProviderData(flags);
      }

      const externalFlagsData = await response.json();
      const localFlagsData = await getProviderData(flags);

      // Manually merge the flag data - external flags take precedence over local ones
      const mergedData = {
        ...localFlagsData,
        definitions: {
          ...localFlagsData.definitions,
          ...externalFlagsData.definitions,
        },
      };

      return mergedData;
    } catch (error) {
      console.error(`Error fetching flags from ${flagsSite}:`, error);
      // Fall back to local flags only
      return await getProviderData(flags);
    }
  }

  // Default behavior: return local flags only
  const apiData = await getProviderData(flags);
  return apiData;
});
