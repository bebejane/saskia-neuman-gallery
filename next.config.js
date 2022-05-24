const path = require('path')
const withPlugins = require('next-compose-plugins');
const graphql = require('next-plugin-graphql')

const sassOptions = {
  includePaths: ['./components', './pages'],
  prependData: `
    @use "sass:math";
    @import "./styles/partials/mediaqueries"; 
    @import "./styles/partials/styles";
    @import "./styles/partials/variables";
    @import "./styles/partials/fonts";
    @import "./styles/partials/mixins";
  `
}
const nextOptions = {
  devIndicators: {
    buildActivity: false
  },
  experimental: {
    scrollRestoration: true
  }
}

const config = withPlugins([graphql], { sassOptions, ...nextOptions })
module.exports = config