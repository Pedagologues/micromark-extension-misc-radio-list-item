import assert from 'node:assert/strict'
import test from 'node:test'
import {micromark} from 'micromark'
import {radioListItemHtml} from './dev/lib/html.js'
import {radioListItem} from './dev/lib/syntax.js'

test('markdown -> html (micromark)', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(
        await import('micromark-extension-misc-radio-list-item')
      ).sort(),
      ['radioListItem', 'radioListItemHtml']
    )
  })

  await t.test(
    'should skip `radiolistCheck` construct if `disable.null` includes `radiolistCheck`',
    async function () {
      assert.deepEqual(
        micromark('* [ ] foo', {
          extensions: [radioListItem(), {disable: {null: ['radiolistCheck']}}],
          htmlExtensions: [radioListItemHtml()]
        }),
        '<ul>\n<li>[ ] foo</li>\n</ul>'
      )
    }
  )

  await t.test('should not support laziness (1)', async function () {
    assert.deepEqual(
      micromark('*\n    [x]', {
        extensions: [radioListItem()],
        htmlExtensions: [radioListItemHtml()]
      }),
      '<ul>\n<li>[x]</li>\n</ul>'
    )
  })

  await t.test('should not support laziness (2)', async function () {
    assert.deepEqual(
      micromark('*\n[x]', {
        extensions: [radioListItem()],
        htmlExtensions: [radioListItemHtml()]
      }),
      '<ul>\n<li></li>\n</ul>\n<p>[x]</p>'
    )
  })

  await t.test('one line checked', async function () {
    assert.deepEqual(
      micromark('* (x) .\n', {
        extensions: [radioListItem()],
        htmlExtensions: [radioListItemHtml()]
      }),
      '<ul>\n<li><input type="radio" disabled="" checked="" /> .</li>\n</ul>\n'
    )
  })

  await t.test('one line unchecked', async function () {
    assert.deepEqual(
      micromark('* ( ) .\n', {
        extensions: [radioListItem()],
        htmlExtensions: [radioListItemHtml()]
      }),
      '<ul>\n<li><input type="radio" disabled="" /> .</li>\n</ul>\n'
    )
  })

  await t.test('multiple lines (1)', async function () {
    assert.deepEqual(
      micromark('* ( ) .\n* ( ) .\n* ( ) .\n', {
        extensions: [radioListItem()],
        htmlExtensions: [radioListItemHtml()]
      }),
      '<ul>\n<li><input type="radio" disabled="" /> .</li>\n<li><input type="radio" disabled="" /> .</li>\n<li><input type="radio" disabled="" /> .</li>\n</ul>\n'
    )
  })

  await t.test('multiple lines (2)', async function () {
    assert.deepEqual(
      micromark('* (X) .\n* ( ) .\n* (X) .\n', {
        extensions: [radioListItem()],
        htmlExtensions: [radioListItemHtml()]
      }),
      '<ul>\n<li><input type="radio" disabled="" checked="" /> .</li>\n<li><input type="radio" disabled="" /> .</li>\n<li><input type="radio" disabled="" checked="" /> .</li>\n</ul>\n'
    )
  })

  await t.test('multiple lines (2)', async function () {
    assert.deepEqual(
      micromark('* (X) \n* () .\n* (\n', {
        extensions: [radioListItem()],
        htmlExtensions: [radioListItemHtml()]
      }),
      '<ul>\n<li>(X)</li>\n<li>() .</li>\n<li>(</li>\n</ul>\n'
    )
  })

  await t.test('multiple lines (3)', async function () {
    assert.deepEqual(
      micromark('(\n- (X\n- (X)\r\n- [ ]␠Text.', {
        extensions: [radioListItem()],
        htmlExtensions: [radioListItemHtml()]
      }),
      '<p>(</p>\n<ul>\n<li>(X</li>\n<li>(X)</li>\n<li>[ ]␠Text.</li>\n</ul>'
    )
  })
})
