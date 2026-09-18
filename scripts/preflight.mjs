import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from '../src/content/site.mjs';
import { safeUrl } from '../src/components/ui.mjs';

export function publicationIssues() {
  const issues = [];
  if (!safeUrl(site.email, { email: true })) issues.push('Bevestigd e-mailadres van Lex ontbreekt.');
  if (!safeUrl(site.domain)) issues.push('Bevestigde HTTPS-domeinnaam ontbreekt.');
  else { const url = new URL(site.domain); if (url.pathname !== '/' || url.search || url.hash) issues.push('Gebruik alleen de domein-origin, zonder pad of query.'); }
  if (site.partnerUrl && !safeUrl(site.partnerUrl)) issues.push('De Floru-link moet een bevestigde HTTPS-URL zijn.');
  for (const [name, approved] of Object.entries(site.approval)) if (!approved) issues.push(`Nog te controleren: approval.${name}.`);
  return issues;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const issues = publicationIssues();
  if (issues.length) { console.log('Nog niet gereed voor openbare publicatie:\n' + issues.map(issue => ' • ' + issue).join('\n')); process.exitCode = 1; }
  else console.log('De geconfigureerde publicatiechecklist is afgerond. Dit is geen juridische of beveiligingscertificering.');
}
