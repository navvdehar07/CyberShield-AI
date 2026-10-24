import { URLCheckResult, URLHeuristicIndicator, RiskLevel } from './types';

// Well-known brands frequently targeted by phishing
const TARGETED_BRANDS = [
  'paypal', 'google', 'apple', 'microsoft', 'amazon', 'netflix', 'facebook',
  'instagram', 'whatsapp', 'chase', 'wellsfargo', 'bankofamerica', 'citibank',
  'usps', 'fedex', 'ups', 'dhl', 'ebay', 'dropbox', 'linkedin', 'binance',
  'coinbase', 'metamask', 'yahoo', 'outlook', 'office365', 'irs'
];

// High-risk TLDs commonly abused in automated phishing campaigns
const SUSPICIOUS_TLDS = [
  'tk', 'ml', 'ga', 'cf', 'gq', 'xyz', 'top', 'work', 'click', 'loan',
  'zip', 'mov', 'fit', 'surf', 'party', 'kim', 'country', 'mom', 'rest',
  'live', 'support', 'online', 'vip'
];

// Known URL shorteners
const URL_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'buff.ly', 'ow.ly',
  'rebrand.ly', 'cutt.ly', 'shorturl.at', 'rb.gy'
];

// Dangerous file extensions often found in disguised links
const SUSPICIOUS_EXTENSIONS = [
  '.exe', '.scr', '.vbs', '.bat', '.cmd', '.ps1', '.iso', '.img', '.apk',
  '.jar', '.msi', '.pif', '.hta', '.wsf'
];

