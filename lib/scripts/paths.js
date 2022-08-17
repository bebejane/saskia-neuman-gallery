const glob = require('glob-promise');
const path = require('path')

glob('./.next/server/pages/**/*.html')
  .then(function(res) {
    
    const paths = res.map(f => f.replace('./.next/server/pages', '').replace('.html', ''))
    console.log(paths.join('\n'))
    
  });
