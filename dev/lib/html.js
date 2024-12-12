/**
 * @import {HtmlExtension} from 'micromark-util-types'
 */

/**
 * Create an HTML extension for `micromark` to support radio list items when
 * serializing to HTML.
 *
 * @returns {HtmlExtension}
 *   Extension for `micromark` that can be passed in `htmlExtensions` to
 *   support radio list items when serializing to HTML.
 */
export function radioListItemHtml() {
  return {
    enter: {
      radioListCheck() {
        this.tag('<input type="radio" disabled="" ')
      }
    },
    exit: {
      radioListCheck() {
        this.tag('/>')
      },
      radioListCheckValueChecked() {
        this.tag('checked="" ')
      }
    }
  }
}
