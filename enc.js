// ==UserScript==
// @name         bilibili_pc_heartbeat
// @namespace    https://github.com/lkeme/bilibili-pcheartbeat
// @version      0.1
// @description  bilibili PC心跳
// @author       lkeme, andywang425
// @run-at       document-end
// @include       * 
// @license      GPL3
// @grant unsafeWindow
// ==/UserScript==
/*! bilibili-pcheartbeat | (c) lkeme (https://github.com/lkeme/bilibili-pcheartbeat) | GNU General Public License v3.0 */
var bilibiliPcHeartBeat = {
    ANSWER: undefined,
    run: async (mainScriptT, mainScriptR, mainScriptRoomid) => {
        if (typeof Rust === "undefined") {
            var Rust = {};
        }

        return function (root, factory) {
            if (typeof define === "function" && define.amd) {
                define([], factory);
            } else if (typeof module === "object" && module.exports) {
                module.exports = factory();
            } else {
                Rust.app = factory();
            }
        }(this, function () {
            return (function (module_factory) {
                var instance = module_factory();
                var file = fetch("https://i0.hdslb.com/bfs/live/e791556706f88d88b4846a61a583b31db007f83d.wasm", { credentials: "same-origin" });
                var wasm_instance = (typeof WebAssembly.instantiateStreaming === "function"
                    ? WebAssembly.instantiateStreaming(file, instance.imports)
                        .then(function (result) {
                            return result.instance;
                        })
                    : file
                        .then(function (response) {
                            return response.arrayBuffer();
                        })
                        .then(function (bytes) {
                            return WebAssembly.compile(bytes);
                        })
                        .then(function (mod) {
                            return WebAssembly.instantiate(mod, instance.imports)
                        }));
                return wasm_instance
                    .then(async (wasm_instance) => {
                        var exports = await instance.initialize(wasm_instance);
                        console.log("Finished loading Rust wasm module 'app'");
                        //console.log('export', exports)
                        return exports;
                    })
                    .catch(function (error) {
                        console.log("Error loading Rust wasm module 'app':", error);
                        throw error;
                    });
                //}
            }(function () {
                var Module = {};

                Module.STDWEB_PRIVATE = {};

                // This is based on code from Emscripten's preamble.js.
                Module.STDWEB_PRIVATE.to_utf8 = function to_utf8(str, addr) {
                    var HEAPU8 = Module.HEAPU8;
                    for (var i = 0; i < str.length; ++i) {
                        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
                        // See http://unicode.org/faq/utf_bom.html#utf16-3
                        // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
                        var u = str.charCodeAt(i); // possibly a lead surrogate
                        if (u >= 0xD800 && u <= 0xDFFF) {
                            u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
                        }

                        if (u <= 0x7F) {
                            HEAPU8[addr++] = u;
                        } else if (u <= 0x7FF) {
                            HEAPU8[addr++] = 0xC0 | (u >> 6);
                            HEAPU8[addr++] = 0x80 | (u & 63);
                        } else if (u <= 0xFFFF) {
                            HEAPU8[addr++] = 0xE0 | (u >> 12);
                            HEAPU8[addr++] = 0x80 | ((u >> 6) & 63);
                            HEAPU8[addr++] = 0x80 | (u & 63);
                        } else if (u <= 0x1FFFFF) {
                            HEAPU8[addr++] = 0xF0 | (u >> 18);
                            HEAPU8[addr++] = 0x80 | ((u >> 12) & 63);
                            HEAPU8[addr++] = 0x80 | ((u >> 6) & 63);
                            HEAPU8[addr++] = 0x80 | (u & 63);
                        } else if (u <= 0x3FFFFFF) {
                            HEAPU8[addr++] = 0xF8 | (u >> 24);
                            HEAPU8[addr++] = 0x80 | ((u >> 18) & 63);
                            HEAPU8[addr++] = 0x80 | ((u >> 12) & 63);
                            HEAPU8[addr++] = 0x80 | ((u >> 6) & 63);
                            HEAPU8[addr++] = 0x80 | (u & 63);
                        } else {
                            HEAPU8[addr++] = 0xFC | (u >> 30);
                            HEAPU8[addr++] = 0x80 | ((u >> 24) & 63);
                            HEAPU8[addr++] = 0x80 | ((u >> 18) & 63);
                            HEAPU8[addr++] = 0x80 | ((u >> 12) & 63);
                            HEAPU8[addr++] = 0x80 | ((u >> 6) & 63);
                            HEAPU8[addr++] = 0x80 | (u & 63);
                        }
                    }
                };

                Module.STDWEB_PRIVATE.noop = function () {
                };
                Module.STDWEB_PRIVATE.to_js = function to_js(address) {
                    var kind = Module.HEAPU8[address + 12];
                    if (kind === 0) {
                        return undefined;
                    } else if (kind === 1) {
                        return null;
                    } else if (kind === 2) {
                        return Module.HEAP32[address / 4];
                    } else if (kind === 3) {
                        return Module.HEAPF64[address / 8];
                    } else if (kind === 4) {
                        var pointer = Module.HEAPU32[address / 4];
                        var length = Module.HEAPU32[(address + 4) / 4];
                        return Module.STDWEB_PRIVATE.to_js_string(pointer, length);
                    } else if (kind === 5) {
                        return false;
                    } else if (kind === 6) {
                        return true;
                    } else if (kind === 7) {
                        var pointer = Module.STDWEB_PRIVATE.arena + Module.HEAPU32[address / 4];
                        var length = Module.HEAPU32[(address + 4) / 4];
                        var output = [];
                        for (var i = 0; i < length; ++i) {
                            output.push(Module.STDWEB_PRIVATE.to_js(pointer + i * 16));
                        }
                        return output;
                    } else if (kind === 8) {
                        var arena = Module.STDWEB_PRIVATE.arena;
                        var value_array_pointer = arena + Module.HEAPU32[address / 4];
                        var length = Module.HEAPU32[(address + 4) / 4];
                        var key_array_pointer = arena + Module.HEAPU32[(address + 8) / 4];
                        var output = {};
                        for (var i = 0; i < length; ++i) {
                            var key_pointer = Module.HEAPU32[(key_array_pointer + i * 8) / 4];
                            var key_length = Module.HEAPU32[(key_array_pointer + 4 + i * 8) / 4];
                            var key = Module.STDWEB_PRIVATE.to_js_string(key_pointer, key_length);
                            var value = Module.STDWEB_PRIVATE.to_js(value_array_pointer + i * 16);
                            output[key] = value;
                        }
                        return output;
                    } else if (kind === 9) {
                        return Module.STDWEB_PRIVATE.acquire_js_reference(Module.HEAP32[address / 4]);
                    } else if (kind === 10 || kind === 12 || kind === 13) {
                        var adapter_pointer = Module.HEAPU32[address / 4];
                        var pointer = Module.HEAPU32[(address + 4) / 4];
                        var deallocator_pointer = Module.HEAPU32[(address + 8) / 4];
                        var num_ongoing_calls = 0;
                        var drop_queued = false;
                        var output = function () {
                            if (pointer === 0 || drop_queued === true) {
                                if (kind === 10) {
                                    throw new ReferenceError("Already dropped Rust function called!");
                                } else if (kind === 12) {
                                    throw new ReferenceError("Already dropped FnMut function called!");
                                } else {
                                    throw new ReferenceError("Already called or dropped FnOnce function called!");
                                }
                            }

                            var function_pointer = pointer;
                            if (kind === 13) {
                                output.drop = Module.STDWEB_PRIVATE.noop;
                                pointer = 0;
                            }

                            if (num_ongoing_calls !== 0) {
                                if (kind === 12 || kind === 13) {
                                    throw new ReferenceError("FnMut function called multiple times concurrently!");
                                }
                            }

                            var args = Module.STDWEB_PRIVATE.alloc(16);
                            Module.STDWEB_PRIVATE.serialize_array(args, arguments);

                            try {
                                num_ongoing_calls += 1;
                                Module.STDWEB_PRIVATE.dyncall("vii", adapter_pointer, [function_pointer, args]);
                                Module.STDWEB_PRIVATE.tmp = null;
                                var result = Module.STDWEB_PRIVATE.tmp;
                            } finally {
                                num_ongoing_calls -= 1;
                            }

                            if (drop_queued === true && num_ongoing_calls === 0) {
                                output.drop();
                            }

                            return result;
                        };

                        output.drop = function () {
                            if (num_ongoing_calls !== 0) {
                                drop_queued = true;
                                return;
                            }

                            output.drop = Module.STDWEB_PRIVATE.noop;
                            var function_pointer = pointer;
                            pointer = 0;

                            if (function_pointer != 0) {
                                Module.STDWEB_PRIVATE.dyncall("vi", deallocator_pointer, [function_pointer]);
                            }
                        };

                        return output;
                    } else if (kind === 14) {
                        var pointer = Module.HEAPU32[address / 4];
                        var length = Module.HEAPU32[(address + 4) / 4];
                        var array_kind = Module.HEAPU32[(address + 8) / 4];
                        var pointer_end = pointer + length;

                        switch (array_kind) {
                            case 0:
                                return Module.HEAPU8.subarray(pointer, pointer_end);
                            case 1:
                                return Module.HEAP8.subarray(pointer, pointer_end);
                            case 2:
                                return Module.HEAPU16.subarray(pointer, pointer_end);
                            case 3:
                                return Module.HEAP16.subarray(pointer, pointer_end);
                            case 4:
                                return Module.HEAPU32.subarray(pointer, pointer_end);
                            case 5:
                                return Module.HEAP32.subarray(pointer, pointer_end);
                            case 6:
                                return Module.HEAPF32.subarray(pointer, pointer_end);
                            case 7:
                                return Module.HEAPF64.subarray(pointer, pointer_end);
                        }
                    } else if (kind === 15) {
                        return Module.STDWEB_PRIVATE.get_raw_value(Module.HEAPU32[address / 4]);
                    }
                };

                Module.STDWEB_PRIVATE.serialize_object = function serialize_object(address, value) {
                    var keys = Object.keys(value);
                    var length = keys.length;
                    var key_array_pointer = Module.STDWEB_PRIVATE.alloc(length * 8);
                    var value_array_pointer = Module.STDWEB_PRIVATE.alloc(length * 16);
                    Module.HEAPU8[address + 12] = 8;
                    Module.HEAPU32[address / 4] = value_array_pointer;
                    Module.HEAPU32[(address + 4) / 4] = length;
                    Module.HEAPU32[(address + 8) / 4] = key_array_pointer;
                    for (var i = 0; i < length; ++i) {
                        var key = keys[i];
                        var key_address = key_array_pointer + i * 8;
                        Module.STDWEB_PRIVATE.to_utf8_string(key_address, key);

                        Module.STDWEB_PRIVATE.from_js(value_array_pointer + i * 16, value[key]);
                    }
                };

                Module.STDWEB_PRIVATE.serialize_array = function serialize_array(address, value) {
                    var length = value.length;
                    var pointer = Module.STDWEB_PRIVATE.alloc(length * 16);
                    Module.HEAPU8[address + 12] = 7;
                    Module.HEAPU32[address / 4] = pointer;
                    Module.HEAPU32[(address + 4) / 4] = length;
                    for (var i = 0; i < length; ++i) {
                        Module.STDWEB_PRIVATE.from_js(pointer + i * 16, value[i]);
                    }
                };

                // New browsers and recent Node
                var cachedEncoder = (typeof TextEncoder === "function"
                    ? new TextEncoder("utf-8")
                    // Old Node (before v11)
                    : (typeof util === "object" && util && typeof util.TextEncoder === "function"
                        ? new util.TextEncoder("utf-8")
                        // Old browsers
                        : null));

                if (cachedEncoder != null) {
                    Module.STDWEB_PRIVATE.to_utf8_string = function to_utf8_string(address, value) {
                        var buffer = cachedEncoder.encode(value);
                        var length = buffer.length;
                        var pointer = 0;

                        if (length > 0) {
                            pointer = Module.STDWEB_PRIVATE.alloc(length);
                            Module.HEAPU8.set(buffer, pointer);
                        }

                        Module.HEAPU32[address / 4] = pointer;
                        Module.HEAPU32[(address + 4) / 4] = length;
                    };

                } else {
                    Module.STDWEB_PRIVATE.to_utf8_string = function to_utf8_string(address, value) {
                        var length = Module.STDWEB_PRIVATE.utf8_len(value);
                        var pointer = 0;

                        if (length > 0) {
                            pointer = Module.STDWEB_PRIVATE.alloc(length);
                            Module.STDWEB_PRIVATE.to_utf8(value, pointer);
                        }

                        Module.HEAPU32[address / 4] = pointer;
                        Module.HEAPU32[(address + 4) / 4] = length;
                    };
                }

                Module.STDWEB_PRIVATE.from_js = function from_js(address, value) {
                    var kind = Object.prototype.toString.call(value);
                    if (kind === "[object String]") {
                        Module.HEAPU8[address + 12] = 4;
                        Module.STDWEB_PRIVATE.to_utf8_string(address, value);
                    } else if (kind === "[object Number]") {
                        if (value === (value | 0)) {
                            Module.HEAPU8[address + 12] = 2;
                            Module.HEAP32[address / 4] = value;
                        } else {
                            Module.HEAPU8[address + 12] = 3;
                            Module.HEAPF64[address / 8] = value;
                        }
                    } else if (value === null) {
                        Module.HEAPU8[address + 12] = 1;
                    } else if (value === undefined) {
                        Module.HEAPU8[address + 12] = 0;
                    } else if (value === false) {
                        Module.HEAPU8[address + 12] = 5;
                    } else if (value === true) {
                        Module.HEAPU8[address + 12] = 6;
                    } else if (kind === "[object Symbol]") {
                        var id = Module.STDWEB_PRIVATE.register_raw_value(value);
                        Module.HEAPU8[address + 12] = 15;
                        Module.HEAP32[address / 4] = id;
                    } else {
                        var refid = Module.STDWEB_PRIVATE.acquire_rust_reference(value);
                        Module.HEAPU8[address + 12] = 9;
                        Module.HEAP32[address / 4] = refid;
                    }
                };

                // New browsers and recent Node
                var cachedDecoder = (typeof TextDecoder === "function"
                    ? new TextDecoder("utf-8")
                    // Old Node (before v11)
                    : (typeof util === "object" && util && typeof util.TextDecoder === "function"
                        ? new util.TextDecoder("utf-8")
                        // Old browsers
                        : null));

                if (cachedDecoder != null) {
                    Module.STDWEB_PRIVATE.to_js_string = function to_js_string(index, length) {
                        return cachedDecoder.decode(Module.HEAPU8.subarray(index, index + length));
                    };

                } else {
                    // This is ported from Rust's stdlib; it's faster than
                    // the string conversion from Emscripten.
                    Module.STDWEB_PRIVATE.to_js_string = function to_js_string(index, length) {
                        var HEAPU8 = Module.HEAPU8;
                        index = index | 0;
                        length = length | 0;
                        var end = (index | 0) + (length | 0);
                        var output = "";
                        while (index < end) {
                            var x = HEAPU8[index++];
                            if (x < 128) {
                                output += String.fromCharCode(x);
                                continue;
                            }
                            var init = (x & (0x7F >> 2));
                            var y = 0;
                            if (index < end) {
                                y = HEAPU8[index++];
                            }
                            var ch = (init << 6) | (y & 63);
                            if (x >= 0xE0) {
                                var z = 0;
                                if (index < end) {
                                    z = HEAPU8[index++];
                                }
                                var y_z = ((y & 63) << 6) | (z & 63);
                                ch = init << 12 | y_z;
                                if (x >= 0xF0) {
                                    var w = 0;
                                    if (index < end) {
                                        w = HEAPU8[index++];
                                    }
                                    ch = (init & 7) << 18 | ((y_z << 6) | (w & 63));

                                    output += String.fromCharCode(0xD7C0 + (ch >> 10));
                                    ch = 0xDC00 + (ch & 0x3FF);
                                }
                            }
                            output += String.fromCharCode(ch);
                            continue;
                        }
                        return output;
                    };
                }

                Module.STDWEB_PRIVATE.id_to_ref_map = {};
                Module.STDWEB_PRIVATE.id_to_refcount_map = {};
                Module.STDWEB_PRIVATE.ref_to_id_map = new WeakMap();
                // Not all types can be stored in a WeakMap
                Module.STDWEB_PRIVATE.ref_to_id_map_fallback = new Map();
                Module.STDWEB_PRIVATE.last_refid = 1;

                Module.STDWEB_PRIVATE.id_to_raw_value_map = {};
                Module.STDWEB_PRIVATE.last_raw_value_id = 1;

                Module.STDWEB_PRIVATE.acquire_rust_reference = function (reference) {
                    if (reference === undefined || reference === null) {
                        return 0;
                    }

                    var id_to_refcount_map = Module.STDWEB_PRIVATE.id_to_refcount_map;
                    var id_to_ref_map = Module.STDWEB_PRIVATE.id_to_ref_map;
                    var ref_to_id_map = Module.STDWEB_PRIVATE.ref_to_id_map;
                    var ref_to_id_map_fallback = Module.STDWEB_PRIVATE.ref_to_id_map_fallback;

                    var refid = ref_to_id_map.get(reference);
                    if (refid === undefined) {
                        refid = ref_to_id_map_fallback.get(reference);
                    }
                    if (refid === undefined) {
                        refid = Module.STDWEB_PRIVATE.last_refid++;
                        try {
                            ref_to_id_map.set(reference, refid);
                        } catch (e) {
                            ref_to_id_map_fallback.set(reference, refid);
                        }
                    }

                    if (refid in id_to_ref_map) {
                        id_to_refcount_map[refid]++;
                    } else {
                        id_to_ref_map[refid] = reference;
                        id_to_refcount_map[refid] = 1;
                    }

                    return refid;
                };

                Module.STDWEB_PRIVATE.acquire_js_reference = function (refid) {
                    return Module.STDWEB_PRIVATE.id_to_ref_map[refid];
                };

                Module.STDWEB_PRIVATE.increment_refcount = function (refid) {
                    Module.STDWEB_PRIVATE.id_to_refcount_map[refid]++;
                };

                Module.STDWEB_PRIVATE.decrement_refcount = function (refid) {
                    var id_to_refcount_map = Module.STDWEB_PRIVATE.id_to_refcount_map;
                    if (0 == --id_to_refcount_map[refid]) {
                        var id_to_ref_map = Module.STDWEB_PRIVATE.id_to_ref_map;
                        var ref_to_id_map_fallback = Module.STDWEB_PRIVATE.ref_to_id_map_fallback;
                        var reference = id_to_ref_map[refid];
                        delete id_to_ref_map[refid];
                        delete id_to_refcount_map[refid];
                        ref_to_id_map_fallback.delete(reference);
                    }
                };

                Module.STDWEB_PRIVATE.register_raw_value = function (value) {
                    var id = Module.STDWEB_PRIVATE.last_raw_value_id++;
                    Module.STDWEB_PRIVATE.id_to_raw_value_map[id] = value;
                    return id;
                };

                Module.STDWEB_PRIVATE.unregister_raw_value = function (id) {
                    delete Module.STDWEB_PRIVATE.id_to_raw_value_map[id];
                };

                Module.STDWEB_PRIVATE.get_raw_value = function (id) {
                    return Module.STDWEB_PRIVATE.id_to_raw_value_map[id];
                };

                Module.STDWEB_PRIVATE.alloc = function alloc(size) {
                    return Module.web_malloc(size);
                };

                Module.STDWEB_PRIVATE.dyncall = function (signature, ptr, args) {
                    return Module.web_table.get(ptr).apply(null, args);
                };

                // This is based on code from Emscripten's preamble.js.
                Module.STDWEB_PRIVATE.utf8_len = function utf8_len(str) {
                    var len = 0;
                    for (var i = 0; i < str.length; ++i) {
                        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
                        // See http://unicode.org/faq/utf_bom.html#utf16-3
                        var u = str.charCodeAt(i); // possibly a lead surrogate
                        if (u >= 0xD800 && u <= 0xDFFF) {
                            u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
                        }

                        if (u <= 0x7F) {
                            ++len;
                        } else if (u <= 0x7FF) {
                            len += 2;
                        } else if (u <= 0xFFFF) {
                            len += 3;
                        } else if (u <= 0x1FFFFF) {
                            len += 4;
                        } else if (u <= 0x3FFFFFF) {
                            len += 5;
                        } else {
                            len += 6;
                        }
                    }
                    return len;
                };

                Module.STDWEB_PRIVATE.prepare_any_arg = function (value) {
                    var arg = Module.STDWEB_PRIVATE.alloc(16);
                    Module.STDWEB_PRIVATE.from_js(arg, value);
                    return arg;
                };

                Module.STDWEB_PRIVATE.acquire_tmp = function (dummy) {
                    var value = Module.STDWEB_PRIVATE.tmp;
                    // console.log("这里是527");
                    // console.log(Module.STDWEB_PRIVATE.tmp);
                    Module.STDWEB_PRIVATE.tmp = null;
                    return value;
                };


                var HEAP8 = null;
                var HEAP16 = null;
                var HEAP32 = null;
                var HEAPU8 = null;
                var HEAPU16 = null;
                var HEAPU32 = null;
                var HEAPF32 = null;
                var HEAPF64 = null;

                Object.defineProperty(Module, 'exports', { value: {} });

                function __web_on_grow() {
                    var buffer = Module.instance.exports.memory.buffer;
                    HEAP8 = new Int8Array(buffer);
                    HEAP16 = new Int16Array(buffer);
                    HEAP32 = new Int32Array(buffer);
                    HEAPU8 = new Uint8Array(buffer);
                    HEAPU16 = new Uint16Array(buffer);
                    HEAPU32 = new Uint32Array(buffer);
                    HEAPF32 = new Float32Array(buffer);
                    HEAPF64 = new Float64Array(buffer);
                    Module.HEAP8 = HEAP8;
                    Module.HEAP16 = HEAP16;
                    Module.HEAP32 = HEAP32;
                    Module.HEAPU8 = HEAPU8;
                    Module.HEAPU16 = HEAPU16;
                    Module.HEAPU32 = HEAPU32;
                    Module.HEAPF32 = HEAPF32;
                    Module.HEAPF64 = HEAPF64;
                }

                return {
                    imports: {
                        env: {
                            __cargo_web_snippet_0d39c013e2144171d64e2fac849140a7e54c939a: function (t, r) {
                                r = Module.STDWEB_PRIVATE.to_js(r),
                                    // r['location']= {"href":"https://live.bilibili.com/23058","ancestorOrigins":{},"origin":"https://live.bilibili.com","protocol":"https:","host":"live.bilibili.com","hostname":"live.bilibili.com","port":"","pathname":"/23058","search":"","hash":""},
                                    Module.STDWEB_PRIVATE.from_js(t, r.location)
                            },
                            __cargo_web_snippet_0f503de1d61309643e0e13a7871406891e3691c9: function (t) {
                                Module.STDWEB_PRIVATE.from_js(t, unsafeWindow)
                            },
                            __cargo_web_snippet_10f5aa3985855124ab83b21d4e9f7297eb496508: function (t) {
                                return Module.STDWEB_PRIVATE.acquire_js_reference(t) instanceof Array | 0
                            },
                            __cargo_web_snippet_2b0b92aee0d0de6a955f8e5540d7923636d951ae: function (t, r) {
                                // r = Module.STDWEB_PRIVATE.to_js(r),
                                r = {
                                    "href": "https://live.bilibili.com/" + mainScriptRoomid,
                                    "ancestorOrigins": {},
                                    "origin": "https://live.bilibili.com",
                                    "protocol": "https:",
                                    "host": "live.bilibili.com",
                                    "hostname": "live.bilibili.com",
                                    "port": "",
                                    "pathname": "/" + mainScriptRoomid,
                                    "search": "",
                                    "hash": ""
                                },
                                    Module.STDWEB_PRIVATE.from_js(t, function () {
                                        try {
                                            return {
                                                value: r.origin,
                                                success: !0
                                            }
                                        } catch (e) {
                                            return {
                                                error: e,
                                                success: !1
                                            }
                                        }
                                    }())
                            },
                            __cargo_web_snippet_461d4581925d5b0bf583a3b445ed676af8701ca6: function (t, r) {
                                // r = Module.STDWEB_PRIVATE.to_js(r),
                                r = {
                                    "href": "https://live.bilibili.com/" + mainScriptRoomid,
                                    "ancestorOrigins": {},
                                    "origin": "https://live.bilibili.com",
                                    "protocol": "https:",
                                    "host": "live.bilibili.com",
                                    "hostname": "live.bilibili.com",
                                    "port": "",
                                    "pathname": "/" + mainScriptRoomid,
                                    "search": "",
                                    "hash": ""
                                },
                                    Module.STDWEB_PRIVATE.from_js(t, function () {
                                        try {
                                            return {
                                                value: r.host,
                                                success: !0
                                            }
                                        } catch (e) {
                                            return {
                                                error: e,
                                                success: !1
                                            }
                                        }
                                    }())
                            },
                            __cargo_web_snippet_47f2f1bcb3a98005784ca21786e4313bdd4de7b2: function (t, r) {
                                r = Module.STDWEB_PRIVATE.to_js(r),
                                    Module.STDWEB_PRIVATE.from_js(t, 1920) // r.outerWidth
                            },
                            __cargo_web_snippet_4c895ac2b754e5559c1415b6546d672c58e29da6: function (t, r) {
                                // r = Module.STDWEB_PRIVATE.to_js(r),
                                r = {
                                    "href": "https://live.bilibili.com/" + mainScriptRoomid,
                                    "ancestorOrigins": {},
                                    "origin": "https://live.bilibili.com",
                                    "protocol": "https:",
                                    "host": "live.bilibili.com",
                                    "hostname": "live.bilibili.com",
                                    "port": "",
                                    "pathname": "/" + mainScriptRoomid,
                                    "search": "",
                                    "hash": ""
                                },
                                    Module.STDWEB_PRIVATE.from_js(t, function () {
                                        try {
                                            return {
                                                value: r.protocol,
                                                success: !0
                                            }
                                        } catch (e) {
                                            return {
                                                error: e,
                                                success: !1
                                            }
                                        }
                                    }())
                            },
                            __cargo_web_snippet_614a3dd2adb7e9eac4a0ec6e59d37f87e0521c3b: function (t, r) {
                                r = Module.STDWEB_PRIVATE.to_js(r),
                                    Module.STDWEB_PRIVATE.from_js(t, r.error)
                            },
                            __cargo_web_snippet_62ef43cf95b12a9b5cdec1639439c972d6373280: function (t, r) {
                                r = Module.STDWEB_PRIVATE.to_js(r),
                                    Module.STDWEB_PRIVATE.from_js(t, r.childNodes)
                            },
                            __cargo_web_snippet_6fcce0aae651e2d748e085ff1f800f87625ff8c8: function (t) {
                                Module.STDWEB_PRIVATE.from_js(t, document)
                            },
                            __cargo_web_snippet_7ba9f102925446c90affc984f921f414615e07dd: function (t, r) {
                                r = Module.STDWEB_PRIVATE.to_js(r),
                                    Module.STDWEB_PRIVATE.from_js(t, r.body)
                            },
                            __cargo_web_snippet_80d6d56760c65e49b7be8b6b01c1ea861b046bf0: function (t) {
                                Module.STDWEB_PRIVATE.decrement_refcount(t)
                            },
                            __cargo_web_snippet_897ff2d0160606ea98961935acb125d1ddbf4688: function (t) {
                                var r = Module.STDWEB_PRIVATE.acquire_js_reference(t);
                                return r instanceof DOMException && "SecurityError" === r.name
                            },
                            __cargo_web_snippet_8c32019649bb581b1b742eeedfc410e2bedd56a6: function (t, r) {
                                var n = Module.STDWEB_PRIVATE.acquire_js_reference(t);
                                Module.STDWEB_PRIVATE.serialize_array(r, n)
                            },
                            __cargo_web_snippet_a1e61073e9bd0063e0444a8b3f8a2770cdf938ec: function (t, r) {
                                r = Module.STDWEB_PRIVATE.to_js(r),
                                    Module.STDWEB_PRIVATE.from_js(t, 1080) // r.outerHeight
                            },
                            __cargo_web_snippet_a466a2ab96cd77e1a77dcdb39f4f031701c195fc: function (t, r) {
                                // r = Module.STDWEB_PRIVATE.to_js(r),
                                r = {
                                    "href": "https://live.bilibili.com/blanc/6?liteVersion=true",
                                    "ancestorOrigins": {},
                                    "origin": "https://live.bilibili.com",
                                    "protocol": "https:",
                                    "host": "live.bilibili.com",
                                    "hostname": "live.bilibili.com",
                                    "port": "",
                                    "pathname": "?liteVersion=true",
                                    "search": "",
                                    "hash": ""
                                },
                                    Module.STDWEB_PRIVATE.from_js(t, function () {
                                        try {
                                            return {
                                                value: r.pathname,
                                                success: !0
                                            }
                                        } catch (e) {
                                            return {
                                                error: e,
                                                success: !1
                                            }
                                        }
                                    }())
                            },
                            __cargo_web_snippet_ab05f53189dacccf2d365ad26daa407d4f7abea9: function (t, r) {
                                r = Module.STDWEB_PRIVATE.to_js(r),
                                    // r = {
                                    //     value: "live.bilibili.com",
                                    //     success: true
                                    // },
                                    Module.STDWEB_PRIVATE.from_js(t, r.value)
                            },
                            __cargo_web_snippet_b06dde4acf09433b5190a4b001259fe5d4abcbc2: function (t, r) {
                                r = Module.STDWEB_PRIVATE.to_js(r),
                                    // r = {
                                    //     value: "live.bilibili.com",
                                    //     success: true
                                    // },
                                    Module.STDWEB_PRIVATE.from_js(t, r.success)
                            },
                            __cargo_web_snippet_b33a39de4ca954888e26fe9caa277138e808eeba: function (t, r) {
                                r = Module.STDWEB_PRIVATE.to_js(r),
                                    Module.STDWEB_PRIVATE.from_js(t, r.length) // r.length
                            },
                            __cargo_web_snippet_b6fbe111e441333398599f63dc09b26f8d172654: function (t, r) {
                                r = Module.STDWEB_PRIVATE.to_js(r),
                                    Module.STDWEB_PRIVATE.from_js(t, 987) // r.innerHeight
                            },
                            __cargo_web_snippet_cdf2859151791ce4cad80688b200564fb08a8613: function (t, r) {
                                // r = Module.STDWEB_PRIVATE.to_js(r),
                                r = {
                                    "href": "https://live.bilibili.com/" + mainScriptRoomid,
                                    "ancestorOrigins": {},
                                    "origin": "https://live.bilibili.com",
                                    "protocol": "https:",
                                    "host": "live.bilibili.com",
                                    "hostname": "live.bilibili.com",
                                    "port": "",
                                    "pathname": "/" + mainScriptRoomid,
                                    "search": "",
                                    "hash": ""
                                },
                                    Module.STDWEB_PRIVATE.from_js(t, function () {
                                        try {
                                            return {
                                                value: r.href,
                                                success: !0
                                            }
                                        } catch (e) {
                                            return {
                                                error: e,
                                                success: !1
                                            }
                                        }
                                    }())
                            },
                            __cargo_web_snippet_e8ef87c41ded1c10f8de3c70dea31a053e19747c: function (t, r) {
                                // r = Module.STDWEB_PRIVATE.to_js(r),
                                r = {
                                    "href": "https://live.bilibili.com/" + mainScriptRoomid,
                                    "ancestorOrigins": {},
                                    "origin": "https://live.bilibili.com",
                                    "protocol": "https:",
                                    "host": "live.bilibili.com",
                                    "hostname": "live.bilibili.com",
                                    "port": "",
                                    "pathname": "/" + mainScriptRoomid,
                                    "search": "",
                                    "hash": ""
                                },
                                    Module.STDWEB_PRIVATE.from_js(t, function () {
                                        try {
                                            return {
                                                value: r.hostname,
                                                success: !0
                                            }
                                        } catch (e) {
                                            return {
                                                error: e,
                                                success: !1
                                            }
                                        }
                                    }())
                            },
                            __cargo_web_snippet_e9638d6405ab65f78daf4a5af9c9de14ecf1e2ec: function (t) {
                                t = Module.STDWEB_PRIVATE.to_js(t),
                                    Module.STDWEB_PRIVATE.unregister_raw_value(t)
                            },
                            __cargo_web_snippet_ea6ad9d8415e84119621f5aa2c86a39abc588b75: function (t, r) {
                                r = Module.STDWEB_PRIVATE.to_js(r),
                                    Module.STDWEB_PRIVATE.from_js(t, 584) // r.innerWidth
                            },
                            __cargo_web_snippet_ff5103e6cc179d13b4c7a785bdce2708fd559fc0: function (t) {
                                Module.STDWEB_PRIVATE.tmp = Module.STDWEB_PRIVATE.to_js(t)
                                // console.log("这里是734");
                                // console.log(Module.STDWEB_PRIVATE.tmp);
                            },
                            __web_on_grow: __web_on_grow
                        }
                    },
                    initialize: async (instance) => {
                        Object.defineProperty(Module, 'instance', { value: instance });
                        Object.defineProperty(Module, 'web_malloc', { value: Module.instance.exports.__web_malloc });
                        Object.defineProperty(Module, 'web_free', { value: Module.instance.exports.__web_free });
                        Object.defineProperty(Module, 'web_table', { value: Module.instance.exports.__indirect_function_table });
                        Module.exports.spyder = async (t, r) => {
                            // console.log(JSON.stringify(t));
                            // console.log(JSON.stringify(r));
                            //console.log("↓---加密前t数据---↓")
                            //console.log(t);
                            //console.log("↓---加密前r数据---↓")
                            //console.log(r);
                            try {
                                var a = await Module.STDWEB_PRIVATE.prepare_any_arg(t);
                                console.log('t', a);
                                var b = await Module.STDWEB_PRIVATE.prepare_any_arg(r)
                                console.log('r', b);
                                var c = await Module.instance.exports.spyder(a, b)
                                //console.log('spyder',c);
                                //var d = await Module.STDWEB_PRIVATE.acquire_tmp(c);
                                //console.log('tmp',d);
                                //UniqueFinalS = d;
                                //console.log("↓---加密后s数据---↓")
                                //var success = Module.STDWEB_PRIVATE.acquire_tmp(Module.exports.spyder(Module.STDWEB_PRIVATE.prepare_any_arg(t), Module.STDWEB_PRIVATE.prepare_any_arg(r)));
                                var success = await Module.STDWEB_PRIVATE.acquire_tmp(c);
                                console.log('success', success);
                                bilibiliPcHeartBeat.ANSWER = success;
                                return success;
                                //return d;
                            } catch (e) {
                                console.log(e);
                            }
                            // return Module.STDWEB_PRIVATE.acquire_tmp(Module.instance.exports.spyder(Module.STDWEB_PRIVATE.prepare_any_arg(t), Module.STDWEB_PRIVATE.prepare_any_arg(r)))
                        }
                        /*
                         var t = JSON.stringify({
                             "id": "[1, 34, 1, 23058]",//"[\"AUTO5715918890686005\",\"c76aaeb9-15b9-4b58-9a43-5a2b4a242f5b\"]"
                             //"device": "[\"e0345df3964d37eb4276832275392dfd\", \"7190a3eb-c27a-40c1-936b-3d66bda01d3e\"]",
                             "device": "[\"AUTO5715918890686005\",\"c76aaeb9-15b9-4b58-9a43-5a2b4a242f5b\"]",
                             "ets": 1595465214,
                             "benchmark": "seacasdgyijfhofiuxoannn",
                             "time": 300, "ts": 1595465515470
                         });
                         var r = [2, 5, 1, 4]*/

                        console.log('开始计算resultS');
                        return await Module.exports.spyder(mainScriptT, mainScriptR);
                        //__web_on_grow();
                        //return resultS
                        /*
                         Object.defineProperty(Module, "web_malloc", {
                             value: Module.instance.__web_malloc
                         }),
                         Object.defineProperty(Module, "web_free", {
                             value: Module.instance.__web_free
                         }),
                         Object.defineProperty(Module, "web_table", {
                             value: Module.instance.__indirect_function_table
                         }),
                        
                         
                         __web_on_grow(),
                         Module.exports
                         */
                    }
                };
            }
            ));
        })
    }
};
/*
let getanswer = async () => {
    var t = JSON.stringify({
        "id": "[1, 34, 1, " + "3" + "]",//"[\"AUTO5715918890686005\",\"c76aaeb9-15b9-4b58-9a43-5a2b4a242f5b\"]"
        //"device": "[\"e0345df3964d37eb4276832275392dfd\", \"7190a3eb-c27a-40c1-936b-3d66bda01d3e\"]",
        "device": "[\"AUTO5715918890686005\",\"c76aaeb9-15b9-4b58-9a43-5a2b4a242f5b\"]",
        "ets": 1595465214,
        "benchmark": "seacasdgyijfhofiuxoannn",
        "time": 300, "ts": 1595465515470
    });
    var r = [2, 5, 1, 4];
    var roomid = "3";
    await bilibiliPcHeartBeat(t, r, roomid);
    setTimeout(() => {
        console.log("结果", UniqueFinalS)
    }, 5000);

};
getanswer()*/
// hash: ""
// host: "live.bilibili.com"
// hostname: "live.bilibili.com"
// href: "https://live.bilibili.com/23058"
// origin: "https://live.bilibili.com"
// pathname: "/23058"
// port: ""
// protocol: "https:"
// reload: ƒ reload()
// replace: ƒ ()
// search: ""
// toString: ƒ toString()
// valueOf: ƒ valueOf()
// Symbol(Symbol.toPrimitive): undefined
// __proto__: Location
//
//
// hash: ""
// host: "live.bilibili.com"
// hostname: "live.bilibili.com"
// href: "https://live.bilibili.com/23058"
// origin: "https://live.bilibili.com"
// pathname: "/23058"
// port: ""
// protocol: "https:"
// reload: ƒ reload()
// replace: ƒ ()
// search: ""
// toString: ƒ toString()
// valueOf: ƒ valueOf()
// Symbol(Symbol.toPrimitive): undefined
//
// __proto__: Location
// "{"href":"https://live.bilibili.com/23058","ancestorOrigins":{},"origin":"https://live.bilibili.com","protocol":"https:","host":"live.bilibili.com","hostname":"live.bilibili.com","port":"","pathname":"/23058","search":"","hash":""}"
// "{"href":"https://live.bilibili.com/23058","ancestorOrigins":{},"origin":"https://live.bilibili.com","protocol":"https:","host":"live.bilibili.com","hostname":"live.bilibili.com","port":"","pathname":"/23058","search":"","hash":""}"
// "{"value":"live.bilibili.com","success":true}"
