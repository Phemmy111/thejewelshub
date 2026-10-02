const fs = require('fs');

const tdHides = {
  'src/components/admin/ProductManagerClient.tsx': [1, 3], // Category is index 1, Stock is index 3
  'src/app/admin/categories/CategoryManagerClient.tsx': [1], // Slug is index 1
  'src/app/admin/customers/page.tsx': [1, 4], // Contact is index 1, Last Order is index 4
  'src/app/admin/transactions/page.tsx': [0, 1], // Date is index 0, Reference is index 1
  'src/app/admin/discounts/DiscountsManagerClient.tsx': [2, 3], // Min Order is index 2, Uses is index 3
  'src/app/admin/reviews/ReviewsManagerClient.tsx': [1, 3] // Product is index 1, Comment is index 3
};

Object.keys(tdHides).forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  let lines = content.split('\n');
  
  let inTbody = false;
  let tdIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<tbody')) { inTbody = true; tdIndex = -1; continue; }
    if (lines[i].includes('</tbody')) { inTbody = false; continue; }
    if (lines[i].includes('<tr')) { tdIndex = -1; continue; } // reset for new row
    
    if (inTbody && lines[i].includes('<td')) {
      // Don't count colSpan rows
      if (lines[i].includes('colSpan')) continue;
      
      tdIndex++;
      if (tdHides[file].includes(tdIndex)) {
        if (lines[i].includes('className="')) {
           lines[i] = lines[i].replace('className="', 'className="hidden sm:table-cell ');
        } else {
           lines[i] = lines[i].replace('<td', '<td className="hidden sm:table-cell"');
        }
      }
    }
  }
  
  fs.writeFileSync(file, lines.join('\n'));
});
console.log('TDs updated');
