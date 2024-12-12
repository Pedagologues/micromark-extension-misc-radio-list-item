/**
 * @import {Extension, State, TokenizeContext, Tokenizer} from 'micromark-util-types'
 */

import {ok as assert} from 'devlop'
import {factorySpace} from 'micromark-factory-space'
import {
  markdownLineEnding,
  markdownLineEndingOrSpace,
  markdownSpace
} from 'micromark-util-character'
import {codes, types} from 'micromark-util-symbol'

const radiolistCheck = {
  name: 'radiolistCheck',
  tokenize: tokenizeRadiolistCheck
}

/**
 * Create an HTML extension for `micromark` to support radio list items
 * syntax.
 *
 * @returns {Extension}
 *   Extension for `micromark` that can be passed in `htmlExtensions` to
 *   support radio list items when serializing to HTML.
 */
export function radioListItem() {
  return {
    text: {[codes.leftParenthesis]: radiolistCheck}
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeRadiolistCheck(effects, ok, nok) {
  const self = this

  return open

  /**
   * At start of radio list item check.
   *
   * ```markdown
   * > | * (x) y.
   *       ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    assert(code === codes.leftParenthesis, 'expected `(`')

    if (
      // Exit if there’s stuff before.
      self.previous !== codes.eof ||
      // Exit if not in the first content that is the first child of a list
      // item.
      !self._gfmTasklistFirstContentOfListItem
    ) {
      return nok(code)
    }

    effects.enter('radioListCheck')
    effects.enter('radioListCheckMarker')
    effects.consume(code)
    effects.exit('radioListCheckMarker')
    return inside
  }

  /**
   * In radio list item check.
   *
   * ```markdown
   * > | * (x) y.
   *        ^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    // Currently we match how GH works in files.
    // To match how GH works in comments, use `markdownSpace` (`(\t )`) instead
    // of `markdownLineEndingOrSpace` (`(\t\n\r )`).
    if (markdownLineEndingOrSpace(code)) {
      effects.enter('radioListCheckValueUnchecked')
      effects.consume(code)
      effects.exit('radioListCheckValueUnchecked')
      return close
    }

    if (code === codes.uppercaseX || code === codes.lowercaseX) {
      effects.enter('radioListCheckValueChecked')
      effects.consume(code)
      effects.exit('radioListCheckValueChecked')
      return close
    }

    return nok(code)
  }

  /**
   * At close of radio list item check.
   *
   * ```markdown
   * > | * (x) y.
   *         ^
   * ```
   *
   * @type {State}
   */
  function close(code) {
    if (code === codes.rightParenthesis) {
      effects.enter('radioListCheckMarker')
      effects.consume(code)
      effects.exit('radioListCheckMarker')
      effects.exit('radioListCheck')
      return after
    }

    return nok(code)
  }

  /**
   * @type {State}
   */
  function after(code) {
    // EOL in paragraph means there must be something else after it.
    if (markdownLineEnding(code)) {
      return ok(code)
    }

    // Space or tab?
    // Check what comes after.
    if (markdownSpace(code)) {
      return effects.check({tokenize: spaceThenNonSpace}, ok, nok)(code)
    }

    // EOF, or non-whitespace, both wrong.
    return nok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function spaceThenNonSpace(effects, ok, nok) {
  return factorySpace(effects, after, types.whitespace)

  /**
   * After whitespace, after radio list item check.
   *
   * ```markdown
   * > | * (x) y.
   *           ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    // EOF means there was nothing, so bad.
    // EOL means there’s content after it, so good.
    // Impossible to have more spaces.
    // Anything else is good.
    return code === codes.eof ? nok(code) : ok(code)
  }
}