export function analyzeUrlLocally(rawUrl: string): URLCheckResult {
  const indicators: URLHeuristicIndicator[] = [];
  let score = 0; // 0 to 100

  // 1. Basic parsing
  let normalized = rawUrl.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    // If no protocol was provided, test with http to parse
    normalized = 'http://' + normalized;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return {
      id: `url-${Date.now()}`,
      url: rawUrl,
      protocol: 'invalid',
      hostname: 'invalid',
      pathname: '',
      searchParams: {},
      riskLevel: 'high',
      riskScore: 85,
      verdict: 'Malformed or unparseable URL structure.',
      indicators: [
        {
          name: 'Invalid URL Format',
          description: 'The provided URL cannot be parsed as a valid RFC-compliant URL.',
          triggered: true,
          severity: 'danger',
          details: 'Malformed URLs are frequently used in injection attacks or to bypass filter parsers.'
        }
      ],
      timestamp: Date.now(),
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const protocol = parsed.protocol.toLowerCase();
  const pathname = parsed.pathname;
  const search = parsed.search;

  // Search parameters to object
  const searchParamsObj: Record<string, string> = {};
  parsed.searchParams.forEach((val, key) => {
    searchParamsObj[key] = val;
  });

  // Check 1: Insecure HTTP Protocol
  const isHttp = protocol === 'http:';
  indicators.push({
    name: 'Unencrypted Protocol (HTTP)',
    description: 'URL uses plaintext HTTP instead of secure HTTPS encryption.',
    triggered: isHttp,
    severity: isHttp ? 'warning' : 'info',
    details: isHttp 
      ? 'Traffic is unencrypted; credentials and session tokens can be intercepted.' 
      : 'URL uses transport encryption (HTTPS).'
  });
  if (isHttp) score += 20;

  // Check 2: IP Address as Hostname
  const isIpv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  const isIpv6 = /^\[?[a-f0-9:]+\]?$/i.test(hostname) && hostname.includes(':');
  const isIpHost = isIpv4 || isIpv6;
  indicators.push({
    name: 'Direct IP Address Host',
    description: 'The URL uses a raw IP address instead of a legitimate registered domain name.',
    triggered: isIpHost,
    severity: isIpHost ? 'danger' : 'info',
    details: isIpHost 
      ? `Host is direct IP (${hostname}). Legitimate organizations almost always use branded domain names.`
      : 'URL uses a registered domain name.'
  });
  if (isIpHost) score += 35;

  // Check 3: Suspicious Top-Level Domain (TLD)
  const parts = hostname.split('.');
  const tld = parts.length > 1 ? parts[parts.length - 1] : '';
  const isSuspiciousTld = SUSPICIOUS_TLDS.includes(tld);
  indicators.push({
    name: 'Abused / High-Risk TLD',
    description: 'The top-level domain (.tk, .xyz, .top, .work, etc.) has high statistical prevalence of phishing abuse.',
    triggered: isSuspiciousTld,
    severity: isSuspiciousTld ? 'warning' : 'info',
    details: isSuspiciousTld 
      ? `TLD .${tld} is frequently favored by mass phishing campaigns due to low cost or free registration.`
      : `Standard TLD .${tld}`
  });
  if (isSuspiciousTld) score += 25;

  // Check 4: Brand Spoofing / Subdomain Deception
  // e.g. "paypal.com-verify.ru" or "login-apple.com"
  const matchedBrand = TARGETED_BRANDS.find(brand => {
    // Brand appears in hostname, but domain isn't official brand domain
    const isExactBrandDomain = hostname === `${brand}.com` || hostname === `${brand}.net` || hostname.endsWith(`.${brand}.com`);
    return hostname.includes(brand) && !isExactBrandDomain;
  });

  indicators.push({
    name: 'Brand Name Impersonation',
    description: 'Known corporate brand name found in subdomains or misleading hyphenated host names.',
    triggered: Boolean(matchedBrand),
    severity: Boolean(matchedBrand) ? 'danger' : 'info',
    details: matchedBrand 
      ? `Detected brand "${matchedBrand}" in host "${hostname}", but host does not belong to ${matchedBrand}.com!`
      : 'No common brand spoofing patterns detected in the hostname.'
  });
  if (matchedBrand) score += 35;

  // Check 5: @ Symbol in URL (Credential Deception)
  // http://google.com@evil.com -> user goes to evil.com!
  const hasAtSymbol = rawUrl.includes('@');
  indicators.push({
    name: 'Userinfo Deception (@ Symbol)',
    description: 'Contains "@" symbol in the URL authority section, routing user to the domain AFTER the @.',
    triggered: hasAtSymbol,
    severity: hasAtSymbol ? 'danger' : 'info',
    details: hasAtSymbol 
      ? 'Critical phishing tactic: browsers ignore text before "@" and navigate to the address following it.'
      : 'No userinfo deception detected.'
  });
  if (hasAtSymbol) score += 40;

  // Check 6: Punycode / IDN Homoglyph Attack
  const isPunycode = hostname.includes('xn--');
  indicators.push({
    name: 'Punycode / Homoglyph Characters',
    description: 'Domain uses internationalized punycode ("xn--"), which can visually mimic legitimate English characters.',
    triggered: isPunycode,
    severity: isPunycode ? 'danger' : 'info',
    details: isPunycode 
      ? `Punycode detected (${hostname}). Attackers use Cyrillic or Greek lookalikes (e.g. Cyrillic "а" instead of Latin "a").`
      : 'No punycode spoofing indicators found.'
  });
  if (isPunycode) score += 30;

  // Check 7: URL Shortener Obfuscation
  const isShortener = URL_SHORTENERS.includes(hostname);
  indicators.push({
    name: 'URL Shortener Redirection',
    description: 'URL hides the true destination behind a shortener (bit.ly, tinyurl, t.co, etc.).',
    triggered: isShortener,
    severity: isShortener ? 'warning' : 'info',
    details: isShortener 
      ? 'Shorteners mask the final landing page. Expand the shortener with a preview tool before visiting.'
      : 'Not a recognized URL shortener domain.'
  });
  if (isShortener) score += 20;

  // Check 8: Excessive Subdomain Depth (> 3 subdomains)
  const isExcessiveSubdomains = parts.length > 4;
  indicators.push({
    name: 'Excessive Subdomain Depth',
    description: 'Domain contains multiple nested subdomains designed to conceal the root domain.',
    triggered: isExcessiveSubdomains,
    severity: isExcessiveSubdomains ? 'warning' : 'info',
    details: isExcessiveSubdomains 
      ? `Hostname contains ${parts.length} segments. Phishers use this on mobile screens where the real root domain is pushed off-screen.`
      : `Subdomain depth is normal (${parts.length} segments).`
  });
  if (isExcessiveSubdomains) score += 15;

  // Check 9: Suspicious Keywords in Path or Host
  const credentialKeywords = ['login', 'signin', 'verify', 'account', 'banking', 'secure', 'wallet', 'update', 'confirm', 'password', 'oauth'];
  const foundKeywords = credentialKeywords.filter(k => 
    hostname.includes(k) || pathname.toLowerCase().includes(k) || search.toLowerCase().includes(k)
  );
  const hasKeywords = foundKeywords.length >= 2;
  indicators.push({
    name: 'Credential Harvesting Keywords',
    description: 'Path or domain contains multiple security/account sensitive keywords.',
    triggered: hasKeywords,
    severity: hasKeywords ? 'warning' : 'info',
    details: hasKeywords 
      ? `Keywords found: [${foundKeywords.join(', ')}]. Phishing kits frequently construct paths like "/secure/verify-account".`
      : 'No high-density credential harvesting keywords found.'
  });
  if (hasKeywords) score += 20;

  // Check 10: Non-Standard Port
  const hasNonStandardPort = parsed.port !== '' && parsed.port !== '80' && parsed.port !== '443';
  indicators.push({
    name: 'Non-Standard Web Port',
    description: 'Connection requests a non-standard port instead of standard 80 (HTTP) or 443 (HTTPS).',
    triggered: hasNonStandardPort,
    severity: hasNonStandardPort ? 'warning' : 'info',
    details: hasNonStandardPort 
      ? `Explicit port :${parsed.port} specified. Often indicates rogue servers, tunneling services, or C2 nodes.`
      : 'Standard web port in use.'
  });
  if (hasNonStandardPort) score += 20;

  // Check 11: Suspicious / Double File Extension
  const hasDangerousExt = SUSPICIOUS_EXTENSIONS.some(ext => pathname.toLowerCase().endsWith(ext));
  const hasDoubleExt = /\.(pdf|doc|docx|xls|xlsx|jpg|png)\.(exe|scr|bat|iso|zip|vbs)$/i.test(pathname);
  indicators.push({
    name: 'Suspicious Executable File Extension',
    description: 'The link points directly to an executable, script, or double-extended payload.',
    triggered: hasDangerousExt || hasDoubleExt,
    severity: (hasDangerousExt || hasDoubleExt) ? 'danger' : 'info',
    details: hasDoubleExt 
      ? 'Double extension detected (e.g. document disguised as executable). Highly dangerous payload tactic.'
      : hasDangerousExt 
        ? 'Points to an executable binary or script payload.'
        : 'Path does not point to a known dangerous executable extension.'
  });
  if (hasDangerousExt || hasDoubleExt) score += 40;

  // Check 12: Excessive Hyphens in Hostname
  const hyphenCount = (hostname.match(/-/g) || []).length;
  const hasExcessiveHyphens = hyphenCount >= 3;
  indicators.push({
    name: 'Excessive Hyphenation in Host',
    description: 'Hostname contains multiple hyphens, often used to string words together (e.g. secure-login-bank-portal).',
    triggered: hasExcessiveHyphens,
    severity: hasExcessiveHyphens ? 'warning' : 'info',
    details: hasExcessiveHyphens 
      ? `Host contains ${hyphenCount} hyphens. Attackers frequently register hyphenated domains to mimic multi-word services.`
      : 'Hyphen frequency is normal.'
  });
  if (hasExcessiveHyphens) score += 15;

  // Cap score at 100
  const finalScore = Math.min(100, Math.max(0, score));

  // Determine Risk Level
  let riskLevel: RiskLevel = 'safe';
  let verdict = 'No immediate structural anomalies detected. Note: Always verify the sender and destination manually.';

  if (finalScore >= 70) {
    riskLevel = 'critical';
    verdict = 'CRITICAL PHISHING RISK: Multiple high-severity red flags detected. Do not click or enter credentials.';
  } else if (finalScore >= 45) {
    riskLevel = 'high';
    verdict = 'HIGH RISK: Suspicious patterns strongly characteristic of phishing or impersonation.';
  } else if (finalScore >= 25) {
    riskLevel = 'medium';
    verdict = 'MEDIUM CAUTION: Potential anomalies identified (e.g. unencrypted protocol or redirected shortener).';
  } else if (finalScore > 0) {
    riskLevel = 'low';
    verdict = 'LOW RISK: Minor heuristic notes, but no major attack indicators identified.';
  }

  return {
    id: `url-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    url: rawUrl,
    protocol,
    hostname,
    pathname,
    searchParams: searchParamsObj,
    riskLevel,
    riskScore: finalScore,
    verdict,
    indicators,
    timestamp: Date.now(),
  };
}
