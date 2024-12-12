export {radioListItemHtml} from './lib/html.js'
export {radioListItem} from './lib/syntax.js'

/**
 * Augment types.
 */
declare module 'micromark-util-types' {
  /**
   * Token types.
   */
  interface TokenTypeMap {
    radioListCheck: 'radioListCheck'
    radioListCheckMarker: 'radioListCheckMarker'
    radioListCheckValueChecked: 'radioListCheckValueChecked'
    radioListCheckValueUnchecked: 'radioListCheckValueUnchecked'
  }
}
