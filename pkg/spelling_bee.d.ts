/* tslint:disable */
/* eslint-disable */
/**
* The possible outcomes of playing a move.
*/
export enum PlayResult {
/**
* The word is valid and new: it has been added to the list and the score
* has been updated.
*/
  Valid,
/**
* The word has already been played.
*/
  AlreadyPlayed,
/**
* The word is not in the lexicon.
*/
  InvalidWord,
/**
* The word is less than `MIN_LENGTH` (four) letters.
*/
  InvalidLength,
/**
* The word doesn't use the required letter or has letters that are not
* allowed.
*/
  InvalidLetters,
}
/**
* A game of the NYT Spelling Bee, with six optional letters and a required one. Lets users play
* words and check them for validity, keeping track of the score.
*/
export class SpellingBeeGame {
  free(): void;
/**
* Creates a new spelling bee game from a set of optional letters and a
* single required letter, using the given input buffers for lexicons.
* @param {string} optional_letters
* @param {string} required_letter
* @param {string} main_words
* @param {string} swears
* @returns {SpellingBeeGame}
*/
  static new(optional_letters: string, required_letter: string, main_words: string, swears: string): SpellingBeeGame;
/**
* Returns the current score.
*
* Score is computed as follows: a four-letter word is worth one point. Any
* word longer than that (words shorter than four letters are not allowed)
* is worth a point for every letter it has. If the word uses all of the
* given letters, it receives an additional seven points.
* @returns {number}
*/
  score(): number;
/**
* Accepts a given word, updating internal state and returning the result
* of the play.
* @param {string} word
* @returns {number}
*/
  play(word: string): number;
/**
* Checks if the given input is valid, in that it only consists of allowed
* letters.
* @param {string} word
* @returns {boolean}
*/
  is_valid_partial_input(word: string): boolean;
/**
* Returns `true` if this word is both valid and contains every given
* letter and `false` otherwise.
* @param {string} word
* @returns {boolean}
*/
  is_pangram(word: string): boolean;
/**
* Returns the required central letter.
* @returns {string}
*/
  required_letter(): string;
/**
* Returns the maximum score with all words.
* @returns {number}
*/
  max_score(): number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_spellingbeegame_free: (a: number) => void;
  readonly spellingbeegame_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly spellingbeegame_score: (a: number) => number;
  readonly spellingbeegame_play: (a: number, b: number, c: number) => number;
  readonly spellingbeegame_is_valid_partial_input: (a: number, b: number, c: number) => number;
  readonly spellingbeegame_is_pangram: (a: number, b: number, c: number) => number;
  readonly spellingbeegame_required_letter: (a: number) => number;
  readonly spellingbeegame_max_score: (a: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
        