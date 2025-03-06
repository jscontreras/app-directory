## USe this logic to create a rewrite rule for `/cached-rewrite` that also add cache headers to the response

const res = await fetch(
`https://api.tc-vercel.dev/api/time`,
// { next: { revalidate: 300, tags: ['timezone'] },
{
headers: {
'X-Custom-TC-Api-Key': process.env.CUSTOM_API_KEY || '',
},
},
);

---
