import markdownit from "markdown-it";
import hljs from 'highlight.js'

export const md = markdownit({
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch {}
    }

    return ""; // use external default escaping
  },
});

// Custom renderer to wrap tables in a table-wrapper div
const defaultRender = md.renderer.rules.table_open || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.table_open = function(tokens, idx, options, env, self) {
  return '<div class="table-wrapper">\n' + defaultRender(tokens, idx, options, env, self);
};

const defaultTableCloseRender = md.renderer.rules.table_close || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.table_close = function(tokens, idx, options, env, self) {
  return defaultTableCloseRender(tokens, idx, options, env, self) + '\n</div>';
};