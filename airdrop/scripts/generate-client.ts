import { createFromRoot } from 'codama';
import { rootNodeFromAnchor, type AnchorIdl } from '@codama/nodes-from-anchor';
import { renderVisitor as renderJavaScriptVisitor } from '@codama/renderers-js';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read JSON file manually
const idlPath = path.join(__dirname, '..', 'programs', 'Turbin3_prereq.json');
const anchorIdl = JSON.parse(readFileSync(idlPath, 'utf8'));

const codama = createFromRoot(rootNodeFromAnchor(anchorIdl as AnchorIdl));
const jsClient = path.join(__dirname, "..", "clients", "js");
codama.accept(renderJavaScriptVisitor(path.join(jsClient, "src", "generated")));