const fs = require('fs');
let c = fs.readFileSync('src/lib/supabase/storefront.ts', 'utf8');
c = c.replace(/if \(searchTerm\) \{ query = query\.ilike\('name', % \+ searchTerm \+ %\)/g, "if (searchTerm) { query = query.ilike('name', '%' + searchTerm + '%')");
fs.writeFileSync('src/lib/supabase/storefront.ts', c);
