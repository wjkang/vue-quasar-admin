// Configuration for your app
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

var md = require('markdown-it')();
var striptags = require('./strip-tags');
var wrap = function (render) {
  return function () {
    return render.apply(this, arguments)
      .replace('<code v-pre class="', '<code class="hljs ')
      .replace('<code>', '<code class="hljs">');
  };
};

function convert(str) {
  str = str.replace(/(&#x)(\w{4});/gi, function ($0) {
    return String.fromCharCode(parseInt(encodeURIComponent($0).replace(/(%26%23x)(\w{4})(%3B)/g, '$2'), 16));
  });
  return str;
}

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: [
      'i18n',
      'vuelidate',
      'permission',
      'demo-block'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons',
      // 'ionicons',
      // 'mdi',
      'fontawesome'
    ],
    supportIE: false,
    vendor: {
      add: [],
      remove: []
    },
    build: {
      env: ctx.dev
        ? { // so on dev we'll have
          API: JSON.stringify('http://localhost:3000')
        }
        : { // and on build (production):
          API: JSON.stringify('http://69.171.69.13:3000')
        },
      scopeHoisting: true,
      vueRouterMode: 'hash',
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      // useNotifier: false,
      extendWebpack(cfg) {
        cfg.module.rules.push({
          test: /\.md$/,
          loader: 'vue-markdown-loader',
          options: {
            preventExtract: true,
            use: [
              [require('markdown-it-container'), 'demo', {
                validate: function (params) {
                  return params.trim().match(/^demo\s*(.*)$/);
                },

                render: function (tokens, idx) {
                  var m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
                  if (tokens[idx].nesting === 1) {
                    var description = (m && m.length > 1) ? m[1] : '';
                    var content = tokens[idx + 1].content;
                    var html = convert(striptags.strip(content, ['script', 'style'])).replace(/(<[^>]*)=""(?=.*>)/g, '$1');
                    var script = striptags.fetch(content, 'script');
                    var style = striptags.fetch(content, 'style');
                    var jsfiddle = { html: html, script: script, style: style };
                    jsfiddle = md.utils.escapeHtml(JSON.stringify(jsfiddle));
                    return `<demo-block>
                             <div style="width:900px" slot="source">${html}</div>
                             <div class="highlight" style="width:900px;overflow-x: auto;" slot="highlight">
                           `;
                  } else {
                    return '</div></demo-block>\n';
                  }
                }
              }],
              [require('markdown-it-container'), 'tip'],
              [require('markdown-it-container'), 'warning']
            ],
            preprocess: function (MarkdownIt, source) {
              MarkdownIt.renderer.rules.table_open = function () {
                return '<table class="table">';
              };
              MarkdownIt.renderer.rules.fence = wrap(MarkdownIt.renderer.rules.fence);
              return source; 
            }
          }
        }),
          cfg.resolve.alias = {
            ...cfg.resolve.alias, // This adds the existing alias

            // Add you own alias like this
            '@': resolve('src')
          }
      }
    },
    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },
    framework: 'all', //--- includes everything; for dev only!
    // framework: {
    //   components: [
    //     'QLayout',
    //     'QLayoutHeader',
    //     'QLayoutDrawer',
    //     'QPageContainer',
    //     'QPage',
    //     'QToolbar',
    //     'QToolbarTitle',
    //     'QBtn',
    //     'QIcon',
    //     'QList',
    //     'QListHeader',
    //     'QItem',
    //     'QItemMain',
    //     'QItemSide',
    //     'QCollapsible'
    //   ],
    //   directives: [
    //     'Ripple'
    //   ],
    //   // Quasar plugins
    //   plugins: [
    //     'Notify'
    //   ]
    // },
    animations: 'all',// --- includes all animations
    // animations: [
    // ],
    pwa: {
      cacheExt: 'js,html,css,ttf,eot,otf,woff,woff2,json,svg,gif,jpg,jpeg,png,wav,ogg,webm,flac,aac,mp4,mp3',
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      extendWebpack(cfg) {
        // do something with cfg
      },
      packager: {
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      }
    },

    // leave this here for Quasar CLI
    starterKit: '1.0.2'
  }
}
