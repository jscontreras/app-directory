import { type ApiData, verifyAccess } from 'flags';
import { getProviderData, createFlagsDiscoveryEndpoint } from 'flags/next';
import * as flags from '../../../../flags';

export const runtime = 'edge';
export const dynamic = 'force-dynamic'; // defaults to auto


// This function handles the authorization check for you
export const GET = createFlagsDiscoveryEndpoint(async (request) => {

  // Get the flags_site cookie
  const flagsSite = request.cookies.get('flags_site')?.value;

  // If the cookie exists and has a value, rewrite to that URL
  // if (flagsSite) {
  //   const authHeader = request.headers.get('authorization');
  //   // Create a new headers object
  //   const headers = new Headers();

  //   // If the authorization header exists, add it to the new headers object
  //   if (authHeader) {
  //     headers.set('Authorization', authHeader);
  //   }
  //   const url = new URL(`${flagsSite}/.well-known/vercel/flags`);
  //   const response = await fetch(url, {
  //     headers: headers,
  //   });
  //   const jsonFlagsEmbeddedSite = await response.json();
  //   const jsonParentAppFlags = await getProviderData(flags);
  //   // const mergedFlags = {
  //   //   ...jsonParentAppFlags,
  //   //   definitions: {
  //   //     ...jsonParentAppFlags.definitions,
  //   //     ...jsonFlagsEmbeddedSite.definitions,
  //   //   },
  //   // };
  //   return jsonParentAppFlags;
  // }
  // your previous logic in here to gather your feature flags
  const apiData = await getProviderData(flags);
  // return the ApiData directly, without a NextResponse.json object.
  return apiData;
});
