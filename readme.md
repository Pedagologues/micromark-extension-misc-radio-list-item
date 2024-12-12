## Use

```js
import {micromark} from 'micromark'
import {
  gfmTaskListItem,
  gfmTaskListItemHtml
} from 'micromark-extension-gfm-task-list-item'

const output = micromark('* (x) a\n* ( ) b', {
  extensions: [gfmTaskListItem()],
  htmlExtensions: [gfmTaskListItemHtml()]
})

console.log(output)
```

Yields:

```html
<ul>
<li><input type="radio" disabled="" checked="" /> a</li>
<li><input type="radio" disabled="" /> b</li>
</ul>
```