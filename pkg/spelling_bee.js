let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}
/**
* The possible outcomes of playing a move.
*/
export const PlayResult = Object.freeze({
/**
* The word is valid and new: it has been added to the list and the score
* has been updated.
*/
Valid:0,
/**
* The word has already been played.
*/
AlreadyPlayed:1,
/**
* The word is not in the lexicon.
*/
InvalidWord:2,
/**
* The word is less than `MIN_LENGTH` (four) letters.
*/
InvalidLength:3,
/**
* The word doesn't use the required letter or has letters that are not
* allowed.
*/
InvalidLetters:4, });
/**
* A game of the NYT Spelling Bee, with six optional letters and a required one. Lets users play
* words and check them for validity, keeping track of the score.
*/
export class SpellingBeeGame {

    static __wrap(ptr) {
        const obj = Object.create(SpellingBeeGame.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_spellingbeegame_free(ptr);
    }
    /**
    * Creates a new spelling bee game from a set of optional letters and a
    * single required letter, using the given input buffers for lexicons.
    * @param {string} optional_letters
    * @param {string} required_letter
    * @param {string} main_words
    * @param {string} swears
    * @returns {SpellingBeeGame}
    */
    static new(optional_letters, required_letter, main_words, swears) {
        var ptr0 = passStringToWasm0(optional_letters, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passStringToWasm0(main_words, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = passStringToWasm0(swears, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        var ret = wasm.spellingbeegame_new(ptr0, len0, required_letter.codePointAt(0), ptr1, len1, ptr2, len2);
        return SpellingBeeGame.__wrap(ret);
    }
    /**
    * Returns the current score.
    *
    * Score is computed as follows: a four-letter word is worth one point. Any
    * word longer than that (words shorter than four letters are not allowed)
    * is worth a point for every letter it has. If the word uses all of the
    * given letters, it receives an additional seven points.
    * @returns {number}
    */
    score() {
        var ret = wasm.spellingbeegame_score(this.ptr);
        return ret >>> 0;
    }
    /**
    * Accepts a given word, updating internal state and returning the result
    * of the play.
    * @param {string} word
    * @returns {number}
    */
    play(word) {
        var ptr0 = passStringToWasm0(word, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.spellingbeegame_play(this.ptr, ptr0, len0);
        return ret >>> 0;
    }
    /**
    * Checks if the given input is valid, in that it only consists of allowed
    * letters.
    * @param {string} word
    * @returns {boolean}
    */
    is_valid_partial_input(word) {
        var ptr0 = passStringToWasm0(word, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.spellingbeegame_is_valid_partial_input(this.ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
    * Returns `true` if this word is both valid and contains every given
    * letter and `false` otherwise.
    * @param {string} word
    * @returns {boolean}
    */
    is_pangram(word) {
        var ptr0 = passStringToWasm0(word, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.spellingbeegame_is_pangram(this.ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
    * Returns the required central letter.
    * @returns {string}
    */
    required_letter() {
        var ret = wasm.spellingbeegame_required_letter(this.ptr);
        return String.fromCodePoint(ret);
    }
    /**
    * Returns the maximum score with all words.
    * @returns {number}
    */
    max_score() {
        var ret = wasm.spellingbeegame_max_score(this.ptr);
        return ret >>> 0;
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {

        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = import.meta.url.replace(/\.js$/, '_bg.wasm');
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        var ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_log_8c015365353ccd49 = function(arg0) {
        console.log(getObject(arg0));
    };
    imports.wbg.__wbg_new_59cb74e423758ede = function() {
        var ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_558ba5917b466edd = function(arg0, arg1) {
        var ret = getObject(arg1).stack;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_error_4bb6c2a97407129a = function(arg0, arg1) {
        try {
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(arg0, arg1);
        }
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;

    return wasm;
}

export default init;

