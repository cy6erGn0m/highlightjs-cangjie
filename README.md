# Cangjie - a language grammar for [highlight.js](https://highlightjs.org/)

Cangjie is a general-purpose programming language developed by Huawei, featuring modern syntax with strong type inference, pattern matching, lambdas, and a hygienic macro system.

## Usage

Simply include the Highlight.js library in your webpage or Node app, then load this module.

### Static website or simple usage

Simply load the module after loading Highlight.js. You'll use the minified version found in the `dist` directory. This module is just a CDN build of the language, so it will register itself as the Javascript is loaded.

```html
<script type="text/javascript" src="/path/to/highlight.min.js"></script>
<script type="text/javascript" charset="UTF-8"
  src="/path/to/highlightjs-cangjie/dist/cangjie.min.js"></script>
<script type="text/javascript">
  hljs.highlightAll();
</script>
```

### Using directly from the UNPKG CDN

```html
<script type="text/javascript"
  src="https://unpkg.com/highlightjs-cangjie/dist/cangjie.min.js"></script>
```

- More info: <https://unpkg.com>

### With Node or another build system

If you're using Node / Webpack / Rollup / Browserify, etc, simply require the language module, then register it with Highlight.js.

```javascript
var hljs = require('highlight.js');
var hljsCangjie = require('highlightjs-cangjie');

hljs.registerLanguage("cangjie", hljsCangjie);
hljs.highlightAll();
```

### React

You need to import both Highlight.js and third-party language like Cangjie:

```js
import React, {Component} from 'react'
import 'highlight.js/scss/darcula.scss'
import cangjie from 'highlightjs-cangjie'
import hljs from 'highlight.js'
hljs.registerLanguage('cangjie', cangjie);

class Highlighter extends Component
{
  constructor(props)
  {
    super(props);
    hljs.highlightAll();
  }

  render()
  {
    let {children} = this.props;
    return
    {
      <pre ref={(node) => this.node = node}>
        <code className="cangjie">
          {children}
        </code>
      </pre>
    }
  }
}

export default Highlighter;
```

## License

Highlight.js is released under the BSD-3-Clause License. See [LICENSE][1] file
for details.

### Author

Mashkov Sergey

## Links

- The official site for the Highlight.js library is <https://highlightjs.org/>.
- The Highlight.js GitHub project: <https://github.com/highlightjs/highlight.js>
- Learn more about Cangjie: <https://cangjie-lang.cn/>

[1]: https://github.com/cy6ergn0m/highlightjs-cangjie/blob/master/LICENSE