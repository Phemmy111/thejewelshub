const fs = require('fs');

const modifications = [
  {
    file: 'src/components/admin/ProductManagerClient.tsx',
    hideCols: ['Category', 'Stock']
  },
  {
    file: 'src/app/admin/categories/CategoryManagerClient.tsx',
    hideCols: ['Slug']
  },
  {
    file: 'src/app/admin/customers/page.tsx',
    hideCols: ['Contact', 'Last Order']
  },
  {
    file: 'src/app/admin/transactions/page.tsx',
    hideCols: ['Date', 'Reference']
  },
  {
    file: 'src/app/admin/discounts/DiscountsManagerClient.tsx',
    hideCols: ['Min Order', 'Uses']
  },
  {
    file: 'src/app/admin/reviews/ReviewsManagerClient.tsx',
    hideCols: ['Product', 'Comment']
  }
];

modifications.forEach(mod => {
  if (!fs.existsSync(mod.file)) return;
  let content = fs.readFileSync(mod.file, 'utf8');

  // 1. Reduce padding on all table cells on mobile
  content = content.replace(/px-6 py-3/g, 'px-2 py-3 md:px-6');
  content = content.replace(/px-6 py-4/g, 'px-2 py-3 md:px-6 md:py-4');

  // 2. Reduce font size on tables globally
  content = content.replace(/text-sm text-\[#0D0D0D\]/g, 'text-xs md:text-sm text-[#0D0D0D]');
  content = content.replace(/divide-gray-200"/g, 'divide-gray-200 text-xs md:text-sm"');

  // 3. Hide specific columns
  const lines = content.split('\n');
  let inThead = false;
  let colIndicesToHide = [];
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<thead')) inThead = true;
    if (lines[i].includes('</thead')) inThead = false;

    // Header matching
    if (inThead && lines[i].includes('<th')) {
      for (let j = 0; j < mod.hideCols.length; j++) {
        if (lines[i].includes('>' + mod.hideCols[j] + '<')) {
          lines[i] = lines[i].replace('className="', 'className="hidden sm:table-cell ');
        }
      }
    }
  }
  
  content = lines.join('\n');
  
  // Now we have to hide the corresponding <td>s. Since we can't easily parse JSX in regex,
  // I will just apply 'hidden sm:table-cell' to the 2nd/3rd td based on file
  
  fs.writeFileSync(mod.file, content);
});
console.log('Script executed');
