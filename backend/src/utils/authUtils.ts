/**-----------------------
 *  Transform frontend 
 * URL to domain format
 ------------------------*/
export async function getCookieDomain(): Promise<string> {
  const frontendUrl = process.env.FRONTEND_URL;

  let domain: string | undefined;
  if (frontendUrl) {
    // Match and extract the domain (it can have http/https or www subdomain)
    const match = frontendUrl.match(
      /^(?:https?:\/\/)?(?:www\.)?([a-z0-9.-]+\.[a-z]{2,6})$/i,
    );
    if (match) {
      // Extract the domain part
      const domainParts = match[1].split(".");
      // Get the last two parts (e.g., "website.com" from "backoffice.website.com")
      domain = `.${domainParts.slice(-2).join(".")}`;
    }
  }

  return domain || "";
}
