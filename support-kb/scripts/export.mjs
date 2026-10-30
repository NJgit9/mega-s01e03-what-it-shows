import { cp, mkdir, rm } from 'node:fs/promises';

// The course explicitly asks for the rendered page beside its .svx source.
// Copy the complete static build so styles, route links and interactive components work.
const destination = new URL('../../rendered/', import.meta.url);
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(new URL('../build/', import.meta.url), destination, { recursive: true });
console.log('Exported the desk view to rendered/kb/incidents/4471-review/index.html');
