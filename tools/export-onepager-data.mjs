// Exports the data the one-pager needs from content/data.ts as JSON on stdout.
import { site, recruiter, roles, education } from "../content/data.ts";
console.log(JSON.stringify({ site, recruiter, roles: roles.map((r) => ({ id: r.id, company: r.company, title: r.title, dates: r.dates })), education }));
