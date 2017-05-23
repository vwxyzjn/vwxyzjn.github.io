webpackJsonp([0],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(52)

var Component = __webpack_require__(4)(
  /* script */
  __webpack_require__(42),
  /* template */
  __webpack_require__(114),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 18 */,
/* 19 */,
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
/* **********************************************
     Begin prism-core.js
********************************************** */

var _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function(){

// Private helper vars
var lang = /\blang(?:uage)?-(\w+)\b/i;
var uniqueId = 0;

var _ = _self.Prism = {
	util: {
		encode: function (tokens) {
			if (tokens instanceof Token) {
				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
			} else if (_.util.type(tokens) === 'Array') {
				return tokens.map(_.util.encode);
			} else {
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
			}
		},

		type: function (o) {
			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
		},

		objId: function (obj) {
			if (!obj['__id']) {
				Object.defineProperty(obj, '__id', { value: ++uniqueId });
			}
			return obj['__id'];
		},

		// Deep clone a language definition (e.g. to extend it)
		clone: function (o) {
			var type = _.util.type(o);

			switch (type) {
				case 'Object':
					var clone = {};

					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = _.util.clone(o[key]);
						}
					}

					return clone;

				case 'Array':
					// Check for existence for IE8
					return o.map && o.map(function(v) { return _.util.clone(v); });
			}

			return o;
		}
	},

	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);

			for (var key in redef) {
				lang[key] = redef[key];
			}

			return lang;
		},

		/**
		 * Insert a token before another token in a language literal
		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
		 * we cannot just provide an object, we need anobject and a key.
		 * @param inside The key (or language id) of the parent
		 * @param before The key to insert before. If not provided, the function appends instead.
		 * @param insert Object with the key/value pairs to insert
		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
		 */
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];

			if (arguments.length == 2) {
				insert = arguments[1];

				for (var newToken in insert) {
					if (insert.hasOwnProperty(newToken)) {
						grammar[newToken] = insert[newToken];
					}
				}

				return grammar;
			}

			var ret = {};

			for (var token in grammar) {

				if (grammar.hasOwnProperty(token)) {

					if (token == before) {

						for (var newToken in insert) {

							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}

					ret[token] = grammar[token];
				}
			}

			// Update references in other language definitions
			_.languages.DFS(_.languages, function(key, value) {
				if (value === root[inside] && key != inside) {
					this[key] = ret;
				}
			});

			return root[inside] = ret;
		},

		// Traverse a language definition with Depth First Search
		DFS: function(o, callback, type, visited) {
			visited = visited || {};
			for (var i in o) {
				if (o.hasOwnProperty(i)) {
					callback.call(o, i, o[i], type || i);

					if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, null, visited);
					}
					else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, i, visited);
					}
				}
			}
		}
	},
	plugins: {},

	highlightAll: function(async, callback) {
		var env = {
			callback: callback,
			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
		};

		_.hooks.run("before-highlightall", env);

		var elements = env.elements || document.querySelectorAll(env.selector);

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, env.callback);
		}
	},

	highlightElement: function(element, async, callback) {
		// Find language
		var language, grammar, parent = element;

		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}

		if (parent) {
			language = (parent.className.match(lang) || [,''])[1].toLowerCase();
			grammar = _.languages[language];
		}

		// Set language on the element, if not present
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

		// Set language on the parent, for styling
		parent = element.parentNode;

		if (/pre/i.test(parent.nodeName)) {
			parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
		}

		var code = element.textContent;

		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};

		_.hooks.run('before-sanity-check', env);

		if (!env.code || !env.grammar) {
			if (env.code) {
				env.element.textContent = env.code;
			}
			_.hooks.run('complete', env);
			return;
		}

		_.hooks.run('before-highlight', env);

		if (async && _self.Worker) {
			var worker = new Worker(_.filename);

			worker.onmessage = function(evt) {
				env.highlightedCode = evt.data;

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				callback && callback.call(env.element);
				_.hooks.run('after-highlight', env);
				_.hooks.run('complete', env);
			};

			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code,
				immediateClose: true
			}));
		}
		else {
			env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

			_.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;

			callback && callback.call(element);

			_.hooks.run('after-highlight', env);
			_.hooks.run('complete', env);
		}
	},

	highlight: function (text, grammar, language) {
		var tokens = _.tokenize(text, grammar);
		return Token.stringify(_.util.encode(tokens), language);
	},

	tokenize: function(text, grammar, language) {
		var Token = _.Token;

		var strarr = [text];

		var rest = grammar.rest;

		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		tokenloop: for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}

			var patterns = grammar[token];
			patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

			for (var j = 0; j < patterns.length; ++j) {
				var pattern = patterns[j],
					inside = pattern.inside,
					lookbehind = !!pattern.lookbehind,
					greedy = !!pattern.greedy,
					lookbehindLength = 0,
					alias = pattern.alias;

				if (greedy && !pattern.pattern.global) {
					// Without the global flag, lastIndex won't work
					var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
					pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
				}

				pattern = pattern.pattern || pattern;

				// Don’t cache length as it changes during the loop
				for (var i=0, pos = 0; i<strarr.length; pos += strarr[i].length, ++i) {

					var str = strarr[i];

					if (strarr.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						break tokenloop;
					}

					if (str instanceof Token) {
						continue;
					}

					pattern.lastIndex = 0;

					var match = pattern.exec(str),
					    delNum = 1;

					// Greedy patterns can override/remove up to two previously matched tokens
					if (!match && greedy && i != strarr.length - 1) {
						pattern.lastIndex = pos;
						match = pattern.exec(text);
						if (!match) {
							break;
						}

						var from = match.index + (lookbehind ? match[1].length : 0),
						    to = match.index + match[0].length,
						    k = i,
						    p = pos;

						for (var len = strarr.length; k < len && p < to; ++k) {
							p += strarr[k].length;
							// Move the index i to the element in strarr that is closest to from
							if (from >= p) {
								++i;
								pos = p;
							}
						}

						/*
						 * If strarr[i] is a Token, then the match starts inside another Token, which is invalid
						 * If strarr[k - 1] is greedy we are in conflict with another greedy pattern
						 */
						if (strarr[i] instanceof Token || strarr[k - 1].greedy) {
							continue;
						}

						// Number of tokens to delete and replace with the new match
						delNum = k - i;
						str = text.slice(pos, p);
						match.index -= pos;
					}

					if (!match) {
						continue;
					}

					if(lookbehind) {
						lookbehindLength = match[1].length;
					}

					var from = match.index + lookbehindLength,
					    match = match[0].slice(lookbehindLength),
					    to = from + match.length,
					    before = str.slice(0, from),
					    after = str.slice(to);

					var args = [i, delNum];

					if (before) {
						args.push(before);
					}

					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

					args.push(wrapped);

					if (after) {
						args.push(after);
					}

					Array.prototype.splice.apply(strarr, args);
				}
			}
		}

		return strarr;
	},

	hooks: {
		all: {},

		add: function (name, callback) {
			var hooks = _.hooks.all;

			hooks[name] = hooks[name] || [];

			hooks[name].push(callback);
		},

		run: function (name, env) {
			var callbacks = _.hooks.all[name];

			if (!callbacks || !callbacks.length) {
				return;
			}

			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	}
};

var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
	this.type = type;
	this.content = content;
	this.alias = alias;
	// Copy of the full string this token was created from
	this.length = (matchedStr || "").length|0;
	this.greedy = !!greedy;
};

Token.stringify = function(o, language, parent) {
	if (typeof o == 'string') {
		return o;
	}

	if (_.util.type(o) === 'Array') {
		return o.map(function(element) {
			return Token.stringify(element, language, o);
		}).join('');
	}

	var env = {
		type: o.type,
		content: Token.stringify(o.content, language, parent),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language,
		parent: parent
	};

	if (env.type == 'comment') {
		env.attributes['spellcheck'] = 'true';
	}

	if (o.alias) {
		var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
		Array.prototype.push.apply(env.classes, aliases);
	}

	_.hooks.run('wrap', env);

	var attributes = Object.keys(env.attributes).map(function(name) {
		return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
	}).join(' ');

	return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';

};

if (!_self.document) {
	if (!_self.addEventListener) {
		// in Node.js
		return _self.Prism;
	}
 	// In worker
	_self.addEventListener('message', function(evt) {
		var message = JSON.parse(evt.data),
		    lang = message.language,
		    code = message.code,
		    immediateClose = message.immediateClose;

		_self.postMessage(_.highlight(code, _.languages[lang], lang));
		if (immediateClose) {
			_self.close();
		}
	}, false);

	return _self.Prism;
}

//Get current script and highlight
var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

if (script) {
	_.filename = script.src;

	if (document.addEventListener && !script.hasAttribute('data-manual')) {
		if(document.readyState !== "loading") {
			if (window.requestAnimationFrame) {
				window.requestAnimationFrame(_.highlightAll);
			} else {
				window.setTimeout(_.highlightAll, 16);
			}
		}
		else {
			document.addEventListener('DOMContentLoaded', _.highlightAll);
		}
	}
}

return _self.Prism;

})();

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
	global.Prism = Prism;
}


/* **********************************************
     Begin prism-markup.js
********************************************** */

Prism.languages.markup = {
	'comment': /<!--[\w\W]*?-->/,
	'prolog': /<\?[\w\W]+?\?>/,
	'doctype': /<!DOCTYPE[\w\W]+?>/i,
	'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,
	'tag': {
		pattern: /<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
		inside: {
			'tag': {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: {
					'punctuation': /^<\/?/,
					'namespace': /^[^\s>\/:]+:/
				}
			},
			'attr-value': {
				pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
				inside: {
					'punctuation': /[=>"']/
				}
			},
			'punctuation': /\/?>/,
			'attr-name': {
				pattern: /[^\s>\/]+/,
				inside: {
					'namespace': /^[^\s>\/:]+:/
				}
			}

		}
	},
	'entity': /&#?[\da-z]{1,8};/i
};

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function(env) {

	if (env.type === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});

Prism.languages.xml = Prism.languages.markup;
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;


/* **********************************************
     Begin prism-css.js
********************************************** */

Prism.languages.css = {
	'comment': /\/\*[\w\W]*?\*\//,
	'atrule': {
		pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
		inside: {
			'rule': /@[\w-]+/
			// See rest below
		}
	},
	'url': /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
	'selector': /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
	'string': {
		pattern: /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'property': /(\b|\B)[\w-]+(?=\s*:)/i,
	'important': /\B!important\b/i,
	'function': /[-a-z0-9]+(?=\()/i,
	'punctuation': /[(){};:]/
};

Prism.languages.css['atrule'].inside.rest = Prism.util.clone(Prism.languages.css);

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'style': {
			pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
			lookbehind: true,
			inside: Prism.languages.css,
			alias: 'language-css'
		}
	});
	
	Prism.languages.insertBefore('inside', 'attr-value', {
		'style-attr': {
			pattern: /\s*style=("|').*?\1/i,
			inside: {
				'attr-name': {
					pattern: /^\s*style/i,
					inside: Prism.languages.markup.tag.inside
				},
				'punctuation': /^\s*=\s*['"]|['"]\s*$/,
				'attr-value': {
					pattern: /.+/i,
					inside: Prism.languages.css
				}
			},
			alias: 'language-css'
		}
	}, Prism.languages.markup.tag);
}

/* **********************************************
     Begin prism-clike.js
********************************************** */

Prism.languages.clike = {
	'comment': [
		{
			pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true
		}
	],
	'string': {
		pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'class-name': {
		pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
		lookbehind: true,
		inside: {
			punctuation: /(\.|\\)/
		}
	},
	'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	'boolean': /\b(true|false)\b/,
	'function': /[a-z0-9_]+(?=\()/i,
	'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	'punctuation': /[{}[\];(),.:]/
};


/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
	'number': /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
	'function': /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*\*?|\/|~|\^|%|\.{3}/
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
		lookbehind: true,
		greedy: true
	}
});

Prism.languages.insertBefore('javascript', 'string', {
	'template-string': {
		pattern: /`(?:\\\\|\\?[^\\])*?`/,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /\$\{[^}]+\}/,
				inside: {
					'interpolation-punctuation': {
						pattern: /^\$\{|\}$/,
						alias: 'punctuation'
					},
					rest: Prism.languages.javascript
				}
			},
			'string': /[\s\S]+/
		}
	}
});

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'script': {
			pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
			lookbehind: true,
			inside: Prism.languages.javascript,
			alias: 'language-javascript'
		}
	});
}

Prism.languages.js = Prism.languages.javascript;

/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
		return;
	}

	self.Prism.fileHighlight = function() {

		var Extensions = {
			'js': 'javascript',
			'py': 'python',
			'rb': 'ruby',
			'ps1': 'powershell',
			'psm1': 'powershell',
			'sh': 'bash',
			'bat': 'batch',
			'h': 'c',
			'tex': 'latex'
		};

		if(Array.prototype.forEach) { // Check to prevent error in IE8
			Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (pre) {
				var src = pre.getAttribute('data-src');

				var language, parent = pre;
				var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;
				while (parent && !lang.test(parent.className)) {
					parent = parent.parentNode;
				}

				if (parent) {
					language = (pre.className.match(lang) || [, ''])[1];
				}

				if (!language) {
					var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
					language = Extensions[extension] || extension;
				}

				var code = document.createElement('code');
				code.className = 'language-' + language;

				pre.textContent = '';

				code.textContent = 'Loading…';

				pre.appendChild(code);

				var xhr = new XMLHttpRequest();

				xhr.open('GET', src, true);

				xhr.onreadystatechange = function () {
					if (xhr.readyState == 4) {

						if (xhr.status < 400 && xhr.responseText) {
							code.textContent = xhr.responseText;

							Prism.highlightElement(code);
						}
						else if (xhr.status >= 400) {
							code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
						}
						else {
							code.textContent = '✖ Error: File does not exist or is empty';
						}
					}
				};

				xhr.send(null);
			});
		}

	};

	document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);

})();

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(14)(true);
// imports


// module
exports.push([module.i, "code[class*=language-],pre[class*=language-]{color:#000;background:none;font-family:Consolas,Monaco,Andale Mono,Ubuntu Mono,monospace;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}pre[class*=language-]{position:relative;margin:.5em 0;box-shadow:-1px 0 0 0 #358ccb,0 0 0 1px #dfdfdf;border-left:10px solid #358ccb;background-color:#fdfdfd;background-image:linear-gradient(transparent 50%,rgba(69,142,209,.04) 0);background-size:3em 3em;background-origin:content-box;overflow:visible;padding:0}code[class*=language]{max-height:inherit;height:100%;padding:0 1em;display:block;overflow:auto}:not(pre)>code[class*=language-],pre[class*=language-]{background-color:#fdfdfd;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;margin-bottom:1em}:not(pre)>code[class*=language-]{position:relative;padding:.2em;border-radius:.3em;color:#c92c2c;border:1px solid rgba(0,0,0,.1);display:inline;white-space:normal}pre[class*=language-]:after,pre[class*=language-]:before{content:\"\";z-index:-2;display:block;position:absolute;bottom:.75em;left:.18em;width:40%;height:20%;max-height:13em;box-shadow:0 13px 8px #979797;-webkit-transform:rotate(-2deg);-moz-transform:rotate(-2deg);-ms-transform:rotate(-2deg);-o-transform:rotate(-2deg);transform:rotate(-2deg)}:not(pre)>code[class*=language-]:after,pre[class*=language-]:after{right:.75em;left:auto;-webkit-transform:rotate(2deg);-moz-transform:rotate(2deg);-ms-transform:rotate(2deg);-o-transform:rotate(2deg);transform:rotate(2deg)}.token.block-comment,.token.cdata,.token.comment,.token.doctype,.token.prolog{color:#7d8b99}.token.punctuation{color:#5f6364}.token.boolean,.token.constant,.token.deleted,.token.function-name,.token.number,.token.property,.token.symbol,.token.tag{color:#c92c2c}.token.attr-name,.token.builtin,.token.char,.token.function,.token.inserted,.token.selector,.token.string{color:#2f9c0a}.token.entity,.token.operator,.token.url,.token.variable{color:#a67f59;background:hsla(0,0%,100%,.5)}.token.atrule,.token.attr-value,.token.class-name,.token.keyword{color:#1990b8}.token.important,.token.regex{color:#e90}.language-css .token.string,.style .token.string{color:#a67f59;background:hsla(0,0%,100%,.5)}.token.important{font-weight:400}.token.bold{font-weight:700}.token.italic{font-style:italic}.token.entity{cursor:help}.namespace{opacity:.7}@media screen and (max-width:767px){pre[class*=language-]:after,pre[class*=language-]:before{bottom:14px;box-shadow:none}}.token.cr:before,.token.lf:before,.token.tab:not(:empty):before{color:#e0d7d1}pre[class*=language-].line-numbers{padding-left:0}pre[class*=language-].line-numbers code{padding-left:3.8em}pre[class*=language-].line-numbers .line-numbers-rows{left:0}pre[class*=language-][data-line]{padding-top:0;padding-bottom:0;padding-left:0}pre[data-line] code{position:relative;padding-left:4em}pre .line-highlight{margin-top:0}", "", {"version":3,"sources":["F:/Github/newvue/node_modules/prismjs/themes/prism-coy.css"],"names":[],"mappings":"AAMA,6CAEC,WAAa,AACb,gBAAiB,AACjB,8DAAuE,AACvE,gBAAiB,AACjB,gBAAiB,AACjB,oBAAqB,AACrB,kBAAmB,AACnB,iBAAkB,AAClB,gBAAiB,AAEjB,gBAAiB,AACjB,cAAe,AACf,WAAY,AAEZ,qBAAsB,AACtB,kBAAmB,AACnB,iBAAkB,AAClB,YAAc,CACd,AAGD,sBACC,kBAAmB,AACnB,cAAe,AACf,gDAA8D,AAC9D,+BAAgC,AAChC,yBAA0B,AAC1B,yEAAiF,AACjF,wBAAyB,AACzB,8BAA+B,AAC/B,iBAAkB,AAClB,SAAW,CACX,AAED,sBACC,mBAAoB,AACpB,YAAa,AACb,cAAe,AACf,cAAe,AACf,aAAe,CACf,AAGD,uDAEC,yBAA0B,AAC1B,8BAA+B,AAC/B,2BAA4B,AAC5B,sBAAuB,AACvB,iBAAmB,CACnB,AAGD,iCACC,kBAAmB,AACnB,aAAc,AACd,mBAAqB,AACrB,cAAe,AACf,gCAAqC,AACrC,eAAgB,AAChB,kBAAoB,CACpB,AAED,yDAEC,WAAY,AACZ,WAAY,AACZ,cAAe,AACf,kBAAmB,AACnB,aAAe,AACf,WAAa,AACb,UAAW,AACX,WAAY,AACZ,gBAAiB,AACjB,8BAAiC,AACjC,gCAAiC,AACjC,6BAA8B,AAC9B,4BAA6B,AAC7B,2BAA4B,AAC5B,uBAAyB,CACzB,AAED,mEAEC,YAAc,AACd,UAAW,AACX,+BAAgC,AAChC,4BAA6B,AAC7B,2BAA4B,AAC5B,0BAA2B,AAC3B,sBAAwB,CACxB,AAED,8EAKC,aAAe,CACf,AAED,mBACC,aAAe,CACf,AAED,0HAQC,aAAe,CACf,AAED,0GAOC,aAAe,CACf,AAED,yDAIC,cAAe,AACf,6BAAqC,CACrC,AAED,iEAIC,aAAe,CACf,AAED,8BAEC,UAAY,CACZ,AAED,iDAEC,cAAe,AACf,6BAAqC,CACrC,AAED,iBACC,eAAoB,CACpB,AAED,YACC,eAAkB,CAClB,AACD,cACC,iBAAmB,CACnB,AAED,cACC,WAAa,CACb,AAED,WACC,UAAY,CACZ,AAED,oCACC,yDAEC,YAAa,AACb,eAAiB,CACjB,CAED,AAGD,gEAGC,aAAe,CACf,AAGD,mCACC,cAAgB,CAChB,AAED,wCACC,kBAAoB,CACpB,AAED,sDACC,MAAQ,CACR,AAGD,iCACC,cAAe,AACf,iBAAkB,AAClB,cAAgB,CAChB,AACD,oBACC,kBAAmB,AACnB,gBAAkB,CAClB,AACD,oBACC,YAAc,CACd","file":"prism-coy.css","sourcesContent":["/**\n * prism.js Coy theme for JavaScript, CoffeeScript, CSS and HTML\n * Based on https://github.com/tshedor/workshop-wp-theme (Example: http://workshop.kansan.com/category/sessions/basics or http://workshop.timshedor.com/category/sessions/basics);\n * @author Tim  Shedor\n */\n\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n\tcolor: black;\n\tbackground: none;\n\tfont-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;\n\ttext-align: left;\n\twhite-space: pre;\n\tword-spacing: normal;\n\tword-break: normal;\n\tword-wrap: normal;\n\tline-height: 1.5;\n\n\t-moz-tab-size: 4;\n\t-o-tab-size: 4;\n\ttab-size: 4;\n\n\t-webkit-hyphens: none;\n\t-moz-hyphens: none;\n\t-ms-hyphens: none;\n\thyphens: none;\n}\n\n/* Code blocks */\npre[class*=\"language-\"] {\n\tposition: relative;\n\tmargin: .5em 0;\n\tbox-shadow: -1px 0px 0px 0px #358ccb, 0px 0px 0px 1px #dfdfdf;\n\tborder-left: 10px solid #358ccb;\n\tbackground-color: #fdfdfd;\n\tbackground-image: linear-gradient(transparent 50%, rgba(69, 142, 209, 0.04) 50%);\n\tbackground-size: 3em 3em;\n\tbackground-origin: content-box;\n\toverflow: visible;\n\tpadding: 0;\n}\n\ncode[class*=\"language\"] {\n\tmax-height: inherit;\n\theight: 100%;\n\tpadding: 0 1em;\n\tdisplay: block;\n\toverflow: auto;\n}\n\n/* Margin bottom to accomodate shadow */\n:not(pre) > code[class*=\"language-\"],\npre[class*=\"language-\"] {\n\tbackground-color: #fdfdfd;\n\t-webkit-box-sizing: border-box;\n\t-moz-box-sizing: border-box;\n\tbox-sizing: border-box;\n\tmargin-bottom: 1em;\n}\n\n/* Inline code */\n:not(pre) > code[class*=\"language-\"] {\n\tposition: relative;\n\tpadding: .2em;\n\tborder-radius: 0.3em;\n\tcolor: #c92c2c;\n\tborder: 1px solid rgba(0, 0, 0, 0.1);\n\tdisplay: inline;\n\twhite-space: normal;\n}\n\npre[class*=\"language-\"]:before,\npre[class*=\"language-\"]:after {\n\tcontent: '';\n\tz-index: -2;\n\tdisplay: block;\n\tposition: absolute;\n\tbottom: 0.75em;\n\tleft: 0.18em;\n\twidth: 40%;\n\theight: 20%;\n\tmax-height: 13em;\n\tbox-shadow: 0px 13px 8px #979797;\n\t-webkit-transform: rotate(-2deg);\n\t-moz-transform: rotate(-2deg);\n\t-ms-transform: rotate(-2deg);\n\t-o-transform: rotate(-2deg);\n\ttransform: rotate(-2deg);\n}\n\n:not(pre) > code[class*=\"language-\"]:after,\npre[class*=\"language-\"]:after {\n\tright: 0.75em;\n\tleft: auto;\n\t-webkit-transform: rotate(2deg);\n\t-moz-transform: rotate(2deg);\n\t-ms-transform: rotate(2deg);\n\t-o-transform: rotate(2deg);\n\ttransform: rotate(2deg);\n}\n\n.token.comment,\n.token.block-comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n\tcolor: #7D8B99;\n}\n\n.token.punctuation {\n\tcolor: #5F6364;\n}\n\n.token.property,\n.token.tag,\n.token.boolean,\n.token.number,\n.token.function-name,\n.token.constant,\n.token.symbol,\n.token.deleted {\n\tcolor: #c92c2c;\n}\n\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.function,\n.token.builtin,\n.token.inserted {\n\tcolor: #2f9c0a;\n}\n\n.token.operator,\n.token.entity,\n.token.url,\n.token.variable {\n\tcolor: #a67f59;\n\tbackground: rgba(255, 255, 255, 0.5);\n}\n\n.token.atrule,\n.token.attr-value,\n.token.keyword,\n.token.class-name {\n\tcolor: #1990b8;\n}\n\n.token.regex,\n.token.important {\n\tcolor: #e90;\n}\n\n.language-css .token.string,\n.style .token.string {\n\tcolor: #a67f59;\n\tbackground: rgba(255, 255, 255, 0.5);\n}\n\n.token.important {\n\tfont-weight: normal;\n}\n\n.token.bold {\n\tfont-weight: bold;\n}\n.token.italic {\n\tfont-style: italic;\n}\n\n.token.entity {\n\tcursor: help;\n}\n\n.namespace {\n\topacity: .7;\n}\n\n@media screen and (max-width: 767px) {\n\tpre[class*=\"language-\"]:before,\n\tpre[class*=\"language-\"]:after {\n\t\tbottom: 14px;\n\t\tbox-shadow: none;\n\t}\n\n}\n\n/* Plugin styles */\n.token.tab:not(:empty):before,\n.token.cr:before,\n.token.lf:before {\n\tcolor: #e0d7d1;\n}\n\n/* Plugin styles: Line Numbers */\npre[class*=\"language-\"].line-numbers {\n\tpadding-left: 0;\n}\n\npre[class*=\"language-\"].line-numbers code {\n\tpadding-left: 3.8em;\n}\n\npre[class*=\"language-\"].line-numbers .line-numbers-rows {\n\tleft: 0;\n}\n\n/* Plugin styles: Line Highlight */\npre[class*=\"language-\"][data-line] {\n\tpadding-top: 0;\n\tpadding-bottom: 0;\n\tpadding-left: 0;\n}\npre[data-line] code {\n\tposition: relative;\n\tpadding-left: 4em;\n}\npre .line-highlight {\n\tmargin-top: 0;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(21);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(15)("1fcd7648", content, true);

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  ('def', '\\n+(?=' + block.def.source + ')')
  ();

block.blockquote = replace(block.blockquote)
  ('def', block.def)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top, bq) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3] || ''
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top, true);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false, bq);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: !this.options.sanitizer
          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
        text: cap[0]
      });
      continue;
    }

    // def
    if ((!bq && top) && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? this.options.sanitizer
          ? this.options.sanitizer(cap[0])
          : escape(cap[0])
        : cap[0]
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this.inLink = true;
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2], true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.text(escape(this.smartypants(cap[0])));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  if (!this.options.mangle) return text;
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

Renderer.prototype.text = function(text) {
  return text;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
	// explicitly match decimal, hex, and named HTML entities 
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) return done(err);
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  sanitizer: null,
  mangle: true,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer,
  xhtml: false
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (true) {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 24 */
/***/ (function(module, exports) {

Prism.languages.python= {
	'triple-quoted-string': {
		pattern: /"""[\s\S]+?"""|'''[\s\S]+?'''/,
		alias: 'string'
	},
	'comment': {
		pattern: /(^|[^\\])#.*/,
		lookbehind: true
	},
	'string': {
		pattern: /("|')(?:\\\\|\\?[^\\\r\n])*?\1/,
		greedy: true
	},
	'function' : {
		pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_][a-zA-Z0-9_]*(?=\()/g,
		lookbehind: true
	},
	'class-name': {
		pattern: /(\bclass\s+)[a-z0-9_]+/i,
		lookbehind: true
	},
	'keyword' : /\b(?:as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|pass|print|raise|return|try|while|with|yield)\b/,
	'boolean' : /\b(?:True|False)\b/,
	'number' : /\b-?(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/i,
	'operator' : /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]|\b(?:or|and|not)\b/,
	'punctuation' : /[{}[\];(),.:]/
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_AMS-Regular.672c961.eot";

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Caligraphic-Bold.3c3fce5.eot";

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Caligraphic-Regular.a0ba281.eot";

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Fraktur-Bold.2b4454d.eot";

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Fraktur-Regular.dc81eae.eot";

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Main-Bold.d327c21.eot";

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Main-Italic.2702ac3.eot";

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Main-Regular.31ec450.eot";

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Math-Italic.031026c.eot";

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_SansSerif-Regular.a3319b7.eot";

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Script-Regular.cf8394e.eot";

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Size1-Regular.5438d9d.eot";

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Size2-Regular.1f5c2ab.eot";

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = "data:application/vnd.ms-fontobject;base64,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UFiwQGBZZrABY2GwAiVGYTgjIDwjOBshICBGI0ewASsjYTghWbEuARQrLbBFLLA4Ky6xLgEUKy2wRiywOSshIyAgPLAEI0IjOLEuARQrsARDLrAuKy2wRyywABUgR7AAI0KyAAEBFRQTLrA0Ki2wSCywABUgR7AAI0KyAAEBFRQTLrA0Ki2wSSyxAAEUE7A1Ki2wSiywNyotsEsssAAWRSMgLiBGiiNhOLEuARQrLbBMLLAII0KwSystsE0ssgAARCstsE4ssgABRCstsE8ssgEARCstsFAssgEBRCstsFEssgAARSstsFIssgABRSstsFMssgEARSstsFQssgEBRSstsFUssgAAQSstsFYssgABQSstsFcssgEAQSstsFgssgEBQSstsFkssgAAQystsFossgABQystsFsssgEAQystsFwssgEBQystsF0ssgAARistsF4ssgABRistsF8ssgEARistsGAssgEBRistsGEssgAAQistsGIssgABQistsGMssgEAQistsGQssgEBQistsGUssDorLrEuARQrLbBmLLA6K7A+Ky2wZyywOiuwPystsGgssAAWsDorsEArLbBpLLA7Ky6xLgEUKy2waiywOyuwPistsGsssDsrsD8rLbBsLLA7K7BAKy2wbSywPCsusS4BFCstsG4ssDwrsD4rLbBvLLA8K7A/Ky2wcCywPCuwQCstsHEssD0rLrEuARQrLbByLLA9K7A+Ky2wcyywPSuwPystsHQssD0rsEArLbB1LLMJBAIDRVghGyMhWUIrsAhlsAMkUHixBQEVRVgwWS0AAEu4AMhSWLEBAY5ZsAG5CAAIAGNwsQAGQrEAACqxAAZCsQAIKrEABkKxAAgqsQAGQrkAAAAJKrEABkK5AAAACSqxAwBEsSQBiFFYsECIWLEDZESxJgGIUVi6CIAAAQRAiGNUWLEDAERZWVlZsQAMKrgB/4WwBI2xAgBEsQVkRAAAAAAAAAAAAAAAAAAAAAAWABYAFgAWAFIAiAC2AMwA/gEUAZYCCgIKAjQCdAKeAt4DFgMqAz4DUgNmA5IDwAPUA+gD9gACADIAAADIAhUAAwAHAAi1BgQBAAIwKzMRMxEnMxEjMpZkMjICFf3rMgGxAAEA0fxLAr0FqgAeAAazEQIBMCsBFAcjJyYnAAMmNTQ3EgE2PwEzFhUUBwYCERAT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HgkCQwJCBgJCAkQNAgIWDwT9tv22Ef21/bQBDwACAAAAAAEsAGQAAwAHAAi1BQQBAAIwKzE1MxUzNTMVZGRkZGRkZAAAAgAAAAABLABkAAMABwAItQUEAQACMCsxNTMVMzUzFWRkZGRkZGQAAAEAAAAAAGQAZAADAAazAQABMCsxNTMVZGRkAAAAABYBDgABAAAAAAAAAEwAmgABAAAAAAABAAsA/wABAAAAAAACAAcBGwABAAAAAAADACMBawABAAAAAAAEABMBtwABAAAAAAAFAB8CCwABAAAAAAAGABMCUwABAAAAAAANAS4ExQABAAAAAAAOABoGKgABAAAAAAAQAAsGXQABAAAAAAARAAcGeQADAAEECQAAAJgAAAADAAEECQABABYA5wADAAEECQACAA4BCwADAAEECQADAEYBIwADAAEECQAEACYBjwADAAEECQAFAD4BywADAAEECQAGACYCKwADAAEECQANAlwCZwADAAEECQAOADQF9AADAAEECQAQABYGRQADAAEECQARAA4GaQBDAG8AcAB5AHIAaQBnAGgAdAAgACgAYwApACAAMgAwADAAOQAtADIAMAAxADAAIABEAGUAcwBpAGcAbgAgAFMAYwBpAGUAbgBjAGUALAAgAEkAbgBjAC4ACgBDAG8AcAB5AHIAaQBnAGgAdAAgACgAYwApACAAMgAwADEANAAgAEsAaABhAG4AIABBAGMAYQBkAGUAbQB5AABDb3B5cmlnaHQgKGMpIDIwMDktMjAxMCBEZXNpZ24gU2NpZW5jZSwgSW5jLgpDb3B5cmlnaHQgKGMpIDIwMTQgS2hhbiBBY2FkZW15AABLAGEAVABlAFgAXwBTAGkAegBlADMAAEthVGVYX1NpemUzAABSAGUAZwB1AGwAYQByAABSZWd1bGFyAABGAG8AbgB0AEYAbwByAGcAZQAgADIALgAwACAAOgAgAEsAYQBUAGUAWABfAFMAaQB6AGUAMwAtAFIAZQBnAHUAbABhAHIAAEZvbnRGb3JnZSAyLjAgOiBLYVRlWF9TaXplMy1SZWd1bGFyAABLAGEAVABlAFgAXwBTAGkAegBlADMALQBSAGUAZwB1AGwAYQByAABLYVRlWF9TaXplMy1SZWd1bGFyAABWAGUAcgBzAGkAbwBuACAAMQAuADEAOwAgAHQAdABmAGEAdQB0AG8AaABpAG4AdAAgACgAdgAxAC4AMwApAABWZXJzaW9uIDEuMTsgdHRmYXV0b2hpbnQgKHYxLjMpAABLAGEAVABlAFgAXwBTAGkAegBlADMALQBSAGUAZwB1AGwAYQByAABLYVRlWF9TaXplMy1SZWd1bGFyAABDAG8AcAB5AHIAaQBnAGgAdAAgACgAYwApACAAMgAwADAAOQAtADIAMAAxADAALAAgAEQAZQBzAGkAZwBuACAAUwBjAGkAZQBuAGMAZQAsACAASQBuAGMALgAgACgAPAB3AHcAdwAuAG0AYQB0AGgAagBhAHgALgBvAHIAZwA+ACkACgBDAG8AcAB5AHIAaQBnAGgAdAAgACgAYwApACAAMgAwADEANAAgAEsAaABhAG4AIABBAGMAYQBkAGUAbQB5ACAAKAA8AHcAdwB3AC4AawBoAGEAbgBhAGMAYQBkAGUAbQB5AC4AbwByAGcAPgApACwACgB3AGkAdABoACAAUgBlAHMAZQByAHYAZQBkACAARgBvAG4AdAAgAE4AYQBtAGUAIABLAGEAVABlAFgAXwBTAGkAegBlADMALgAKAAoAVABoAGkAcwAgAEYAbwBuAHQAIABTAG8AZgB0AHcAYQByAGUAIABpAHMAIABsAGkAYwBlAG4AcwBlAGQAIAB1AG4AZABlAHIAIAB0AGgAZQAgAFMASQBMACAATwBwAGUAbgAgAEYAbwBuAHQAIABMAGkAYwBlAG4AcwBlACwAIABWAGUAcgBzAGkAbwBuACAAMQAuADEALgAKAFQAaABpAHMAIABsAGkAYwBlAG4AcwBlACAAYQB2AGEAaQBsAGEAYgBsAGUAIAB3AGkAdABoACAAYQAgAEYAQQBRACAAYQB0ADoACgBoAHQAdABwADoALwAvAHMAYwByAGkAcAB0AHMALgBzAGkAbAAuAG8AcgBnAC8ATwBGAEwAAENvcHlyaWdodCAoYykgMjAwOS0yMDEwLCBEZXNpZ24gU2NpZW5jZSwgSW5jLiAoPHd3dy5tYXRoamF4Lm9yZz4pCkNvcHlyaWdodCAoYykgMjAxNCBLaGFuIEFjYWRlbXkgKDx3d3cua2hhbmFjYWRlbXkub3JnPiksCndpdGggUmVzZXJ2ZWQgRm9udCBOYW1lIEthVGVYX1NpemUzLgoKVGhpcyBGb250IFNvZnR3YXJlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBTSUwgT3BlbiBGb250IExpY2Vuc2UsIFZlcnNpb24gMS4xLgpUaGlzIGxpY2Vuc2UgYXZhaWxhYmxlIHdpdGggYSBGQVEgYXQ6Cmh0dHA6Ly9zY3JpcHRzLnNpbC5vcmcvT0ZMAABoAHQAdABwADoALwAvAHMAYwByAGkAcAB0AHMALgBzAGkAbAAuAG8AcgBnAC8ATwBGAEwAAGh0dHA6Ly9zY3JpcHRzLnNpbC5vcmcvT0ZMAABLAGEAVABlAFgAXwBTAGkAegBlADMAAEthVGVYX1NpemUzAABSAGUAZwB1AGwAYQByAABSZWd1bGFyAAAAAgAAAAAAAP+DADIAAAAAAAAAAAAAAAAAAAAAAAAAAAAbAAAAAQACAAMACwAMABIAPgA/AEAAXgBgAQIA2ADZAQMBBAClAQUBBgEHAQgBCQEKAQsBDAENB3VuaTAwQTAHdW5pMDMwMgl0aWxkZWNvbWIHdW5pMjMwOAd1bmkyMzA5B3VuaTIzMEEHdW5pMjMwQgd1bmkyN0U4B3VuaTI3RTkHdW5pRUZGRAd1bmlFRkZFB3VuaUVGRkYAAAABAAH//wAPAAAAAQAAAADMPaLPAAAAAMb5Mk8AAAAA0bd8oA=="

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Size4-Regular.5a3cee2.eot";

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Typewriter-Regular.b2e9414.eot";

/***/ }),
/* 41 */,
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_katex_dist_katex_css__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_katex_dist_katex_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_katex_dist_katex_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_katex_dist_contrib_auto_render_js__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_katex_dist_contrib_auto_render_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_katex_dist_contrib_auto_render_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_marked__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_marked___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_marked__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_prismjs__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_prismjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_prismjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_prismjs_themes_prism_coy_css__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_prismjs_themes_prism_coy_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_prismjs_themes_prism_coy_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_prismjs_prism_js__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_prismjs_prism_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_prismjs_prism_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prismjs_components_prism_python_js__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prismjs_components_prism_python_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_prismjs_components_prism_python_js__);










var article = '\n\n# The Plane Shooting Problem (Dynamic Programming)\nAuthor: Costa Huang\n\n## Introduction\n\nThe nation is at war. The enemy send out a squadron of $n$ planes to attack our troops from various angles. You have a very precise anti-aircraft launcher that will be used to shoot enemy planes. If the launcher is aimed directly at an enemy plane, it\'s guaranteed to destroy the plane. Unfortunately, your launcher is ponderous to reposition. Namely, you can only move 1 degree per minute. Then 1 plane enter your shoot range per minute. Once they go passed your shoot range, they are gone and you can\'t shoot them again. You are tasked to destroy the first plane, and then destroy as many plane as possible. \n\n## Examples\n\nThe plane is coming at [50,49,60,48,54,55,56,57,58] angles for each minute. You shoot down the first plane at 50 degree and you can either statys at 50 degree, move to 51 degree, or move to 49 degree. The optimal solution would be shooting down 6 aircraft: [50,54,55,56,57,58].\n\n## Analysis\n\nNotice this problem can be solved by brute force method. For each position, we can either statys at $k$ degree, move to $k+1$ degree, or move to $k-1$ degree. So we can just try all possible possibilities and see which possibility shoot the most plane. We therefore demonstrate a brute force approach:\n\n\n\n```python\nimport pandas as pd\nimport numpy as np\n    \n# Some testing data\na_1 = [50,49,60,48,54,55,56,57,58]\na_2 = [50,49,60,48,54,55,56,47,46]\na_3 = [50,80,81,82,83]\na_4 = [50,51,49,48]\na_5= [50,51,50,51,50,55,56,57,58,59,60]\na_6 = [50,49,48,50,50,50]\n\n\ndef brute_force(angles, start_angle):\n    \n    if len(angles) == 0:\n        return 0\n    x = brute_force(angles[1:], start_angle+1)\n    y = brute_force(angles[1:], start_angle-1)\n    z = brute_force(angles[1:], start_angle)\n    if angles[0] == start_angle:\n        return max(x + 1, y + 1, z + 1)\n    else:\n        return max(x, y, z)\n    \nprint(brute_force(a_1, a_1[0]))\nprint(brute_force(a_2, a_2[0]))\nprint(brute_force(a_5, a_5[0]))\n```\n\n    6\n    5\n    8\n    \n\nThen we draw the brute force tree for analysis:\n\n\n```python\nfrom IPython.display import Image\nImage("pic.JPG", height = 600, width = 600)\n```\n\n\n\n\n![Responsive image](' + __webpack_require__(64) + ')\n\n\n\nWe somehow spotted this pattern: there are so many interconnected edges, which means we can maybe find a way to efficiently use the past information. For example, if we want to know what\'s the maximum number of planes we can shoot down if we end in 49, there are only two ways to 49: [50,49,49], [50,50,49], but in the process we would have already know which ways shoot down more planes, and we can just take the maximum of them. Therefore we demonstrate the dynamic programming approach:\n\n\n```python\nangles = a_6\nstart_angle = angles[0]\n\ndf = pd.DataFrame(index = angles, columns = range(start_angle - len(angles),start_angle + len(angles)+1), data = 0)\ndef dynamic_programming(df, print_output = False):\n    df.iloc[0][start_angle] = 1\n    columns = list(df.columns)\n    rows = list(df.index)\n    \n    for row in range(0, len(df)-1):\n        # record the degree of the upcoming plane, which is in next row\n        plane_degree = rows[row+1]\n        \n        for col in range(1, len(df.iloc[0])-1):\n            # if the current column has data, the cannon can\n            # go down left, go down, or go down right\n            if df.iloc[row].iloc[col] != 0:\n                data = df.iloc[row].iloc[col]\n                \n                # go down left\n                left_column_degree = columns[col-1]\n                # if our move results in a new destoryed plane: \n                if left_column_degree == plane_degree:\n                    df.iloc[row+1].iloc[col-1] = max(df.iloc[row+1].iloc[col-1], data + 1)\n                else:\n                    df.iloc[row+1].iloc[col-1] = max(df.iloc[row+1].iloc[col-1], data)\n                    \n                # go down\n                down_column_degree = columns[col]\n                # if our move results in a new destoryed plane: \n                if down_column_degree == plane_degree:\n                    df.iloc[row+1].iloc[col] = max(df.iloc[row+1].iloc[col], data + 1)\n                else:\n                    df.iloc[row+1].iloc[col] = max(df.iloc[row+1].iloc[col], data)\n                    \n                # go down right\n                right_column_degree = columns[col+1]\n                # if our move results in a new destoryed plane: \n                if right_column_degree == plane_degree:\n                    df.iloc[row+1].iloc[col+1] = max(df.iloc[row+1].iloc[col+1], data + 1)\n                else:\n                    df.iloc[row+1].iloc[col+1] = max(df.iloc[row+1].iloc[col+1], data)\n        \n        if print_output == True:\n            print(df)\n            print("===============================================================")\n            \n    # now we are ready to trace the planes we shoot down\n    # in the last row search the largest possible planes shoot down in the current row,\n    # namely, max_planes = [planes shoot down, column number]\n    row = len(df)-1 \n    max_planes = [0,0]\n    for col in range(0, len(df.iloc[row])):\n        if df.iloc[row].iloc[col] > max_planes[0]:\n            max_planes[0] = df.iloc[row].iloc[col]\n            max_planes[1] = col\n    \n    \n    # now find the order of planes to shoot down\n    moving_record = [columns[max_planes[1]]]\n    print("now we start to trace back our move")\n    while (row > 0):\n        # from the last row where we hit maximum number of plane, we can go up, go up left, go up right to trace\n        # the record, but we need to go to the maximum of them\n        left_col = max_planes[1]-1\n        right_col = max_planes[1]+2\n        # reset max_planes[planes shoot down] and go up one row\n        max_planes[0] = 0  \n        row -= 1\n        for col in range(left_col, right_col):\n            if df.iloc[row].iloc[col] > max_planes[0]:\n                max_planes[0] = df.iloc[row].iloc[col]\n                max_planes[1] = col\n        \n        moving_record += [columns[max_planes[1]]]\n        \n        print(moving_record)\n    \n    moving_record.reverse()\n    print("after reversing, now the moving record is:")\n    print(moving_record)\n    \n    \n    # Lastly, we ouput the specific planes we choose to shoot\n    planes_chosen = []\n    for i in range(0, len(df.index)):\n        if df.index[i] == moving_record[i]:\n            planes_chosen += [df.index[i]]\n    \n    print("lastly, we print out planes chosen to shoot down")\n    print(planes_chosen)\n    \n    return max(df.iloc[-1])\n    \n\n\ndp_output = dynamic_programming(df, print_output = True)\nprint("input data is ", angles)\nprint("dynamic programming can shoot down", dp_output, "planes")\nprint("brute force method can shoot down", brute_force(angles, start_angle), "planes")\n```\n\n        44  45  46  47  48  49  50  51  52  53  54  55  56\n    50   0   0   0   0   0   0   1   0   0   0   0   0   0\n    49   0   0   0   0   0   2   1   1   0   0   0   0   0\n    48   0   0   0   0   0   0   0   0   0   0   0   0   0\n    50   0   0   0   0   0   0   0   0   0   0   0   0   0\n    50   0   0   0   0   0   0   0   0   0   0   0   0   0\n    50   0   0   0   0   0   0   0   0   0   0   0   0   0\n    ===============================================================\n        44  45  46  47  48  49  50  51  52  53  54  55  56\n    50   0   0   0   0   0   0   1   0   0   0   0   0   0\n    49   0   0   0   0   0   2   1   1   0   0   0   0   0\n    48   0   0   0   0   3   2   2   1   1   0   0   0   0\n    50   0   0   0   0   0   0   0   0   0   0   0   0   0\n    50   0   0   0   0   0   0   0   0   0   0   0   0   0\n    50   0   0   0   0   0   0   0   0   0   0   0   0   0\n    ===============================================================\n        44  45  46  47  48  49  50  51  52  53  54  55  56\n    50   0   0   0   0   0   0   1   0   0   0   0   0   0\n    49   0   0   0   0   0   2   1   1   0   0   0   0   0\n    48   0   0   0   0   3   2   2   1   1   0   0   0   0\n    50   0   0   0   3   3   3   3   2   1   1   0   0   0\n    50   0   0   0   0   0   0   0   0   0   0   0   0   0\n    50   0   0   0   0   0   0   0   0   0   0   0   0   0\n    ===============================================================\n        44  45  46  47  48  49  50  51  52  53  54  55  56\n    50   0   0   0   0   0   0   1   0   0   0   0   0   0\n    49   0   0   0   0   0   2   1   1   0   0   0   0   0\n    48   0   0   0   0   3   2   2   1   1   0   0   0   0\n    50   0   0   0   3   3   3   3   2   1   1   0   0   0\n    50   0   0   3   3   3   3   4   3   2   1   1   0   0\n    50   0   0   0   0   0   0   0   0   0   0   0   0   0\n    ===============================================================\n        44  45  46  47  48  49  50  51  52  53  54  55  56\n    50   0   0   0   0   0   0   1   0   0   0   0   0   0\n    49   0   0   0   0   0   2   1   1   0   0   0   0   0\n    48   0   0   0   0   3   2   2   1   1   0   0   0   0\n    50   0   0   0   3   3   3   3   2   1   1   0   0   0\n    50   0   0   3   3   3   3   4   3   2   1   1   0   0\n    50   0   3   3   3   3   4   5   4   3   2   1   1   0\n    ===============================================================\n    now we start to trace back our move\n    [50, 50]\n    [50, 50, 49]\n    [50, 50, 49, 48]\n    [50, 50, 49, 48, 49]\n    [50, 50, 49, 48, 49, 50]\n    \n    after reversing, now the moving record is:\n    [50, 49, 48, 49, 50, 50]\n    \n    lastly, we print out planes chosen to shoot down\n    [50, 49, 48, 50, 50]\n    \n    input data is  [50, 49, 48, 50, 50, 50]\n    dynamic programming can shoot down 5 planes\n    brute force method can shoot down 5 planes\n    \n\nNow we can test different data by generating some random list and run the program to see when does brute force become really slow.\n\n\n```python\nt = np.random.choice(10, 14) + 50\nt\n# (2, 5) + 10 would out put size 5, origin 10, random integer from (10-2, 10+2) \n# at size 14 is where you can see brute force takes more than an instant\n# notice 3^14 = 4782969\n```\n\n\n\n\n    array([59, 53, 50, 50, 54, 56, 50, 58, 53, 57, 54, 58, 52, 53])\n\n\n\n\n```python\nangles = t\nstart_angle = angles[0]\ndf = pd.DataFrame(index = angles, columns = range(start_angle - len(angles),start_angle + len(angles)+1), data = 0)\ndp_ouput = dynamic_programming(df)\nprint("\ninput data is ", angles)\nprint("dynamic programming can shoot down", dp_ouput, "planes")\nprint("brute force method can shoot down", brute_force(angles, start_angle), "planes")\n```\n\n    now we start to trace back our move\n    [53, 52]\n    [53, 52, 53]\n    [53, 52, 53, 54]\n    [53, 52, 53, 54, 53]\n    [53, 52, 53, 54, 53, 53]\n    [53, 52, 53, 54, 53, 53, 54]\n    [53, 52, 53, 54, 53, 53, 54, 55]\n    [53, 52, 53, 54, 53, 53, 54, 55, 56]\n    [53, 52, 53, 54, 53, 53, 54, 55, 56, 55]\n    [53, 52, 53, 54, 53, 53, 54, 55, 56, 55, 56]\n    [53, 52, 53, 54, 53, 53, 54, 55, 56, 55, 56, 57]\n    [53, 52, 53, 54, 53, 53, 54, 55, 56, 55, 56, 57, 58]\n    [53, 52, 53, 54, 53, 53, 54, 55, 56, 55, 56, 57, 58, 59]\n    \n    after reversing, now the moving record is:\n    [59, 58, 57, 56, 55, 56, 55, 54, 53, 53, 54, 53, 52, 53]\n    \n    lastly, we print out planes chosen to shoot down\n    [59, 56, 53, 54, 52, 53]\n    \n    input data is  [59 53 50 50 54 56 50 58 53 57 54 58 52 53]\n    dynamic programming can shoot down 6 planes\n    brute force method can shoot down 6 planes\n';

/* harmony default export */ __webpack_exports__["default"] = ({
    name: 'article',
    data: function data() {
        return {
            rawHtml: __WEBPACK_IMPORTED_MODULE_2_marked___default()(article)
        };
    },
    mounted: function mounted() {
        __WEBPACK_IMPORTED_MODULE_3_prismjs___default.a.highlightAll();

        __WEBPACK_IMPORTED_MODULE_1_katex_dist_contrib_auto_render_js___default()(document.body, {
            delimiters: [{ left: "$$", right: "$$", display: true }, { left: "\\[", right: "\\]", display: true }, { left: "$", right: "$", display: false }, { left: "\\(", right: "\\)", display: false }]
        });
    }
});

/***/ }),
/* 43 */,
/* 44 */,
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(14)(true);
// imports


// module
exports.push([module.i, "@font-face{font-family:KaTeX_AMS;src:url(" + __webpack_require__(25) + ");src:url(" + __webpack_require__(25) + "#iefix) format(\"embedded-opentype\"),url(" + __webpack_require__(67) + ") format(\"woff2\"),url(" + __webpack_require__(66) + ") format(\"woff\"),url(" + __webpack_require__(65) + ") format(\"truetype\");font-weight:400;font-style:normal}@font-face{font-family:KaTeX_Caligraphic;src:url(" + __webpack_require__(26) + ");src:url(" + __webpack_require__(26) + "#iefix) format(\"embedded-opentype\"),url(" + __webpack_require__(70) + ") format(\"woff2\"),url(" + __webpack_require__(69) + ") format(\"woff\"),url(" + __webpack_require__(68) + ") format(\"truetype\");font-weight:700;font-style:normal}@font-face{font-family:KaTeX_Caligraphic;src:url(" + __webpack_require__(27) + ");src:url(" + __webpack_require__(27) + "#iefix) format(\"embedded-opentype\"),url(" + __webpack_require__(73) + ") format(\"woff2\"),url(" + __webpack_require__(72) + ") format(\"woff\"),url(" + __webpack_require__(71) + ") format(\"truetype\");font-weight:400;font-style:normal}@font-face{font-family:KaTeX_Fraktur;src:url(" + __webpack_require__(28) + ");src:url(" + __webpack_require__(28) + "#iefix) format(\"embedded-opentype\"),url(" + __webpack_require__(76) + ") format(\"woff2\"),url(" + __webpack_require__(75) + ") format(\"woff\"),url(" + __webpack_require__(74) + ") format(\"truetype\");font-weight:700;font-style:normal}@font-face{font-family:KaTeX_Fraktur;src:url(" + __webpack_require__(29) + ");src:url(" + __webpack_require__(29) + "#iefix) format(\"embedded-opentype\"),url(" + __webpack_require__(79) + ") format(\"woff2\"),url(" + __webpack_require__(78) + ") format(\"woff\"),url(" + __webpack_require__(77) + ") format(\"truetype\");font-weight:400;font-style:normal}@font-face{font-family:KaTeX_Main;src:url(" + __webpack_require__(30) + ");src:url(" + __webpack_require__(30) + "#iefix) format(\"embedded-opentype\"),url(" + __webpack_require__(82) + ") format(\"woff2\"),url(" + __webpack_require__(81) + ") format(\"woff\"),url(" + __webpack_require__(80) + ") format(\"truetype\");font-weight:700;font-style:normal}@font-face{font-family:KaTeX_Main;src:url(" + __webpack_require__(31) + ");src:url(" + __webpack_require__(31) + "#iefix) format(\"embedded-opentype\"),url(" + __webpack_require__(85) + ") format(\"woff2\"),url(" + __webpack_require__(84) + ") format(\"woff\"),url(" + __webpack_require__(83) + ") format(\"truetype\");font-weight:400;font-style:italic}@font-face{font-family:KaTeX_Main;src:url(" + __webpack_require__(32) + ");src:url(" + __webpack_require__(32) + "#iefix) format(\"embedded-opentype\"),url(" + __webpack_require__(88) + ") format(\"woff2\"),url(" + __webpack_require__(87) + ") format(\"woff\"),url(" + __webpack_require__(86) + ") format(\"truetype\");font-weight:400;font-style:normal}@font-face{font-family:KaTeX_Math;src:url(" + __webpack_require__(33) + ");src:url(" + __webpack_require__(33) + "#iefix) format(\"embedded-opentype\"),url(" + __webpack_require__(91) + ") format(\"woff2\"),url(" + __webpack_require__(90) + ") format(\"woff\"),url(" + __webpack_require__(89) + ") format(\"truetype\");font-weight:400;font-style:italic}@font-face{font-family:KaTeX_SansSerif;src:url(" + __webpack_require__(34) + ");src:url(" + __webpack_require__(34) + "#iefix) format(\"embedded-opentype\"),url(" + __webpack_require__(94) + ") format(\"woff2\"),url(" + __webpack_require__(93) + ") format(\"woff\"),url(" + __webpack_require__(92) + ") format(\"truetype\");font-weight:400;font-style:normal}@font-face{font-family:KaTeX_Script;src:url(" + __webpack_require__(35) + ");src:url(" + __webpack_require__(35) + "#iefix) format(\"embedded-opentype\"),url(" + __webpack_require__(97) + ") format(\"woff2\"),url(" + __webpack_require__(96) + ") format(\"woff\"),url(" + __webpack_require__(95) + ") format(\"truetype\");font-weight:400;font-style:normal}@font-face{font-family:KaTeX_Size1;src:url(" + __webpack_require__(36) + ");src:url(" + __webpack_require__(36) + "#iefix) format(\"embedded-opentype\"),url(" + __webpack_require__(100) + ") format(\"woff2\"),url(" + __webpack_require__(99) + ") format(\"woff\"),url(" + __webpack_require__(98) + ") format(\"truetype\");font-weight:400;font-style:normal}@font-face{font-family:KaTeX_Size2;src:url(" + __webpack_require__(37) + ");src:url(" + __webpack_require__(37) + "#iefix) format(\"embedded-opentype\"),url(" + __webpack_require__(103) + ") format(\"woff2\"),url(" + __webpack_require__(102) + ") format(\"woff\"),url(" + __webpack_require__(101) + ") format(\"truetype\");font-weight:400;font-style:normal}@font-face{font-family:KaTeX_Size3;src:url(" + __webpack_require__(38) + ");src:url(" + __webpack_require__(38) + "#iefix) format(\"embedded-opentype\"),url(" + __webpack_require__(106) + ") format(\"woff2\"),url(" + __webpack_require__(105) + ") format(\"woff\"),url(" + __webpack_require__(104) + ") format(\"truetype\");font-weight:400;font-style:normal}@font-face{font-family:KaTeX_Size4;src:url(" + __webpack_require__(39) + ");src:url(" + __webpack_require__(39) + "#iefix) format(\"embedded-opentype\"),url(" + __webpack_require__(109) + ") format(\"woff2\"),url(" + __webpack_require__(108) + ") format(\"woff\"),url(" + __webpack_require__(107) + ") format(\"truetype\");font-weight:400;font-style:normal}@font-face{font-family:KaTeX_Typewriter;src:url(" + __webpack_require__(40) + ");src:url(" + __webpack_require__(40) + "#iefix) format(\"embedded-opentype\"),url(" + __webpack_require__(112) + ") format(\"woff2\"),url(" + __webpack_require__(111) + ") format(\"woff\"),url(" + __webpack_require__(110) + ") format(\"truetype\");font-weight:400;font-style:normal}.katex-display{display:block;margin:1em 0;text-align:center}.katex-display>.katex{display:inline-block;text-align:initial}.katex{font:normal 1.21em KaTeX_Main,Times New Roman,serif;line-height:1.2;white-space:nowrap;text-indent:0}.katex .katex-html{display:inline-block}.katex .katex-mathml{position:absolute;clip:rect(1px,1px,1px,1px);padding:0;border:0;height:1px;width:1px;overflow:hidden}.katex .base,.katex .strut{display:inline-block}.katex .mathrm{font-style:normal}.katex .mathit,.katex .textit{font-style:italic}.katex .mathit{font-family:KaTeX_Math}.katex .mathbf{font-family:KaTeX_Main;font-weight:700}.katex .amsrm,.katex .mathbb{font-family:KaTeX_AMS}.katex .mathcal{font-family:KaTeX_Caligraphic}.katex .mathfrak{font-family:KaTeX_Fraktur}.katex .mathtt{font-family:KaTeX_Typewriter}.katex .mathscr{font-family:KaTeX_Script}.katex .mathsf{font-family:KaTeX_SansSerif}.katex .mainit{font-family:KaTeX_Main;font-style:italic}.katex .mord+.mop{margin-left:.16667em}.katex .mord+.mbin{margin-left:.22222em}.katex .mord+.mrel{margin-left:.27778em}.katex .mop+.mop,.katex .mop+.mord,.katex .mord+.minner{margin-left:.16667em}.katex .mop+.mrel{margin-left:.27778em}.katex .mop+.minner{margin-left:.16667em}.katex .mbin+.minner,.katex .mbin+.mop,.katex .mbin+.mopen,.katex .mbin+.mord{margin-left:.22222em}.katex .mrel+.minner,.katex .mrel+.mop,.katex .mrel+.mopen,.katex .mrel+.mord{margin-left:.27778em}.katex .mclose+.mop{margin-left:.16667em}.katex .mclose+.mbin{margin-left:.22222em}.katex .mclose+.mrel{margin-left:.27778em}.katex .mclose+.minner,.katex .minner+.mop,.katex .minner+.mord,.katex .mpunct+.mclose,.katex .mpunct+.minner,.katex .mpunct+.mop,.katex .mpunct+.mopen,.katex .mpunct+.mord,.katex .mpunct+.mpunct,.katex .mpunct+.mrel{margin-left:.16667em}.katex .minner+.mbin{margin-left:.22222em}.katex .minner+.mrel{margin-left:.27778em}.katex .minner+.minner,.katex .minner+.mopen,.katex .minner+.mpunct{margin-left:.16667em}.katex .mbin.mtight,.katex .mclose.mtight,.katex .minner.mtight,.katex .mop.mtight,.katex .mopen.mtight,.katex .mord.mtight,.katex .mpunct.mtight,.katex .mrel.mtight{margin-left:0}.katex .mclose+.mop.mtight,.katex .minner+.mop.mtight,.katex .mop+.mop.mtight,.katex .mop+.mord.mtight,.katex .mord+.mop.mtight{margin-left:.16667em}.katex .reset-textstyle.textstyle{font-size:1em}.katex .reset-textstyle.scriptstyle{font-size:.7em}.katex .reset-textstyle.scriptscriptstyle{font-size:.5em}.katex .reset-scriptstyle.textstyle{font-size:1.42857em}.katex .reset-scriptstyle.scriptstyle{font-size:1em}.katex .reset-scriptstyle.scriptscriptstyle{font-size:.71429em}.katex .reset-scriptscriptstyle.textstyle{font-size:2em}.katex .reset-scriptscriptstyle.scriptstyle{font-size:1.4em}.katex .reset-scriptscriptstyle.scriptscriptstyle{font-size:1em}.katex .style-wrap{position:relative}.katex .vlist{display:inline-block}.katex .vlist>span{display:block;height:0;position:relative}.katex .vlist>span>span{display:inline-block}.katex .vlist .baseline-fix{display:inline-table;table-layout:fixed}.katex .msupsub{text-align:left}.katex .mfrac>span>span{text-align:center}.katex .mfrac .frac-line{width:100%}.katex .mfrac .frac-line:before{border-bottom-style:solid;border-bottom-width:1px;content:\"\";display:block}.katex .mfrac .frac-line:after{border-bottom-style:solid;border-bottom-width:.04em;content:\"\";display:block;margin-top:-1px}.katex .mspace{display:inline-block}.katex .mspace.negativethinspace{margin-left:-.16667em}.katex .mspace.thinspace{width:.16667em}.katex .mspace.negativemediumspace{margin-left:-.22222em}.katex .mspace.mediumspace{width:.22222em}.katex .mspace.thickspace{width:.27778em}.katex .mspace.sixmuspace{width:.333333em}.katex .mspace.eightmuspace{width:.444444em}.katex .mspace.enspace{width:.5em}.katex .mspace.twelvemuspace{width:.666667em}.katex .mspace.quad{width:1em}.katex .mspace.qquad{width:2em}.katex .llap,.katex .rlap{width:0;position:relative}.katex .llap>.inner,.katex .rlap>.inner{position:absolute}.katex .llap>.fix,.katex .rlap>.fix{display:inline-block}.katex .llap>.inner{right:0}.katex .rlap>.inner{left:0}.katex .katex-logo .a{font-size:.75em;margin-left:-.32em;position:relative;top:-.2em}.katex .katex-logo .t{margin-left:-.23em}.katex .katex-logo .e{margin-left:-.1667em;position:relative;top:.2155em}.katex .katex-logo .x{margin-left:-.125em}.katex .rule{display:inline-block;border:0 solid;position:relative}.katex .overline .overline-line,.katex .underline .underline-line{width:100%}.katex .overline .overline-line:before,.katex .underline .underline-line:before{border-bottom-style:solid;border-bottom-width:1px;content:\"\";display:block}.katex .overline .overline-line:after,.katex .underline .underline-line:after{border-bottom-style:solid;border-bottom-width:.04em;content:\"\";display:block;margin-top:-1px}.katex .sqrt>.sqrt-sign{position:relative}.katex .sqrt .sqrt-line{width:100%}.katex .sqrt .sqrt-line:before{border-bottom-style:solid;border-bottom-width:1px;content:\"\";display:block}.katex .sqrt .sqrt-line:after{border-bottom-style:solid;border-bottom-width:.04em;content:\"\";display:block;margin-top:-1px}.katex .sqrt>.root{margin-left:.27777778em;margin-right:-.55555556em}.katex .fontsize-ensurer,.katex .sizing{display:inline-block}.katex .fontsize-ensurer.reset-size1.size1,.katex .sizing.reset-size1.size1{font-size:1em}.katex .fontsize-ensurer.reset-size1.size2,.katex .sizing.reset-size1.size2{font-size:1.4em}.katex .fontsize-ensurer.reset-size1.size3,.katex .sizing.reset-size1.size3{font-size:1.6em}.katex .fontsize-ensurer.reset-size1.size4,.katex .sizing.reset-size1.size4{font-size:1.8em}.katex .fontsize-ensurer.reset-size1.size5,.katex .sizing.reset-size1.size5{font-size:2em}.katex .fontsize-ensurer.reset-size1.size6,.katex .sizing.reset-size1.size6{font-size:2.4em}.katex .fontsize-ensurer.reset-size1.size7,.katex .sizing.reset-size1.size7{font-size:2.88em}.katex .fontsize-ensurer.reset-size1.size8,.katex .sizing.reset-size1.size8{font-size:3.46em}.katex .fontsize-ensurer.reset-size1.size9,.katex .sizing.reset-size1.size9{font-size:4.14em}.katex .fontsize-ensurer.reset-size1.size10,.katex .sizing.reset-size1.size10{font-size:4.98em}.katex .fontsize-ensurer.reset-size2.size1,.katex .sizing.reset-size2.size1{font-size:.71428571em}.katex .fontsize-ensurer.reset-size2.size2,.katex .sizing.reset-size2.size2{font-size:1em}.katex .fontsize-ensurer.reset-size2.size3,.katex .sizing.reset-size2.size3{font-size:1.14285714em}.katex .fontsize-ensurer.reset-size2.size4,.katex .sizing.reset-size2.size4{font-size:1.28571429em}.katex .fontsize-ensurer.reset-size2.size5,.katex .sizing.reset-size2.size5{font-size:1.42857143em}.katex .fontsize-ensurer.reset-size2.size6,.katex .sizing.reset-size2.size6{font-size:1.71428571em}.katex .fontsize-ensurer.reset-size2.size7,.katex .sizing.reset-size2.size7{font-size:2.05714286em}.katex .fontsize-ensurer.reset-size2.size8,.katex .sizing.reset-size2.size8{font-size:2.47142857em}.katex .fontsize-ensurer.reset-size2.size9,.katex .sizing.reset-size2.size9{font-size:2.95714286em}.katex .fontsize-ensurer.reset-size2.size10,.katex .sizing.reset-size2.size10{font-size:3.55714286em}.katex .fontsize-ensurer.reset-size3.size1,.katex .sizing.reset-size3.size1{font-size:.625em}.katex .fontsize-ensurer.reset-size3.size2,.katex .sizing.reset-size3.size2{font-size:.875em}.katex .fontsize-ensurer.reset-size3.size3,.katex .sizing.reset-size3.size3{font-size:1em}.katex .fontsize-ensurer.reset-size3.size4,.katex .sizing.reset-size3.size4{font-size:1.125em}.katex .fontsize-ensurer.reset-size3.size5,.katex .sizing.reset-size3.size5{font-size:1.25em}.katex .fontsize-ensurer.reset-size3.size6,.katex .sizing.reset-size3.size6{font-size:1.5em}.katex .fontsize-ensurer.reset-size3.size7,.katex .sizing.reset-size3.size7{font-size:1.8em}.katex .fontsize-ensurer.reset-size3.size8,.katex .sizing.reset-size3.size8{font-size:2.1625em}.katex .fontsize-ensurer.reset-size3.size9,.katex .sizing.reset-size3.size9{font-size:2.5875em}.katex .fontsize-ensurer.reset-size3.size10,.katex .sizing.reset-size3.size10{font-size:3.1125em}.katex .fontsize-ensurer.reset-size4.size1,.katex .sizing.reset-size4.size1{font-size:.55555556em}.katex .fontsize-ensurer.reset-size4.size2,.katex .sizing.reset-size4.size2{font-size:.77777778em}.katex .fontsize-ensurer.reset-size4.size3,.katex .sizing.reset-size4.size3{font-size:.88888889em}.katex .fontsize-ensurer.reset-size4.size4,.katex .sizing.reset-size4.size4{font-size:1em}.katex .fontsize-ensurer.reset-size4.size5,.katex .sizing.reset-size4.size5{font-size:1.11111111em}.katex .fontsize-ensurer.reset-size4.size6,.katex .sizing.reset-size4.size6{font-size:1.33333333em}.katex .fontsize-ensurer.reset-size4.size7,.katex .sizing.reset-size4.size7{font-size:1.6em}.katex .fontsize-ensurer.reset-size4.size8,.katex .sizing.reset-size4.size8{font-size:1.92222222em}.katex .fontsize-ensurer.reset-size4.size9,.katex .sizing.reset-size4.size9{font-size:2.3em}.katex .fontsize-ensurer.reset-size4.size10,.katex .sizing.reset-size4.size10{font-size:2.76666667em}.katex .fontsize-ensurer.reset-size5.size1,.katex .sizing.reset-size5.size1{font-size:.5em}.katex .fontsize-ensurer.reset-size5.size2,.katex .sizing.reset-size5.size2{font-size:.7em}.katex .fontsize-ensurer.reset-size5.size3,.katex .sizing.reset-size5.size3{font-size:.8em}.katex .fontsize-ensurer.reset-size5.size4,.katex .sizing.reset-size5.size4{font-size:.9em}.katex .fontsize-ensurer.reset-size5.size5,.katex .sizing.reset-size5.size5{font-size:1em}.katex .fontsize-ensurer.reset-size5.size6,.katex .sizing.reset-size5.size6{font-size:1.2em}.katex .fontsize-ensurer.reset-size5.size7,.katex .sizing.reset-size5.size7{font-size:1.44em}.katex .fontsize-ensurer.reset-size5.size8,.katex .sizing.reset-size5.size8{font-size:1.73em}.katex .fontsize-ensurer.reset-size5.size9,.katex .sizing.reset-size5.size9{font-size:2.07em}.katex .fontsize-ensurer.reset-size5.size10,.katex .sizing.reset-size5.size10{font-size:2.49em}.katex .fontsize-ensurer.reset-size6.size1,.katex .sizing.reset-size6.size1{font-size:.41666667em}.katex .fontsize-ensurer.reset-size6.size2,.katex .sizing.reset-size6.size2{font-size:.58333333em}.katex .fontsize-ensurer.reset-size6.size3,.katex .sizing.reset-size6.size3{font-size:.66666667em}.katex .fontsize-ensurer.reset-size6.size4,.katex .sizing.reset-size6.size4{font-size:.75em}.katex .fontsize-ensurer.reset-size6.size5,.katex .sizing.reset-size6.size5{font-size:.83333333em}.katex .fontsize-ensurer.reset-size6.size6,.katex .sizing.reset-size6.size6{font-size:1em}.katex .fontsize-ensurer.reset-size6.size7,.katex .sizing.reset-size6.size7{font-size:1.2em}.katex .fontsize-ensurer.reset-size6.size8,.katex .sizing.reset-size6.size8{font-size:1.44166667em}.katex .fontsize-ensurer.reset-size6.size9,.katex .sizing.reset-size6.size9{font-size:1.725em}.katex .fontsize-ensurer.reset-size6.size10,.katex .sizing.reset-size6.size10{font-size:2.075em}.katex .fontsize-ensurer.reset-size7.size1,.katex .sizing.reset-size7.size1{font-size:.34722222em}.katex .fontsize-ensurer.reset-size7.size2,.katex .sizing.reset-size7.size2{font-size:.48611111em}.katex .fontsize-ensurer.reset-size7.size3,.katex .sizing.reset-size7.size3{font-size:.55555556em}.katex .fontsize-ensurer.reset-size7.size4,.katex .sizing.reset-size7.size4{font-size:.625em}.katex .fontsize-ensurer.reset-size7.size5,.katex .sizing.reset-size7.size5{font-size:.69444444em}.katex .fontsize-ensurer.reset-size7.size6,.katex .sizing.reset-size7.size6{font-size:.83333333em}.katex .fontsize-ensurer.reset-size7.size7,.katex .sizing.reset-size7.size7{font-size:1em}.katex .fontsize-ensurer.reset-size7.size8,.katex .sizing.reset-size7.size8{font-size:1.20138889em}.katex .fontsize-ensurer.reset-size7.size9,.katex .sizing.reset-size7.size9{font-size:1.4375em}.katex .fontsize-ensurer.reset-size7.size10,.katex .sizing.reset-size7.size10{font-size:1.72916667em}.katex .fontsize-ensurer.reset-size8.size1,.katex .sizing.reset-size8.size1{font-size:.28901734em}.katex .fontsize-ensurer.reset-size8.size2,.katex .sizing.reset-size8.size2{font-size:.40462428em}.katex .fontsize-ensurer.reset-size8.size3,.katex .sizing.reset-size8.size3{font-size:.46242775em}.katex .fontsize-ensurer.reset-size8.size4,.katex .sizing.reset-size8.size4{font-size:.52023121em}.katex .fontsize-ensurer.reset-size8.size5,.katex .sizing.reset-size8.size5{font-size:.57803468em}.katex .fontsize-ensurer.reset-size8.size6,.katex .sizing.reset-size8.size6{font-size:.69364162em}.katex .fontsize-ensurer.reset-size8.size7,.katex .sizing.reset-size8.size7{font-size:.83236994em}.katex .fontsize-ensurer.reset-size8.size8,.katex .sizing.reset-size8.size8{font-size:1em}.katex .fontsize-ensurer.reset-size8.size9,.katex .sizing.reset-size8.size9{font-size:1.19653179em}.katex .fontsize-ensurer.reset-size8.size10,.katex .sizing.reset-size8.size10{font-size:1.43930636em}.katex .fontsize-ensurer.reset-size9.size1,.katex .sizing.reset-size9.size1{font-size:.24154589em}.katex .fontsize-ensurer.reset-size9.size2,.katex .sizing.reset-size9.size2{font-size:.33816425em}.katex .fontsize-ensurer.reset-size9.size3,.katex .sizing.reset-size9.size3{font-size:.38647343em}.katex .fontsize-ensurer.reset-size9.size4,.katex .sizing.reset-size9.size4{font-size:.43478261em}.katex .fontsize-ensurer.reset-size9.size5,.katex .sizing.reset-size9.size5{font-size:.48309179em}.katex .fontsize-ensurer.reset-size9.size6,.katex .sizing.reset-size9.size6{font-size:.57971014em}.katex .fontsize-ensurer.reset-size9.size7,.katex .sizing.reset-size9.size7{font-size:.69565217em}.katex .fontsize-ensurer.reset-size9.size8,.katex .sizing.reset-size9.size8{font-size:.83574879em}.katex .fontsize-ensurer.reset-size9.size9,.katex .sizing.reset-size9.size9{font-size:1em}.katex .fontsize-ensurer.reset-size9.size10,.katex .sizing.reset-size9.size10{font-size:1.20289855em}.katex .fontsize-ensurer.reset-size10.size1,.katex .sizing.reset-size10.size1{font-size:.20080321em}.katex .fontsize-ensurer.reset-size10.size2,.katex .sizing.reset-size10.size2{font-size:.2811245em}.katex .fontsize-ensurer.reset-size10.size3,.katex .sizing.reset-size10.size3{font-size:.32128514em}.katex .fontsize-ensurer.reset-size10.size4,.katex .sizing.reset-size10.size4{font-size:.36144578em}.katex .fontsize-ensurer.reset-size10.size5,.katex .sizing.reset-size10.size5{font-size:.40160643em}.katex .fontsize-ensurer.reset-size10.size6,.katex .sizing.reset-size10.size6{font-size:.48192771em}.katex .fontsize-ensurer.reset-size10.size7,.katex .sizing.reset-size10.size7{font-size:.57831325em}.katex .fontsize-ensurer.reset-size10.size8,.katex .sizing.reset-size10.size8{font-size:.69477912em}.katex .fontsize-ensurer.reset-size10.size9,.katex .sizing.reset-size10.size9{font-size:.8313253em}.katex .fontsize-ensurer.reset-size10.size10,.katex .sizing.reset-size10.size10{font-size:1em}.katex .delimsizing.size1{font-family:KaTeX_Size1}.katex .delimsizing.size2{font-family:KaTeX_Size2}.katex .delimsizing.size3{font-family:KaTeX_Size3}.katex .delimsizing.size4{font-family:KaTeX_Size4}.katex .delimsizing.mult .delim-size1>span{font-family:KaTeX_Size1}.katex .delimsizing.mult .delim-size4>span{font-family:KaTeX_Size4}.katex .nulldelimiter{display:inline-block;width:.12em}.katex .op-symbol{position:relative}.katex .op-symbol.small-op{font-family:KaTeX_Size1}.katex .op-symbol.large-op{font-family:KaTeX_Size2}.katex .accent>.vlist>span,.katex .op-limits>.vlist>span{text-align:center}.katex .accent .accent-body>span{width:0}.katex .accent .accent-body.accent-vec>span{position:relative;left:.326em}.katex .mtable .vertical-separator{display:inline-block;margin:0 -.025em;border-right:.05em solid #000}.katex .mtable .arraycolsep{display:inline-block}.katex .mtable .col-align-c>.vlist{text-align:center}.katex .mtable .col-align-l>.vlist{text-align:left}.katex .mtable .col-align-r>.vlist{text-align:right}", "", {"version":3,"sources":["F:/Github/newvue/node_modules/katex/dist/katex.css"],"names":[],"mappings":"AAAA,WACE,sBAAyB,AACzB,kCAAwC,AACxC,0MAA2O,AAC3O,gBAAoB,AACpB,iBAAmB,CACpB,AACD,WACE,8BAAiC,AACjC,kCAA6C,AAC7C,0MAA+P,AAC/P,gBAAkB,AAClB,iBAAmB,CACpB,AACD,WACE,8BAAiC,AACjC,mCAAgD,AAChD,8MAA2Q,AAC3Q,gBAAoB,AACpB,iBAAmB,CACpB,AACD,WACE,0BAA6B,AAC7B,mCAAyC,AACzC,8MAA+O,AAC/O,gBAAkB,AAClB,iBAAmB,CACpB,AACD,WACE,0BAA6B,AAC7B,mCAA4C,AAC5C,8MAA2P,AAC3P,gBAAoB,AACpB,iBAAmB,CACpB,AACD,WACE,uBAA0B,AAC1B,mCAAsC,AACtC,8MAAmO,AACnO,gBAAkB,AAClB,iBAAmB,CACpB,AACD,WACE,uBAA0B,AAC1B,mCAAwC,AACxC,8MAA2O,AAC3O,gBAAoB,AACpB,iBAAmB,CACpB,AACD,WACE,uBAA0B,AAC1B,mCAAyC,AACzC,8MAA+O,AAC/O,gBAAoB,AACpB,iBAAmB,CACpB,AACD,WACE,uBAA0B,AAC1B,mCAAwC,AACxC,8MAA2O,AAC3O,gBAAoB,AACpB,iBAAmB,CACpB,AACD,WACE,4BAA+B,AAC/B,mCAA8C,AAC9C,8MAAmQ,AACnQ,gBAAoB,AACpB,iBAAmB,CACpB,AACD,WACE,yBAA4B,AAC5B,mCAA2C,AAC3C,8MAAuP,AACvP,gBAAoB,AACpB,iBAAmB,CACpB,AACD,WACE,wBAA2B,AAC3B,mCAA0C,AAC1C,8MAAmP,AACnP,gBAAoB,AACpB,iBAAmB,CACpB,AACD,WACE,wBAA2B,AAC3B,mCAA0C,AAC1C,8MAAmP,AACnP,gBAAoB,AACpB,iBAAmB,CACpB,AACD,WACE,wBAA2B,AAC3B,mCAA0C,AAC1C,8MAAmP,AACnP,gBAAoB,AACpB,iBAAmB,CACpB,AACD,WACE,wBAA2B,AAC3B,mCAA0C,AAC1C,8MAAmP,AACnP,gBAAoB,AACpB,iBAAmB,CACpB,AACD,WACE,6BAAgC,AAChC,mCAA+C,AAC/C,8MAAuQ,AACvQ,gBAAoB,AACpB,iBAAmB,CACpB,AACD,eACE,cAAe,AACf,aAAc,AACd,iBAAmB,CACpB,AACD,sBACE,qBAAsB,AACtB,kBAAoB,CACrB,AACD,OACE,oDAAuD,AACvD,gBAAiB,AACjB,mBAAoB,AACpB,aAAe,CAChB,AACD,mBACE,oBAAsB,CACvB,AACD,qBACE,kBAAmB,AACnB,2BAA+B,AAC/B,UAAW,AACX,SAAU,AACV,WAAY,AACZ,UAAW,AACX,eAAiB,CAClB,AAID,2BACE,oBAAsB,CACvB,AACD,eACE,iBAAmB,CACpB,AAID,8BAFE,iBAAmB,CAKpB,AAHD,eACE,sBAAwB,CAEzB,AACD,eACE,uBAAwB,AACxB,eAAkB,CACnB,AAID,6BACE,qBAAuB,CACxB,AACD,gBACE,6BAA+B,CAChC,AACD,iBACE,yBAA2B,CAC5B,AACD,eACE,4BAA8B,CAC/B,AACD,gBACE,wBAA0B,CAC3B,AACD,eACE,2BAA6B,CAC9B,AACD,eACE,uBAAwB,AACxB,iBAAmB,CACpB,AACD,kBACE,oBAAuB,CACxB,AACD,mBACE,oBAAuB,CACxB,AACD,mBACE,oBAAuB,CACxB,AAOD,wDACE,oBAAuB,CACxB,AACD,kBACE,oBAAuB,CACxB,AACD,oBACE,oBAAuB,CACxB,AAUD,8EACE,oBAAuB,CACxB,AAUD,8EACE,oBAAuB,CACxB,AACD,oBACE,oBAAuB,CACxB,AACD,qBACE,oBAAuB,CACxB,AACD,qBACE,oBAAuB,CACxB,AA4BD,yNACE,oBAAuB,CACxB,AACD,qBACE,oBAAuB,CACxB,AACD,qBACE,oBAAuB,CACxB,AAOD,oEACE,oBAAuB,CACxB,AAsBD,sKACE,aAAe,CAChB,AAaD,gIACE,oBAAuB,CACxB,AACD,kCACE,aAAe,CAChB,AACD,oCACE,cAAiB,CAClB,AACD,0CACE,cAAiB,CAClB,AACD,oCACE,mBAAqB,CACtB,AACD,sCACE,aAAe,CAChB,AACD,4CACE,kBAAqB,CACtB,AACD,0CACE,aAAe,CAChB,AACD,4CACE,eAAiB,CAClB,AACD,kDACE,aAAe,CAChB,AACD,mBACE,iBAAmB,CACpB,AACD,cACE,oBAAsB,CACvB,AACD,mBACE,cAAe,AACf,SAAU,AACV,iBAAmB,CACpB,AACD,wBACE,oBAAsB,CACvB,AACD,4BACE,qBAAsB,AACtB,kBAAoB,CACrB,AACD,gBACE,eAAiB,CAClB,AACD,wBACE,iBAAmB,CACpB,AACD,yBACE,UAAY,CACb,AACD,gCACE,0BAA2B,AAC3B,wBAAyB,AACzB,WAAY,AACZ,aAAe,CAChB,AACD,+BACE,0BAA2B,AAC3B,0BAA4B,AAC5B,WAAY,AACZ,cAAe,AACf,eAAiB,CAClB,AACD,eACE,oBAAsB,CACvB,AACD,iCACE,qBAAwB,CACzB,AACD,yBACE,cAAiB,CAClB,AACD,mCACE,qBAAwB,CACzB,AACD,2BACE,cAAiB,CAClB,AACD,0BACE,cAAiB,CAClB,AACD,0BACE,eAAkB,CACnB,AACD,4BACE,eAAkB,CACnB,AACD,uBACE,UAAa,CACd,AACD,6BACE,eAAkB,CACnB,AACD,oBACE,SAAW,CACZ,AACD,qBACE,SAAW,CACZ,AACD,0BAEE,QAAS,AACT,iBAAmB,CACpB,AACD,wCAEE,iBAAmB,CACpB,AACD,oCAEE,oBAAsB,CACvB,AACD,oBACE,OAAS,CACV,AACD,oBACE,MAAQ,CACT,AACD,sBACE,gBAAkB,AAClB,mBAAqB,AACrB,kBAAmB,AACnB,SAAY,CACb,AACD,sBACE,kBAAqB,CACtB,AACD,sBACE,qBAAuB,AACvB,kBAAmB,AACnB,WAAc,CACf,AACD,sBACE,mBAAsB,CACvB,AACD,aACE,qBAAsB,AACtB,eAAgB,AAChB,iBAAmB,CACpB,AACD,kEAEE,UAAY,CACb,AACD,gFAEE,0BAA2B,AAC3B,wBAAyB,AACzB,WAAY,AACZ,aAAe,CAChB,AACD,8EAEE,0BAA2B,AAC3B,0BAA4B,AAC5B,WAAY,AACZ,cAAe,AACf,eAAiB,CAClB,AACD,wBACE,iBAAmB,CACpB,AACD,wBACE,UAAY,CACb,AACD,+BACE,0BAA2B,AAC3B,wBAAyB,AACzB,WAAY,AACZ,aAAe,CAChB,AACD,8BACE,0BAA2B,AAC3B,0BAA4B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","file":"katex.css","sourcesContent":["@font-face {\n  font-family: 'KaTeX_AMS';\n  src: url('fonts/KaTeX_AMS-Regular.eot');\n  src: url('fonts/KaTeX_AMS-Regular.eot#iefix') format('embedded-opentype'), url('fonts/KaTeX_AMS-Regular.woff2') format('woff2'), url('fonts/KaTeX_AMS-Regular.woff') format('woff'), url('fonts/KaTeX_AMS-Regular.ttf') format('truetype');\n  font-weight: normal;\n  font-style: normal;\n}\n@font-face {\n  font-family: 'KaTeX_Caligraphic';\n  src: url('fonts/KaTeX_Caligraphic-Bold.eot');\n  src: url('fonts/KaTeX_Caligraphic-Bold.eot#iefix') format('embedded-opentype'), url('fonts/KaTeX_Caligraphic-Bold.woff2') format('woff2'), url('fonts/KaTeX_Caligraphic-Bold.woff') format('woff'), url('fonts/KaTeX_Caligraphic-Bold.ttf') format('truetype');\n  font-weight: bold;\n  font-style: normal;\n}\n@font-face {\n  font-family: 'KaTeX_Caligraphic';\n  src: url('fonts/KaTeX_Caligraphic-Regular.eot');\n  src: url('fonts/KaTeX_Caligraphic-Regular.eot#iefix') format('embedded-opentype'), url('fonts/KaTeX_Caligraphic-Regular.woff2') format('woff2'), url('fonts/KaTeX_Caligraphic-Regular.woff') format('woff'), url('fonts/KaTeX_Caligraphic-Regular.ttf') format('truetype');\n  font-weight: normal;\n  font-style: normal;\n}\n@font-face {\n  font-family: 'KaTeX_Fraktur';\n  src: url('fonts/KaTeX_Fraktur-Bold.eot');\n  src: url('fonts/KaTeX_Fraktur-Bold.eot#iefix') format('embedded-opentype'), url('fonts/KaTeX_Fraktur-Bold.woff2') format('woff2'), url('fonts/KaTeX_Fraktur-Bold.woff') format('woff'), url('fonts/KaTeX_Fraktur-Bold.ttf') format('truetype');\n  font-weight: bold;\n  font-style: normal;\n}\n@font-face {\n  font-family: 'KaTeX_Fraktur';\n  src: url('fonts/KaTeX_Fraktur-Regular.eot');\n  src: url('fonts/KaTeX_Fraktur-Regular.eot#iefix') format('embedded-opentype'), url('fonts/KaTeX_Fraktur-Regular.woff2') format('woff2'), url('fonts/KaTeX_Fraktur-Regular.woff') format('woff'), url('fonts/KaTeX_Fraktur-Regular.ttf') format('truetype');\n  font-weight: normal;\n  font-style: normal;\n}\n@font-face {\n  font-family: 'KaTeX_Main';\n  src: url('fonts/KaTeX_Main-Bold.eot');\n  src: url('fonts/KaTeX_Main-Bold.eot#iefix') format('embedded-opentype'), url('fonts/KaTeX_Main-Bold.woff2') format('woff2'), url('fonts/KaTeX_Main-Bold.woff') format('woff'), url('fonts/KaTeX_Main-Bold.ttf') format('truetype');\n  font-weight: bold;\n  font-style: normal;\n}\n@font-face {\n  font-family: 'KaTeX_Main';\n  src: url('fonts/KaTeX_Main-Italic.eot');\n  src: url('fonts/KaTeX_Main-Italic.eot#iefix') format('embedded-opentype'), url('fonts/KaTeX_Main-Italic.woff2') format('woff2'), url('fonts/KaTeX_Main-Italic.woff') format('woff'), url('fonts/KaTeX_Main-Italic.ttf') format('truetype');\n  font-weight: normal;\n  font-style: italic;\n}\n@font-face {\n  font-family: 'KaTeX_Main';\n  src: url('fonts/KaTeX_Main-Regular.eot');\n  src: url('fonts/KaTeX_Main-Regular.eot#iefix') format('embedded-opentype'), url('fonts/KaTeX_Main-Regular.woff2') format('woff2'), url('fonts/KaTeX_Main-Regular.woff') format('woff'), url('fonts/KaTeX_Main-Regular.ttf') format('truetype');\n  font-weight: normal;\n  font-style: normal;\n}\n@font-face {\n  font-family: 'KaTeX_Math';\n  src: url('fonts/KaTeX_Math-Italic.eot');\n  src: url('fonts/KaTeX_Math-Italic.eot#iefix') format('embedded-opentype'), url('fonts/KaTeX_Math-Italic.woff2') format('woff2'), url('fonts/KaTeX_Math-Italic.woff') format('woff'), url('fonts/KaTeX_Math-Italic.ttf') format('truetype');\n  font-weight: normal;\n  font-style: italic;\n}\n@font-face {\n  font-family: 'KaTeX_SansSerif';\n  src: url('fonts/KaTeX_SansSerif-Regular.eot');\n  src: url('fonts/KaTeX_SansSerif-Regular.eot#iefix') format('embedded-opentype'), url('fonts/KaTeX_SansSerif-Regular.woff2') format('woff2'), url('fonts/KaTeX_SansSerif-Regular.woff') format('woff'), url('fonts/KaTeX_SansSerif-Regular.ttf') format('truetype');\n  font-weight: normal;\n  font-style: normal;\n}\n@font-face {\n  font-family: 'KaTeX_Script';\n  src: url('fonts/KaTeX_Script-Regular.eot');\n  src: url('fonts/KaTeX_Script-Regular.eot#iefix') format('embedded-opentype'), url('fonts/KaTeX_Script-Regular.woff2') format('woff2'), url('fonts/KaTeX_Script-Regular.woff') format('woff'), url('fonts/KaTeX_Script-Regular.ttf') format('truetype');\n  font-weight: normal;\n  font-style: normal;\n}\n@font-face {\n  font-family: 'KaTeX_Size1';\n  src: url('fonts/KaTeX_Size1-Regular.eot');\n  src: url('fonts/KaTeX_Size1-Regular.eot#iefix') format('embedded-opentype'), url('fonts/KaTeX_Size1-Regular.woff2') format('woff2'), url('fonts/KaTeX_Size1-Regular.woff') format('woff'), url('fonts/KaTeX_Size1-Regular.ttf') format('truetype');\n  font-weight: normal;\n  font-style: normal;\n}\n@font-face {\n  font-family: 'KaTeX_Size2';\n  src: url('fonts/KaTeX_Size2-Regular.eot');\n  src: url('fonts/KaTeX_Size2-Regular.eot#iefix') format('embedded-opentype'), url('fonts/KaTeX_Size2-Regular.woff2') format('woff2'), url('fonts/KaTeX_Size2-Regular.woff') format('woff'), url('fonts/KaTeX_Size2-Regular.ttf') format('truetype');\n  font-weight: normal;\n  font-style: normal;\n}\n@font-face {\n  font-family: 'KaTeX_Size3';\n  src: url('fonts/KaTeX_Size3-Regular.eot');\n  src: url('fonts/KaTeX_Size3-Regular.eot#iefix') format('embedded-opentype'), url('fonts/KaTeX_Size3-Regular.woff2') format('woff2'), url('fonts/KaTeX_Size3-Regular.woff') format('woff'), url('fonts/KaTeX_Size3-Regular.ttf') format('truetype');\n  font-weight: normal;\n  font-style: normal;\n}\n@font-face {\n  font-family: 'KaTeX_Size4';\n  src: url('fonts/KaTeX_Size4-Regular.eot');\n  src: url('fonts/KaTeX_Size4-Regular.eot#iefix') format('embedded-opentype'), url('fonts/KaTeX_Size4-Regular.woff2') format('woff2'), url('fonts/KaTeX_Size4-Regular.woff') format('woff'), url('fonts/KaTeX_Size4-Regular.ttf') format('truetype');\n  font-weight: normal;\n  font-style: normal;\n}\n@font-face {\n  font-family: 'KaTeX_Typewriter';\n  src: url('fonts/KaTeX_Typewriter-Regular.eot');\n  src: url('fonts/KaTeX_Typewriter-Regular.eot#iefix') format('embedded-opentype'), url('fonts/KaTeX_Typewriter-Regular.woff2') format('woff2'), url('fonts/KaTeX_Typewriter-Regular.woff') format('woff'), url('fonts/KaTeX_Typewriter-Regular.ttf') format('truetype');\n  font-weight: normal;\n  font-style: normal;\n}\n.katex-display {\n  display: block;\n  margin: 1em 0;\n  text-align: center;\n}\n.katex-display > .katex {\n  display: inline-block;\n  text-align: initial;\n}\n.katex {\n  font: normal 1.21em KaTeX_Main, Times New Roman, serif;\n  line-height: 1.2;\n  white-space: nowrap;\n  text-indent: 0;\n}\n.katex .katex-html {\n  display: inline-block;\n}\n.katex .katex-mathml {\n  position: absolute;\n  clip: rect(1px, 1px, 1px, 1px);\n  padding: 0;\n  border: 0;\n  height: 1px;\n  width: 1px;\n  overflow: hidden;\n}\n.katex .base {\n  display: inline-block;\n}\n.katex .strut {\n  display: inline-block;\n}\n.katex .mathrm {\n  font-style: normal;\n}\n.katex .textit {\n  font-style: italic;\n}\n.katex .mathit {\n  font-family: KaTeX_Math;\n  font-style: italic;\n}\n.katex .mathbf {\n  font-family: KaTeX_Main;\n  font-weight: bold;\n}\n.katex .amsrm {\n  font-family: KaTeX_AMS;\n}\n.katex .mathbb {\n  font-family: KaTeX_AMS;\n}\n.katex .mathcal {\n  font-family: KaTeX_Caligraphic;\n}\n.katex .mathfrak {\n  font-family: KaTeX_Fraktur;\n}\n.katex .mathtt {\n  font-family: KaTeX_Typewriter;\n}\n.katex .mathscr {\n  font-family: KaTeX_Script;\n}\n.katex .mathsf {\n  font-family: KaTeX_SansSerif;\n}\n.katex .mainit {\n  font-family: KaTeX_Main;\n  font-style: italic;\n}\n.katex .mord + .mop {\n  margin-left: 0.16667em;\n}\n.katex .mord + .mbin {\n  margin-left: 0.22222em;\n}\n.katex .mord + .mrel {\n  margin-left: 0.27778em;\n}\n.katex .mord + .minner {\n  margin-left: 0.16667em;\n}\n.katex .mop + .mord {\n  margin-left: 0.16667em;\n}\n.katex .mop + .mop {\n  margin-left: 0.16667em;\n}\n.katex .mop + .mrel {\n  margin-left: 0.27778em;\n}\n.katex .mop + .minner {\n  margin-left: 0.16667em;\n}\n.katex .mbin + .mord {\n  margin-left: 0.22222em;\n}\n.katex .mbin + .mop {\n  margin-left: 0.22222em;\n}\n.katex .mbin + .mopen {\n  margin-left: 0.22222em;\n}\n.katex .mbin + .minner {\n  margin-left: 0.22222em;\n}\n.katex .mrel + .mord {\n  margin-left: 0.27778em;\n}\n.katex .mrel + .mop {\n  margin-left: 0.27778em;\n}\n.katex .mrel + .mopen {\n  margin-left: 0.27778em;\n}\n.katex .mrel + .minner {\n  margin-left: 0.27778em;\n}\n.katex .mclose + .mop {\n  margin-left: 0.16667em;\n}\n.katex .mclose + .mbin {\n  margin-left: 0.22222em;\n}\n.katex .mclose + .mrel {\n  margin-left: 0.27778em;\n}\n.katex .mclose + .minner {\n  margin-left: 0.16667em;\n}\n.katex .mpunct + .mord {\n  margin-left: 0.16667em;\n}\n.katex .mpunct + .mop {\n  margin-left: 0.16667em;\n}\n.katex .mpunct + .mrel {\n  margin-left: 0.16667em;\n}\n.katex .mpunct + .mopen {\n  margin-left: 0.16667em;\n}\n.katex .mpunct + .mclose {\n  margin-left: 0.16667em;\n}\n.katex .mpunct + .mpunct {\n  margin-left: 0.16667em;\n}\n.katex .mpunct + .minner {\n  margin-left: 0.16667em;\n}\n.katex .minner + .mord {\n  margin-left: 0.16667em;\n}\n.katex .minner + .mop {\n  margin-left: 0.16667em;\n}\n.katex .minner + .mbin {\n  margin-left: 0.22222em;\n}\n.katex .minner + .mrel {\n  margin-left: 0.27778em;\n}\n.katex .minner + .mopen {\n  margin-left: 0.16667em;\n}\n.katex .minner + .mpunct {\n  margin-left: 0.16667em;\n}\n.katex .minner + .minner {\n  margin-left: 0.16667em;\n}\n.katex .mord.mtight {\n  margin-left: 0;\n}\n.katex .mop.mtight {\n  margin-left: 0;\n}\n.katex .mbin.mtight {\n  margin-left: 0;\n}\n.katex .mrel.mtight {\n  margin-left: 0;\n}\n.katex .mopen.mtight {\n  margin-left: 0;\n}\n.katex .mclose.mtight {\n  margin-left: 0;\n}\n.katex .mpunct.mtight {\n  margin-left: 0;\n}\n.katex .minner.mtight {\n  margin-left: 0;\n}\n.katex .mord + .mop.mtight {\n  margin-left: 0.16667em;\n}\n.katex .mop + .mord.mtight {\n  margin-left: 0.16667em;\n}\n.katex .mop + .mop.mtight {\n  margin-left: 0.16667em;\n}\n.katex .mclose + .mop.mtight {\n  margin-left: 0.16667em;\n}\n.katex .minner + .mop.mtight {\n  margin-left: 0.16667em;\n}\n.katex .reset-textstyle.textstyle {\n  font-size: 1em;\n}\n.katex .reset-textstyle.scriptstyle {\n  font-size: 0.7em;\n}\n.katex .reset-textstyle.scriptscriptstyle {\n  font-size: 0.5em;\n}\n.katex .reset-scriptstyle.textstyle {\n  font-size: 1.42857em;\n}\n.katex .reset-scriptstyle.scriptstyle {\n  font-size: 1em;\n}\n.katex .reset-scriptstyle.scriptscriptstyle {\n  font-size: 0.71429em;\n}\n.katex .reset-scriptscriptstyle.textstyle {\n  font-size: 2em;\n}\n.katex .reset-scriptscriptstyle.scriptstyle {\n  font-size: 1.4em;\n}\n.katex .reset-scriptscriptstyle.scriptscriptstyle {\n  font-size: 1em;\n}\n.katex .style-wrap {\n  position: relative;\n}\n.katex .vlist {\n  display: inline-block;\n}\n.katex .vlist > span {\n  display: block;\n  height: 0;\n  position: relative;\n}\n.katex .vlist > span > span {\n  display: inline-block;\n}\n.katex .vlist .baseline-fix {\n  display: inline-table;\n  table-layout: fixed;\n}\n.katex .msupsub {\n  text-align: left;\n}\n.katex .mfrac > span > span {\n  text-align: center;\n}\n.katex .mfrac .frac-line {\n  width: 100%;\n}\n.katex .mfrac .frac-line:before {\n  border-bottom-style: solid;\n  border-bottom-width: 1px;\n  content: \"\";\n  display: block;\n}\n.katex .mfrac .frac-line:after {\n  border-bottom-style: solid;\n  border-bottom-width: 0.04em;\n  content: \"\";\n  display: block;\n  margin-top: -1px;\n}\n.katex .mspace {\n  display: inline-block;\n}\n.katex .mspace.negativethinspace {\n  margin-left: -0.16667em;\n}\n.katex .mspace.thinspace {\n  width: 0.16667em;\n}\n.katex .mspace.negativemediumspace {\n  margin-left: -0.22222em;\n}\n.katex .mspace.mediumspace {\n  width: 0.22222em;\n}\n.katex .mspace.thickspace {\n  width: 0.27778em;\n}\n.katex .mspace.sixmuspace {\n  width: 0.333333em;\n}\n.katex .mspace.eightmuspace {\n  width: 0.444444em;\n}\n.katex .mspace.enspace {\n  width: 0.5em;\n}\n.katex .mspace.twelvemuspace {\n  width: 0.666667em;\n}\n.katex .mspace.quad {\n  width: 1em;\n}\n.katex .mspace.qquad {\n  width: 2em;\n}\n.katex .llap,\n.katex .rlap {\n  width: 0;\n  position: relative;\n}\n.katex .llap > .inner,\n.katex .rlap > .inner {\n  position: absolute;\n}\n.katex .llap > .fix,\n.katex .rlap > .fix {\n  display: inline-block;\n}\n.katex .llap > .inner {\n  right: 0;\n}\n.katex .rlap > .inner {\n  left: 0;\n}\n.katex .katex-logo .a {\n  font-size: 0.75em;\n  margin-left: -0.32em;\n  position: relative;\n  top: -0.2em;\n}\n.katex .katex-logo .t {\n  margin-left: -0.23em;\n}\n.katex .katex-logo .e {\n  margin-left: -0.1667em;\n  position: relative;\n  top: 0.2155em;\n}\n.katex .katex-logo .x {\n  margin-left: -0.125em;\n}\n.katex .rule {\n  display: inline-block;\n  border: solid 0;\n  position: relative;\n}\n.katex .overline .overline-line,\n.katex .underline .underline-line {\n  width: 100%;\n}\n.katex .overline .overline-line:before,\n.katex .underline .underline-line:before {\n  border-bottom-style: solid;\n  border-bottom-width: 1px;\n  content: \"\";\n  display: block;\n}\n.katex .overline .overline-line:after,\n.katex .underline .underline-line:after {\n  border-bottom-style: solid;\n  border-bottom-width: 0.04em;\n  content: \"\";\n  display: block;\n  margin-top: -1px;\n}\n.katex .sqrt > .sqrt-sign {\n  position: relative;\n}\n.katex .sqrt .sqrt-line {\n  width: 100%;\n}\n.katex .sqrt .sqrt-line:before {\n  border-bottom-style: solid;\n  border-bottom-width: 1px;\n  content: \"\";\n  display: block;\n}\n.katex .sqrt .sqrt-line:after {\n  border-bottom-style: solid;\n  border-bottom-width: 0.04em;\n  content: \"\";\n  display: block;\n  margin-top: -1px;\n}\n.katex .sqrt > .root {\n  margin-left: 0.27777778em;\n  margin-right: -0.55555556em;\n}\n.katex .sizing,\n.katex .fontsize-ensurer {\n  display: inline-block;\n}\n.katex .sizing.reset-size1.size1,\n.katex .fontsize-ensurer.reset-size1.size1 {\n  font-size: 1em;\n}\n.katex .sizing.reset-size1.size2,\n.katex .fontsize-ensurer.reset-size1.size2 {\n  font-size: 1.4em;\n}\n.katex .sizing.reset-size1.size3,\n.katex .fontsize-ensurer.reset-size1.size3 {\n  font-size: 1.6em;\n}\n.katex .sizing.reset-size1.size4,\n.katex .fontsize-ensurer.reset-size1.size4 {\n  font-size: 1.8em;\n}\n.katex .sizing.reset-size1.size5,\n.katex .fontsize-ensurer.reset-size1.size5 {\n  font-size: 2em;\n}\n.katex .sizing.reset-size1.size6,\n.katex .fontsize-ensurer.reset-size1.size6 {\n  font-size: 2.4em;\n}\n.katex .sizing.reset-size1.size7,\n.katex .fontsize-ensurer.reset-size1.size7 {\n  font-size: 2.88em;\n}\n.katex .sizing.reset-size1.size8,\n.katex .fontsize-ensurer.reset-size1.size8 {\n  font-size: 3.46em;\n}\n.katex .sizing.reset-size1.size9,\n.katex .fontsize-ensurer.reset-size1.size9 {\n  font-size: 4.14em;\n}\n.katex .sizing.reset-size1.size10,\n.katex .fontsize-ensurer.reset-size1.size10 {\n  font-size: 4.98em;\n}\n.katex .sizing.reset-size2.size1,\n.katex .fontsize-ensurer.reset-size2.size1 {\n  font-size: 0.71428571em;\n}\n.katex .sizing.reset-size2.size2,\n.katex .fontsize-ensurer.reset-size2.size2 {\n  font-size: 1em;\n}\n.katex .sizing.reset-size2.size3,\n.katex .fontsize-ensurer.reset-size2.size3 {\n  font-size: 1.14285714em;\n}\n.katex .sizing.reset-size2.size4,\n.katex .fontsize-ensurer.reset-size2.size4 {\n  font-size: 1.28571429em;\n}\n.katex .sizing.reset-size2.size5,\n.katex .fontsize-ensurer.reset-size2.size5 {\n  font-size: 1.42857143em;\n}\n.katex .sizing.reset-size2.size6,\n.katex .fontsize-ensurer.reset-size2.size6 {\n  font-size: 1.71428571em;\n}\n.katex .sizing.reset-size2.size7,\n.katex .fontsize-ensurer.reset-size2.size7 {\n  font-size: 2.05714286em;\n}\n.katex .sizing.reset-size2.size8,\n.katex .fontsize-ensurer.reset-size2.size8 {\n  font-size: 2.47142857em;\n}\n.katex .sizing.reset-size2.size9,\n.katex .fontsize-ensurer.reset-size2.size9 {\n  font-size: 2.95714286em;\n}\n.katex .sizing.reset-size2.size10,\n.katex .fontsize-ensurer.reset-size2.size10 {\n  font-size: 3.55714286em;\n}\n.katex .sizing.reset-size3.size1,\n.katex .fontsize-ensurer.reset-size3.size1 {\n  font-size: 0.625em;\n}\n.katex .sizing.reset-size3.size2,\n.katex .fontsize-ensurer.reset-size3.size2 {\n  font-size: 0.875em;\n}\n.katex .sizing.reset-size3.size3,\n.katex .fontsize-ensurer.reset-size3.size3 {\n  font-size: 1em;\n}\n.katex .sizing.reset-size3.size4,\n.katex .fontsize-ensurer.reset-size3.size4 {\n  font-size: 1.125em;\n}\n.katex .sizing.reset-size3.size5,\n.katex .fontsize-ensurer.reset-size3.size5 {\n  font-size: 1.25em;\n}\n.katex .sizing.reset-size3.size6,\n.katex .fontsize-ensurer.reset-size3.size6 {\n  font-size: 1.5em;\n}\n.katex .sizing.reset-size3.size7,\n.katex .fontsize-ensurer.reset-size3.size7 {\n  font-size: 1.8em;\n}\n.katex .sizing.reset-size3.size8,\n.katex .fontsize-ensurer.reset-size3.size8 {\n  font-size: 2.1625em;\n}\n.katex .sizing.reset-size3.size9,\n.katex .fontsize-ensurer.reset-size3.size9 {\n  font-size: 2.5875em;\n}\n.katex .sizing.reset-size3.size10,\n.katex .fontsize-ensurer.reset-size3.size10 {\n  font-size: 3.1125em;\n}\n.katex .sizing.reset-size4.size1,\n.katex .fontsize-ensurer.reset-size4.size1 {\n  font-size: 0.55555556em;\n}\n.katex .sizing.reset-size4.size2,\n.katex .fontsize-ensurer.reset-size4.size2 {\n  font-size: 0.77777778em;\n}\n.katex .sizing.reset-size4.size3,\n.katex .fontsize-ensurer.reset-size4.size3 {\n  font-size: 0.88888889em;\n}\n.katex .sizing.reset-size4.size4,\n.katex .fontsize-ensurer.reset-size4.size4 {\n  font-size: 1em;\n}\n.katex .sizing.reset-size4.size5,\n.katex .fontsize-ensurer.reset-size4.size5 {\n  font-size: 1.11111111em;\n}\n.katex .sizing.reset-size4.size6,\n.katex .fontsize-ensurer.reset-size4.size6 {\n  font-size: 1.33333333em;\n}\n.katex .sizing.reset-size4.size7,\n.katex .fontsize-ensurer.reset-size4.size7 {\n  font-size: 1.6em;\n}\n.katex .sizing.reset-size4.size8,\n.katex .fontsize-ensurer.reset-size4.size8 {\n  font-size: 1.92222222em;\n}\n.katex .sizing.reset-size4.size9,\n.katex .fontsize-ensurer.reset-size4.size9 {\n  font-size: 2.3em;\n}\n.katex .sizing.reset-size4.size10,\n.katex .fontsize-ensurer.reset-size4.size10 {\n  font-size: 2.76666667em;\n}\n.katex .sizing.reset-size5.size1,\n.katex .fontsize-ensurer.reset-size5.size1 {\n  font-size: 0.5em;\n}\n.katex .sizing.reset-size5.size2,\n.katex .fontsize-ensurer.reset-size5.size2 {\n  font-size: 0.7em;\n}\n.katex .sizing.reset-size5.size3,\n.katex .fontsize-ensurer.reset-size5.size3 {\n  font-size: 0.8em;\n}\n.katex .sizing.reset-size5.size4,\n.katex .fontsize-ensurer.reset-size5.size4 {\n  font-size: 0.9em;\n}\n.katex .sizing.reset-size5.size5,\n.katex .fontsize-ensurer.reset-size5.size5 {\n  font-size: 1em;\n}\n.katex .sizing.reset-size5.size6,\n.katex .fontsize-ensurer.reset-size5.size6 {\n  font-size: 1.2em;\n}\n.katex .sizing.reset-size5.size7,\n.katex .fontsize-ensurer.reset-size5.size7 {\n  font-size: 1.44em;\n}\n.katex .sizing.reset-size5.size8,\n.katex .fontsize-ensurer.reset-size5.size8 {\n  font-size: 1.73em;\n}\n.katex .sizing.reset-size5.size9,\n.katex .fontsize-ensurer.reset-size5.size9 {\n  font-size: 2.07em;\n}\n.katex .sizing.reset-size5.size10,\n.katex .fontsize-ensurer.reset-size5.size10 {\n  font-size: 2.49em;\n}\n.katex .sizing.reset-size6.size1,\n.katex .fontsize-ensurer.reset-size6.size1 {\n  font-size: 0.41666667em;\n}\n.katex .sizing.reset-size6.size2,\n.katex .fontsize-ensurer.reset-size6.size2 {\n  font-size: 0.58333333em;\n}\n.katex .sizing.reset-size6.size3,\n.katex .fontsize-ensurer.reset-size6.size3 {\n  font-size: 0.66666667em;\n}\n.katex .sizing.reset-size6.size4,\n.katex .fontsize-ensurer.reset-size6.size4 {\n  font-size: 0.75em;\n}\n.katex .sizing.reset-size6.size5,\n.katex .fontsize-ensurer.reset-size6.size5 {\n  font-size: 0.83333333em;\n}\n.katex .sizing.reset-size6.size6,\n.katex .fontsize-ensurer.reset-size6.size6 {\n  font-size: 1em;\n}\n.katex .sizing.reset-size6.size7,\n.katex .fontsize-ensurer.reset-size6.size7 {\n  font-size: 1.2em;\n}\n.katex .sizing.reset-size6.size8,\n.katex .fontsize-ensurer.reset-size6.size8 {\n  font-size: 1.44166667em;\n}\n.katex .sizing.reset-size6.size9,\n.katex .fontsize-ensurer.reset-size6.size9 {\n  font-size: 1.725em;\n}\n.katex .sizing.reset-size6.size10,\n.katex .fontsize-ensurer.reset-size6.size10 {\n  font-size: 2.075em;\n}\n.katex .sizing.reset-size7.size1,\n.katex .fontsize-ensurer.reset-size7.size1 {\n  font-size: 0.34722222em;\n}\n.katex .sizing.reset-size7.size2,\n.katex .fontsize-ensurer.reset-size7.size2 {\n  font-size: 0.48611111em;\n}\n.katex .sizing.reset-size7.size3,\n.katex .fontsize-ensurer.reset-size7.size3 {\n  font-size: 0.55555556em;\n}\n.katex .sizing.reset-size7.size4,\n.katex .fontsize-ensurer.reset-size7.size4 {\n  font-size: 0.625em;\n}\n.katex .sizing.reset-size7.size5,\n.katex .fontsize-ensurer.reset-size7.size5 {\n  font-size: 0.69444444em;\n}\n.katex .sizing.reset-size7.size6,\n.katex .fontsize-ensurer.reset-size7.size6 {\n  font-size: 0.83333333em;\n}\n.katex .sizing.reset-size7.size7,\n.katex .fontsize-ensurer.reset-size7.size7 {\n  font-size: 1em;\n}\n.katex .sizing.reset-size7.size8,\n.katex .fontsize-ensurer.reset-size7.size8 {\n  font-size: 1.20138889em;\n}\n.katex .sizing.reset-size7.size9,\n.katex .fontsize-ensurer.reset-size7.size9 {\n  font-size: 1.4375em;\n}\n.katex .sizing.reset-size7.size10,\n.katex .fontsize-ensurer.reset-size7.size10 {\n  font-size: 1.72916667em;\n}\n.katex .sizing.reset-size8.size1,\n.katex .fontsize-ensurer.reset-size8.size1 {\n  font-size: 0.28901734em;\n}\n.katex .sizing.reset-size8.size2,\n.katex .fontsize-ensurer.reset-size8.size2 {\n  font-size: 0.40462428em;\n}\n.katex .sizing.reset-size8.size3,\n.katex .fontsize-ensurer.reset-size8.size3 {\n  font-size: 0.46242775em;\n}\n.katex .sizing.reset-size8.size4,\n.katex .fontsize-ensurer.reset-size8.size4 {\n  font-size: 0.52023121em;\n}\n.katex .sizing.reset-size8.size5,\n.katex .fontsize-ensurer.reset-size8.size5 {\n  font-size: 0.57803468em;\n}\n.katex .sizing.reset-size8.size6,\n.katex .fontsize-ensurer.reset-size8.size6 {\n  font-size: 0.69364162em;\n}\n.katex .sizing.reset-size8.size7,\n.katex .fontsize-ensurer.reset-size8.size7 {\n  font-size: 0.83236994em;\n}\n.katex .sizing.reset-size8.size8,\n.katex .fontsize-ensurer.reset-size8.size8 {\n  font-size: 1em;\n}\n.katex .sizing.reset-size8.size9,\n.katex .fontsize-ensurer.reset-size8.size9 {\n  font-size: 1.19653179em;\n}\n.katex .sizing.reset-size8.size10,\n.katex .fontsize-ensurer.reset-size8.size10 {\n  font-size: 1.43930636em;\n}\n.katex .sizing.reset-size9.size1,\n.katex .fontsize-ensurer.reset-size9.size1 {\n  font-size: 0.24154589em;\n}\n.katex .sizing.reset-size9.size2,\n.katex .fontsize-ensurer.reset-size9.size2 {\n  font-size: 0.33816425em;\n}\n.katex .sizing.reset-size9.size3,\n.katex .fontsize-ensurer.reset-size9.size3 {\n  font-size: 0.38647343em;\n}\n.katex .sizing.reset-size9.size4,\n.katex .fontsize-ensurer.reset-size9.size4 {\n  font-size: 0.43478261em;\n}\n.katex .sizing.reset-size9.size5,\n.katex .fontsize-ensurer.reset-size9.size5 {\n  font-size: 0.48309179em;\n}\n.katex .sizing.reset-size9.size6,\n.katex .fontsize-ensurer.reset-size9.size6 {\n  font-size: 0.57971014em;\n}\n.katex .sizing.reset-size9.size7,\n.katex .fontsize-ensurer.reset-size9.size7 {\n  font-size: 0.69565217em;\n}\n.katex .sizing.reset-size9.size8,\n.katex .fontsize-ensurer.reset-size9.size8 {\n  font-size: 0.83574879em;\n}\n.katex .sizing.reset-size9.size9,\n.katex .fontsize-ensurer.reset-size9.size9 {\n  font-size: 1em;\n}\n.katex .sizing.reset-size9.size10,\n.katex .fontsize-ensurer.reset-size9.size10 {\n  font-size: 1.20289855em;\n}\n.katex .sizing.reset-size10.size1,\n.katex .fontsize-ensurer.reset-size10.size1 {\n  font-size: 0.20080321em;\n}\n.katex .sizing.reset-size10.size2,\n.katex .fontsize-ensurer.reset-size10.size2 {\n  font-size: 0.2811245em;\n}\n.katex .sizing.reset-size10.size3,\n.katex .fontsize-ensurer.reset-size10.size3 {\n  font-size: 0.32128514em;\n}\n.katex .sizing.reset-size10.size4,\n.katex .fontsize-ensurer.reset-size10.size4 {\n  font-size: 0.36144578em;\n}\n.katex .sizing.reset-size10.size5,\n.katex .fontsize-ensurer.reset-size10.size5 {\n  font-size: 0.40160643em;\n}\n.katex .sizing.reset-size10.size6,\n.katex .fontsize-ensurer.reset-size10.size6 {\n  font-size: 0.48192771em;\n}\n.katex .sizing.reset-size10.size7,\n.katex .fontsize-ensurer.reset-size10.size7 {\n  font-size: 0.57831325em;\n}\n.katex .sizing.reset-size10.size8,\n.katex .fontsize-ensurer.reset-size10.size8 {\n  font-size: 0.69477912em;\n}\n.katex .sizing.reset-size10.size9,\n.katex .fontsize-ensurer.reset-size10.size9 {\n  font-size: 0.8313253em;\n}\n.katex .sizing.reset-size10.size10,\n.katex .fontsize-ensurer.reset-size10.size10 {\n  font-size: 1em;\n}\n.katex .delimsizing.size1 {\n  font-family: KaTeX_Size1;\n}\n.katex .delimsizing.size2 {\n  font-family: KaTeX_Size2;\n}\n.katex .delimsizing.size3 {\n  font-family: KaTeX_Size3;\n}\n.katex .delimsizing.size4 {\n  font-family: KaTeX_Size4;\n}\n.katex .delimsizing.mult .delim-size1 > span {\n  font-family: KaTeX_Size1;\n}\n.katex .delimsizing.mult .delim-size4 > span {\n  font-family: KaTeX_Size4;\n}\n.katex .nulldelimiter {\n  display: inline-block;\n  width: 0.12em;\n}\n.katex .op-symbol {\n  position: relative;\n}\n.katex .op-symbol.small-op {\n  font-family: KaTeX_Size1;\n}\n.katex .op-symbol.large-op {\n  font-family: KaTeX_Size2;\n}\n.katex .op-limits > .vlist > span {\n  text-align: center;\n}\n.katex .accent > .vlist > span {\n  text-align: center;\n}\n.katex .accent .accent-body > span {\n  width: 0;\n}\n.katex .accent .accent-body.accent-vec > span {\n  position: relative;\n  left: 0.326em;\n}\n.katex .mtable .vertical-separator {\n  display: inline-block;\n  margin: 0 -0.025em;\n  border-right: 0.05em solid black;\n}\n.katex .mtable .arraycolsep {\n  display: inline-block;\n}\n.katex .mtable .col-align-c > .vlist {\n  text-align: center;\n}\n.katex .mtable .col-align-l > .vlist {\n  text-align: left;\n}\n.katex .mtable .col-align-r > .vlist {\n  text-align: right;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 46 */,
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(14)(true);
// imports


// module
exports.push([module.i, ".research-article img{max-width:100%}.research-article h1{font-size:1.5rem}.research-article h2{font-size:1.25rem}.research-article h3,.research-article h4,.research-article h5,.research-article h6{font-size:1rem}.research-article li,.research-article p,.research-article pre{font-size:.85rem}@media (min-width:768px){.research-article h1{font-size:1.75rem}.research-article h2{font-size:1.5rem}.research-article h3{font-size:1.25rem}.research-article h4,.research-article h5,.research-article h6{font-size:1rem}.research-article li,.research-article p,.research-article pre{font-size:.94rem}}", "", {"version":3,"sources":["F:/Github/newvue/src/components/research_article/Plane_Shooting_Problem_Dynamic_Programming/article.vue"],"names":[],"mappings":"AACA,sBACE,cAAgB,CACjB,AACD,qBACE,gBAAkB,CACnB,AACD,qBACE,iBAAmB,CACpB,AAUD,oFACE,cAAgB,CACjB,AAOD,+DACE,gBAAmB,CACpB,AACD,yBACA,qBACI,iBAAmB,CACtB,AACD,qBACI,gBAAkB,CACrB,AACD,qBACI,iBAAmB,CACtB,AAOD,+DACI,cAAgB,CACnB,AAOD,+DACI,gBAAmB,CACtB,CACA","file":"article.vue","sourcesContent":["\n.research-article img {\n  max-width: 100%;\n}\n.research-article h1 {\n  font-size: 1.5rem;\n}\n.research-article h2 {\n  font-size: 1.25rem;\n}\n.research-article h3 {\n  font-size: 1rem;\n}\n.research-article h4 {\n  font-size: 1rem;\n}\n.research-article h5 {\n  font-size: 1rem;\n}\n.research-article h6 {\n  font-size: 1rem;\n}\n.research-article p {\n  font-size: 0.85rem;\n}\n.research-article li {\n  font-size: 0.85rem;\n}\n.research-article pre {\n  font-size: 0.85rem;\n}\n@media (min-width: 768px) {\n.research-article h1 {\n    font-size: 1.75rem;\n}\n.research-article h2 {\n    font-size: 1.5rem;\n}\n.research-article h3 {\n    font-size: 1.25rem;\n}\n.research-article h4 {\n    font-size: 1rem;\n}\n.research-article h5 {\n    font-size: 1rem;\n}\n.research-article h6 {\n    font-size: 1rem;\n}\n.research-article p {\n    font-size: 0.94rem;\n}\n.research-article li {\n    font-size: 0.94rem;\n}\n.research-article pre {\n    font-size: 0.94rem;\n}\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 48 */,
/* 49 */,
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(45);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(15)("6c2ccccc", content, true);

/***/ }),
/* 51 */,
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(47);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(15)("d734c3a8", content, true);

/***/ }),
/* 53 */,
/* 54 */,
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint no-console:0 */
/* global katex */
var katex = __webpack_require__(57);
const splitAtDelimiters = __webpack_require__(56);

const splitWithDelimiters = function(text, delimiters) {
    let data = [{type: "text", data: text}];
    for (let i = 0; i < delimiters.length; i++) {
        const delimiter = delimiters[i];
        data = splitAtDelimiters(
            data, delimiter.left, delimiter.right,
            delimiter.display || false);
    }
    return data;
};

const renderMathInText = function(text, delimiters) {
    const data = splitWithDelimiters(text, delimiters);

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < data.length; i++) {
        if (data[i].type === "text") {
            fragment.appendChild(document.createTextNode(data[i].data));
        } else {
            const span = document.createElement("span");
            const math = data[i].data;
            try {
                katex.render(math, span, {
                    displayMode: data[i].display,
                });
            } catch (e) {
                if (!(e instanceof katex.ParseError)) {
                    throw e;
                }
                console.error(
                    "KaTeX auto-render: Failed to parse `" + data[i].data +
                    "` with ",
                    e
                );
                fragment.appendChild(document.createTextNode(data[i].rawData));
                continue;
            }
            fragment.appendChild(span);
        }
    }

    return fragment;
};

const renderElem = function(elem, delimiters, ignoredTags) {
    for (let i = 0; i < elem.childNodes.length; i++) {
        const childNode = elem.childNodes[i];
        if (childNode.nodeType === 3) {
            // Text node
            const frag = renderMathInText(childNode.textContent, delimiters);
            i += frag.childNodes.length - 1;
            elem.replaceChild(frag, childNode);
        } else if (childNode.nodeType === 1) {
            // Element node
            const shouldRender = ignoredTags.indexOf(
                childNode.nodeName.toLowerCase()) === -1;

            if (shouldRender) {
                renderElem(childNode, delimiters, ignoredTags);
            }
        }
        // Otherwise, it's something else, and ignore it.
    }
};

const defaultOptions = {
    delimiters: [
        {left: "$$", right: "$$", display: true},
        {left: "\\[", right: "\\]", display: true},
        {left: "\\(", right: "\\)", display: false},
        // LaTeX uses this, but it ruins the display of normal `$` in text:
        // {left: "$", right: "$", display: false},
    ],

    ignoredTags: [
        "script", "noscript", "style", "textarea", "pre", "code",
    ],
};

const extend = function(obj) {
    // Adapted from underscore.js' `_.extend`. See LICENSE.txt for license.
    let source;
    let prop;
    const length = arguments.length;
    for (let i = 1; i < length; i++) {
        source = arguments[i];
        for (prop in source) {
            if (Object.prototype.hasOwnProperty.call(source, prop)) {
                obj[prop] = source[prop];
            }
        }
    }
    return obj;
};

const renderMathInElement = function(elem, options) {
    if (!elem) {
        throw new Error("No element provided to render");
    }

    options = extend({}, defaultOptions, options);

    renderElem(elem, options.delimiters, options.ignoredTags);
};

module.exports = renderMathInElement;


/***/ }),
/* 56 */
/***/ (function(module, exports) {

/* eslint no-constant-condition:0 */
const findEndOfMath = function(delimiter, text, startIndex) {
    // Adapted from
    // https://github.com/Khan/perseus/blob/master/src/perseus-markdown.jsx
    let index = startIndex;
    let braceLevel = 0;

    const delimLength = delimiter.length;

    while (index < text.length) {
        const character = text[index];

        if (braceLevel <= 0 &&
            text.slice(index, index + delimLength) === delimiter) {
            return index;
        } else if (character === "\\") {
            index++;
        } else if (character === "{") {
            braceLevel++;
        } else if (character === "}") {
            braceLevel--;
        }

        index++;
    }

    return -1;
};

const splitAtDelimiters = function(startData, leftDelim, rightDelim, display) {
    const finalData = [];

    for (let i = 0; i < startData.length; i++) {
        if (startData[i].type === "text") {
            const text = startData[i].data;

            let lookingForLeft = true;
            let currIndex = 0;
            let nextIndex;

            nextIndex = text.indexOf(leftDelim);
            if (nextIndex !== -1) {
                currIndex = nextIndex;
                finalData.push({
                    type: "text",
                    data: text.slice(0, currIndex),
                });
                lookingForLeft = false;
            }

            while (true) {
                if (lookingForLeft) {
                    nextIndex = text.indexOf(leftDelim, currIndex);
                    if (nextIndex === -1) {
                        break;
                    }

                    finalData.push({
                        type: "text",
                        data: text.slice(currIndex, nextIndex),
                    });

                    currIndex = nextIndex;
                } else {
                    nextIndex = findEndOfMath(
                        rightDelim,
                        text,
                        currIndex + leftDelim.length);
                    if (nextIndex === -1) {
                        break;
                    }

                    finalData.push({
                        type: "math",
                        data: text.slice(
                            currIndex + leftDelim.length,
                            nextIndex),
                        rawData: text.slice(
                            currIndex,
                            nextIndex + rightDelim.length),
                        display: display,
                    });

                    currIndex = nextIndex + rightDelim.length;
                }

                lookingForLeft = !lookingForLeft;
            }

            finalData.push({
                type: "text",
                data: text.slice(currIndex),
            });
        } else {
            finalData.push(startData[i]);
        }
    }

    return finalData;
};

module.exports = splitAtDelimiters;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var require;var require;(function(f){if(true){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.katex = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return require(o,!0);if(i)return require(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* eslint no-console:0 */
/**
 * This is the main entry point for KaTeX. Here, we expose functions for
 * rendering expressions either to DOM nodes or to markup strings.
 *
 * We also expose the ParseError class to check if errors thrown from KaTeX are
 * errors in the expression, or errors in javascript handling.
 */

var ParseError = require("./src/ParseError");
var Settings = require("./src/Settings");

var buildTree = require("./src/buildTree");
var parseTree = require("./src/parseTree");
var utils = require("./src/utils");

/**
 * Parse and build an expression, and place that expression in the DOM node
 * given.
 */
var render = function(expression, baseNode, options) {
    utils.clearNode(baseNode);

    var settings = new Settings(options);

    var tree = parseTree(expression, settings);
    var node = buildTree(tree, expression, settings).toNode();

    baseNode.appendChild(node);
};

// KaTeX's styles don't work properly in quirks mode. Print out an error, and
// disable rendering.
if (typeof document !== "undefined") {
    if (document.compatMode !== "CSS1Compat") {
        typeof console !== "undefined" && console.warn(
            "Warning: KaTeX doesn't work in quirks mode. Make sure your " +
                "website has a suitable doctype.");

        render = function() {
            throw new ParseError("KaTeX doesn't work in quirks mode.");
        };
    }
}

/**
 * Parse and build an expression, and return the markup for that.
 */
var renderToString = function(expression, options) {
    var settings = new Settings(options);

    var tree = parseTree(expression, settings);
    return buildTree(tree, expression, settings).toMarkup();
};

/**
 * Parse an expression and return the parse tree.
 */
var generateParseTree = function(expression, options) {
    var settings = new Settings(options);
    return parseTree(expression, settings);
};

module.exports = {
    render: render,
    renderToString: renderToString,
    /**
     * NOTE: This method is not currently recommended for public use.
     * The internal tree representation is unstable and is very likely
     * to change. Use at your own risk.
     */
    __parse: generateParseTree,
    ParseError: ParseError
};

},{"./src/ParseError":6,"./src/Settings":8,"./src/buildTree":13,"./src/parseTree":22,"./src/utils":25}],2:[function(require,module,exports){
/** @flow */

"use strict";

function getRelocatable(re) {
  // In the future, this could use a WeakMap instead of an expando.
  if (!re.__matchAtRelocatable) {
    // Disjunctions are the lowest-precedence operator, so we can make any
    // pattern match the empty string by appending `|()` to it:
    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-patterns
    var source = re.source + "|()";

    // We always make the new regex global.
    var flags = "g" + (re.ignoreCase ? "i" : "") + (re.multiline ? "m" : "") + (re.unicode ? "u" : "")
    // sticky (/.../y) doesn't make sense in conjunction with our relocation
    // logic, so we ignore it here.
    ;

    re.__matchAtRelocatable = new RegExp(source, flags);
  }
  return re.__matchAtRelocatable;
}

function matchAt(re, str, pos) {
  if (re.global || re.sticky) {
    throw new Error("matchAt(...): Only non-global regexes are supported");
  }
  var reloc = getRelocatable(re);
  reloc.lastIndex = pos;
  var match = reloc.exec(str);
  // Last capturing group is our sentinel that indicates whether the regex
  // matched at the given location.
  if (match[match.length - 1] == null) {
    // Original regex matched.
    match.length = match.length - 1;
    return match;
  } else {
    return null;
  }
}

module.exports = matchAt;
},{}],3:[function(require,module,exports){
/**
 * The Lexer class handles tokenizing the input in various ways. Since our
 * parser expects us to be able to backtrack, the lexer allows lexing from any
 * given starting point.
 *
 * Its main exposed function is the `lex` function, which takes a position to
 * lex from and a type of token to lex. It defers to the appropriate `_innerLex`
 * function.
 *
 * The various `_innerLex` functions perform the actual lexing of different
 * kinds.
 */

var matchAt = require("match-at");

var ParseError = require("./ParseError");

// The main lexer class
function Lexer(input) {
    this.input = input;
    this.pos = 0;
}

/**
 * The resulting token returned from `lex`.
 *
 * It consists of the token text plus some position information.
 * The position information is essentially a range in an input string,
 * but instead of referencing the bare input string, we refer to the lexer.
 * That way it is possible to attach extra metadata to the input string,
 * like for example a file name or similar.
 *
 * The position information (all three parameters) is optional,
 * so it is OK to construct synthetic tokens if appropriate.
 * Not providing available position information may lead to
 * degraded error reporting, though.
 *
 * @param {string}  text   the text of this token
 * @param {number=} start  the start offset, zero-based inclusive
 * @param {number=} end    the end offset, zero-based exclusive
 * @param {Lexer=}  lexer  the lexer which in turn holds the input string
 */
function Token(text, start, end, lexer) {
    this.text = text;
    this.start = start;
    this.end = end;
    this.lexer = lexer;
}

/**
 * Given a pair of tokens (this and endToken), compute a “Token” encompassing
 * the whole input range enclosed by these two.
 *
 * @param {Token}  endToken  last token of the range, inclusive
 * @param {string} text      the text of the newly constructed token
 */
Token.prototype.range = function(endToken, text) {
    if (endToken.lexer !== this.lexer) {
        return new Token(text); // sorry, no position information available
    }
    return new Token(text, this.start, endToken.end, this.lexer);
};

/* The following tokenRegex
 * - matches typical whitespace (but not NBSP etc.) using its first group
 * - does not match any control character \x00-\x1f except whitespace
 * - does not match a bare backslash
 * - matches any ASCII character except those just mentioned
 * - does not match the BMP private use area \uE000-\uF8FF
 * - does not match bare surrogate code units
 * - matches any BMP character except for those just described
 * - matches any valid Unicode surrogate pair
 * - matches a backslash followed by one or more letters
 * - matches a backslash followed by any BMP character, including newline
 * Just because the Lexer matches something doesn't mean it's valid input:
 * If there is no matching function or symbol definition, the Parser will
 * still reject the input.
 */
var tokenRegex = new RegExp(
    "([ \r\n\t]+)|" +                                 // whitespace
    "([!-\\[\\]-\u2027\u202A-\uD7FF\uF900-\uFFFF]" +  // single codepoint
    "|[\uD800-\uDBFF][\uDC00-\uDFFF]" +               // surrogate pair
    "|\\\\(?:[a-zA-Z]+|[^\uD800-\uDFFF])" +           // function name
    ")"
);

/**
 * This function lexes a single token.
 */
Lexer.prototype.lex = function() {
    var input = this.input;
    var pos = this.pos;
    if (pos === input.length) {
        return new Token("EOF", pos, pos, this);
    }
    var match = matchAt(tokenRegex, input, pos);
    if (match === null) {
        throw new ParseError(
            "Unexpected character: '" + input[pos] + "'",
            new Token(input[pos], pos, pos + 1, this));
    }
    var text = match[2] || " ";
    var start = this.pos;
    this.pos += match[0].length;
    var end = this.pos;
    return new Token(text, start, end, this);
};

module.exports = Lexer;

},{"./ParseError":6,"match-at":2}],4:[function(require,module,exports){
/**
 * This file contains the “gullet” where macros are expanded
 * until only non-macro tokens remain.
 */

var Lexer = require("./Lexer");

function MacroExpander(input, macros) {
    this.lexer = new Lexer(input);
    this.macros = macros;
    this.stack = []; // contains tokens in REVERSE order
    this.discardedWhiteSpace = [];
}

/**
 * Recursively expand first token, then return first non-expandable token.
 */
MacroExpander.prototype.nextToken = function() {
    for (;;) {
        if (this.stack.length === 0) {
            this.stack.push(this.lexer.lex());
        }
        var topToken = this.stack.pop();
        var name = topToken.text;
        if (!(name.charAt(0) === "\\" && this.macros.hasOwnProperty(name))) {
            return topToken;
        }
        var expansion = this.macros[name];
        if (typeof expansion === "string") {
            var bodyLexer = new Lexer(expansion);
            expansion = [];
            var tok = bodyLexer.lex();
            while (tok.text !== "EOF") {
                expansion.push(tok);
                tok = bodyLexer.lex();
            }
            expansion.reverse(); // to fit in with stack using push and pop
            this.macros[name] = expansion;
        }
        this.stack = this.stack.concat(expansion);
    }
};

MacroExpander.prototype.get = function(ignoreSpace) {
    this.discardedWhiteSpace = [];
    var token = this.nextToken();
    if (ignoreSpace) {
        while (token.text === " ") {
            this.discardedWhiteSpace.push(token);
            token = this.nextToken();
        }
    }
    return token;
};

/**
 * Undo the effect of the preceding call to the get method.
 * A call to this method MUST be immediately preceded and immediately followed
 * by a call to get.  Only used during mode switching, i.e. after one token
 * was got in the old mode but should get got again in a new mode
 * with possibly different whitespace handling.
 */
MacroExpander.prototype.unget = function(token) {
    this.stack.push(token);
    while (this.discardedWhiteSpace.length !== 0) {
        this.stack.push(this.discardedWhiteSpace.pop());
    }
};

module.exports = MacroExpander;

},{"./Lexer":3}],5:[function(require,module,exports){
/**
 * This file contains information about the options that the Parser carries
 * around with it while parsing. Data is held in an `Options` object, and when
 * recursing, a new `Options` object can be created with the `.with*` and
 * `.reset` functions.
 */

/**
 * This is the main options class. It contains the style, size, color, and font
 * of the current parse level. It also contains the style and size of the parent
 * parse level, so size changes can be handled efficiently.
 *
 * Each of the `.with*` and `.reset` functions passes its current style and size
 * as the parentStyle and parentSize of the new options class, so parent
 * handling is taken care of automatically.
 */
function Options(data) {
    this.style = data.style;
    this.color = data.color;
    this.size = data.size;
    this.phantom = data.phantom;
    this.font = data.font;

    if (data.parentStyle === undefined) {
        this.parentStyle = data.style;
    } else {
        this.parentStyle = data.parentStyle;
    }

    if (data.parentSize === undefined) {
        this.parentSize = data.size;
    } else {
        this.parentSize = data.parentSize;
    }
}

/**
 * Returns a new options object with the same properties as "this".  Properties
 * from "extension" will be copied to the new options object.
 */
Options.prototype.extend = function(extension) {
    var data = {
        style: this.style,
        size: this.size,
        color: this.color,
        parentStyle: this.style,
        parentSize: this.size,
        phantom: this.phantom,
        font: this.font
    };

    for (var key in extension) {
        if (extension.hasOwnProperty(key)) {
            data[key] = extension[key];
        }
    }

    return new Options(data);
};

/**
 * Create a new options object with the given style.
 */
Options.prototype.withStyle = function(style) {
    return this.extend({
        style: style
    });
};

/**
 * Create a new options object with the given size.
 */
Options.prototype.withSize = function(size) {
    return this.extend({
        size: size
    });
};

/**
 * Create a new options object with the given color.
 */
Options.prototype.withColor = function(color) {
    return this.extend({
        color: color
    });
};

/**
 * Create a new options object with "phantom" set to true.
 */
Options.prototype.withPhantom = function() {
    return this.extend({
        phantom: true
    });
};

/**
 * Create a new options objects with the give font.
 */
Options.prototype.withFont = function(font) {
    return this.extend({
        font: font || this.font
    });
};

/**
 * Create a new options object with the same style, size, and color. This is
 * used so that parent style and size changes are handled correctly.
 */
Options.prototype.reset = function() {
    return this.extend({});
};

/**
 * A map of color names to CSS colors.
 * TODO(emily): Remove this when we have real macros
 */
var colorMap = {
    "katex-blue": "#6495ed",
    "katex-orange": "#ffa500",
    "katex-pink": "#ff00af",
    "katex-red": "#df0030",
    "katex-green": "#28ae7b",
    "katex-gray": "gray",
    "katex-purple": "#9d38bd",
    "katex-blueA": "#ccfaff",
    "katex-blueB": "#80f6ff",
    "katex-blueC": "#63d9ea",
    "katex-blueD": "#11accd",
    "katex-blueE": "#0c7f99",
    "katex-tealA": "#94fff5",
    "katex-tealB": "#26edd5",
    "katex-tealC": "#01d1c1",
    "katex-tealD": "#01a995",
    "katex-tealE": "#208170",
    "katex-greenA": "#b6ffb0",
    "katex-greenB": "#8af281",
    "katex-greenC": "#74cf70",
    "katex-greenD": "#1fab54",
    "katex-greenE": "#0d923f",
    "katex-goldA": "#ffd0a9",
    "katex-goldB": "#ffbb71",
    "katex-goldC": "#ff9c39",
    "katex-goldD": "#e07d10",
    "katex-goldE": "#a75a05",
    "katex-redA": "#fca9a9",
    "katex-redB": "#ff8482",
    "katex-redC": "#f9685d",
    "katex-redD": "#e84d39",
    "katex-redE": "#bc2612",
    "katex-maroonA": "#ffbde0",
    "katex-maroonB": "#ff92c6",
    "katex-maroonC": "#ed5fa6",
    "katex-maroonD": "#ca337c",
    "katex-maroonE": "#9e034e",
    "katex-purpleA": "#ddd7ff",
    "katex-purpleB": "#c6b9fc",
    "katex-purpleC": "#aa87ff",
    "katex-purpleD": "#7854ab",
    "katex-purpleE": "#543b78",
    "katex-mintA": "#f5f9e8",
    "katex-mintB": "#edf2df",
    "katex-mintC": "#e0e5cc",
    "katex-grayA": "#f6f7f7",
    "katex-grayB": "#f0f1f2",
    "katex-grayC": "#e3e5e6",
    "katex-grayD": "#d6d8da",
    "katex-grayE": "#babec2",
    "katex-grayF": "#888d93",
    "katex-grayG": "#626569",
    "katex-grayH": "#3b3e40",
    "katex-grayI": "#21242c",
    "katex-kaBlue": "#314453",
    "katex-kaGreen": "#71B307"
};

/**
 * Gets the CSS color of the current options object, accounting for the
 * `colorMap`.
 */
Options.prototype.getColor = function() {
    if (this.phantom) {
        return "transparent";
    } else {
        return colorMap[this.color] || this.color;
    }
};

module.exports = Options;

},{}],6:[function(require,module,exports){
/**
 * This is the ParseError class, which is the main error thrown by KaTeX
 * functions when something has gone wrong. This is used to distinguish internal
 * errors from errors in the expression that the user provided.
 *
 * If possible, a caller should provide a Token or ParseNode with information
 * about where in the source string the problem occurred.
 *
 * @param {string} message  The error message
 * @param {(Token|ParseNode)=} token  An object providing position information
 */
function ParseError(message, token) {
    var error = "KaTeX parse error: " + message;
    var start;
    var end;

    if (token && token.lexer && token.start <= token.end) {
        // If we have the input and a position, make the error a bit fancier

        // Get the input
        var input = token.lexer.input;

        // Prepend some information
        start = token.start;
        end = token.end;
        if (start === input.length) {
            error += " at end of input: ";
        } else {
            error += " at position " + (start + 1) + ": ";
        }

        // Underline token in question using combining underscores
        var underlined = input.slice(start, end).replace(/[^]/g, "$&\u0332");

        // Extract some context from the input and add it to the error
        var left;
        if (start > 15) {
            left = "…" + input.slice(start - 15, start);
        } else {
            left = input.slice(0, start);
        }
        var right;
        if (end + 15 < input.length) {
            right = input.slice(end, end + 15) + "…";
        } else {
            right = input.slice(end);
        }
        error += left + underlined + right;
    }

    // Some hackery to make ParseError a prototype of Error
    // See http://stackoverflow.com/a/8460753
    var self = new Error(error);
    self.name = "ParseError";
    self.__proto__ = ParseError.prototype;

    self.position = start;
    return self;
}

// More hackery
ParseError.prototype.__proto__ = Error.prototype;

module.exports = ParseError;

},{}],7:[function(require,module,exports){
/* eslint no-constant-condition:0 */
var functions = require("./functions");
var environments = require("./environments");
var MacroExpander = require("./MacroExpander");
var symbols = require("./symbols");
var utils = require("./utils");
var cjkRegex = require("./unicodeRegexes").cjkRegex;

var parseData = require("./parseData");
var ParseError = require("./ParseError");

/**
 * This file contains the parser used to parse out a TeX expression from the
 * input. Since TeX isn't context-free, standard parsers don't work particularly
 * well.
 *
 * The strategy of this parser is as such:
 *
 * The main functions (the `.parse...` ones) take a position in the current
 * parse string to parse tokens from. The lexer (found in Lexer.js, stored at
 * this.lexer) also supports pulling out tokens at arbitrary places. When
 * individual tokens are needed at a position, the lexer is called to pull out a
 * token, which is then used.
 *
 * The parser has a property called "mode" indicating the mode that
 * the parser is currently in. Currently it has to be one of "math" or
 * "text", which denotes whether the current environment is a math-y
 * one or a text-y one (e.g. inside \text). Currently, this serves to
 * limit the functions which can be used in text mode.
 *
 * The main functions then return an object which contains the useful data that
 * was parsed at its given point, and a new position at the end of the parsed
 * data. The main functions can call each other and continue the parsing by
 * using the returned position as a new starting point.
 *
 * There are also extra `.handle...` functions, which pull out some reused
 * functionality into self-contained functions.
 *
 * The earlier functions return ParseNodes.
 * The later functions (which are called deeper in the parse) sometimes return
 * ParseFuncOrArgument, which contain a ParseNode as well as some data about
 * whether the parsed object is a function which is missing some arguments, or a
 * standalone object which can be used as an argument to another function.
 */

/**
 * Main Parser class
 */
function Parser(input, settings) {
    // Create a new macro expander (gullet) and (indirectly via that) also a
    // new lexer (mouth) for this parser (stomach, in the language of TeX)
    this.gullet = new MacroExpander(input, settings.macros);
    // Store the settings for use in parsing
    this.settings = settings;
    // Count leftright depth (for \middle errors)
    this.leftrightDepth = 0;
}

var ParseNode = parseData.ParseNode;

/**
 * An initial function (without its arguments), or an argument to a function.
 * The `result` argument should be a ParseNode.
 */
function ParseFuncOrArgument(result, isFunction, token) {
    this.result = result;
    // Is this a function (i.e. is it something defined in functions.js)?
    this.isFunction = isFunction;
    this.token = token;
}

/**
 * Checks a result to make sure it has the right type, and throws an
 * appropriate error otherwise.
 *
 * @param {boolean=} consume whether to consume the expected token,
 *                           defaults to true
 */
Parser.prototype.expect = function(text, consume) {
    if (this.nextToken.text !== text) {
        throw new ParseError(
            "Expected '" + text + "', got '" + this.nextToken.text + "'",
            this.nextToken
        );
    }
    if (consume !== false) {
        this.consume();
    }
};

/**
 * Considers the current look ahead token as consumed,
 * and fetches the one after that as the new look ahead.
 */
Parser.prototype.consume = function() {
    this.nextToken = this.gullet.get(this.mode === "math");
};

Parser.prototype.switchMode = function(newMode) {
    this.gullet.unget(this.nextToken);
    this.mode = newMode;
    this.consume();
};

/**
 * Main parsing function, which parses an entire input.
 *
 * @return {?Array.<ParseNode>}
 */
Parser.prototype.parse = function() {
    // Try to parse the input
    this.mode = "math";
    this.consume();
    var parse = this.parseInput();
    return parse;
};

/**
 * Parses an entire input tree.
 */
Parser.prototype.parseInput = function() {
    // Parse an expression
    var expression = this.parseExpression(false);
    // If we succeeded, make sure there's an EOF at the end
    this.expect("EOF", false);
    return expression;
};

var endOfExpression = ["}", "\\end", "\\right", "&", "\\\\", "\\cr"];

/**
 * Parses an "expression", which is a list of atoms.
 *
 * @param {boolean} breakOnInfix  Should the parsing stop when we hit infix
 *                  nodes? This happens when functions have higher precendence
 *                  than infix nodes in implicit parses.
 *
 * @param {?string} breakOnTokenText  The text of the token that the expression
 *                  should end with, or `null` if something else should end the
 *                  expression.
 *
 * @return {ParseNode}
 */
Parser.prototype.parseExpression = function(breakOnInfix, breakOnTokenText) {
    var body = [];
    // Keep adding atoms to the body until we can't parse any more atoms (either
    // we reached the end, a }, or a \right)
    while (true) {
        var lex = this.nextToken;
        if (endOfExpression.indexOf(lex.text) !== -1) {
            break;
        }
        if (breakOnTokenText && lex.text === breakOnTokenText) {
            break;
        }
        if (breakOnInfix && functions[lex.text] && functions[lex.text].infix) {
            break;
        }
        var atom = this.parseAtom();
        if (!atom) {
            if (!this.settings.throwOnError && lex.text[0] === "\\") {
                var errorNode = this.handleUnsupportedCmd();
                body.push(errorNode);
                continue;
            }

            break;
        }
        body.push(atom);
    }
    return this.handleInfixNodes(body);
};

/**
 * Rewrites infix operators such as \over with corresponding commands such
 * as \frac.
 *
 * There can only be one infix operator per group.  If there's more than one
 * then the expression is ambiguous.  This can be resolved by adding {}.
 *
 * @returns {Array}
 */
Parser.prototype.handleInfixNodes = function(body) {
    var overIndex = -1;
    var funcName;

    for (var i = 0; i < body.length; i++) {
        var node = body[i];
        if (node.type === "infix") {
            if (overIndex !== -1) {
                throw new ParseError(
                    "only one infix operator per group",
                    node.value.token);
            }
            overIndex = i;
            funcName = node.value.replaceWith;
        }
    }

    if (overIndex !== -1) {
        var numerNode;
        var denomNode;

        var numerBody = body.slice(0, overIndex);
        var denomBody = body.slice(overIndex + 1);

        if (numerBody.length === 1 && numerBody[0].type === "ordgroup") {
            numerNode = numerBody[0];
        } else {
            numerNode = new ParseNode("ordgroup", numerBody, this.mode);
        }

        if (denomBody.length === 1 && denomBody[0].type === "ordgroup") {
            denomNode = denomBody[0];
        } else {
            denomNode = new ParseNode("ordgroup", denomBody, this.mode);
        }

        var value = this.callFunction(
            funcName, [numerNode, denomNode], null);
        return [new ParseNode(value.type, value, this.mode)];
    } else {
        return body;
    }
};

// The greediness of a superscript or subscript
var SUPSUB_GREEDINESS = 1;

/**
 * Handle a subscript or superscript with nice errors.
 */
Parser.prototype.handleSupSubscript = function(name) {
    var symbolToken = this.nextToken;
    var symbol = symbolToken.text;
    this.consume();
    var group = this.parseGroup();

    if (!group) {
        if (!this.settings.throwOnError && this.nextToken.text[0] === "\\") {
            return this.handleUnsupportedCmd();
        } else {
            throw new ParseError(
                "Expected group after '" + symbol + "'",
                symbolToken
            );
        }
    } else if (group.isFunction) {
        // ^ and _ have a greediness, so handle interactions with functions'
        // greediness
        var funcGreediness = functions[group.result].greediness;
        if (funcGreediness > SUPSUB_GREEDINESS) {
            return this.parseFunction(group);
        } else {
            throw new ParseError(
                "Got function '" + group.result + "' with no arguments " +
                    "as " + name, symbolToken);
        }
    } else {
        return group.result;
    }
};

/**
 * Converts the textual input of an unsupported command into a text node
 * contained within a color node whose color is determined by errorColor
 */
Parser.prototype.handleUnsupportedCmd = function() {
    var text = this.nextToken.text;
    var textordArray = [];

    for (var i = 0; i < text.length; i++) {
        textordArray.push(new ParseNode("textord", text[i], "text"));
    }

    var textNode = new ParseNode(
        "text",
        {
            body: textordArray,
            type: "text"
        },
        this.mode);

    var colorNode = new ParseNode(
        "color",
        {
            color: this.settings.errorColor,
            value: [textNode],
            type: "color"
        },
        this.mode);

    this.consume();
    return colorNode;
};

/**
 * Parses a group with optional super/subscripts.
 *
 * @return {?ParseNode}
 */
Parser.prototype.parseAtom = function() {
    // The body of an atom is an implicit group, so that things like
    // \left(x\right)^2 work correctly.
    var base = this.parseImplicitGroup();

    // In text mode, we don't have superscripts or subscripts
    if (this.mode === "text") {
        return base;
    }

    // Note that base may be empty (i.e. null) at this point.

    var superscript;
    var subscript;
    while (true) {
        // Lex the first token
        var lex = this.nextToken;

        if (lex.text === "\\limits" || lex.text === "\\nolimits") {
            // We got a limit control
            if (!base || base.type !== "op") {
                throw new ParseError(
                    "Limit controls must follow a math operator",
                    lex);
            } else {
                var limits = lex.text === "\\limits";
                base.value.limits = limits;
                base.value.alwaysHandleSupSub = true;
            }
            this.consume();
        } else if (lex.text === "^") {
            // We got a superscript start
            if (superscript) {
                throw new ParseError("Double superscript", lex);
            }
            superscript = this.handleSupSubscript("superscript");
        } else if (lex.text === "_") {
            // We got a subscript start
            if (subscript) {
                throw new ParseError("Double subscript", lex);
            }
            subscript = this.handleSupSubscript("subscript");
        } else if (lex.text === "'") {
            // We got a prime
            var prime = new ParseNode("textord", "\\prime", this.mode);

            // Many primes can be grouped together, so we handle this here
            var primes = [prime];
            this.consume();
            // Keep lexing tokens until we get something that's not a prime
            while (this.nextToken.text === "'") {
                // For each one, add another prime to the list
                primes.push(prime);
                this.consume();
            }
            // Put them into an ordgroup as the superscript
            superscript = new ParseNode("ordgroup", primes, this.mode);
        } else {
            // If it wasn't ^, _, or ', stop parsing super/subscripts
            break;
        }
    }

    if (superscript || subscript) {
        // If we got either a superscript or subscript, create a supsub
        return new ParseNode("supsub", {
            base: base,
            sup: superscript,
            sub: subscript
        }, this.mode);
    } else {
        // Otherwise return the original body
        return base;
    }
};

// A list of the size-changing functions, for use in parseImplicitGroup
var sizeFuncs = [
    "\\tiny", "\\scriptsize", "\\footnotesize", "\\small", "\\normalsize",
    "\\large", "\\Large", "\\LARGE", "\\huge", "\\Huge"
];

// A list of the style-changing functions, for use in parseImplicitGroup
var styleFuncs = [
    "\\displaystyle", "\\textstyle", "\\scriptstyle", "\\scriptscriptstyle"
];

/**
 * Parses an implicit group, which is a group that starts at the end of a
 * specified, and ends right before a higher explicit group ends, or at EOL. It
 * is used for functions that appear to affect the current style, like \Large or
 * \textrm, where instead of keeping a style we just pretend that there is an
 * implicit grouping after it until the end of the group. E.g.
 *   small text {\Large large text} small text again
 * It is also used for \left and \right to get the correct grouping.
 *
 * @return {?ParseNode}
 */
Parser.prototype.parseImplicitGroup = function() {
    var start = this.parseSymbol();

    if (start == null) {
        // If we didn't get anything we handle, fall back to parseFunction
        return this.parseFunction();
    }

    var func = start.result;
    var body;

    if (func === "\\left") {
        // If we see a left:
        // Parse the entire left function (including the delimiter)
        var left = this.parseFunction(start);
        // Parse out the implicit body
        ++this.leftrightDepth;
        body = this.parseExpression(false);
        --this.leftrightDepth;
        // Check the next token
        this.expect("\\right", false);
        var right = this.parseFunction();
        return new ParseNode("leftright", {
            body: body,
            left: left.value.value,
            right: right.value.value
        }, this.mode);
    } else if (func === "\\begin") {
        // begin...end is similar to left...right
        var begin = this.parseFunction(start);
        var envName = begin.value.name;
        if (!environments.hasOwnProperty(envName)) {
            throw new ParseError(
                "No such environment: " + envName, begin.value.nameGroup);
        }
        // Build the environment object. Arguments and other information will
        // be made available to the begin and end methods using properties.
        var env = environments[envName];
        var args = this.parseArguments("\\begin{" + envName + "}", env);
        var context = {
            mode: this.mode,
            envName: envName,
            parser: this,
            positions: args.pop()
        };
        var result = env.handler(context, args);
        this.expect("\\end", false);
        var endNameToken = this.nextToken;
        var end = this.parseFunction();
        if (end.value.name !== envName) {
            throw new ParseError(
                "Mismatch: \\begin{" + envName + "} matched " +
                "by \\end{" + end.value.name + "}",
                endNameToken);
        }
        result.position = end.position;
        return result;
    } else if (utils.contains(sizeFuncs, func)) {
        // If we see a sizing function, parse out the implict body
        body = this.parseExpression(false);
        return new ParseNode("sizing", {
            // Figure out what size to use based on the list of functions above
            size: "size" + (utils.indexOf(sizeFuncs, func) + 1),
            value: body
        }, this.mode);
    } else if (utils.contains(styleFuncs, func)) {
        // If we see a styling function, parse out the implict body
        body = this.parseExpression(true);
        return new ParseNode("styling", {
            // Figure out what style to use by pulling out the style from
            // the function name
            style: func.slice(1, func.length - 5),
            value: body
        }, this.mode);
    } else {
        // Defer to parseFunction if it's not a function we handle
        return this.parseFunction(start);
    }
};

/**
 * Parses an entire function, including its base and all of its arguments.
 * The base might either have been parsed already, in which case
 * it is provided as an argument, or it's the next group in the input.
 *
 * @param {ParseFuncOrArgument=} baseGroup optional as described above
 * @return {?ParseNode}
 */
Parser.prototype.parseFunction = function(baseGroup) {
    if (!baseGroup) {
        baseGroup = this.parseGroup();
    }

    if (baseGroup) {
        if (baseGroup.isFunction) {
            var func = baseGroup.result;
            var funcData = functions[func];
            if (this.mode === "text" && !funcData.allowedInText) {
                throw new ParseError(
                    "Can't use function '" + func + "' in text mode",
                    baseGroup.token);
            }

            var args = this.parseArguments(func, funcData);
            var token = baseGroup.token;
            var result = this.callFunction(func, args, args.pop(), token);
            return new ParseNode(result.type, result, this.mode);
        } else {
            return baseGroup.result;
        }
    } else {
        return null;
    }
};

/**
 * Call a function handler with a suitable context and arguments.
 */
Parser.prototype.callFunction = function(name, args, positions, token) {
    var context = {
        funcName: name,
        parser: this,
        positions: positions,
        token: token
    };
    return functions[name].handler(context, args);
};

/**
 * Parses the arguments of a function or environment
 *
 * @param {string} func  "\name" or "\begin{name}"
 * @param {{numArgs:number,numOptionalArgs:number|undefined}} funcData
 * @return the array of arguments, with the list of positions as last element
 */
Parser.prototype.parseArguments = function(func, funcData) {
    var totalArgs = funcData.numArgs + funcData.numOptionalArgs;
    if (totalArgs === 0) {
        return [[this.pos]];
    }

    var baseGreediness = funcData.greediness;
    var positions = [this.pos];
    var args = [];

    for (var i = 0; i < totalArgs; i++) {
        var nextToken = this.nextToken;
        var argType = funcData.argTypes && funcData.argTypes[i];
        var arg;
        if (i < funcData.numOptionalArgs) {
            if (argType) {
                arg = this.parseGroupOfType(argType, true);
            } else {
                arg = this.parseGroup(true);
            }
            if (!arg) {
                args.push(null);
                positions.push(this.pos);
                continue;
            }
        } else {
            if (argType) {
                arg = this.parseGroupOfType(argType);
            } else {
                arg = this.parseGroup();
            }
            if (!arg) {
                if (!this.settings.throwOnError &&
                    this.nextToken.text[0] === "\\") {
                    arg = new ParseFuncOrArgument(
                        this.handleUnsupportedCmd(this.nextToken.text),
                        false);
                } else {
                    throw new ParseError(
                        "Expected group after '" + func + "'", nextToken);
                }
            }
        }
        var argNode;
        if (arg.isFunction) {
            var argGreediness =
                functions[arg.result].greediness;
            if (argGreediness > baseGreediness) {
                argNode = this.parseFunction(arg);
            } else {
                throw new ParseError(
                    "Got function '" + arg.result + "' as " +
                    "argument to '" + func + "'", nextToken);
            }
        } else {
            argNode = arg.result;
        }
        args.push(argNode);
        positions.push(this.pos);
    }

    args.push(positions);

    return args;
};


/**
 * Parses a group when the mode is changing.
 *
 * @return {?ParseFuncOrArgument}
 */
Parser.prototype.parseGroupOfType = function(innerMode, optional) {
    var outerMode = this.mode;
    // Handle `original` argTypes
    if (innerMode === "original") {
        innerMode = outerMode;
    }

    if (innerMode === "color") {
        return this.parseColorGroup(optional);
    }
    if (innerMode === "size") {
        return this.parseSizeGroup(optional);
    }

    this.switchMode(innerMode);
    if (innerMode === "text") {
        // text mode is special because it should ignore the whitespace before
        // it
        while (this.nextToken.text === " ") {
            this.consume();
        }
    }
    // By the time we get here, innerMode is one of "text" or "math".
    // We switch the mode of the parser, recurse, then restore the old mode.
    var res = this.parseGroup(optional);
    this.switchMode(outerMode);
    return res;
};

/**
 * Parses a group, essentially returning the string formed by the
 * brace-enclosed tokens plus some position information.
 *
 * @param {string} modeName  Used to describe the mode in error messages
 * @param {boolean=} optional  Whether the group is optional or required
 */
Parser.prototype.parseStringGroup = function(modeName, optional) {
    if (optional && this.nextToken.text !== "[") {
        return null;
    }
    var outerMode = this.mode;
    this.mode = "text";
    this.expect(optional ? "[" : "{");
    var str = "";
    var firstToken = this.nextToken;
    var lastToken = firstToken;
    while (this.nextToken.text !== (optional ? "]" : "}")) {
        if (this.nextToken.text === "EOF") {
            throw new ParseError(
                "Unexpected end of input in " + modeName,
                firstToken.range(this.nextToken, str));
        }
        lastToken = this.nextToken;
        str += lastToken.text;
        this.consume();
    }
    this.mode = outerMode;
    this.expect(optional ? "]" : "}");
    return firstToken.range(lastToken, str);
};

/**
 * Parses a regex-delimited group: the largest sequence of tokens
 * whose concatenated strings match `regex`. Returns the string
 * formed by the tokens plus some position information.
 *
 * @param {RegExp} regex
 * @param {string} modeName  Used to describe the mode in error messages
 */
Parser.prototype.parseRegexGroup = function(regex, modeName) {
    var outerMode = this.mode;
    this.mode = "text";
    var firstToken = this.nextToken;
    var lastToken = firstToken;
    var str = "";
    while (this.nextToken.text !== "EOF"
           && regex.test(str + this.nextToken.text)) {
        lastToken = this.nextToken;
        str += lastToken.text;
        this.consume();
    }
    if (str === "") {
        throw new ParseError(
            "Invalid " + modeName + ": '" + firstToken.text + "'",
            firstToken);
    }
    this.mode = outerMode;
    return firstToken.range(lastToken, str);
};

/**
 * Parses a color description.
 */
Parser.prototype.parseColorGroup = function(optional) {
    var res = this.parseStringGroup("color", optional);
    if (!res) {
        return null;
    }
    var match = (/^(#[a-z0-9]+|[a-z]+)$/i).exec(res.text);
    if (!match) {
        throw new ParseError("Invalid color: '" + res.text + "'", res);
    }
    return new ParseFuncOrArgument(
        new ParseNode("color", match[0], this.mode),
        false);
};

/**
 * Parses a size specification, consisting of magnitude and unit.
 */
Parser.prototype.parseSizeGroup = function(optional) {
    var res;
    if (!optional && this.nextToken.text !== "{") {
        res = this.parseRegexGroup(
            /^[-+]? *(?:$|\d+|\d+\.\d*|\.\d*) *[a-z]{0,2}$/, "size");
    } else {
        res = this.parseStringGroup("size", optional);
    }
    if (!res) {
        return null;
    }
    var match = (/([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/).exec(res.text);
    if (!match) {
        throw new ParseError("Invalid size: '" + res.text + "'", res);
    }
    var data = {
        number: +(match[1] + match[2]), // sign + magnitude, cast to number
        unit: match[3]
    };
    if (data.unit !== "em" && data.unit !== "ex" && data.unit !== "mu") {
        throw new ParseError("Invalid unit: '" + data.unit + "'", res);
    }
    return new ParseFuncOrArgument(
        new ParseNode("color", data, this.mode),
        false);
};

/**
 * If the argument is false or absent, this parses an ordinary group,
 * which is either a single nucleus (like "x") or an expression
 * in braces (like "{x+y}").
 * If the argument is true, it parses either a bracket-delimited expression
 * (like "[x+y]") or returns null to indicate the absence of a
 * bracket-enclosed group.
 *
 * @param {boolean=} optional  Whether the group is optional or required
 * @return {?ParseFuncOrArgument}
 */
Parser.prototype.parseGroup = function(optional) {
    var firstToken = this.nextToken;
    // Try to parse an open brace
    if (this.nextToken.text === (optional ? "[" : "{")) {
        // If we get a brace, parse an expression
        this.consume();
        var expression = this.parseExpression(false, optional ? "]" : null);
        var lastToken = this.nextToken;
        // Make sure we get a close brace
        this.expect(optional ? "]" : "}");
        if (this.mode === "text") {
            this.formLigatures(expression);
        }
        return new ParseFuncOrArgument(
            new ParseNode("ordgroup", expression, this.mode,
                          firstToken, lastToken),
            false);
    } else {
        // Otherwise, just return a nucleus, or nothing for an optional group
        return optional ? null : this.parseSymbol();
    }
};

/**
 * Form ligature-like combinations of characters for text mode.
 * This includes inputs like "--", "---", "``" and "''".
 * The result will simply replace multiple textord nodes with a single
 * character in each value by a single textord node having multiple
 * characters in its value.  The representation is still ASCII source.
 *
 * @param {Array.<ParseNode>} group  the nodes of this group,
 *                                   list will be moified in place
 */
Parser.prototype.formLigatures = function(group) {
    var i;
    var n = group.length - 1;
    for (i = 0; i < n; ++i) {
        var a = group[i];
        var v = a.value;
        if (v === "-" && group[i + 1].value === "-") {
            if (i + 1 < n && group[i + 2].value === "-") {
                group.splice(i, 3, new ParseNode(
                    "textord", "---", "text", a, group[i + 2]));
                n -= 2;
            } else {
                group.splice(i, 2, new ParseNode(
                    "textord", "--", "text", a, group[i + 1]));
                n -= 1;
            }
        }
        if ((v === "'" || v === "`") && group[i + 1].value === v) {
            group.splice(i, 2, new ParseNode(
                "textord", v + v, "text", a, group[i + 1]));
            n -= 1;
        }
    }
};

/**
 * Parse a single symbol out of the string. Here, we handle both the functions
 * we have defined, as well as the single character symbols
 *
 * @return {?ParseFuncOrArgument}
 */
Parser.prototype.parseSymbol = function() {
    var nucleus = this.nextToken;

    if (functions[nucleus.text]) {
        this.consume();
        // If there exists a function with this name, we return the function and
        // say that it is a function.
        return new ParseFuncOrArgument(
            nucleus.text,
            true, nucleus);
    } else if (symbols[this.mode][nucleus.text]) {
        this.consume();
        // Otherwise if this is a no-argument function, find the type it
        // corresponds to in the symbols map
        return new ParseFuncOrArgument(
            new ParseNode(symbols[this.mode][nucleus.text].group,
                          nucleus.text, this.mode, nucleus),
            false, nucleus);
    } else if (this.mode === "text" && cjkRegex.test(nucleus.text)) {
        this.consume();
        return new ParseFuncOrArgument(
            new ParseNode("textord", nucleus.text, this.mode, nucleus),
            false, nucleus);
    } else {
        return null;
    }
};

Parser.prototype.ParseNode = ParseNode;

module.exports = Parser;

},{"./MacroExpander":4,"./ParseError":6,"./environments":16,"./functions":19,"./parseData":21,"./symbols":23,"./unicodeRegexes":24,"./utils":25}],8:[function(require,module,exports){
/**
 * This is a module for storing settings passed into KaTeX. It correctly handles
 * default settings.
 */

/**
 * Helper function for getting a default value if the value is undefined
 */
function get(option, defaultValue) {
    return option === undefined ? defaultValue : option;
}

/**
 * The main Settings object
 *
 * The current options stored are:
 *  - displayMode: Whether the expression should be typeset by default in
 *                 textstyle or displaystyle (default false)
 */
function Settings(options) {
    // allow null options
    options = options || {};
    this.displayMode = get(options.displayMode, false);
    this.throwOnError = get(options.throwOnError, true);
    this.errorColor = get(options.errorColor, "#cc0000");
    this.macros = options.macros || {};
}

module.exports = Settings;

},{}],9:[function(require,module,exports){
/**
 * This file contains information and classes for the various kinds of styles
 * used in TeX. It provides a generic `Style` class, which holds information
 * about a specific style. It then provides instances of all the different kinds
 * of styles possible, and provides functions to move between them and get
 * information about them.
 */

var sigmas = require("./fontMetrics.js").sigmas;

var metrics = [{}, {}, {}];
var i;
for (var key in sigmas) {
    if (sigmas.hasOwnProperty(key)) {
        for (i = 0; i < 3; i++) {
            metrics[i][key] = sigmas[key][i];
        }
    }
}
for (i = 0; i < 3; i++) {
    metrics[i].emPerEx = sigmas.xHeight[i] / sigmas.quad[i];
}

/**
 * The main style class. Contains a unique id for the style, a size (which is
 * the same for cramped and uncramped version of a style), a cramped flag, and a
 * size multiplier, which gives the size difference between a style and
 * textstyle.
 */
function Style(id, size, multiplier, cramped) {
    this.id = id;
    this.size = size;
    this.cramped = cramped;
    this.sizeMultiplier = multiplier;
    this.metrics = metrics[size > 0 ? size - 1 : 0];
}

/**
 * Get the style of a superscript given a base in the current style.
 */
Style.prototype.sup = function() {
    return styles[sup[this.id]];
};

/**
 * Get the style of a subscript given a base in the current style.
 */
Style.prototype.sub = function() {
    return styles[sub[this.id]];
};

/**
 * Get the style of a fraction numerator given the fraction in the current
 * style.
 */
Style.prototype.fracNum = function() {
    return styles[fracNum[this.id]];
};

/**
 * Get the style of a fraction denominator given the fraction in the current
 * style.
 */
Style.prototype.fracDen = function() {
    return styles[fracDen[this.id]];
};

/**
 * Get the cramped version of a style (in particular, cramping a cramped style
 * doesn't change the style).
 */
Style.prototype.cramp = function() {
    return styles[cramp[this.id]];
};

/**
 * HTML class name, like "displaystyle cramped"
 */
Style.prototype.cls = function() {
    return sizeNames[this.size] + (this.cramped ? " cramped" : " uncramped");
};

/**
 * HTML Reset class name, like "reset-textstyle"
 */
Style.prototype.reset = function() {
    return resetNames[this.size];
};

/**
 * Return if this style is tightly spaced (scriptstyle/scriptscriptstyle)
 */
Style.prototype.isTight = function() {
    return this.size >= 2;
};

// IDs of the different styles
var D = 0;
var Dc = 1;
var T = 2;
var Tc = 3;
var S = 4;
var Sc = 5;
var SS = 6;
var SSc = 7;

// String names for the different sizes
var sizeNames = [
    "displaystyle textstyle",
    "textstyle",
    "scriptstyle",
    "scriptscriptstyle"
];

// Reset names for the different sizes
var resetNames = [
    "reset-textstyle",
    "reset-textstyle",
    "reset-scriptstyle",
    "reset-scriptscriptstyle"
];

// Instances of the different styles
var styles = [
    new Style(D, 0, 1.0, false),
    new Style(Dc, 0, 1.0, true),
    new Style(T, 1, 1.0, false),
    new Style(Tc, 1, 1.0, true),
    new Style(S, 2, 0.7, false),
    new Style(Sc, 2, 0.7, true),
    new Style(SS, 3, 0.5, false),
    new Style(SSc, 3, 0.5, true)
];

// Lookup tables for switching from one style to another
var sup = [S, Sc, S, Sc, SS, SSc, SS, SSc];
var sub = [Sc, Sc, Sc, Sc, SSc, SSc, SSc, SSc];
var fracNum = [T, Tc, S, Sc, SS, SSc, SS, SSc];
var fracDen = [Tc, Tc, Sc, Sc, SSc, SSc, SSc, SSc];
var cramp = [Dc, Dc, Tc, Tc, Sc, Sc, SSc, SSc];

// We only export some of the styles. Also, we don't export the `Style` class so
// no more styles can be generated.
module.exports = {
    DISPLAY: styles[D],
    TEXT: styles[T],
    SCRIPT: styles[S],
    SCRIPTSCRIPT: styles[SS]
};

},{"./fontMetrics.js":17}],10:[function(require,module,exports){
/* eslint no-console:0 */
/**
 * This module contains general functions that can be used for building
 * different kinds of domTree nodes in a consistent manner.
 */

var domTree = require("./domTree");
var fontMetrics = require("./fontMetrics");
var symbols = require("./symbols");
var utils = require("./utils");

var greekCapitals = [
    "\\Gamma",
    "\\Delta",
    "\\Theta",
    "\\Lambda",
    "\\Xi",
    "\\Pi",
    "\\Sigma",
    "\\Upsilon",
    "\\Phi",
    "\\Psi",
    "\\Omega"
];

// The following have to be loaded from Main-Italic font, using class mainit
var mainitLetters = [
    "\u0131",   // dotless i, \imath
    "\u0237",   // dotless j, \jmath
    "\u00a3"   // \pounds
];

/**
 * Makes a symbolNode after translation via the list of symbols in symbols.js.
 * Correctly pulls out metrics for the character, and optionally takes a list of
 * classes to be attached to the node.
 *
 * TODO: make argument order closer to makeSpan
 * TODO: add a separate argument for math class (e.g. `mop`, `mbin`), which
 * should if present come first in `classes`.
 */
var makeSymbol = function(value, fontFamily, mode, options, classes) {
    // Replace the value with its replaced value from symbol.js
    if (symbols[mode][value] && symbols[mode][value].replace) {
        value = symbols[mode][value].replace;
    }

    var metrics = fontMetrics.getCharacterMetrics(value, fontFamily);

    var symbolNode;
    if (metrics) {
        var italic = metrics.italic;
        if (mode === "text") {
            italic = 0;
        }
        symbolNode = new domTree.symbolNode(
            value, metrics.height, metrics.depth, italic, metrics.skew,
            classes);
    } else {
        // TODO(emily): Figure out a good way to only print this in development
        typeof console !== "undefined" && console.warn(
            "No character metrics for '" + value + "' in style '" +
                fontFamily + "'");
        symbolNode = new domTree.symbolNode(value, 0, 0, 0, 0, classes);
    }

    if (options) {
        if (options.style.isTight()) {
            symbolNode.classes.push("mtight");
        }
        if (options.getColor()) {
            symbolNode.style.color = options.getColor();
        }
    }

    return symbolNode;
};

/**
 * Makes a symbol in Main-Regular or AMS-Regular.
 * Used for rel, bin, open, close, inner, and punct.
 */
var mathsym = function(value, mode, options, classes) {
    // Decide what font to render the symbol in by its entry in the symbols
    // table.
    // Have a special case for when the value = \ because the \ is used as a
    // textord in unsupported command errors but cannot be parsed as a regular
    // text ordinal and is therefore not present as a symbol in the symbols
    // table for text
    if (value === "\\" || symbols[mode][value].font === "main") {
        return makeSymbol(value, "Main-Regular", mode, options, classes);
    } else {
        return makeSymbol(
            value, "AMS-Regular", mode, options, classes.concat(["amsrm"]));
    }
};

/**
 * Makes a symbol in the default font for mathords and textords.
 */
var mathDefault = function(value, mode, options, classes, type) {
    if (type === "mathord") {
        return mathit(value, mode, options, classes);
    } else if (type === "textord") {
        return makeSymbol(
            value, "Main-Regular", mode, options, classes.concat(["mathrm"]));
    } else {
        throw new Error("unexpected type: " + type + " in mathDefault");
    }
};

/**
 * Makes a symbol in the italic math font.
 */
var mathit = function(value, mode, options, classes) {
    if (/[0-9]/.test(value.charAt(0)) ||
            // glyphs for \imath and \jmath do not exist in Math-Italic so we
            // need to use Main-Italic instead
            utils.contains(mainitLetters, value) ||
            utils.contains(greekCapitals, value)) {
        return makeSymbol(
            value, "Main-Italic", mode, options, classes.concat(["mainit"]));
    } else {
        return makeSymbol(
            value, "Math-Italic", mode, options, classes.concat(["mathit"]));
    }
};

/**
 * Makes either a mathord or textord in the correct font and color.
 */
var makeOrd = function(group, options, type) {
    var mode = group.mode;
    var value = group.value;
    if (symbols[mode][value] && symbols[mode][value].replace) {
        value = symbols[mode][value].replace;
    }

    var classes = ["mord"];

    var font = options.font;
    if (font) {
        if (font === "mathit" || utils.contains(mainitLetters, value)) {
            return mathit(value, mode, options, classes);
        } else {
            var fontName = fontMap[font].fontName;
            if (fontMetrics.getCharacterMetrics(value, fontName)) {
                return makeSymbol(
                    value, fontName, mode, options, classes.concat([font]));
            } else {
                return mathDefault(value, mode, options, classes, type);
            }
        }
    } else {
        return mathDefault(value, mode, options, classes, type);
    }
};

/**
 * Calculate the height, depth, and maxFontSize of an element based on its
 * children.
 */
var sizeElementFromChildren = function(elem) {
    var height = 0;
    var depth = 0;
    var maxFontSize = 0;

    if (elem.children) {
        for (var i = 0; i < elem.children.length; i++) {
            if (elem.children[i].height > height) {
                height = elem.children[i].height;
            }
            if (elem.children[i].depth > depth) {
                depth = elem.children[i].depth;
            }
            if (elem.children[i].maxFontSize > maxFontSize) {
                maxFontSize = elem.children[i].maxFontSize;
            }
        }
    }

    elem.height = height;
    elem.depth = depth;
    elem.maxFontSize = maxFontSize;
};

/**
 * Makes a span with the given list of classes, list of children, and options.
 *
 * TODO: Ensure that `options` is always provided (currently some call sites
 * don't pass it).
 * TODO: add a separate argument for math class (e.g. `mop`, `mbin`), which
 * should if present come first in `classes`.
 */
var makeSpan = function(classes, children, options) {
    var span = new domTree.span(classes, children, options);

    sizeElementFromChildren(span);

    return span;
};

/**
 * Prepends the given children to the given span, updating height, depth, and
 * maxFontSize.
 */
var prependChildren = function(span, children) {
    span.children = children.concat(span.children);

    sizeElementFromChildren(span);
};

/**
 * Makes a document fragment with the given list of children.
 */
var makeFragment = function(children) {
    var fragment = new domTree.documentFragment(children);

    sizeElementFromChildren(fragment);

    return fragment;
};

/**
 * Makes an element placed in each of the vlist elements to ensure that each
 * element has the same max font size. To do this, we create a zero-width space
 * with the correct font size.
 */
var makeFontSizer = function(options, fontSize) {
    var fontSizeInner = makeSpan([], [new domTree.symbolNode("\u200b")]);
    fontSizeInner.style.fontSize =
        (fontSize / options.style.sizeMultiplier) + "em";

    var fontSizer = makeSpan(
        ["fontsize-ensurer", "reset-" + options.size, "size5"],
        [fontSizeInner]);

    return fontSizer;
};

/**
 * Makes a vertical list by stacking elements and kerns on top of each other.
 * Allows for many different ways of specifying the positioning method.
 *
 * Arguments:
 *  - children: A list of child or kern nodes to be stacked on top of each other
 *              (i.e. the first element will be at the bottom, and the last at
 *              the top). Element nodes are specified as
 *                {type: "elem", elem: node}
 *              while kern nodes are specified as
 *                {type: "kern", size: size}
 *  - positionType: The method by which the vlist should be positioned. Valid
 *                  values are:
 *                   - "individualShift": The children list only contains elem
 *                                        nodes, and each node contains an extra
 *                                        "shift" value of how much it should be
 *                                        shifted (note that shifting is always
 *                                        moving downwards). positionData is
 *                                        ignored.
 *                   - "top": The positionData specifies the topmost point of
 *                            the vlist (note this is expected to be a height,
 *                            so positive values move up)
 *                   - "bottom": The positionData specifies the bottommost point
 *                               of the vlist (note this is expected to be a
 *                               depth, so positive values move down
 *                   - "shift": The vlist will be positioned such that its
 *                              baseline is positionData away from the baseline
 *                              of the first child. Positive values move
 *                              downwards.
 *                   - "firstBaseline": The vlist will be positioned such that
 *                                      its baseline is aligned with the
 *                                      baseline of the first child.
 *                                      positionData is ignored. (this is
 *                                      equivalent to "shift" with
 *                                      positionData=0)
 *  - positionData: Data used in different ways depending on positionType
 *  - options: An Options object
 *
 */
var makeVList = function(children, positionType, positionData, options) {
    var depth;
    var currPos;
    var i;
    if (positionType === "individualShift") {
        var oldChildren = children;
        children = [oldChildren[0]];

        // Add in kerns to the list of children to get each element to be
        // shifted to the correct specified shift
        depth = -oldChildren[0].shift - oldChildren[0].elem.depth;
        currPos = depth;
        for (i = 1; i < oldChildren.length; i++) {
            var diff = -oldChildren[i].shift - currPos -
                oldChildren[i].elem.depth;
            var size = diff -
                (oldChildren[i - 1].elem.height +
                 oldChildren[i - 1].elem.depth);

            currPos = currPos + diff;

            children.push({type: "kern", size: size});
            children.push(oldChildren[i]);
        }
    } else if (positionType === "top") {
        // We always start at the bottom, so calculate the bottom by adding up
        // all the sizes
        var bottom = positionData;
        for (i = 0; i < children.length; i++) {
            if (children[i].type === "kern") {
                bottom -= children[i].size;
            } else {
                bottom -= children[i].elem.height + children[i].elem.depth;
            }
        }
        depth = bottom;
    } else if (positionType === "bottom") {
        depth = -positionData;
    } else if (positionType === "shift") {
        depth = -children[0].elem.depth - positionData;
    } else if (positionType === "firstBaseline") {
        depth = -children[0].elem.depth;
    } else {
        depth = 0;
    }

    // Make the fontSizer
    var maxFontSize = 0;
    for (i = 0; i < children.length; i++) {
        if (children[i].type === "elem") {
            maxFontSize = Math.max(maxFontSize, children[i].elem.maxFontSize);
        }
    }
    var fontSizer = makeFontSizer(options, maxFontSize);

    // Create a new list of actual children at the correct offsets
    var realChildren = [];
    currPos = depth;
    for (i = 0; i < children.length; i++) {
        if (children[i].type === "kern") {
            currPos += children[i].size;
        } else {
            var child = children[i].elem;

            var shift = -child.depth - currPos;
            currPos += child.height + child.depth;

            var childWrap = makeSpan([], [fontSizer, child]);
            childWrap.height -= shift;
            childWrap.depth += shift;
            childWrap.style.top = shift + "em";

            realChildren.push(childWrap);
        }
    }

    // Add in an element at the end with no offset to fix the calculation of
    // baselines in some browsers (namely IE, sometimes safari)
    var baselineFix = makeSpan(
        ["baseline-fix"], [fontSizer, new domTree.symbolNode("\u200b")]);
    realChildren.push(baselineFix);

    var vlist = makeSpan(["vlist"], realChildren);
    // Fix the final height and depth, in case there were kerns at the ends
    // since the makeSpan calculation won't take that in to account.
    vlist.height = Math.max(currPos, vlist.height);
    vlist.depth = Math.max(-depth, vlist.depth);
    return vlist;
};

// A table of size -> font size for the different sizing functions
var sizingMultiplier = {
    size1: 0.5,
    size2: 0.7,
    size3: 0.8,
    size4: 0.9,
    size5: 1.0,
    size6: 1.2,
    size7: 1.44,
    size8: 1.73,
    size9: 2.07,
    size10: 2.49
};

// A map of spacing functions to their attributes, like size and corresponding
// CSS class
var spacingFunctions = {
    "\\qquad": {
        size: "2em",
        className: "qquad"
    },
    "\\quad": {
        size: "1em",
        className: "quad"
    },
    "\\enspace": {
        size: "0.5em",
        className: "enspace"
    },
    "\\;": {
        size: "0.277778em",
        className: "thickspace"
    },
    "\\:": {
        size: "0.22222em",
        className: "mediumspace"
    },
    "\\,": {
        size: "0.16667em",
        className: "thinspace"
    },
    "\\!": {
        size: "-0.16667em",
        className: "negativethinspace"
    }
};

/**
 * Maps TeX font commands to objects containing:
 * - variant: string used for "mathvariant" attribute in buildMathML.js
 * - fontName: the "style" parameter to fontMetrics.getCharacterMetrics
 */
// A map between tex font commands an MathML mathvariant attribute values
var fontMap = {
    // styles
    "mathbf": {
        variant: "bold",
        fontName: "Main-Bold"
    },
    "mathrm": {
        variant: "normal",
        fontName: "Main-Regular"
    },
    "textit": {
        variant: "italic",
        fontName: "Main-Italic"
    },

    // "mathit" is missing because it requires the use of two fonts: Main-Italic
    // and Math-Italic.  This is handled by a special case in makeOrd which ends
    // up calling mathit.

    // families
    "mathbb": {
        variant: "double-struck",
        fontName: "AMS-Regular"
    },
    "mathcal": {
        variant: "script",
        fontName: "Caligraphic-Regular"
    },
    "mathfrak": {
        variant: "fraktur",
        fontName: "Fraktur-Regular"
    },
    "mathscr": {
        variant: "script",
        fontName: "Script-Regular"
    },
    "mathsf": {
        variant: "sans-serif",
        fontName: "SansSerif-Regular"
    },
    "mathtt": {
        variant: "monospace",
        fontName: "Typewriter-Regular"
    }
};

module.exports = {
    fontMap: fontMap,
    makeSymbol: makeSymbol,
    mathsym: mathsym,
    makeSpan: makeSpan,
    makeFragment: makeFragment,
    makeVList: makeVList,
    makeOrd: makeOrd,
    prependChildren: prependChildren,
    sizingMultiplier: sizingMultiplier,
    spacingFunctions: spacingFunctions
};

},{"./domTree":15,"./fontMetrics":17,"./symbols":23,"./utils":25}],11:[function(require,module,exports){
/* eslint no-console:0 */
/**
 * This file does the main work of building a domTree structure from a parse
 * tree. The entry point is the `buildHTML` function, which takes a parse tree.
 * Then, the buildExpression, buildGroup, and various groupTypes functions are
 * called, to produce a final HTML tree.
 */

var ParseError = require("./ParseError");
var Style = require("./Style");

var buildCommon = require("./buildCommon");
var delimiter = require("./delimiter");
var domTree = require("./domTree");
var fontMetrics = require("./fontMetrics");
var utils = require("./utils");

var makeSpan = buildCommon.makeSpan;

var isSpace = function(node) {
    return node instanceof domTree.span && node.classes[0] === "mspace";
};

// Binary atoms (first class `mbin`) change into ordinary atoms (`mord`)
// depending on their surroundings. See TeXbook pg. 442-446, Rules 5 and 6,
// and the text before Rule 19.

var isBin = function(node) {
    return node && node.classes[0] === "mbin";
};

var isBinLeftCanceller = function(node, isRealGroup) {
    // TODO: This code assumes that a node's math class is the first element
    // of its `classes` array. A later cleanup should ensure this, for
    // instance by changing the signature of `makeSpan`.
    if (node) {
        return utils.contains(["mbin", "mopen", "mrel", "mop", "mpunct"],
                              node.classes[0]);
    } else {
        return isRealGroup;
    }
};

var isBinRightCanceller = function(node, isRealGroup) {
    if (node) {
        return utils.contains(["mrel", "mclose", "mpunct"], node.classes[0]);
    } else {
        return isRealGroup;
    }
};

/**
 * Take a list of nodes, build them in order, and return a list of the built
 * nodes. documentFragments are flattened into their contents, so the
 * returned list contains no fragments. `isRealGroup` is true if `expression`
 * is a real group (no atoms will be added on either side), as opposed to
 * a partial group (e.g. one created by \color).
 */
var buildExpression = function(expression, options, isRealGroup) {
    // Parse expressions into `groups`.
    var groups = [];
    for (var i = 0; i < expression.length; i++) {
        var group = expression[i];
        var output = buildGroup(group, options);
        if (output instanceof domTree.documentFragment) {
            Array.prototype.push.apply(groups, output.children);
        } else {
            groups.push(output);
        }
    }
    // At this point `groups` consists entirely of `symbolNode`s and `span`s.

    // Explicit spaces (e.g., \;, \,) should be ignored with respect to atom
    // spacing (e.g., "add thick space between mord and mrel"). Since CSS
    // adjacency rules implement atom spacing, spaces should be invisible to
    // CSS. So we splice them out of `groups` and into the atoms themselves.
    var spaces = null;
    for (i = 0; i < groups.length; i++) {
        if (isSpace(groups[i])) {
            spaces = spaces || [];
            spaces.push(groups[i]);
            groups.splice(i, 1);
            i--;
        } else if (spaces) {
            if (groups[i] instanceof domTree.symbolNode) {
                groups[i] = makeSpan([].concat(groups[i].classes), [groups[i]]);
            }
            buildCommon.prependChildren(groups[i], spaces);
            spaces = null;
        }
    }
    if (spaces) {
        Array.prototype.push.apply(groups, spaces);
    }

    // Binary operators change to ordinary symbols in some contexts.
    for (i = 0; i < groups.length; i++) {
        if (isBin(groups[i])
            && (isBinLeftCanceller(groups[i - 1], isRealGroup)
                || isBinRightCanceller(groups[i + 1], isRealGroup))) {
            groups[i].classes[0] = "mord";
        }
    }

    return groups;
};

// Return math atom class (mclass) of a domTree.
var getTypeOfDomTree = function(node) {
    if (node instanceof domTree.documentFragment) {
        if (node.children.length) {
            return getTypeOfDomTree(
                node.children[node.children.length - 1]);
        }
    } else {
        if (utils.contains(["mord", "mop", "mbin", "mrel", "mopen", "mclose",
            "mpunct", "minner"], node.classes[0])) {
            return node.classes[0];
        }
    }
    return null;
};

/**
 * Sometimes, groups perform special rules when they have superscripts or
 * subscripts attached to them. This function lets the `supsub` group know that
 * its inner element should handle the superscripts and subscripts instead of
 * handling them itself.
 */
var shouldHandleSupSub = function(group, options) {
    if (!group) {
        return false;
    } else if (group.type === "op") {
        // Operators handle supsubs differently when they have limits
        // (e.g. `\displaystyle\sum_2^3`)
        return group.value.limits &&
            (options.style.size === Style.DISPLAY.size ||
            group.value.alwaysHandleSupSub);
    } else if (group.type === "accent") {
        return isCharacterBox(group.value.base);
    } else {
        return null;
    }
};

/**
 * Sometimes we want to pull out the innermost element of a group. In most
 * cases, this will just be the group itself, but when ordgroups and colors have
 * a single element, we want to pull that out.
 */
var getBaseElem = function(group) {
    if (!group) {
        return false;
    } else if (group.type === "ordgroup") {
        if (group.value.length === 1) {
            return getBaseElem(group.value[0]);
        } else {
            return group;
        }
    } else if (group.type === "color") {
        if (group.value.value.length === 1) {
            return getBaseElem(group.value.value[0]);
        } else {
            return group;
        }
    } else if (group.type === "font") {
        return getBaseElem(group.value.body);
    } else {
        return group;
    }
};

/**
 * TeXbook algorithms often reference "character boxes", which are simply groups
 * with a single character in them. To decide if something is a character box,
 * we find its innermost group, and see if it is a single character.
 */
var isCharacterBox = function(group) {
    var baseElem = getBaseElem(group);

    // These are all they types of groups which hold single characters
    return baseElem.type === "mathord" ||
        baseElem.type === "textord" ||
        baseElem.type === "bin" ||
        baseElem.type === "rel" ||
        baseElem.type === "inner" ||
        baseElem.type === "open" ||
        baseElem.type === "close" ||
        baseElem.type === "punct";
};

var makeNullDelimiter = function(options, classes) {
    return makeSpan(classes.concat([
        "sizing", "reset-" + options.size, "size5",
        options.style.reset(), Style.TEXT.cls(),
        "nulldelimiter"]));
};

/**
 * This is a map of group types to the function used to handle that type.
 * Simpler types come at the beginning, while complicated types come afterwards.
 */
var groupTypes = {};

groupTypes.mathord = function(group, options) {
    return buildCommon.makeOrd(group, options, "mathord");
};

groupTypes.textord = function(group, options) {
    return buildCommon.makeOrd(group, options, "textord");
};

groupTypes.bin = function(group, options) {
    return buildCommon.mathsym(
        group.value, group.mode, options, ["mbin"]);
};

groupTypes.rel = function(group, options) {
    return buildCommon.mathsym(
        group.value, group.mode, options, ["mrel"]);
};

groupTypes.open = function(group, options) {
    return buildCommon.mathsym(
        group.value, group.mode, options, ["mopen"]);
};

groupTypes.close = function(group, options) {
    return buildCommon.mathsym(
        group.value, group.mode, options, ["mclose"]);
};

groupTypes.inner = function(group, options) {
    return buildCommon.mathsym(
        group.value, group.mode, options, ["minner"]);
};

groupTypes.punct = function(group, options) {
    return buildCommon.mathsym(
        group.value, group.mode, options, ["mpunct"]);
};

groupTypes.ordgroup = function(group, options) {
    return makeSpan(
        ["mord", options.style.cls()],
        buildExpression(group.value, options.reset(), true),
        options
    );
};

groupTypes.text = function(group, options) {
    var newOptions = options.withFont(group.value.style);
    var inner = buildExpression(group.value.body, newOptions, true);
    for (var i = 0; i < inner.length - 1; i++) {
        if (inner[i].tryCombine(inner[i + 1])) {
            inner.splice(i + 1, 1);
            i--;
        }
    }
    return makeSpan(["mord", "text", newOptions.style.cls()],
        inner, newOptions);
};

groupTypes.color = function(group, options) {
    var elements = buildExpression(
        group.value.value,
        options.withColor(group.value.color),
        false
    );

    // \color isn't supposed to affect the type of the elements it contains.
    // To accomplish this, we wrap the results in a fragment, so the inner
    // elements will be able to directly interact with their neighbors. For
    // example, `\color{red}{2 +} 3` has the same spacing as `2 + 3`
    return new buildCommon.makeFragment(elements);
};

groupTypes.supsub = function(group, options) {
    // Superscript and subscripts are handled in the TeXbook on page
    // 445-446, rules 18(a-f).

    // Here is where we defer to the inner group if it should handle
    // superscripts and subscripts itself.
    if (shouldHandleSupSub(group.value.base, options)) {
        return groupTypes[group.value.base.type](group, options);
    }

    var base = buildGroup(group.value.base, options.reset());
    var supmid;
    var submid;
    var sup;
    var sub;

    var style = options.style;
    var newOptions;

    if (group.value.sup) {
        newOptions = options.withStyle(style.sup());
        sup = buildGroup(group.value.sup, newOptions);
        supmid = makeSpan([style.reset(), style.sup().cls()],
            [sup], newOptions);
    }

    if (group.value.sub) {
        newOptions = options.withStyle(style.sub());
        sub = buildGroup(group.value.sub, newOptions);
        submid = makeSpan([style.reset(), style.sub().cls()],
            [sub], newOptions);
    }

    // Rule 18a
    var supShift;
    var subShift;
    if (isCharacterBox(group.value.base)) {
        supShift = 0;
        subShift = 0;
    } else {
        supShift = base.height - style.metrics.supDrop;
        subShift = base.depth + style.metrics.subDrop;
    }

    // Rule 18c
    var minSupShift;
    if (style === Style.DISPLAY) {
        minSupShift = style.metrics.sup1;
    } else if (style.cramped) {
        minSupShift = style.metrics.sup3;
    } else {
        minSupShift = style.metrics.sup2;
    }

    // scriptspace is a font-size-independent size, so scale it
    // appropriately
    var multiplier = Style.TEXT.sizeMultiplier *
            style.sizeMultiplier;
    var scriptspace =
        (0.5 / fontMetrics.metrics.ptPerEm) / multiplier + "em";

    var supsub;
    if (!group.value.sup) {
        // Rule 18b
        subShift = Math.max(
            subShift, style.metrics.sub1,
            sub.height - 0.8 * style.metrics.xHeight);

        supsub = buildCommon.makeVList([
            {type: "elem", elem: submid}
        ], "shift", subShift, options);

        supsub.children[0].style.marginRight = scriptspace;

        // Subscripts shouldn't be shifted by the base's italic correction.
        // Account for that by shifting the subscript back the appropriate
        // amount. Note we only do this when the base is a single symbol.
        if (base instanceof domTree.symbolNode) {
            supsub.children[0].style.marginLeft = -base.italic + "em";
        }
    } else if (!group.value.sub) {
        // Rule 18c, d
        supShift = Math.max(supShift, minSupShift,
            sup.depth + 0.25 * style.metrics.xHeight);

        supsub = buildCommon.makeVList([
            {type: "elem", elem: supmid}
        ], "shift", -supShift, options);

        supsub.children[0].style.marginRight = scriptspace;
    } else {
        supShift = Math.max(
            supShift, minSupShift, sup.depth + 0.25 * style.metrics.xHeight);
        subShift = Math.max(subShift, style.metrics.sub2);

        var ruleWidth = fontMetrics.metrics.defaultRuleThickness;

        // Rule 18e
        if ((supShift - sup.depth) - (sub.height - subShift) <
                4 * ruleWidth) {
            subShift = 4 * ruleWidth - (supShift - sup.depth) + sub.height;
            var psi = 0.8 * style.metrics.xHeight - (supShift - sup.depth);
            if (psi > 0) {
                supShift += psi;
                subShift -= psi;
            }
        }

        supsub = buildCommon.makeVList([
            {type: "elem", elem: submid, shift: subShift},
            {type: "elem", elem: supmid, shift: -supShift}
        ], "individualShift", null, options);

        // See comment above about subscripts not being shifted
        if (base instanceof domTree.symbolNode) {
            supsub.children[0].style.marginLeft = -base.italic + "em";
        }

        supsub.children[0].style.marginRight = scriptspace;
        supsub.children[1].style.marginRight = scriptspace;
    }

    // We ensure to wrap the supsub vlist in a span.msupsub to reset text-align
    var mclass = getTypeOfDomTree(base) || "mord";
    return makeSpan([mclass],
        [base, makeSpan(["msupsub"], [supsub])],
        options);
};

groupTypes.genfrac = function(group, options) {
    // Fractions are handled in the TeXbook on pages 444-445, rules 15(a-e).
    // Figure out what style this fraction should be in based on the
    // function used
    var style = options.style;
    if (group.value.size === "display") {
        style = Style.DISPLAY;
    } else if (group.value.size === "text") {
        style = Style.TEXT;
    }

    var nstyle = style.fracNum();
    var dstyle = style.fracDen();
    var newOptions;

    newOptions = options.withStyle(nstyle);
    var numer = buildGroup(group.value.numer, newOptions);
    var numerreset = makeSpan([style.reset(), nstyle.cls()],
        [numer], newOptions);

    newOptions = options.withStyle(dstyle);
    var denom = buildGroup(group.value.denom, newOptions);
    var denomreset = makeSpan([style.reset(), dstyle.cls()],
        [denom], newOptions);

    var ruleWidth;
    if (group.value.hasBarLine) {
        ruleWidth = fontMetrics.metrics.defaultRuleThickness /
            options.style.sizeMultiplier;
    } else {
        ruleWidth = 0;
    }

    // Rule 15b
    var numShift;
    var clearance;
    var denomShift;
    if (style.size === Style.DISPLAY.size) {
        numShift = style.metrics.num1;
        if (ruleWidth > 0) {
            clearance = 3 * ruleWidth;
        } else {
            clearance = 7 * fontMetrics.metrics.defaultRuleThickness;
        }
        denomShift = style.metrics.denom1;
    } else {
        if (ruleWidth > 0) {
            numShift = style.metrics.num2;
            clearance = ruleWidth;
        } else {
            numShift = style.metrics.num3;
            clearance = 3 * fontMetrics.metrics.defaultRuleThickness;
        }
        denomShift = style.metrics.denom2;
    }

    var frac;
    if (ruleWidth === 0) {
        // Rule 15c
        var candidateClearance =
            (numShift - numer.depth) - (denom.height - denomShift);
        if (candidateClearance < clearance) {
            numShift += 0.5 * (clearance - candidateClearance);
            denomShift += 0.5 * (clearance - candidateClearance);
        }

        frac = buildCommon.makeVList([
            {type: "elem", elem: denomreset, shift: denomShift},
            {type: "elem", elem: numerreset, shift: -numShift}
        ], "individualShift", null, options);
    } else {
        // Rule 15d
        var axisHeight = style.metrics.axisHeight;

        if ((numShift - numer.depth) - (axisHeight + 0.5 * ruleWidth) <
                clearance) {
            numShift +=
                clearance - ((numShift - numer.depth) -
                             (axisHeight + 0.5 * ruleWidth));
        }

        if ((axisHeight - 0.5 * ruleWidth) - (denom.height - denomShift) <
                clearance) {
            denomShift +=
                clearance - ((axisHeight - 0.5 * ruleWidth) -
                             (denom.height - denomShift));
        }

        var mid = makeSpan(
            [options.style.reset(), Style.TEXT.cls(), "frac-line"]);
        // Manually set the height of the line because its height is
        // created in CSS
        mid.height = ruleWidth;

        var midShift = -(axisHeight - 0.5 * ruleWidth);

        frac = buildCommon.makeVList([
            {type: "elem", elem: denomreset, shift: denomShift},
            {type: "elem", elem: mid,        shift: midShift},
            {type: "elem", elem: numerreset, shift: -numShift}
        ], "individualShift", null, options);
    }

    // Since we manually change the style sometimes (with \dfrac or \tfrac),
    // account for the possible size change here.
    frac.height *= style.sizeMultiplier / options.style.sizeMultiplier;
    frac.depth *= style.sizeMultiplier / options.style.sizeMultiplier;

    // Rule 15e
    var delimSize;
    if (style.size === Style.DISPLAY.size) {
        delimSize = style.metrics.delim1;
    } else {
        delimSize = style.metrics.delim2;
    }

    var leftDelim;
    var rightDelim;
    if (group.value.leftDelim == null) {
        leftDelim = makeNullDelimiter(options, ["mopen"]);
    } else {
        leftDelim = delimiter.customSizedDelim(
            group.value.leftDelim, delimSize, true,
            options.withStyle(style), group.mode, ["mopen"]);
    }
    if (group.value.rightDelim == null) {
        rightDelim = makeNullDelimiter(options, ["mclose"]);
    } else {
        rightDelim = delimiter.customSizedDelim(
            group.value.rightDelim, delimSize, true,
            options.withStyle(style), group.mode, ["mclose"]);
    }

    return makeSpan(
        ["mord", options.style.reset(), style.cls()],
        [leftDelim, makeSpan(["mfrac"], [frac]), rightDelim],
        options);
};

var calculateSize = function(sizeValue, style) {
    var x = sizeValue.number;
    if (sizeValue.unit === "ex") {
        x *= style.metrics.emPerEx;
    } else if (sizeValue.unit === "mu") {
        x /= 18;
    }
    return x;
};

groupTypes.array = function(group, options) {
    var r;
    var c;
    var nr = group.value.body.length;
    var nc = 0;
    var body = new Array(nr);

    var style = options.style;

    // Horizontal spacing
    var pt = 1 / fontMetrics.metrics.ptPerEm;
    var arraycolsep = 5 * pt; // \arraycolsep in article.cls

    // Vertical spacing
    var baselineskip = 12 * pt; // see size10.clo
    // Default \arraystretch from lttab.dtx
    // TODO(gagern): may get redefined once we have user-defined macros
    var arraystretch = utils.deflt(group.value.arraystretch, 1);
    var arrayskip = arraystretch * baselineskip;
    var arstrutHeight = 0.7 * arrayskip; // \strutbox in ltfsstrc.dtx and
    var arstrutDepth = 0.3 * arrayskip;  // \@arstrutbox in lttab.dtx

    var totalHeight = 0;
    for (r = 0; r < group.value.body.length; ++r) {
        var inrow = group.value.body[r];
        var height = arstrutHeight; // \@array adds an \@arstrut
        var depth = arstrutDepth;   // to each tow (via the template)

        if (nc < inrow.length) {
            nc = inrow.length;
        }

        var outrow = new Array(inrow.length);
        for (c = 0; c < inrow.length; ++c) {
            var elt = buildGroup(inrow[c], options);
            if (depth < elt.depth) {
                depth = elt.depth;
            }
            if (height < elt.height) {
                height = elt.height;
            }
            outrow[c] = elt;
        }

        var gap = 0;
        if (group.value.rowGaps[r]) {
            gap = calculateSize(group.value.rowGaps[r].value, style);
            if (gap > 0) { // \@argarraycr
                gap += arstrutDepth;
                if (depth < gap) {
                    depth = gap; // \@xargarraycr
                }
                gap = 0;
            }
        }

        outrow.height = height;
        outrow.depth = depth;
        totalHeight += height;
        outrow.pos = totalHeight;
        totalHeight += depth + gap; // \@yargarraycr
        body[r] = outrow;
    }

    var offset = totalHeight / 2 + style.metrics.axisHeight;
    var colDescriptions = group.value.cols || [];
    var cols = [];
    var colSep;
    var colDescrNum;
    for (c = 0, colDescrNum = 0;
         // Continue while either there are more columns or more column
         // descriptions, so trailing separators don't get lost.
         c < nc || colDescrNum < colDescriptions.length;
         ++c, ++colDescrNum) {

        var colDescr = colDescriptions[colDescrNum] || {};

        var firstSeparator = true;
        while (colDescr.type === "separator") {
            // If there is more than one separator in a row, add a space
            // between them.
            if (!firstSeparator) {
                colSep = makeSpan(["arraycolsep"], []);
                colSep.style.width =
                    fontMetrics.metrics.doubleRuleSep + "em";
                cols.push(colSep);
            }

            if (colDescr.separator === "|") {
                var separator = makeSpan(
                    ["vertical-separator"],
                    []);
                separator.style.height = totalHeight + "em";
                separator.style.verticalAlign =
                    -(totalHeight - offset) + "em";

                cols.push(separator);
            } else {
                throw new ParseError(
                    "Invalid separator type: " + colDescr.separator);
            }

            colDescrNum++;
            colDescr = colDescriptions[colDescrNum] || {};
            firstSeparator = false;
        }

        if (c >= nc) {
            continue;
        }

        var sepwidth;
        if (c > 0 || group.value.hskipBeforeAndAfter) {
            sepwidth = utils.deflt(colDescr.pregap, arraycolsep);
            if (sepwidth !== 0) {
                colSep = makeSpan(["arraycolsep"], []);
                colSep.style.width = sepwidth + "em";
                cols.push(colSep);
            }
        }

        var col = [];
        for (r = 0; r < nr; ++r) {
            var row = body[r];
            var elem = row[c];
            if (!elem) {
                continue;
            }
            var shift = row.pos - offset;
            elem.depth = row.depth;
            elem.height = row.height;
            col.push({type: "elem", elem: elem, shift: shift});
        }

        col = buildCommon.makeVList(col, "individualShift", null, options);
        col = makeSpan(
            ["col-align-" + (colDescr.align || "c")],
            [col]);
        cols.push(col);

        if (c < nc - 1 || group.value.hskipBeforeAndAfter) {
            sepwidth = utils.deflt(colDescr.postgap, arraycolsep);
            if (sepwidth !== 0) {
                colSep = makeSpan(["arraycolsep"], []);
                colSep.style.width = sepwidth + "em";
                cols.push(colSep);
            }
        }
    }
    body = makeSpan(["mtable"], cols);
    return makeSpan(["mord"], [body], options);
};

groupTypes.spacing = function(group, options) {
    if (group.value === "\\ " || group.value === "\\space" ||
        group.value === " " || group.value === "~") {
        // Spaces are generated by adding an actual space. Each of these
        // things has an entry in the symbols table, so these will be turned
        // into appropriate outputs.
        if (group.mode === "text") {
            return buildCommon.makeOrd(group, options, "textord");
        } else {
            return makeSpan(["mspace"],
                [buildCommon.mathsym(group.value, group.mode, options)],
                options);
        }
    } else {
        // Other kinds of spaces are of arbitrary width. We use CSS to
        // generate these.
        return makeSpan(
            ["mspace",
                buildCommon.spacingFunctions[group.value].className],
            [], options);
    }
};

groupTypes.llap = function(group, options) {
    var inner = makeSpan(
        ["inner"], [buildGroup(group.value.body, options.reset())]);
    var fix = makeSpan(["fix"], []);
    return makeSpan(
        ["mord", "llap", options.style.cls()], [inner, fix], options);
};

groupTypes.rlap = function(group, options) {
    var inner = makeSpan(
        ["inner"], [buildGroup(group.value.body, options.reset())]);
    var fix = makeSpan(["fix"], []);
    return makeSpan(
        ["mord", "rlap", options.style.cls()], [inner, fix], options);
};

groupTypes.op = function(group, options) {
    // Operators are handled in the TeXbook pg. 443-444, rule 13(a).
    var supGroup;
    var subGroup;
    var hasLimits = false;
    if (group.type === "supsub") {
        // If we have limits, supsub will pass us its group to handle. Pull
        // out the superscript and subscript and set the group to the op in
        // its base.
        supGroup = group.value.sup;
        subGroup = group.value.sub;
        group = group.value.base;
        hasLimits = true;
    }

    var style = options.style;

    // Most operators have a large successor symbol, but these don't.
    var noSuccessor = [
        "\\smallint"
    ];

    var large = false;
    if (style.size === Style.DISPLAY.size &&
        group.value.symbol &&
        !utils.contains(noSuccessor, group.value.body)) {

        // Most symbol operators get larger in displaystyle (rule 13)
        large = true;
    }

    var base;
    var baseShift = 0;
    var slant = 0;
    if (group.value.symbol) {
        // If this is a symbol, create the symbol.
        var fontName = large ? "Size2-Regular" : "Size1-Regular";
        base = buildCommon.makeSymbol(
            group.value.body, fontName, "math", options,
            ["mop", "op-symbol", large ? "large-op" : "small-op"]);

        // Shift the symbol so its center lies on the axis (rule 13). It
        // appears that our fonts have the centers of the symbols already
        // almost on the axis, so these numbers are very small. Note we
        // don't actually apply this here, but instead it is used either in
        // the vlist creation or separately when there are no limits.
        baseShift = (base.height - base.depth) / 2 -
            style.metrics.axisHeight * style.sizeMultiplier;

        // The slant of the symbol is just its italic correction.
        slant = base.italic;
    } else if (group.value.value) {
        // If this is a list, compose that list.
        var inner = buildExpression(group.value.value, options, true);

        base = makeSpan(["mop"], inner, options);
    } else {
        // Otherwise, this is a text operator. Build the text from the
        // operator's name.
        // TODO(emily): Add a space in the middle of some of these
        // operators, like \limsup
        var output = [];
        for (var i = 1; i < group.value.body.length; i++) {
            output.push(buildCommon.mathsym(group.value.body[i], group.mode));
        }
        base = makeSpan(["mop"], output, options);
    }

    if (hasLimits) {
        // IE 8 clips \int if it is in a display: inline-block. We wrap it
        // in a new span so it is an inline, and works.
        base = makeSpan([], [base]);

        var supmid;
        var supKern;
        var submid;
        var subKern;
        var newOptions;
        // We manually have to handle the superscripts and subscripts. This,
        // aside from the kern calculations, is copied from supsub.
        if (supGroup) {
            newOptions = options.withStyle(style.sup());
            var sup = buildGroup(supGroup, newOptions);
            supmid = makeSpan([style.reset(), style.sup().cls()],
                [sup], newOptions);

            supKern = Math.max(
                fontMetrics.metrics.bigOpSpacing1,
                fontMetrics.metrics.bigOpSpacing3 - sup.depth);
        }

        if (subGroup) {
            newOptions = options.withStyle(style.sub());
            var sub = buildGroup(subGroup, newOptions);
            submid = makeSpan([style.reset(), style.sub().cls()],
                [sub], newOptions);

            subKern = Math.max(
                fontMetrics.metrics.bigOpSpacing2,
                fontMetrics.metrics.bigOpSpacing4 - sub.height);
        }

        // Build the final group as a vlist of the possible subscript, base,
        // and possible superscript.
        var finalGroup;
        var top;
        var bottom;
        if (!supGroup) {
            top = base.height - baseShift;

            finalGroup = buildCommon.makeVList([
                {type: "kern", size: fontMetrics.metrics.bigOpSpacing5},
                {type: "elem", elem: submid},
                {type: "kern", size: subKern},
                {type: "elem", elem: base}
            ], "top", top, options);

            // Here, we shift the limits by the slant of the symbol. Note
            // that we are supposed to shift the limits by 1/2 of the slant,
            // but since we are centering the limits adding a full slant of
            // margin will shift by 1/2 that.
            finalGroup.children[0].style.marginLeft = -slant + "em";
        } else if (!subGroup) {
            bottom = base.depth + baseShift;

            finalGroup = buildCommon.makeVList([
                {type: "elem", elem: base},
                {type: "kern", size: supKern},
                {type: "elem", elem: supmid},
                {type: "kern", size: fontMetrics.metrics.bigOpSpacing5}
            ], "bottom", bottom, options);

            // See comment above about slants
            finalGroup.children[1].style.marginLeft = slant + "em";
        } else if (!supGroup && !subGroup) {
            // This case probably shouldn't occur (this would mean the
            // supsub was sending us a group with no superscript or
            // subscript) but be safe.
            return base;
        } else {
            bottom = fontMetrics.metrics.bigOpSpacing5 +
                submid.height + submid.depth +
                subKern +
                base.depth + baseShift;

            finalGroup = buildCommon.makeVList([
                {type: "kern", size: fontMetrics.metrics.bigOpSpacing5},
                {type: "elem", elem: submid},
                {type: "kern", size: subKern},
                {type: "elem", elem: base},
                {type: "kern", size: supKern},
                {type: "elem", elem: supmid},
                {type: "kern", size: fontMetrics.metrics.bigOpSpacing5}
            ], "bottom", bottom, options);

            // See comment above about slants
            finalGroup.children[0].style.marginLeft = -slant + "em";
            finalGroup.children[2].style.marginLeft = slant + "em";
        }

        return makeSpan(["mop", "op-limits"], [finalGroup], options);
    } else {
        if (group.value.symbol) {
            base.style.top = baseShift + "em";
        }

        return base;
    }
};

groupTypes.mod = function(group, options) {
    var inner = [];

    if (group.value.modType === "bmod") {
        // “\nonscript\mskip-\medmuskip\mkern5mu”
        if (!options.style.isTight()) {
            inner.push(makeSpan(
                ["mspace", "negativemediumspace"], [], options));
        }
        inner.push(makeSpan(["mspace", "thickspace"], [], options));
    } else if (options.style.size === Style.DISPLAY.size) {
        inner.push(makeSpan(["mspace", "quad"], [], options));
    } else if (group.value.modType === "mod") {
        inner.push(makeSpan(["mspace", "twelvemuspace"], [], options));
    } else {
        inner.push(makeSpan(["mspace", "eightmuspace"], [], options));
    }

    if (group.value.modType === "pod" || group.value.modType === "pmod") {
        inner.push(buildCommon.mathsym("(", group.mode));
    }

    if (group.value.modType !== "pod") {
        var modInner = [
            buildCommon.mathsym("m", group.mode),
            buildCommon.mathsym("o", group.mode),
            buildCommon.mathsym("d", group.mode)];
        if (group.value.modType === "bmod") {
            inner.push(makeSpan(["mbin"], modInner, options));
            // “\mkern5mu\nonscript\mskip-\medmuskip”
            inner.push(makeSpan(["mspace", "thickspace"], [], options));
            if (!options.style.isTight()) {
                inner.push(makeSpan(
                    ["mspace", "negativemediumspace"], [], options));
            }
        } else {
            Array.prototype.push.apply(inner, modInner);
            inner.push(makeSpan(["mspace", "sixmuspace"], [], options));
        }
    }

    if (group.value.value) {
        Array.prototype.push.apply(inner,
            buildExpression(group.value.value, options, false));
    }

    if (group.value.modType === "pod" || group.value.modType === "pmod") {
        inner.push(buildCommon.mathsym(")", group.mode));
    }

    return buildCommon.makeFragment(inner);
};

groupTypes.katex = function(group, options) {
    // The KaTeX logo. The offsets for the K and a were chosen to look
    // good, but the offsets for the T, E, and X were taken from the
    // definition of \TeX in TeX (see TeXbook pg. 356)
    var k = makeSpan(
        ["k"], [buildCommon.mathsym("K", group.mode)], options);
    var a = makeSpan(
        ["a"], [buildCommon.mathsym("A", group.mode)], options);

    a.height = (a.height + 0.2) * 0.75;
    a.depth = (a.height - 0.2) * 0.75;

    var t = makeSpan(
        ["t"], [buildCommon.mathsym("T", group.mode)], options);
    var e = makeSpan(
        ["e"], [buildCommon.mathsym("E", group.mode)], options);

    e.height = (e.height - 0.2155);
    e.depth = (e.depth + 0.2155);

    var x = makeSpan(
        ["x"], [buildCommon.mathsym("X", group.mode)], options);

    return makeSpan(
        ["mord", "katex-logo"], [k, a, t, e, x], options);
};

groupTypes.overline = function(group, options) {
    // Overlines are handled in the TeXbook pg 443, Rule 9.
    var style = options.style;

    // Build the inner group in the cramped style.
    var innerGroup = buildGroup(group.value.body,
            options.withStyle(style.cramp()));

    var ruleWidth = fontMetrics.metrics.defaultRuleThickness /
        style.sizeMultiplier;

    // Create the line above the body
    var line = makeSpan(
        [style.reset(), Style.TEXT.cls(), "overline-line"]);
    line.height = ruleWidth;
    line.maxFontSize = 1.0;

    // Generate the vlist, with the appropriate kerns
    var vlist = buildCommon.makeVList([
        {type: "elem", elem: innerGroup},
        {type: "kern", size: 3 * ruleWidth},
        {type: "elem", elem: line},
        {type: "kern", size: ruleWidth}
    ], "firstBaseline", null, options);

    return makeSpan(["mord", "overline"], [vlist], options);
};

groupTypes.underline = function(group, options) {
    // Underlines are handled in the TeXbook pg 443, Rule 10.
    var style = options.style;

    // Build the inner group.
    var innerGroup = buildGroup(group.value.body, options);

    var ruleWidth = fontMetrics.metrics.defaultRuleThickness /
        style.sizeMultiplier;

    // Create the line above the body
    var line = makeSpan([style.reset(), Style.TEXT.cls(), "underline-line"]);
    line.height = ruleWidth;
    line.maxFontSize = 1.0;

    // Generate the vlist, with the appropriate kerns
    var vlist = buildCommon.makeVList([
        {type: "kern", size: ruleWidth},
        {type: "elem", elem: line},
        {type: "kern", size: 3 * ruleWidth},
        {type: "elem", elem: innerGroup}
    ], "top", innerGroup.height, options);

    return makeSpan(["mord", "underline"], [vlist], options);
};

groupTypes.sqrt = function(group, options) {
    // Square roots are handled in the TeXbook pg. 443, Rule 11.
    var style = options.style;

    // First, we do the same steps as in overline to build the inner group
    // and line
    var inner = buildGroup(group.value.body, options.withStyle(style.cramp()));

    var ruleWidth = fontMetrics.metrics.defaultRuleThickness /
        style.sizeMultiplier;

    var line = makeSpan(
        [style.reset(), Style.TEXT.cls(), "sqrt-line"], [],
        options);
    line.height = ruleWidth;
    line.maxFontSize = 1.0;

    var phi = ruleWidth;
    if (style.id < Style.TEXT.id) {
        phi = style.metrics.xHeight;
    }

    // Calculate the clearance between the body and line
    var lineClearance = ruleWidth + phi / 4;

    var innerHeight = (inner.height + inner.depth) * style.sizeMultiplier;
    var minDelimiterHeight = innerHeight + lineClearance + ruleWidth;

    // Create a \surd delimiter of the required minimum size
    var delim = makeSpan(["sqrt-sign"], [
        delimiter.customSizedDelim("\\surd", minDelimiterHeight,
                                   false, options, group.mode)],
                         options);

    var delimDepth = (delim.height + delim.depth) - ruleWidth;

    // Adjust the clearance based on the delimiter size
    if (delimDepth > inner.height + inner.depth + lineClearance) {
        lineClearance =
            (lineClearance + delimDepth - inner.height - inner.depth) / 2;
    }

    // Shift the delimiter so that its top lines up with the top of the line
    var delimShift = -(inner.height + lineClearance + ruleWidth) + delim.height;
    delim.style.top = delimShift + "em";
    delim.height -= delimShift;
    delim.depth += delimShift;

    // We add a special case here, because even when `inner` is empty, we
    // still get a line. So, we use a simple heuristic to decide if we
    // should omit the body entirely. (note this doesn't work for something
    // like `\sqrt{\rlap{x}}`, but if someone is doing that they deserve for
    // it not to work.
    var body;
    if (inner.height === 0 && inner.depth === 0) {
        body = makeSpan();
    } else {
        body = buildCommon.makeVList([
            {type: "elem", elem: inner},
            {type: "kern", size: lineClearance},
            {type: "elem", elem: line},
            {type: "kern", size: ruleWidth}
        ], "firstBaseline", null, options);
    }

    if (!group.value.index) {
        return makeSpan(["mord", "sqrt"], [delim, body], options);
    } else {
        // Handle the optional root index

        // The index is always in scriptscript style
        var newOptions = options.withStyle(Style.SCRIPTSCRIPT);
        var root = buildGroup(group.value.index, newOptions);
        var rootWrap = makeSpan(
            [style.reset(), Style.SCRIPTSCRIPT.cls()],
            [root],
            newOptions);

        // Figure out the height and depth of the inner part
        var innerRootHeight = Math.max(delim.height, body.height);
        var innerRootDepth = Math.max(delim.depth, body.depth);

        // The amount the index is shifted by. This is taken from the TeX
        // source, in the definition of `\r@@t`.
        var toShift = 0.6 * (innerRootHeight - innerRootDepth);

        // Build a VList with the superscript shifted up correctly
        var rootVList = buildCommon.makeVList(
            [{type: "elem", elem: rootWrap}],
            "shift", -toShift, options);
        // Add a class surrounding it so we can add on the appropriate
        // kerning
        var rootVListWrap = makeSpan(["root"], [rootVList]);

        return makeSpan(["mord", "sqrt"],
            [rootVListWrap, delim, body], options);
    }
};

groupTypes.sizing = function(group, options) {
    // Handle sizing operators like \Huge. Real TeX doesn't actually allow
    // these functions inside of math expressions, so we do some special
    // handling.
    var inner = buildExpression(group.value.value,
            options.withSize(group.value.size), false);

    // Compute the correct maxFontSize.
    var style = options.style;
    var fontSize = buildCommon.sizingMultiplier[group.value.size];
    fontSize = fontSize * style.sizeMultiplier;

    // Add size-resetting classes to the inner list and set maxFontSize
    // manually. Handle nested size changes.
    for (var i = 0; i < inner.length; i++) {
        var pos = utils.indexOf(inner[i].classes, "sizing");
        if (pos < 0) {
            inner[i].classes.push("sizing", "reset-" + options.size,
                                  group.value.size, style.cls());
            inner[i].maxFontSize = fontSize;
        } else if (inner[i].classes[pos + 1] === "reset-" + group.value.size) {
            // This is a nested size change: e.g., inner[i] is the "b" in
            // `\Huge a \small b`. Override the old size (the `reset-` class)
            // but not the new size.
            inner[i].classes[pos + 1] = "reset-" + options.size;
        }
    }

    return buildCommon.makeFragment(inner);
};

groupTypes.styling = function(group, options) {
    // Style changes are handled in the TeXbook on pg. 442, Rule 3.

    // Figure out what style we're changing to.
    var styleMap = {
        "display": Style.DISPLAY,
        "text": Style.TEXT,
        "script": Style.SCRIPT,
        "scriptscript": Style.SCRIPTSCRIPT
    };

    var newStyle = styleMap[group.value.style];
    var newOptions = options.withStyle(newStyle);

    // Build the inner expression in the new style.
    var inner = buildExpression(
        group.value.value, newOptions, false);

    // Add style-resetting classes to the inner list. Handle nested changes.
    for (var i = 0; i < inner.length; i++) {
        var pos = utils.indexOf(inner[i].classes, newStyle.reset());
        if (pos < 0) {
            inner[i].classes.push(options.style.reset(), newStyle.cls());
        } else {
            // This is a nested style change, as `\textstyle a\scriptstyle b`.
            // Only override the old style (the reset class).
            inner[i].classes[pos] = options.style.reset();
        }
    }

    return new buildCommon.makeFragment(inner);
};

groupTypes.font = function(group, options) {
    var font = group.value.font;
    return buildGroup(group.value.body, options.withFont(font));
};

groupTypes.delimsizing = function(group, options) {
    var delim = group.value.value;

    if (delim === ".") {
        // Empty delimiters still count as elements, even though they don't
        // show anything.
        return makeSpan([group.value.mclass]);
    }

    // Use delimiter.sizedDelim to generate the delimiter.
    return delimiter.sizedDelim(
            delim, group.value.size, options, group.mode,
            [group.value.mclass]);
};

groupTypes.leftright = function(group, options) {
    // Build the inner expression
    var inner = buildExpression(group.value.body, options.reset(), true);

    var innerHeight = 0;
    var innerDepth = 0;
    var hadMiddle = false;

    // Calculate its height and depth
    for (var i = 0; i < inner.length; i++) {
        if (inner[i].isMiddle) {
            hadMiddle = true;
        } else {
            innerHeight = Math.max(inner[i].height, innerHeight);
            innerDepth = Math.max(inner[i].depth, innerDepth);
        }
    }

    var style = options.style;

    // The size of delimiters is the same, regardless of what style we are
    // in. Thus, to correctly calculate the size of delimiter we need around
    // a group, we scale down the inner size based on the size.
    innerHeight *= style.sizeMultiplier;
    innerDepth *= style.sizeMultiplier;

    var leftDelim;
    if (group.value.left === ".") {
        // Empty delimiters in \left and \right make null delimiter spaces.
        leftDelim = makeNullDelimiter(options, ["mopen"]);
    } else {
        // Otherwise, use leftRightDelim to generate the correct sized
        // delimiter.
        leftDelim = delimiter.leftRightDelim(
            group.value.left, innerHeight, innerDepth, options,
            group.mode, ["mopen"]);
    }
    // Add it to the beginning of the expression
    inner.unshift(leftDelim);

    // Handle middle delimiters
    if (hadMiddle) {
        for (i = 1; i < inner.length; i++) {
            if (inner[i].isMiddle) {
                // Apply the options that were active when \middle was called
                inner[i] = delimiter.leftRightDelim(
                    inner[i].isMiddle.value, innerHeight, innerDepth,
                    inner[i].isMiddle.options, group.mode, []);
            }
        }
    }

    var rightDelim;
    // Same for the right delimiter
    if (group.value.right === ".") {
        rightDelim = makeNullDelimiter(options, ["mclose"]);
    } else {
        rightDelim = delimiter.leftRightDelim(
            group.value.right, innerHeight, innerDepth, options,
            group.mode, ["mclose"]);
    }
    // Add it to the end of the expression.
    inner.push(rightDelim);

    return makeSpan(
        ["minner", style.cls()], inner, options);
};

groupTypes.middle = function(group, options) {
    var middleDelim;
    if (group.value.value === ".") {
        middleDelim = makeNullDelimiter(options, []);
    } else {
        middleDelim = delimiter.sizedDelim(
            group.value.value, 1, options,
            group.mode, []);
        middleDelim.isMiddle = {value: group.value.value, options: options};
    }
    return middleDelim;
};

groupTypes.rule = function(group, options) {
    // Make an empty span for the rule
    var rule = makeSpan(["mord", "rule"], [], options);
    var style = options.style;

    // Calculate the shift, width, and height of the rule, and account for units
    var shift = 0;
    if (group.value.shift) {
        shift = calculateSize(group.value.shift, style);
    }

    var width = calculateSize(group.value.width, style);
    var height = calculateSize(group.value.height, style);

    // The sizes of rules are absolute, so make it larger if we are in a
    // smaller style.
    shift /= style.sizeMultiplier;
    width /= style.sizeMultiplier;
    height /= style.sizeMultiplier;

    // Style the rule to the right size
    rule.style.borderRightWidth = width + "em";
    rule.style.borderTopWidth = height + "em";
    rule.style.bottom = shift + "em";

    // Record the height and width
    rule.width = width;
    rule.height = height + shift;
    rule.depth = -shift;

    return rule;
};

groupTypes.kern = function(group, options) {
    // Make an empty span for the rule
    var rule = makeSpan(["mord", "rule"], [], options);
    var style = options.style;

    var dimension = 0;
    if (group.value.dimension) {
        dimension = calculateSize(group.value.dimension, style);
    }

    dimension /= style.sizeMultiplier;

    rule.style.marginLeft = dimension + "em";

    return rule;
};

groupTypes.accent = function(group, options) {
    // Accents are handled in the TeXbook pg. 443, rule 12.
    var base = group.value.base;
    var style = options.style;

    var supsubGroup;
    if (group.type === "supsub") {
        // If our base is a character box, and we have superscripts and
        // subscripts, the supsub will defer to us. In particular, we want
        // to attach the superscripts and subscripts to the inner body (so
        // that the position of the superscripts and subscripts won't be
        // affected by the height of the accent). We accomplish this by
        // sticking the base of the accent into the base of the supsub, and
        // rendering that, while keeping track of where the accent is.

        // The supsub group is the group that was passed in
        var supsub = group;
        // The real accent group is the base of the supsub group
        group = supsub.value.base;
        // The character box is the base of the accent group
        base = group.value.base;
        // Stick the character box into the base of the supsub group
        supsub.value.base = base;

        // Rerender the supsub group with its new base, and store that
        // result.
        supsubGroup = buildGroup(
            supsub, options.reset());
    }

    // Build the base group
    var body = buildGroup(
        base, options.withStyle(style.cramp()));

    // Calculate the skew of the accent. This is based on the line "If the
    // nucleus is not a single character, let s = 0; otherwise set s to the
    // kern amount for the nucleus followed by the \skewchar of its font."
    // Note that our skew metrics are just the kern between each character
    // and the skewchar.
    var skew;
    if (isCharacterBox(base)) {
        // If the base is a character box, then we want the skew of the
        // innermost character. To do that, we find the innermost character:
        var baseChar = getBaseElem(base);
        // Then, we render its group to get the symbol inside it
        var baseGroup = buildGroup(
            baseChar, options.withStyle(style.cramp()));
        // Finally, we pull the skew off of the symbol.
        skew = baseGroup.skew;
        // Note that we now throw away baseGroup, because the layers we
        // removed with getBaseElem might contain things like \color which
        // we can't get rid of.
        // TODO(emily): Find a better way to get the skew
    } else {
        skew = 0;
    }

    // calculate the amount of space between the body and the accent
    var clearance = Math.min(
        body.height,
        style.metrics.xHeight);

    // Build the accent
    var accent = buildCommon.makeSymbol(
        group.value.accent, "Main-Regular", "math", options);
    // Remove the italic correction of the accent, because it only serves to
    // shift the accent over to a place we don't want.
    accent.italic = 0;

    // The \vec character that the fonts use is a combining character, and
    // thus shows up much too far to the left. To account for this, we add a
    // specific class which shifts the accent over to where we want it.
    // TODO(emily): Fix this in a better way, like by changing the font
    var vecClass = group.value.accent === "\\vec" ? "accent-vec" : null;

    var accentBody = makeSpan(["accent-body", vecClass], [
        makeSpan([], [accent])]);

    accentBody = buildCommon.makeVList([
        {type: "elem", elem: body},
        {type: "kern", size: -clearance},
        {type: "elem", elem: accentBody}
    ], "firstBaseline", null, options);

    // Shift the accent over by the skew. Note we shift by twice the skew
    // because we are centering the accent, so by adding 2*skew to the left,
    // we shift it to the right by 1*skew.
    accentBody.children[1].style.marginLeft = 2 * skew + "em";

    var accentWrap = makeSpan(["mord", "accent"], [accentBody], options);

    if (supsubGroup) {
        // Here, we replace the "base" child of the supsub with our newly
        // generated accent.
        supsubGroup.children[0] = accentWrap;

        // Since we don't rerun the height calculation after replacing the
        // accent, we manually recalculate height.
        supsubGroup.height = Math.max(accentWrap.height, supsubGroup.height);

        // Accents should always be ords, even when their innards are not.
        supsubGroup.classes[0] = "mord";

        return supsubGroup;
    } else {
        return accentWrap;
    }
};

groupTypes.phantom = function(group, options) {
    var elements = buildExpression(
        group.value.value,
        options.withPhantom(),
        false
    );

    // \phantom isn't supposed to affect the elements it contains.
    // See "color" for more details.
    return new buildCommon.makeFragment(elements);
};

groupTypes.mclass = function(group, options) {
    var elements = buildExpression(group.value.value, options, true);

    return makeSpan([group.value.mclass], elements, options);
};

/**
 * buildGroup is the function that takes a group and calls the correct groupType
 * function for it. It also handles the interaction of size and style changes
 * between parents and children.
 */
var buildGroup = function(group, options) {
    if (!group) {
        return makeSpan();
    }

    if (groupTypes[group.type]) {
        // Call the groupTypes function
        var groupNode = groupTypes[group.type](group, options);
        var multiplier;

        // If the style changed between the parent and the current group,
        // account for the size difference
        if (options.style !== options.parentStyle) {
            multiplier = options.style.sizeMultiplier /
                    options.parentStyle.sizeMultiplier;

            groupNode.height *= multiplier;
            groupNode.depth *= multiplier;
        }

        // If the size changed between the parent and the current group, account
        // for that size difference.
        if (options.size !== options.parentSize) {
            multiplier = buildCommon.sizingMultiplier[options.size] /
                    buildCommon.sizingMultiplier[options.parentSize];

            groupNode.height *= multiplier;
            groupNode.depth *= multiplier;
        }

        return groupNode;
    } else {
        throw new ParseError(
            "Got group of unknown type: '" + group.type + "'");
    }
};

/**
 * Take an entire parse tree, and build it into an appropriate set of HTML
 * nodes.
 */
var buildHTML = function(tree, options) {
    // buildExpression is destructive, so we need to make a clone
    // of the incoming tree so that it isn't accidentally changed
    tree = JSON.parse(JSON.stringify(tree));

    // Build the expression contained in the tree
    var expression = buildExpression(tree, options, true);
    var body = makeSpan(["base", options.style.cls()], expression, options);

    // Add struts, which ensure that the top of the HTML element falls at the
    // height of the expression, and the bottom of the HTML element falls at the
    // depth of the expression.
    var topStrut = makeSpan(["strut"]);
    var bottomStrut = makeSpan(["strut", "bottom"]);

    topStrut.style.height = body.height + "em";
    bottomStrut.style.height = (body.height + body.depth) + "em";
    // We'd like to use `vertical-align: top` but in IE 9 this lowers the
    // baseline of the box to the bottom of this strut (instead staying in the
    // normal place) so we use an absolute value for vertical-align instead
    bottomStrut.style.verticalAlign = -body.depth + "em";

    // Wrap the struts and body together
    var htmlNode = makeSpan(["katex-html"], [topStrut, bottomStrut, body]);

    htmlNode.setAttribute("aria-hidden", "true");

    return htmlNode;
};

module.exports = buildHTML;

},{"./ParseError":6,"./Style":9,"./buildCommon":10,"./delimiter":14,"./domTree":15,"./fontMetrics":17,"./utils":25}],12:[function(require,module,exports){
/**
 * This file converts a parse tree into a cooresponding MathML tree. The main
 * entry point is the `buildMathML` function, which takes a parse tree from the
 * parser.
 */

var buildCommon = require("./buildCommon");
var fontMetrics = require("./fontMetrics");
var mathMLTree = require("./mathMLTree");
var ParseError = require("./ParseError");
var symbols = require("./symbols");
var utils = require("./utils");

var makeSpan = buildCommon.makeSpan;
var fontMap = buildCommon.fontMap;

/**
 * Takes a symbol and converts it into a MathML text node after performing
 * optional replacement from symbols.js.
 */
var makeText = function(text, mode) {
    if (symbols[mode][text] && symbols[mode][text].replace) {
        text = symbols[mode][text].replace;
    }

    return new mathMLTree.TextNode(text);
};

/**
 * Returns the math variant as a string or null if none is required.
 */
var getVariant = function(group, options) {
    var font = options.font;
    if (!font) {
        return null;
    }

    var mode = group.mode;
    if (font === "mathit") {
        return "italic";
    }

    var value = group.value;
    if (utils.contains(["\\imath", "\\jmath"], value)) {
        return null;
    }

    if (symbols[mode][value] && symbols[mode][value].replace) {
        value = symbols[mode][value].replace;
    }

    var fontName = fontMap[font].fontName;
    if (fontMetrics.getCharacterMetrics(value, fontName)) {
        return fontMap[options.font].variant;
    }

    return null;
};

/**
 * Functions for handling the different types of groups found in the parse
 * tree. Each function should take a parse group and return a MathML node.
 */
var groupTypes = {};

groupTypes.mathord = function(group, options) {
    var node = new mathMLTree.MathNode(
        "mi",
        [makeText(group.value, group.mode)]);

    var variant = getVariant(group, options);
    if (variant) {
        node.setAttribute("mathvariant", variant);
    }
    return node;
};

groupTypes.textord = function(group, options) {
    var text = makeText(group.value, group.mode);

    var variant = getVariant(group, options) || "normal";

    var node;
    if (/[0-9]/.test(group.value)) {
        // TODO(kevinb) merge adjacent <mn> nodes
        // do it as a post processing step
        node = new mathMLTree.MathNode("mn", [text]);
        if (options.font) {
            node.setAttribute("mathvariant", variant);
        }
    } else {
        node = new mathMLTree.MathNode("mi", [text]);
        node.setAttribute("mathvariant", variant);
    }

    return node;
};

groupTypes.bin = function(group) {
    var node = new mathMLTree.MathNode(
        "mo", [makeText(group.value, group.mode)]);

    return node;
};

groupTypes.rel = function(group) {
    var node = new mathMLTree.MathNode(
        "mo", [makeText(group.value, group.mode)]);

    return node;
};

groupTypes.open = function(group) {
    var node = new mathMLTree.MathNode(
        "mo", [makeText(group.value, group.mode)]);

    return node;
};

groupTypes.close = function(group) {
    var node = new mathMLTree.MathNode(
        "mo", [makeText(group.value, group.mode)]);

    return node;
};

groupTypes.inner = function(group) {
    var node = new mathMLTree.MathNode(
        "mo", [makeText(group.value, group.mode)]);

    return node;
};

groupTypes.punct = function(group) {
    var node = new mathMLTree.MathNode(
        "mo", [makeText(group.value, group.mode)]);

    node.setAttribute("separator", "true");

    return node;
};

groupTypes.ordgroup = function(group, options) {
    var inner = buildExpression(group.value, options);

    var node = new mathMLTree.MathNode("mrow", inner);

    return node;
};

groupTypes.text = function(group, options) {
    var inner = buildExpression(group.value.body, options);

    var node = new mathMLTree.MathNode("mtext", inner);

    return node;
};

groupTypes.color = function(group, options) {
    var inner = buildExpression(group.value.value, options);

    var node = new mathMLTree.MathNode("mstyle", inner);

    node.setAttribute("mathcolor", group.value.color);

    return node;
};

groupTypes.supsub = function(group, options) {
    var children = [buildGroup(group.value.base, options)];

    if (group.value.sub) {
        children.push(buildGroup(group.value.sub, options));
    }

    if (group.value.sup) {
        children.push(buildGroup(group.value.sup, options));
    }

    var nodeType;
    if (!group.value.sub) {
        nodeType = "msup";
    } else if (!group.value.sup) {
        nodeType = "msub";
    } else {
        nodeType = "msubsup";
    }

    var node = new mathMLTree.MathNode(nodeType, children);

    return node;
};

groupTypes.genfrac = function(group, options) {
    var node = new mathMLTree.MathNode(
        "mfrac",
        [buildGroup(group.value.numer, options),
            buildGroup(group.value.denom, options)]);

    if (!group.value.hasBarLine) {
        node.setAttribute("linethickness", "0px");
    }

    if (group.value.leftDelim != null || group.value.rightDelim != null) {
        var withDelims = [];

        if (group.value.leftDelim != null) {
            var leftOp = new mathMLTree.MathNode(
                "mo", [new mathMLTree.TextNode(group.value.leftDelim)]);

            leftOp.setAttribute("fence", "true");

            withDelims.push(leftOp);
        }

        withDelims.push(node);

        if (group.value.rightDelim != null) {
            var rightOp = new mathMLTree.MathNode(
                "mo", [new mathMLTree.TextNode(group.value.rightDelim)]);

            rightOp.setAttribute("fence", "true");

            withDelims.push(rightOp);
        }

        var outerNode = new mathMLTree.MathNode("mrow", withDelims);

        return outerNode;
    }

    return node;
};

groupTypes.array = function(group, options) {
    return new mathMLTree.MathNode(
        "mtable", group.value.body.map(function(row) {
            return new mathMLTree.MathNode(
                "mtr", row.map(function(cell) {
                    return new mathMLTree.MathNode(
                        "mtd", [buildGroup(cell, options)]);
                }));
        }));
};

groupTypes.sqrt = function(group, options) {
    var node;
    if (group.value.index) {
        node = new mathMLTree.MathNode(
            "mroot", [
                buildGroup(group.value.body, options),
                buildGroup(group.value.index, options)
            ]);
    } else {
        node = new mathMLTree.MathNode(
            "msqrt", [buildGroup(group.value.body, options)]);
    }

    return node;
};

groupTypes.leftright = function(group, options) {
    var inner = buildExpression(group.value.body, options);

    if (group.value.left !== ".") {
        var leftNode = new mathMLTree.MathNode(
            "mo", [makeText(group.value.left, group.mode)]);

        leftNode.setAttribute("fence", "true");

        inner.unshift(leftNode);
    }

    if (group.value.right !== ".") {
        var rightNode = new mathMLTree.MathNode(
            "mo", [makeText(group.value.right, group.mode)]);

        rightNode.setAttribute("fence", "true");

        inner.push(rightNode);
    }

    var outerNode = new mathMLTree.MathNode("mrow", inner);

    return outerNode;
};

groupTypes.middle = function(group, options) {
    var middleNode = new mathMLTree.MathNode(
        "mo", [makeText(group.value.middle, group.mode)]);
    middleNode.setAttribute("fence", "true");
    return middleNode;
};

groupTypes.accent = function(group, options) {
    var accentNode = new mathMLTree.MathNode(
        "mo", [makeText(group.value.accent, group.mode)]);

    var node = new mathMLTree.MathNode(
        "mover",
        [buildGroup(group.value.base, options),
            accentNode]);

    node.setAttribute("accent", "true");

    return node;
};

groupTypes.spacing = function(group) {
    var node;

    if (group.value === "\\ " || group.value === "\\space" ||
        group.value === " " || group.value === "~") {
        node = new mathMLTree.MathNode(
            "mtext", [new mathMLTree.TextNode("\u00a0")]);
    } else {
        node = new mathMLTree.MathNode("mspace");

        node.setAttribute(
            "width", buildCommon.spacingFunctions[group.value].size);
    }

    return node;
};

groupTypes.op = function(group, options) {
    var node;

    // TODO(emily): handle big operators using the `largeop` attribute

    if (group.value.symbol) {
        // This is a symbol. Just add the symbol.
        node = new mathMLTree.MathNode(
            "mo", [makeText(group.value.body, group.mode)]);
    } else if (group.value.value) {
        // This is an operator with children. Add them.
        node = new mathMLTree.MathNode(
            "mo", buildExpression(group.value.value, options));
    } else {
        // This is a text operator. Add all of the characters from the
        // operator's name.
        // TODO(emily): Add a space in the middle of some of these
        // operators, like \limsup.
        node = new mathMLTree.MathNode(
            "mi", [new mathMLTree.TextNode(group.value.body.slice(1))]);
    }

    return node;
};

groupTypes.mod = function(group, options) {
    var inner = [];

    if (group.value.modType === "pod" || group.value.modType === "pmod") {
        inner.push(new mathMLTree.MathNode(
            "mo", [makeText("(", group.mode)]));
    }
    if (group.value.modType !== "pod") {
        inner.push(new mathMLTree.MathNode(
            "mo", [makeText("mod", group.mode)]));
    }
    if (group.value.value) {
        var space = new mathMLTree.MathNode("mspace");
        space.setAttribute("width", "0.333333em");
        inner.push(space);
        inner = inner.concat(buildExpression(group.value.value, options));
    }
    if (group.value.modType === "pod" || group.value.modType === "pmod") {
        inner.push(new mathMLTree.MathNode(
            "mo", [makeText(")", group.mode)]));
    }

    return new mathMLTree.MathNode("mo", inner);
};

groupTypes.katex = function(group) {
    var node = new mathMLTree.MathNode(
        "mtext", [new mathMLTree.TextNode("KaTeX")]);

    return node;
};

groupTypes.font = function(group, options) {
    var font = group.value.font;
    return buildGroup(group.value.body, options.withFont(font));
};

groupTypes.delimsizing = function(group) {
    var children = [];

    if (group.value.value !== ".") {
        children.push(makeText(group.value.value, group.mode));
    }

    var node = new mathMLTree.MathNode("mo", children);

    if (group.value.mclass === "mopen" ||
        group.value.mclass === "mclose") {
        // Only some of the delimsizing functions act as fences, and they
        // return "mopen" or "mclose" mclass.
        node.setAttribute("fence", "true");
    } else {
        // Explicitly disable fencing if it's not a fence, to override the
        // defaults.
        node.setAttribute("fence", "false");
    }

    return node;
};

groupTypes.styling = function(group, options) {
    var inner = buildExpression(group.value.value, options);

    var node = new mathMLTree.MathNode("mstyle", inner);

    var styleAttributes = {
        "display": ["0", "true"],
        "text": ["0", "false"],
        "script": ["1", "false"],
        "scriptscript": ["2", "false"]
    };

    var attr = styleAttributes[group.value.style];

    node.setAttribute("scriptlevel", attr[0]);
    node.setAttribute("displaystyle", attr[1]);

    return node;
};

groupTypes.sizing = function(group, options) {
    var inner = buildExpression(group.value.value, options);

    var node = new mathMLTree.MathNode("mstyle", inner);

    // TODO(emily): This doesn't produce the correct size for nested size
    // changes, because we don't keep state of what style we're currently
    // in, so we can't reset the size to normal before changing it.  Now
    // that we're passing an options parameter we should be able to fix
    // this.
    node.setAttribute(
        "mathsize", buildCommon.sizingMultiplier[group.value.size] + "em");

    return node;
};

groupTypes.overline = function(group, options) {
    var operator = new mathMLTree.MathNode(
        "mo", [new mathMLTree.TextNode("\u203e")]);
    operator.setAttribute("stretchy", "true");

    var node = new mathMLTree.MathNode(
        "mover",
        [buildGroup(group.value.body, options),
            operator]);
    node.setAttribute("accent", "true");

    return node;
};

groupTypes.underline = function(group, options) {
    var operator = new mathMLTree.MathNode(
        "mo", [new mathMLTree.TextNode("\u203e")]);
    operator.setAttribute("stretchy", "true");

    var node = new mathMLTree.MathNode(
        "munder",
        [buildGroup(group.value.body, options),
            operator]);
    node.setAttribute("accentunder", "true");

    return node;
};

groupTypes.rule = function(group) {
    // TODO(emily): Figure out if there's an actual way to draw black boxes
    // in MathML.
    var node = new mathMLTree.MathNode("mrow");

    return node;
};

groupTypes.kern = function(group) {
    // TODO(kevin): Figure out if there's a way to add space in MathML
    var node = new mathMLTree.MathNode("mrow");

    return node;
};

groupTypes.llap = function(group, options) {
    var node = new mathMLTree.MathNode(
        "mpadded", [buildGroup(group.value.body, options)]);

    node.setAttribute("lspace", "-1width");
    node.setAttribute("width", "0px");

    return node;
};

groupTypes.rlap = function(group, options) {
    var node = new mathMLTree.MathNode(
        "mpadded", [buildGroup(group.value.body, options)]);

    node.setAttribute("width", "0px");

    return node;
};

groupTypes.phantom = function(group, options) {
    var inner = buildExpression(group.value.value, options);
    return new mathMLTree.MathNode("mphantom", inner);
};

groupTypes.mclass = function(group, options) {
    var inner = buildExpression(group.value.value, options);
    return new mathMLTree.MathNode("mstyle", inner);
};

/**
 * Takes a list of nodes, builds them, and returns a list of the generated
 * MathML nodes. A little simpler than the HTML version because we don't do any
 * previous-node handling.
 */
var buildExpression = function(expression, options) {
    var groups = [];
    for (var i = 0; i < expression.length; i++) {
        var group = expression[i];
        groups.push(buildGroup(group, options));
    }
    return groups;
};

/**
 * Takes a group from the parser and calls the appropriate groupTypes function
 * on it to produce a MathML node.
 */
var buildGroup = function(group, options) {
    if (!group) {
        return new mathMLTree.MathNode("mrow");
    }

    if (groupTypes[group.type]) {
        // Call the groupTypes function
        return groupTypes[group.type](group, options);
    } else {
        throw new ParseError(
            "Got group of unknown type: '" + group.type + "'");
    }
};

/**
 * Takes a full parse tree and settings and builds a MathML representation of
 * it. In particular, we put the elements from building the parse tree into a
 * <semantics> tag so we can also include that TeX source as an annotation.
 *
 * Note that we actually return a domTree element with a `<math>` inside it so
 * we can do appropriate styling.
 */
var buildMathML = function(tree, texExpression, options) {
    var expression = buildExpression(tree, options);

    // Wrap up the expression in an mrow so it is presented in the semantics
    // tag correctly.
    var wrapper = new mathMLTree.MathNode("mrow", expression);

    // Build a TeX annotation of the source
    var annotation = new mathMLTree.MathNode(
        "annotation", [new mathMLTree.TextNode(texExpression)]);

    annotation.setAttribute("encoding", "application/x-tex");

    var semantics = new mathMLTree.MathNode(
        "semantics", [wrapper, annotation]);

    var math = new mathMLTree.MathNode("math", [semantics]);

    // You can't style <math> nodes, so we wrap the node in a span.
    return makeSpan(["katex-mathml"], [math]);
};

module.exports = buildMathML;

},{"./ParseError":6,"./buildCommon":10,"./fontMetrics":17,"./mathMLTree":20,"./symbols":23,"./utils":25}],13:[function(require,module,exports){
var buildHTML = require("./buildHTML");
var buildMathML = require("./buildMathML");
var buildCommon = require("./buildCommon");
var Options = require("./Options");
var Settings = require("./Settings");
var Style = require("./Style");

var makeSpan = buildCommon.makeSpan;

var buildTree = function(tree, expression, settings) {
    settings = settings || new Settings({});

    var startStyle = Style.TEXT;
    if (settings.displayMode) {
        startStyle = Style.DISPLAY;
    }

    // Setup the default options
    var options = new Options({
        style: startStyle,
        size: "size5"
    });

    // `buildHTML` sometimes messes with the parse tree (like turning bins ->
    // ords), so we build the MathML version first.
    var mathMLNode = buildMathML(tree, expression, options);
    var htmlNode = buildHTML(tree, options);

    var katexNode = makeSpan(["katex"], [
        mathMLNode, htmlNode
    ]);

    if (settings.displayMode) {
        return makeSpan(["katex-display"], [katexNode]);
    } else {
        return katexNode;
    }
};

module.exports = buildTree;

},{"./Options":5,"./Settings":8,"./Style":9,"./buildCommon":10,"./buildHTML":11,"./buildMathML":12}],14:[function(require,module,exports){
/**
 * This file deals with creating delimiters of various sizes. The TeXbook
 * discusses these routines on page 441-442, in the "Another subroutine sets box
 * x to a specified variable delimiter" paragraph.
 *
 * There are three main routines here. `makeSmallDelim` makes a delimiter in the
 * normal font, but in either text, script, or scriptscript style.
 * `makeLargeDelim` makes a delimiter in textstyle, but in one of the Size1,
 * Size2, Size3, or Size4 fonts. `makeStackedDelim` makes a delimiter out of
 * smaller pieces that are stacked on top of one another.
 *
 * The functions take a parameter `center`, which determines if the delimiter
 * should be centered around the axis.
 *
 * Then, there are three exposed functions. `sizedDelim` makes a delimiter in
 * one of the given sizes. This is used for things like `\bigl`.
 * `customSizedDelim` makes a delimiter with a given total height+depth. It is
 * called in places like `\sqrt`. `leftRightDelim` makes an appropriate
 * delimiter which surrounds an expression of a given height an depth. It is
 * used in `\left` and `\right`.
 */

var ParseError = require("./ParseError");
var Style = require("./Style");

var buildCommon = require("./buildCommon");
var fontMetrics = require("./fontMetrics");
var symbols = require("./symbols");
var utils = require("./utils");

var makeSpan = buildCommon.makeSpan;

/**
 * Get the metrics for a given symbol and font, after transformation (i.e.
 * after following replacement from symbols.js)
 */
var getMetrics = function(symbol, font) {
    if (symbols.math[symbol] && symbols.math[symbol].replace) {
        return fontMetrics.getCharacterMetrics(
            symbols.math[symbol].replace, font);
    } else {
        return fontMetrics.getCharacterMetrics(
            symbol, font);
    }
};

/**
 * Builds a symbol in the given font size (note size is an integer)
 */
var mathrmSize = function(value, size, mode, options) {
    return buildCommon.makeSymbol(value, "Size" + size + "-Regular",
        mode, options);
};

/**
 * Puts a delimiter span in a given style, and adds appropriate height, depth,
 * and maxFontSizes.
 */
var styleWrap = function(delim, toStyle, options, classes) {
    classes = classes || [];
    var span = makeSpan(
        classes.concat(["style-wrap", options.style.reset(), toStyle.cls()]),
        [delim], options);

    var multiplier = toStyle.sizeMultiplier / options.style.sizeMultiplier;

    span.height *= multiplier;
    span.depth *= multiplier;
    span.maxFontSize = toStyle.sizeMultiplier;

    return span;
};

/**
 * Makes a small delimiter. This is a delimiter that comes in the Main-Regular
 * font, but is restyled to either be in textstyle, scriptstyle, or
 * scriptscriptstyle.
 */
var makeSmallDelim = function(delim, style, center, options, mode, classes) {
    var text = buildCommon.makeSymbol(delim, "Main-Regular", mode, options);

    var span = styleWrap(text, style, options, classes);

    if (center) {
        var shift =
            (1 - options.style.sizeMultiplier / style.sizeMultiplier) *
            options.style.metrics.axisHeight;

        span.style.top = shift + "em";
        span.height -= shift;
        span.depth += shift;
    }

    return span;
};

/**
 * Makes a large delimiter. This is a delimiter that comes in the Size1, Size2,
 * Size3, or Size4 fonts. It is always rendered in textstyle.
 */
var makeLargeDelim = function(delim, size, center, options, mode, classes) {
    var inner = mathrmSize(delim, size, mode, options);

    var span = styleWrap(
        makeSpan(["delimsizing", "size" + size], [inner], options),
        Style.TEXT, options, classes);

    if (center) {
        var shift = (1 - options.style.sizeMultiplier) *
            options.style.metrics.axisHeight;

        span.style.top = shift + "em";
        span.height -= shift;
        span.depth += shift;
    }

    return span;
};

/**
 * Make an inner span with the given offset and in the given font. This is used
 * in `makeStackedDelim` to make the stacking pieces for the delimiter.
 */
var makeInner = function(symbol, font, mode) {
    var sizeClass;
    // Apply the correct CSS class to choose the right font.
    if (font === "Size1-Regular") {
        sizeClass = "delim-size1";
    } else if (font === "Size4-Regular") {
        sizeClass = "delim-size4";
    }

    var inner = makeSpan(
        ["delimsizinginner", sizeClass],
        [makeSpan([], [buildCommon.makeSymbol(symbol, font, mode)])]);

    // Since this will be passed into `makeVList` in the end, wrap the element
    // in the appropriate tag that VList uses.
    return {type: "elem", elem: inner};
};

/**
 * Make a stacked delimiter out of a given delimiter, with the total height at
 * least `heightTotal`. This routine is mentioned on page 442 of the TeXbook.
 */
var makeStackedDelim = function(delim, heightTotal, center, options, mode,
                                classes) {
    // There are four parts, the top, an optional middle, a repeated part, and a
    // bottom.
    var top;
    var middle;
    var repeat;
    var bottom;
    top = repeat = bottom = delim;
    middle = null;
    // Also keep track of what font the delimiters are in
    var font = "Size1-Regular";

    // We set the parts and font based on the symbol. Note that we use
    // '\u23d0' instead of '|' and '\u2016' instead of '\\|' for the
    // repeats of the arrows
    if (delim === "\\uparrow") {
        repeat = bottom = "\u23d0";
    } else if (delim === "\\Uparrow") {
        repeat = bottom = "\u2016";
    } else if (delim === "\\downarrow") {
        top = repeat = "\u23d0";
    } else if (delim === "\\Downarrow") {
        top = repeat = "\u2016";
    } else if (delim === "\\updownarrow") {
        top = "\\uparrow";
        repeat = "\u23d0";
        bottom = "\\downarrow";
    } else if (delim === "\\Updownarrow") {
        top = "\\Uparrow";
        repeat = "\u2016";
        bottom = "\\Downarrow";
    } else if (delim === "[" || delim === "\\lbrack") {
        top = "\u23a1";
        repeat = "\u23a2";
        bottom = "\u23a3";
        font = "Size4-Regular";
    } else if (delim === "]" || delim === "\\rbrack") {
        top = "\u23a4";
        repeat = "\u23a5";
        bottom = "\u23a6";
        font = "Size4-Regular";
    } else if (delim === "\\lfloor") {
        repeat = top = "\u23a2";
        bottom = "\u23a3";
        font = "Size4-Regular";
    } else if (delim === "\\lceil") {
        top = "\u23a1";
        repeat = bottom = "\u23a2";
        font = "Size4-Regular";
    } else if (delim === "\\rfloor") {
        repeat = top = "\u23a5";
        bottom = "\u23a6";
        font = "Size4-Regular";
    } else if (delim === "\\rceil") {
        top = "\u23a4";
        repeat = bottom = "\u23a5";
        font = "Size4-Regular";
    } else if (delim === "(") {
        top = "\u239b";
        repeat = "\u239c";
        bottom = "\u239d";
        font = "Size4-Regular";
    } else if (delim === ")") {
        top = "\u239e";
        repeat = "\u239f";
        bottom = "\u23a0";
        font = "Size4-Regular";
    } else if (delim === "\\{" || delim === "\\lbrace") {
        top = "\u23a7";
        middle = "\u23a8";
        bottom = "\u23a9";
        repeat = "\u23aa";
        font = "Size4-Regular";
    } else if (delim === "\\}" || delim === "\\rbrace") {
        top = "\u23ab";
        middle = "\u23ac";
        bottom = "\u23ad";
        repeat = "\u23aa";
        font = "Size4-Regular";
    } else if (delim === "\\lgroup") {
        top = "\u23a7";
        bottom = "\u23a9";
        repeat = "\u23aa";
        font = "Size4-Regular";
    } else if (delim === "\\rgroup") {
        top = "\u23ab";
        bottom = "\u23ad";
        repeat = "\u23aa";
        font = "Size4-Regular";
    } else if (delim === "\\lmoustache") {
        top = "\u23a7";
        bottom = "\u23ad";
        repeat = "\u23aa";
        font = "Size4-Regular";
    } else if (delim === "\\rmoustache") {
        top = "\u23ab";
        bottom = "\u23a9";
        repeat = "\u23aa";
        font = "Size4-Regular";
    } else if (delim === "\\surd") {
        top = "\ue001";
        bottom = "\u23b7";
        repeat = "\ue000";
        font = "Size4-Regular";
    }

    // Get the metrics of the four sections
    var topMetrics = getMetrics(top, font);
    var topHeightTotal = topMetrics.height + topMetrics.depth;
    var repeatMetrics = getMetrics(repeat, font);
    var repeatHeightTotal = repeatMetrics.height + repeatMetrics.depth;
    var bottomMetrics = getMetrics(bottom, font);
    var bottomHeightTotal = bottomMetrics.height + bottomMetrics.depth;
    var middleHeightTotal = 0;
    var middleFactor = 1;
    if (middle !== null) {
        var middleMetrics = getMetrics(middle, font);
        middleHeightTotal = middleMetrics.height + middleMetrics.depth;
        middleFactor = 2; // repeat symmetrically above and below middle
    }

    // Calcuate the minimal height that the delimiter can have.
    // It is at least the size of the top, bottom, and optional middle combined.
    var minHeight = topHeightTotal + bottomHeightTotal + middleHeightTotal;

    // Compute the number of copies of the repeat symbol we will need
    var repeatCount = Math.ceil(
        (heightTotal - minHeight) / (middleFactor * repeatHeightTotal));

    // Compute the total height of the delimiter including all the symbols
    var realHeightTotal =
        minHeight + repeatCount * middleFactor * repeatHeightTotal;

    // The center of the delimiter is placed at the center of the axis. Note
    // that in this context, "center" means that the delimiter should be
    // centered around the axis in the current style, while normally it is
    // centered around the axis in textstyle.
    var axisHeight = options.style.metrics.axisHeight;
    if (center) {
        axisHeight *= options.style.sizeMultiplier;
    }
    // Calculate the depth
    var depth = realHeightTotal / 2 - axisHeight;

    // Now, we start building the pieces that will go into the vlist

    // Keep a list of the inner pieces
    var inners = [];

    // Add the bottom symbol
    inners.push(makeInner(bottom, font, mode));

    var i;
    if (middle === null) {
        // Add that many symbols
        for (i = 0; i < repeatCount; i++) {
            inners.push(makeInner(repeat, font, mode));
        }
    } else {
        // When there is a middle bit, we need the middle part and two repeated
        // sections
        for (i = 0; i < repeatCount; i++) {
            inners.push(makeInner(repeat, font, mode));
        }
        inners.push(makeInner(middle, font, mode));
        for (i = 0; i < repeatCount; i++) {
            inners.push(makeInner(repeat, font, mode));
        }
    }

    // Add the top symbol
    inners.push(makeInner(top, font, mode));

    // Finally, build the vlist
    var inner = buildCommon.makeVList(inners, "bottom", depth, options);

    return styleWrap(
        makeSpan(["delimsizing", "mult"], [inner], options),
        Style.TEXT, options, classes);
};

// There are three kinds of delimiters, delimiters that stack when they become
// too large
var stackLargeDelimiters = [
    "(", ")", "[", "\\lbrack", "]", "\\rbrack",
    "\\{", "\\lbrace", "\\}", "\\rbrace",
    "\\lfloor", "\\rfloor", "\\lceil", "\\rceil",
    "\\surd"
];

// delimiters that always stack
var stackAlwaysDelimiters = [
    "\\uparrow", "\\downarrow", "\\updownarrow",
    "\\Uparrow", "\\Downarrow", "\\Updownarrow",
    "|", "\\|", "\\vert", "\\Vert",
    "\\lvert", "\\rvert", "\\lVert", "\\rVert",
    "\\lgroup", "\\rgroup", "\\lmoustache", "\\rmoustache"
];

// and delimiters that never stack
var stackNeverDelimiters = [
    "<", ">", "\\langle", "\\rangle", "/", "\\backslash", "\\lt", "\\gt"
];

// Metrics of the different sizes. Found by looking at TeX's output of
// $\bigl| // \Bigl| \biggl| \Biggl| \showlists$
// Used to create stacked delimiters of appropriate sizes in makeSizedDelim.
var sizeToMaxHeight = [0, 1.2, 1.8, 2.4, 3.0];

/**
 * Used to create a delimiter of a specific size, where `size` is 1, 2, 3, or 4.
 */
var makeSizedDelim = function(delim, size, options, mode, classes) {
    // < and > turn into \langle and \rangle in delimiters
    if (delim === "<" || delim === "\\lt") {
        delim = "\\langle";
    } else if (delim === ">" || delim === "\\gt") {
        delim = "\\rangle";
    }

    // Sized delimiters are never centered.
    if (utils.contains(stackLargeDelimiters, delim) ||
        utils.contains(stackNeverDelimiters, delim)) {
        return makeLargeDelim(delim, size, false, options, mode, classes);
    } else if (utils.contains(stackAlwaysDelimiters, delim)) {
        return makeStackedDelim(
            delim, sizeToMaxHeight[size], false, options, mode, classes);
    } else {
        throw new ParseError("Illegal delimiter: '" + delim + "'");
    }
};

/**
 * There are three different sequences of delimiter sizes that the delimiters
 * follow depending on the kind of delimiter. This is used when creating custom
 * sized delimiters to decide whether to create a small, large, or stacked
 * delimiter.
 *
 * In real TeX, these sequences aren't explicitly defined, but are instead
 * defined inside the font metrics. Since there are only three sequences that
 * are possible for the delimiters that TeX defines, it is easier to just encode
 * them explicitly here.
 */

// Delimiters that never stack try small delimiters and large delimiters only
var stackNeverDelimiterSequence = [
    {type: "small", style: Style.SCRIPTSCRIPT},
    {type: "small", style: Style.SCRIPT},
    {type: "small", style: Style.TEXT},
    {type: "large", size: 1},
    {type: "large", size: 2},
    {type: "large", size: 3},
    {type: "large", size: 4}
];

// Delimiters that always stack try the small delimiters first, then stack
var stackAlwaysDelimiterSequence = [
    {type: "small", style: Style.SCRIPTSCRIPT},
    {type: "small", style: Style.SCRIPT},
    {type: "small", style: Style.TEXT},
    {type: "stack"}
];

// Delimiters that stack when large try the small and then large delimiters, and
// stack afterwards
var stackLargeDelimiterSequence = [
    {type: "small", style: Style.SCRIPTSCRIPT},
    {type: "small", style: Style.SCRIPT},
    {type: "small", style: Style.TEXT},
    {type: "large", size: 1},
    {type: "large", size: 2},
    {type: "large", size: 3},
    {type: "large", size: 4},
    {type: "stack"}
];

/**
 * Get the font used in a delimiter based on what kind of delimiter it is.
 */
var delimTypeToFont = function(type) {
    if (type.type === "small") {
        return "Main-Regular";
    } else if (type.type === "large") {
        return "Size" + type.size + "-Regular";
    } else if (type.type === "stack") {
        return "Size4-Regular";
    }
};

/**
 * Traverse a sequence of types of delimiters to decide what kind of delimiter
 * should be used to create a delimiter of the given height+depth.
 */
var traverseSequence = function(delim, height, sequence, options) {
    // Here, we choose the index we should start at in the sequences. In smaller
    // sizes (which correspond to larger numbers in style.size) we start earlier
    // in the sequence. Thus, scriptscript starts at index 3-3=0, script starts
    // at index 3-2=1, text starts at 3-1=2, and display starts at min(2,3-0)=2
    var start = Math.min(2, 3 - options.style.size);
    for (var i = start; i < sequence.length; i++) {
        if (sequence[i].type === "stack") {
            // This is always the last delimiter, so we just break the loop now.
            break;
        }

        var metrics = getMetrics(delim, delimTypeToFont(sequence[i]));
        var heightDepth = metrics.height + metrics.depth;

        // Small delimiters are scaled down versions of the same font, so we
        // account for the style change size.

        if (sequence[i].type === "small") {
            heightDepth *= sequence[i].style.sizeMultiplier;
        }

        // Check if the delimiter at this size works for the given height.
        if (heightDepth > height) {
            return sequence[i];
        }
    }

    // If we reached the end of the sequence, return the last sequence element.
    return sequence[sequence.length - 1];
};

/**
 * Make a delimiter of a given height+depth, with optional centering. Here, we
 * traverse the sequences, and create a delimiter that the sequence tells us to.
 */
var makeCustomSizedDelim = function(delim, height, center, options, mode,
                                    classes) {
    if (delim === "<" || delim === "\\lt") {
        delim = "\\langle";
    } else if (delim === ">" || delim === "\\gt") {
        delim = "\\rangle";
    }

    // Decide what sequence to use
    var sequence;
    if (utils.contains(stackNeverDelimiters, delim)) {
        sequence = stackNeverDelimiterSequence;
    } else if (utils.contains(stackLargeDelimiters, delim)) {
        sequence = stackLargeDelimiterSequence;
    } else {
        sequence = stackAlwaysDelimiterSequence;
    }

    // Look through the sequence
    var delimType = traverseSequence(delim, height, sequence, options);

    // Depending on the sequence element we decided on, call the appropriate
    // function.
    if (delimType.type === "small") {
        return makeSmallDelim(delim, delimType.style, center, options, mode,
                              classes);
    } else if (delimType.type === "large") {
        return makeLargeDelim(delim, delimType.size, center, options, mode,
                              classes);
    } else if (delimType.type === "stack") {
        return makeStackedDelim(delim, height, center, options, mode, classes);
    }
};

/**
 * Make a delimiter for use with `\left` and `\right`, given a height and depth
 * of an expression that the delimiters surround.
 */
var makeLeftRightDelim = function(delim, height, depth, options, mode,
                                  classes) {
    // We always center \left/\right delimiters, so the axis is always shifted
    var axisHeight =
        options.style.metrics.axisHeight * options.style.sizeMultiplier;

    // Taken from TeX source, tex.web, function make_left_right
    var delimiterFactor = 901;
    var delimiterExtend = 5.0 / fontMetrics.metrics.ptPerEm;

    var maxDistFromAxis = Math.max(
        height - axisHeight, depth + axisHeight);

    var totalHeight = Math.max(
        // In real TeX, calculations are done using integral values which are
        // 65536 per pt, or 655360 per em. So, the division here truncates in
        // TeX but doesn't here, producing different results. If we wanted to
        // exactly match TeX's calculation, we could do
        //   Math.floor(655360 * maxDistFromAxis / 500) *
        //    delimiterFactor / 655360
        // (To see the difference, compare
        //    x^{x^{\left(\rule{0.1em}{0.68em}\right)}}
        // in TeX and KaTeX)
        maxDistFromAxis / 500 * delimiterFactor,
        2 * maxDistFromAxis - delimiterExtend);

    // Finally, we defer to `makeCustomSizedDelim` with our calculated total
    // height
    return makeCustomSizedDelim(delim, totalHeight, true, options, mode,
                                classes);
};

module.exports = {
    sizedDelim: makeSizedDelim,
    customSizedDelim: makeCustomSizedDelim,
    leftRightDelim: makeLeftRightDelim
};

},{"./ParseError":6,"./Style":9,"./buildCommon":10,"./fontMetrics":17,"./symbols":23,"./utils":25}],15:[function(require,module,exports){
/**
 * These objects store the data about the DOM nodes we create, as well as some
 * extra data. They can then be transformed into real DOM nodes with the
 * `toNode` function or HTML markup using `toMarkup`. They are useful for both
 * storing extra properties on the nodes, as well as providing a way to easily
 * work with the DOM.
 *
 * Similar functions for working with MathML nodes exist in mathMLTree.js.
 */
var unicodeRegexes = require("./unicodeRegexes");
var utils = require("./utils");

/**
 * Create an HTML className based on a list of classes. In addition to joining
 * with spaces, we also remove null or empty classes.
 */
var createClass = function(classes) {
    classes = classes.slice();
    for (var i = classes.length - 1; i >= 0; i--) {
        if (!classes[i]) {
            classes.splice(i, 1);
        }
    }

    return classes.join(" ");
};

/**
 * This node represents a span node, with a className, a list of children, and
 * an inline style. It also contains information about its height, depth, and
 * maxFontSize.
 */
function span(classes, children, options) {
    this.classes = classes || [];
    this.children = children || [];
    this.height = 0;
    this.depth = 0;
    this.maxFontSize = 0;
    this.style = {};
    this.attributes = {};
    if (options) {
        if (options.style.isTight()) {
            this.classes.push("mtight");
        }
        if (options.getColor()) {
            this.style.color = options.getColor();
        }
    }
}

/**
 * Sets an arbitrary attribute on the span. Warning: use this wisely. Not all
 * browsers support attributes the same, and having too many custom attributes
 * is probably bad.
 */
span.prototype.setAttribute = function(attribute, value) {
    this.attributes[attribute] = value;
};

span.prototype.tryCombine = function(sibling) {
    return false;
};

/**
 * Convert the span into an HTML node
 */
span.prototype.toNode = function() {
    var span = document.createElement("span");

    // Apply the class
    span.className = createClass(this.classes);

    // Apply inline styles
    for (var style in this.style) {
        if (Object.prototype.hasOwnProperty.call(this.style, style)) {
            span.style[style] = this.style[style];
        }
    }

    // Apply attributes
    for (var attr in this.attributes) {
        if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) {
            span.setAttribute(attr, this.attributes[attr]);
        }
    }

    // Append the children, also as HTML nodes
    for (var i = 0; i < this.children.length; i++) {
        span.appendChild(this.children[i].toNode());
    }

    return span;
};

/**
 * Convert the span into an HTML markup string
 */
span.prototype.toMarkup = function() {
    var markup = "<span";

    // Add the class
    if (this.classes.length) {
        markup += " class=\"";
        markup += utils.escape(createClass(this.classes));
        markup += "\"";
    }

    var styles = "";

    // Add the styles, after hyphenation
    for (var style in this.style) {
        if (this.style.hasOwnProperty(style)) {
            styles += utils.hyphenate(style) + ":" + this.style[style] + ";";
        }
    }

    if (styles) {
        markup += " style=\"" + utils.escape(styles) + "\"";
    }

    // Add the attributes
    for (var attr in this.attributes) {
        if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) {
            markup += " " + attr + "=\"";
            markup += utils.escape(this.attributes[attr]);
            markup += "\"";
        }
    }

    markup += ">";

    // Add the markup of the children, also as markup
    for (var i = 0; i < this.children.length; i++) {
        markup += this.children[i].toMarkup();
    }

    markup += "</span>";

    return markup;
};

/**
 * This node represents a document fragment, which contains elements, but when
 * placed into the DOM doesn't have any representation itself. Thus, it only
 * contains children and doesn't have any HTML properties. It also keeps track
 * of a height, depth, and maxFontSize.
 */
function documentFragment(children) {
    this.children = children || [];
    this.height = 0;
    this.depth = 0;
    this.maxFontSize = 0;
}

/**
 * Convert the fragment into a node
 */
documentFragment.prototype.toNode = function() {
    // Create a fragment
    var frag = document.createDocumentFragment();

    // Append the children
    for (var i = 0; i < this.children.length; i++) {
        frag.appendChild(this.children[i].toNode());
    }

    return frag;
};

/**
 * Convert the fragment into HTML markup
 */
documentFragment.prototype.toMarkup = function() {
    var markup = "";

    // Simply concatenate the markup for the children together
    for (var i = 0; i < this.children.length; i++) {
        markup += this.children[i].toMarkup();
    }

    return markup;
};

var iCombinations = {
    'î': '\u0131\u0302',
    'ï': '\u0131\u0308',
    'í': '\u0131\u0301',
    // 'ī': '\u0131\u0304', // enable when we add Extended Latin
    'ì': '\u0131\u0300'
};

/**
 * A symbol node contains information about a single symbol. It either renders
 * to a single text node, or a span with a single text node in it, depending on
 * whether it has CSS classes, styles, or needs italic correction.
 */
function symbolNode(value, height, depth, italic, skew, classes, style) {
    this.value = value || "";
    this.height = height || 0;
    this.depth = depth || 0;
    this.italic = italic || 0;
    this.skew = skew || 0;
    this.classes = classes || [];
    this.style = style || {};
    this.maxFontSize = 0;

    // Mark CJK characters with specific classes so that we can specify which
    // fonts to use.  This allows us to render these characters with a serif
    // font in situations where the browser would either default to a sans serif
    // or render a placeholder character.
    if (unicodeRegexes.cjkRegex.test(value)) {
        // I couldn't find any fonts that contained Hangul as well as all of
        // the other characters we wanted to test there for it gets its own
        // CSS class.
        if (unicodeRegexes.hangulRegex.test(value)) {
            this.classes.push('hangul_fallback');
        } else {
            this.classes.push('cjk_fallback');
        }
    }

    if (/[îïíì]/.test(this.value)) {    // add ī when we add Extended Latin
        this.value = iCombinations[this.value];
    }
}

symbolNode.prototype.tryCombine = function(sibling) {
    if (!sibling
        || !(sibling instanceof symbolNode)
        || this.italic > 0
        || createClass(this.classes) !== createClass(sibling.classes)
        || this.skew !== sibling.skew
        || this.maxFontSize !== sibling.maxFontSize) {
        return false;
    }
    for (var style in this.style) {
        if (this.style.hasOwnProperty(style)
            && this.style[style] !== sibling.style[style]) {
            return false;
        }
    }
    for (style in sibling.style) {
        if (sibling.style.hasOwnProperty(style)
            && this.style[style] !== sibling.style[style]) {
            return false;
        }
    }
    this.value += sibling.value;
    this.height = Math.max(this.height, sibling.height);
    this.depth = Math.max(this.depth, sibling.depth);
    this.italic = sibling.italic;
    return true;
};

/**
 * Creates a text node or span from a symbol node. Note that a span is only
 * created if it is needed.
 */
symbolNode.prototype.toNode = function() {
    var node = document.createTextNode(this.value);
    var span = null;

    if (this.italic > 0) {
        span = document.createElement("span");
        span.style.marginRight = this.italic + "em";
    }

    if (this.classes.length > 0) {
        span = span || document.createElement("span");
        span.className = createClass(this.classes);
    }

    for (var style in this.style) {
        if (this.style.hasOwnProperty(style)) {
            span = span || document.createElement("span");
            span.style[style] = this.style[style];
        }
    }

    if (span) {
        span.appendChild(node);
        return span;
    } else {
        return node;
    }
};

/**
 * Creates markup for a symbol node.
 */
symbolNode.prototype.toMarkup = function() {
    // TODO(alpert): More duplication than I'd like from
    // span.prototype.toMarkup and symbolNode.prototype.toNode...
    var needsSpan = false;

    var markup = "<span";

    if (this.classes.length) {
        needsSpan = true;
        markup += " class=\"";
        markup += utils.escape(createClass(this.classes));
        markup += "\"";
    }

    var styles = "";

    if (this.italic > 0) {
        styles += "margin-right:" + this.italic + "em;";
    }
    for (var style in this.style) {
        if (this.style.hasOwnProperty(style)) {
            styles += utils.hyphenate(style) + ":" + this.style[style] + ";";
        }
    }

    if (styles) {
        needsSpan = true;
        markup += " style=\"" + utils.escape(styles) + "\"";
    }

    var escaped = utils.escape(this.value);
    if (needsSpan) {
        markup += ">";
        markup += escaped;
        markup += "</span>";
        return markup;
    } else {
        return escaped;
    }
};

module.exports = {
    span: span,
    documentFragment: documentFragment,
    symbolNode: symbolNode
};

},{"./unicodeRegexes":24,"./utils":25}],16:[function(require,module,exports){
/* eslint no-constant-condition:0 */
var parseData = require("./parseData");
var ParseError = require("./ParseError");
var Style = require("./Style");

var ParseNode = parseData.ParseNode;

/**
 * Parse the body of the environment, with rows delimited by \\ and
 * columns delimited by &, and create a nested list in row-major order
 * with one group per cell.
 */
function parseArray(parser, result) {
    var row = [];
    var body = [row];
    var rowGaps = [];
    while (true) {
        var cell = parser.parseExpression(false, null);
        row.push(new ParseNode("ordgroup", cell, parser.mode));
        var next = parser.nextToken.text;
        if (next === "&") {
            parser.consume();
        } else if (next === "\\end") {
            break;
        } else if (next === "\\\\" || next === "\\cr") {
            var cr = parser.parseFunction();
            rowGaps.push(cr.value.size);
            row = [];
            body.push(row);
        } else {
            throw new ParseError("Expected & or \\\\ or \\end",
                                 parser.nextToken);
        }
    }
    result.body = body;
    result.rowGaps = rowGaps;
    return new ParseNode(result.type, result, parser.mode);
}

/*
 * An environment definition is very similar to a function definition:
 * it is declared with a name or a list of names, a set of properties
 * and a handler containing the actual implementation.
 *
 * The properties include:
 *  - numArgs: The number of arguments after the \begin{name} function.
 *  - argTypes: (optional) Just like for a function
 *  - allowedInText: (optional) Whether or not the environment is allowed inside
 *                   text mode (default false) (not enforced yet)
 *  - numOptionalArgs: (optional) Just like for a function
 * A bare number instead of that object indicates the numArgs value.
 *
 * The handler function will receive two arguments
 *  - context: information and references provided by the parser
 *  - args: an array of arguments passed to \begin{name}
 * The context contains the following properties:
 *  - envName: the name of the environment, one of the listed names.
 *  - parser: the parser object
 *  - lexer: the lexer object
 *  - positions: the positions associated with these arguments from args.
 * The handler must return a ParseResult.
 */

function defineEnvironment(names, props, handler) {
    if (typeof names === "string") {
        names = [names];
    }
    if (typeof props === "number") {
        props = { numArgs: props };
    }
    // Set default values of environments
    var data = {
        numArgs: props.numArgs || 0,
        argTypes: props.argTypes,
        greediness: 1,
        allowedInText: !!props.allowedInText,
        numOptionalArgs: props.numOptionalArgs || 0,
        handler: handler
    };
    for (var i = 0; i < names.length; ++i) {
        module.exports[names[i]] = data;
    }
}

// Arrays are part of LaTeX, defined in lttab.dtx so its documentation
// is part of the source2e.pdf file of LaTeX2e source documentation.
defineEnvironment("array", {
    numArgs: 1
}, function(context, args) {
    var colalign = args[0];
    colalign = colalign.value.map ? colalign.value : [colalign];
    var cols = colalign.map(function(node) {
        var ca = node.value;
        if ("lcr".indexOf(ca) !== -1) {
            return {
                type: "align",
                align: ca
            };
        } else if (ca === "|") {
            return {
                type: "separator",
                separator: "|"
            };
        }
        throw new ParseError(
            "Unknown column alignment: " + node.value,
            node);
    });
    var res = {
        type: "array",
        cols: cols,
        hskipBeforeAndAfter: true // \@preamble in lttab.dtx
    };
    res = parseArray(context.parser, res);
    return res;
});

// The matrix environments of amsmath builds on the array environment
// of LaTeX, which is discussed above.
defineEnvironment([
    "matrix",
    "pmatrix",
    "bmatrix",
    "Bmatrix",
    "vmatrix",
    "Vmatrix"
], {
}, function(context) {
    var delimiters = {
        "matrix": null,
        "pmatrix": ["(", ")"],
        "bmatrix": ["[", "]"],
        "Bmatrix": ["\\{", "\\}"],
        "vmatrix": ["|", "|"],
        "Vmatrix": ["\\Vert", "\\Vert"]
    }[context.envName];
    var res = {
        type: "array",
        hskipBeforeAndAfter: false // \hskip -\arraycolsep in amsmath
    };
    res = parseArray(context.parser, res);
    if (delimiters) {
        res = new ParseNode("leftright", {
            body: [res],
            left: delimiters[0],
            right: delimiters[1]
        }, context.mode);
    }
    return res;
});

// A cases environment (in amsmath.sty) is almost equivalent to
// \def\arraystretch{1.2}%
// \left\{\begin{array}{@{}l@{\quad}l@{}} … \end{array}\right.
defineEnvironment("cases", {
}, function(context) {
    var res = {
        type: "array",
        arraystretch: 1.2,
        cols: [{
            type: "align",
            align: "l",
            pregap: 0,
            // TODO(kevinb) get the current style.
            // For now we use the metrics for TEXT style which is what we were
            // doing before.  Before attempting to get the current style we
            // should look at TeX's behavior especially for \over and matrices.
            postgap: Style.TEXT.metrics.quad
        }, {
            type: "align",
            align: "l",
            pregap: 0,
            postgap: 0
        }]
    };
    res = parseArray(context.parser, res);
    res = new ParseNode("leftright", {
        body: [res],
        left: "\\{",
        right: "."
    }, context.mode);
    return res;
});

// An aligned environment is like the align* environment
// except it operates within math mode.
// Note that we assume \nomallineskiplimit to be zero,
// so that \strut@ is the same as \strut.
defineEnvironment("aligned", {
}, function(context) {
    var res = {
        type: "array",
        cols: []
    };
    res = parseArray(context.parser, res);
    var emptyGroup = new ParseNode("ordgroup", [], context.mode);
    var numCols = 0;
    res.value.body.forEach(function(row) {
        var i;
        for (i = 1; i < row.length; i += 2) {
            row[i].value.unshift(emptyGroup);
        }
        if (numCols < row.length) {
            numCols = row.length;
        }
    });
    for (var i = 0; i < numCols; ++i) {
        var align = "r";
        var pregap = 0;
        if (i % 2 === 1) {
            align = "l";
        } else if (i > 0) {
            pregap = 2; // one \qquad between columns
        }
        res.value.cols[i] = {
            type: "align",
            align: align,
            pregap: pregap,
            postgap: 0
        };
    }
    return res;
});

},{"./ParseError":6,"./Style":9,"./parseData":21}],17:[function(require,module,exports){
/* eslint no-unused-vars:0 */

var Style = require("./Style");
var cjkRegex = require("./unicodeRegexes").cjkRegex;

/**
 * This file contains metrics regarding fonts and individual symbols. The sigma
 * and xi variables, as well as the metricMap map contain data extracted from
 * TeX, TeX font metrics, and the TTF files. These data are then exposed via the
 * `metrics` variable and the getCharacterMetrics function.
 */

// In TeX, there are actually three sets of dimensions, one for each of
// textstyle, scriptstyle, and scriptscriptstyle.  These are provided in the
// the arrays below, in that order.
//
// The font metrics are stored in fonts cmsy10, cmsy7, and cmsy5 respsectively.
// This was determined by running the folllowing script:
//
//     latex -interaction=nonstopmode \
//     '\documentclass{article}\usepackage{amsmath}\begin{document}' \
//     '$a$ \expandafter\show\the\textfont2' \
//     '\expandafter\show\the\scriptfont2' \
//     '\expandafter\show\the\scriptscriptfont2' \
//     '\stop'
//
// The metrics themselves were retreived using the following commands:
//
//     tftopl cmsy10
//     tftopl cmsy7
//     tftopl cmsy5
//
// The output of each of these commands is quite lengthy.  The only part we
// care about is the FONTDIMEN section. Each value is measured in EMs.
var sigmas = {
    slant: [0.250, 0.250, 0.250],       // sigma1
    space: [0.000, 0.000, 0.000],       // sigma2
    stretch: [0.000, 0.000, 0.000],     // sigma3
    shrink: [0.000, 0.000, 0.000],      // sigma4
    xHeight: [0.431, 0.431, 0.431],     // sigma5
    quad: [1.000, 1.171, 1.472],        // sigma6
    extraSpace: [0.000, 0.000, 0.000],  // sigma7
    num1: [0.677, 0.732, 0.925],        // sigma8
    num2: [0.394, 0.384, 0.387],        // sigma9
    num3: [0.444, 0.471, 0.504],        // sigma10
    denom1: [0.686, 0.752, 1.025],      // sigma11
    denom2: [0.345, 0.344, 0.532],      // sigma12
    sup1: [0.413, 0.503, 0.504],        // sigma13
    sup2: [0.363, 0.431, 0.404],        // sigma14
    sup3: [0.289, 0.286, 0.294],        // sigma15
    sub1: [0.150, 0.143, 0.200],        // sigma16
    sub2: [0.247, 0.286, 0.400],        // sigma17
    supDrop: [0.386, 0.353, 0.494],     // sigma18
    subDrop: [0.050, 0.071, 0.100],     // sigma19
    delim1: [2.390, 1.700, 1.980],      // sigma20
    delim2: [1.010, 1.157, 1.420],      // sigma21
    axisHeight: [0.250, 0.250, 0.250]  // sigma22
};

// These font metrics are extracted from TeX by using
// \font\a=cmex10
// \showthe\fontdimenX\a
// where X is the corresponding variable number. These correspond to the font
// parameters of the extension fonts (family 3). See the TeXbook, page 441.
var xi1 = 0;
var xi2 = 0;
var xi3 = 0;
var xi4 = 0;
var xi5 = 0.431;
var xi6 = 1;
var xi7 = 0;
var xi8 = 0.04;
var xi9 = 0.111;
var xi10 = 0.166;
var xi11 = 0.2;
var xi12 = 0.6;
var xi13 = 0.1;

// This value determines how large a pt is, for metrics which are defined in
// terms of pts.
// This value is also used in katex.less; if you change it make sure the values
// match.
var ptPerEm = 10.0;

// The space between adjacent `|` columns in an array definition. From
// `\showthe\doublerulesep` in LaTeX.
var doubleRuleSep = 2.0 / ptPerEm;

/**
 * This is just a mapping from common names to real metrics
 */
var metrics = {
    defaultRuleThickness: xi8,
    bigOpSpacing1: xi9,
    bigOpSpacing2: xi10,
    bigOpSpacing3: xi11,
    bigOpSpacing4: xi12,
    bigOpSpacing5: xi13,
    ptPerEm: ptPerEm,
    doubleRuleSep: doubleRuleSep
};

// This map contains a mapping from font name and character code to character
// metrics, including height, depth, italic correction, and skew (kern from the
// character to the corresponding \skewchar)
// This map is generated via `make metrics`. It should not be changed manually.
var metricMap = require("./fontMetricsData");

// These are very rough approximations.  We default to Times New Roman which
// should have Latin-1 and Cyrillic characters, but may not depending on the
// operating system.  The metrics do not account for extra height from the
// accents.  In the case of Cyrillic characters which have both ascenders and
// descenders we prefer approximations with ascenders, primarily to prevent
// the fraction bar or root line from intersecting the glyph.
// TODO(kevinb) allow union of multiple glyph metrics for better accuracy.
var extraCharacterMap = {
    // Latin-1
    'À': 'A',
    'Á': 'A',
    'Â': 'A',
    'Ã': 'A',
    'Ä': 'A',
    'Å': 'A',
    'Æ': 'A',
    'Ç': 'C',
    'È': 'E',
    'É': 'E',
    'Ê': 'E',
    'Ë': 'E',
    'Ì': 'I',
    'Í': 'I',
    'Î': 'I',
    'Ï': 'I',
    'Ð': 'D',
    'Ñ': 'N',
    'Ò': 'O',
    'Ó': 'O',
    'Ô': 'O',
    'Õ': 'O',
    'Ö': 'O',
    'Ø': 'O',
    'Ù': 'U',
    'Ú': 'U',
    'Û': 'U',
    'Ü': 'U',
    'Ý': 'Y',
    'Þ': 'o',
    'ß': 'B',
    'à': 'a',
    'á': 'a',
    'â': 'a',
    'ã': 'a',
    'ä': 'a',
    'å': 'a',
    'æ': 'a',
    'ç': 'c',
    'è': 'e',
    'é': 'e',
    'ê': 'e',
    'ë': 'e',
    'ì': 'i',
    'í': 'i',
    'î': 'i',
    'ï': 'i',
    'ð': 'd',
    'ñ': 'n',
    'ò': 'o',
    'ó': 'o',
    'ô': 'o',
    'õ': 'o',
    'ö': 'o',
    'ø': 'o',
    'ù': 'u',
    'ú': 'u',
    'û': 'u',
    'ü': 'u',
    'ý': 'y',
    'þ': 'o',
    'ÿ': 'y',

    // Cyrillic
    'А': 'A',
    'Б': 'B',
    'В': 'B',
    'Г': 'F',
    'Д': 'A',
    'Е': 'E',
    'Ж': 'K',
    'З': '3',
    'И': 'N',
    'Й': 'N',
    'К': 'K',
    'Л': 'N',
    'М': 'M',
    'Н': 'H',
    'О': 'O',
    'П': 'N',
    'Р': 'P',
    'С': 'C',
    'Т': 'T',
    'У': 'y',
    'Ф': 'O',
    'Х': 'X',
    'Ц': 'U',
    'Ч': 'h',
    'Ш': 'W',
    'Щ': 'W',
    'Ъ': 'B',
    'Ы': 'X',
    'Ь': 'B',
    'Э': '3',
    'Ю': 'X',
    'Я': 'R',
    'а': 'a',
    'б': 'b',
    'в': 'a',
    'г': 'r',
    'д': 'y',
    'е': 'e',
    'ж': 'm',
    'з': 'e',
    'и': 'n',
    'й': 'n',
    'к': 'n',
    'л': 'n',
    'м': 'm',
    'н': 'n',
    'о': 'o',
    'п': 'n',
    'р': 'p',
    'с': 'c',
    'т': 'o',
    'у': 'y',
    'ф': 'b',
    'х': 'x',
    'ц': 'n',
    'ч': 'n',
    'ш': 'w',
    'щ': 'w',
    'ъ': 'a',
    'ы': 'm',
    'ь': 'a',
    'э': 'e',
    'ю': 'm',
    'я': 'r'
};

/**
 * This function is a convenience function for looking up information in the
 * metricMap table. It takes a character as a string, and a style.
 *
 * Note: the `width` property may be undefined if fontMetricsData.js wasn't
 * built using `Make extended_metrics`.
 */
var getCharacterMetrics = function(character, style) {
    var ch = character.charCodeAt(0);
    if (character[0] in extraCharacterMap) {
        ch = extraCharacterMap[character[0]].charCodeAt(0);
    } else if (cjkRegex.test(character[0])) {
        ch = 'M'.charCodeAt(0);
    }
    var metrics = metricMap[style][ch];
    if (metrics) {
        return {
            depth: metrics[0],
            height: metrics[1],
            italic: metrics[2],
            skew: metrics[3],
            width: metrics[4]
        };
    }
};

module.exports = {
    metrics: metrics,
    sigmas: sigmas,
    getCharacterMetrics: getCharacterMetrics
};

},{"./Style":9,"./fontMetricsData":18,"./unicodeRegexes":24}],18:[function(require,module,exports){
module.exports = {
    "AMS-Regular": {
        "65": [0, 0.68889, 0, 0],
        "66": [0, 0.68889, 0, 0],
        "67": [0, 0.68889, 0, 0],
        "68": [0, 0.68889, 0, 0],
        "69": [0, 0.68889, 0, 0],
        "70": [0, 0.68889, 0, 0],
        "71": [0, 0.68889, 0, 0],
        "72": [0, 0.68889, 0, 0],
        "73": [0, 0.68889, 0, 0],
        "74": [0.16667, 0.68889, 0, 0],
        "75": [0, 0.68889, 0, 0],
        "76": [0, 0.68889, 0, 0],
        "77": [0, 0.68889, 0, 0],
        "78": [0, 0.68889, 0, 0],
        "79": [0.16667, 0.68889, 0, 0],
        "80": [0, 0.68889, 0, 0],
        "81": [0.16667, 0.68889, 0, 0],
        "82": [0, 0.68889, 0, 0],
        "83": [0, 0.68889, 0, 0],
        "84": [0, 0.68889, 0, 0],
        "85": [0, 0.68889, 0, 0],
        "86": [0, 0.68889, 0, 0],
        "87": [0, 0.68889, 0, 0],
        "88": [0, 0.68889, 0, 0],
        "89": [0, 0.68889, 0, 0],
        "90": [0, 0.68889, 0, 0],
        "107": [0, 0.68889, 0, 0],
        "165": [0, 0.675, 0.025, 0],
        "174": [0.15559, 0.69224, 0, 0],
        "240": [0, 0.68889, 0, 0],
        "295": [0, 0.68889, 0, 0],
        "710": [0, 0.825, 0, 0],
        "732": [0, 0.9, 0, 0],
        "770": [0, 0.825, 0, 0],
        "771": [0, 0.9, 0, 0],
        "989": [0.08167, 0.58167, 0, 0],
        "1008": [0, 0.43056, 0.04028, 0],
        "8245": [0, 0.54986, 0, 0],
        "8463": [0, 0.68889, 0, 0],
        "8487": [0, 0.68889, 0, 0],
        "8498": [0, 0.68889, 0, 0],
        "8502": [0, 0.68889, 0, 0],
        "8503": [0, 0.68889, 0, 0],
        "8504": [0, 0.68889, 0, 0],
        "8513": [0, 0.68889, 0, 0],
        "8592": [-0.03598, 0.46402, 0, 0],
        "8594": [-0.03598, 0.46402, 0, 0],
        "8602": [-0.13313, 0.36687, 0, 0],
        "8603": [-0.13313, 0.36687, 0, 0],
        "8606": [0.01354, 0.52239, 0, 0],
        "8608": [0.01354, 0.52239, 0, 0],
        "8610": [0.01354, 0.52239, 0, 0],
        "8611": [0.01354, 0.52239, 0, 0],
        "8619": [0, 0.54986, 0, 0],
        "8620": [0, 0.54986, 0, 0],
        "8621": [-0.13313, 0.37788, 0, 0],
        "8622": [-0.13313, 0.36687, 0, 0],
        "8624": [0, 0.69224, 0, 0],
        "8625": [0, 0.69224, 0, 0],
        "8630": [0, 0.43056, 0, 0],
        "8631": [0, 0.43056, 0, 0],
        "8634": [0.08198, 0.58198, 0, 0],
        "8635": [0.08198, 0.58198, 0, 0],
        "8638": [0.19444, 0.69224, 0, 0],
        "8639": [0.19444, 0.69224, 0, 0],
        "8642": [0.19444, 0.69224, 0, 0],
        "8643": [0.19444, 0.69224, 0, 0],
        "8644": [0.1808, 0.675, 0, 0],
        "8646": [0.1808, 0.675, 0, 0],
        "8647": [0.1808, 0.675, 0, 0],
        "8648": [0.19444, 0.69224, 0, 0],
        "8649": [0.1808, 0.675, 0, 0],
        "8650": [0.19444, 0.69224, 0, 0],
        "8651": [0.01354, 0.52239, 0, 0],
        "8652": [0.01354, 0.52239, 0, 0],
        "8653": [-0.13313, 0.36687, 0, 0],
        "8654": [-0.13313, 0.36687, 0, 0],
        "8655": [-0.13313, 0.36687, 0, 0],
        "8666": [0.13667, 0.63667, 0, 0],
        "8667": [0.13667, 0.63667, 0, 0],
        "8669": [-0.13313, 0.37788, 0, 0],
        "8672": [-0.064, 0.437, 0, 0],
        "8674": [-0.064, 0.437, 0, 0],
        "8705": [0, 0.825, 0, 0],
        "8708": [0, 0.68889, 0, 0],
        "8709": [0.08167, 0.58167, 0, 0],
        "8717": [0, 0.43056, 0, 0],
        "8722": [-0.03598, 0.46402, 0, 0],
        "8724": [0.08198, 0.69224, 0, 0],
        "8726": [0.08167, 0.58167, 0, 0],
        "8733": [0, 0.69224, 0, 0],
        "8736": [0, 0.69224, 0, 0],
        "8737": [0, 0.69224, 0, 0],
        "8738": [0.03517, 0.52239, 0, 0],
        "8739": [0.08167, 0.58167, 0, 0],
        "8740": [0.25142, 0.74111, 0, 0],
        "8741": [0.08167, 0.58167, 0, 0],
        "8742": [0.25142, 0.74111, 0, 0],
        "8756": [0, 0.69224, 0, 0],
        "8757": [0, 0.69224, 0, 0],
        "8764": [-0.13313, 0.36687, 0, 0],
        "8765": [-0.13313, 0.37788, 0, 0],
        "8769": [-0.13313, 0.36687, 0, 0],
        "8770": [-0.03625, 0.46375, 0, 0],
        "8774": [0.30274, 0.79383, 0, 0],
        "8776": [-0.01688, 0.48312, 0, 0],
        "8778": [0.08167, 0.58167, 0, 0],
        "8782": [0.06062, 0.54986, 0, 0],
        "8783": [0.06062, 0.54986, 0, 0],
        "8785": [0.08198, 0.58198, 0, 0],
        "8786": [0.08198, 0.58198, 0, 0],
        "8787": [0.08198, 0.58198, 0, 0],
        "8790": [0, 0.69224, 0, 0],
        "8791": [0.22958, 0.72958, 0, 0],
        "8796": [0.08198, 0.91667, 0, 0],
        "8806": [0.25583, 0.75583, 0, 0],
        "8807": [0.25583, 0.75583, 0, 0],
        "8808": [0.25142, 0.75726, 0, 0],
        "8809": [0.25142, 0.75726, 0, 0],
        "8812": [0.25583, 0.75583, 0, 0],
        "8814": [0.20576, 0.70576, 0, 0],
        "8815": [0.20576, 0.70576, 0, 0],
        "8816": [0.30274, 0.79383, 0, 0],
        "8817": [0.30274, 0.79383, 0, 0],
        "8818": [0.22958, 0.72958, 0, 0],
        "8819": [0.22958, 0.72958, 0, 0],
        "8822": [0.1808, 0.675, 0, 0],
        "8823": [0.1808, 0.675, 0, 0],
        "8828": [0.13667, 0.63667, 0, 0],
        "8829": [0.13667, 0.63667, 0, 0],
        "8830": [0.22958, 0.72958, 0, 0],
        "8831": [0.22958, 0.72958, 0, 0],
        "8832": [0.20576, 0.70576, 0, 0],
        "8833": [0.20576, 0.70576, 0, 0],
        "8840": [0.30274, 0.79383, 0, 0],
        "8841": [0.30274, 0.79383, 0, 0],
        "8842": [0.13597, 0.63597, 0, 0],
        "8843": [0.13597, 0.63597, 0, 0],
        "8847": [0.03517, 0.54986, 0, 0],
        "8848": [0.03517, 0.54986, 0, 0],
        "8858": [0.08198, 0.58198, 0, 0],
        "8859": [0.08198, 0.58198, 0, 0],
        "8861": [0.08198, 0.58198, 0, 0],
        "8862": [0, 0.675, 0, 0],
        "8863": [0, 0.675, 0, 0],
        "8864": [0, 0.675, 0, 0],
        "8865": [0, 0.675, 0, 0],
        "8872": [0, 0.69224, 0, 0],
        "8873": [0, 0.69224, 0, 0],
        "8874": [0, 0.69224, 0, 0],
        "8876": [0, 0.68889, 0, 0],
        "8877": [0, 0.68889, 0, 0],
        "8878": [0, 0.68889, 0, 0],
        "8879": [0, 0.68889, 0, 0],
        "8882": [0.03517, 0.54986, 0, 0],
        "8883": [0.03517, 0.54986, 0, 0],
        "8884": [0.13667, 0.63667, 0, 0],
        "8885": [0.13667, 0.63667, 0, 0],
        "8888": [0, 0.54986, 0, 0],
        "8890": [0.19444, 0.43056, 0, 0],
        "8891": [0.19444, 0.69224, 0, 0],
        "8892": [0.19444, 0.69224, 0, 0],
        "8901": [0, 0.54986, 0, 0],
        "8903": [0.08167, 0.58167, 0, 0],
        "8905": [0.08167, 0.58167, 0, 0],
        "8906": [0.08167, 0.58167, 0, 0],
        "8907": [0, 0.69224, 0, 0],
        "8908": [0, 0.69224, 0, 0],
        "8909": [-0.03598, 0.46402, 0, 0],
        "8910": [0, 0.54986, 0, 0],
        "8911": [0, 0.54986, 0, 0],
        "8912": [0.03517, 0.54986, 0, 0],
        "8913": [0.03517, 0.54986, 0, 0],
        "8914": [0, 0.54986, 0, 0],
        "8915": [0, 0.54986, 0, 0],
        "8916": [0, 0.69224, 0, 0],
        "8918": [0.0391, 0.5391, 0, 0],
        "8919": [0.0391, 0.5391, 0, 0],
        "8920": [0.03517, 0.54986, 0, 0],
        "8921": [0.03517, 0.54986, 0, 0],
        "8922": [0.38569, 0.88569, 0, 0],
        "8923": [0.38569, 0.88569, 0, 0],
        "8926": [0.13667, 0.63667, 0, 0],
        "8927": [0.13667, 0.63667, 0, 0],
        "8928": [0.30274, 0.79383, 0, 0],
        "8929": [0.30274, 0.79383, 0, 0],
        "8934": [0.23222, 0.74111, 0, 0],
        "8935": [0.23222, 0.74111, 0, 0],
        "8936": [0.23222, 0.74111, 0, 0],
        "8937": [0.23222, 0.74111, 0, 0],
        "8938": [0.20576, 0.70576, 0, 0],
        "8939": [0.20576, 0.70576, 0, 0],
        "8940": [0.30274, 0.79383, 0, 0],
        "8941": [0.30274, 0.79383, 0, 0],
        "8994": [0.19444, 0.69224, 0, 0],
        "8995": [0.19444, 0.69224, 0, 0],
        "9416": [0.15559, 0.69224, 0, 0],
        "9484": [0, 0.69224, 0, 0],
        "9488": [0, 0.69224, 0, 0],
        "9492": [0, 0.37788, 0, 0],
        "9496": [0, 0.37788, 0, 0],
        "9585": [0.19444, 0.68889, 0, 0],
        "9586": [0.19444, 0.74111, 0, 0],
        "9632": [0, 0.675, 0, 0],
        "9633": [0, 0.675, 0, 0],
        "9650": [0, 0.54986, 0, 0],
        "9651": [0, 0.54986, 0, 0],
        "9654": [0.03517, 0.54986, 0, 0],
        "9660": [0, 0.54986, 0, 0],
        "9661": [0, 0.54986, 0, 0],
        "9664": [0.03517, 0.54986, 0, 0],
        "9674": [0.11111, 0.69224, 0, 0],
        "9733": [0.19444, 0.69224, 0, 0],
        "10003": [0, 0.69224, 0, 0],
        "10016": [0, 0.69224, 0, 0],
        "10731": [0.11111, 0.69224, 0, 0],
        "10846": [0.19444, 0.75583, 0, 0],
        "10877": [0.13667, 0.63667, 0, 0],
        "10878": [0.13667, 0.63667, 0, 0],
        "10885": [0.25583, 0.75583, 0, 0],
        "10886": [0.25583, 0.75583, 0, 0],
        "10887": [0.13597, 0.63597, 0, 0],
        "10888": [0.13597, 0.63597, 0, 0],
        "10889": [0.26167, 0.75726, 0, 0],
        "10890": [0.26167, 0.75726, 0, 0],
        "10891": [0.48256, 0.98256, 0, 0],
        "10892": [0.48256, 0.98256, 0, 0],
        "10901": [0.13667, 0.63667, 0, 0],
        "10902": [0.13667, 0.63667, 0, 0],
        "10933": [0.25142, 0.75726, 0, 0],
        "10934": [0.25142, 0.75726, 0, 0],
        "10935": [0.26167, 0.75726, 0, 0],
        "10936": [0.26167, 0.75726, 0, 0],
        "10937": [0.26167, 0.75726, 0, 0],
        "10938": [0.26167, 0.75726, 0, 0],
        "10949": [0.25583, 0.75583, 0, 0],
        "10950": [0.25583, 0.75583, 0, 0],
        "10955": [0.28481, 0.79383, 0, 0],
        "10956": [0.28481, 0.79383, 0, 0],
        "57350": [0.08167, 0.58167, 0, 0],
        "57351": [0.08167, 0.58167, 0, 0],
        "57352": [0.08167, 0.58167, 0, 0],
        "57353": [0, 0.43056, 0.04028, 0],
        "57356": [0.25142, 0.75726, 0, 0],
        "57357": [0.25142, 0.75726, 0, 0],
        "57358": [0.41951, 0.91951, 0, 0],
        "57359": [0.30274, 0.79383, 0, 0],
        "57360": [0.30274, 0.79383, 0, 0],
        "57361": [0.41951, 0.91951, 0, 0],
        "57366": [0.25142, 0.75726, 0, 0],
        "57367": [0.25142, 0.75726, 0, 0],
        "57368": [0.25142, 0.75726, 0, 0],
        "57369": [0.25142, 0.75726, 0, 0],
        "57370": [0.13597, 0.63597, 0, 0],
        "57371": [0.13597, 0.63597, 0, 0]
    },
    "Caligraphic-Regular": {
        "48": [0, 0.43056, 0, 0],
        "49": [0, 0.43056, 0, 0],
        "50": [0, 0.43056, 0, 0],
        "51": [0.19444, 0.43056, 0, 0],
        "52": [0.19444, 0.43056, 0, 0],
        "53": [0.19444, 0.43056, 0, 0],
        "54": [0, 0.64444, 0, 0],
        "55": [0.19444, 0.43056, 0, 0],
        "56": [0, 0.64444, 0, 0],
        "57": [0.19444, 0.43056, 0, 0],
        "65": [0, 0.68333, 0, 0.19445],
        "66": [0, 0.68333, 0.03041, 0.13889],
        "67": [0, 0.68333, 0.05834, 0.13889],
        "68": [0, 0.68333, 0.02778, 0.08334],
        "69": [0, 0.68333, 0.08944, 0.11111],
        "70": [0, 0.68333, 0.09931, 0.11111],
        "71": [0.09722, 0.68333, 0.0593, 0.11111],
        "72": [0, 0.68333, 0.00965, 0.11111],
        "73": [0, 0.68333, 0.07382, 0],
        "74": [0.09722, 0.68333, 0.18472, 0.16667],
        "75": [0, 0.68333, 0.01445, 0.05556],
        "76": [0, 0.68333, 0, 0.13889],
        "77": [0, 0.68333, 0, 0.13889],
        "78": [0, 0.68333, 0.14736, 0.08334],
        "79": [0, 0.68333, 0.02778, 0.11111],
        "80": [0, 0.68333, 0.08222, 0.08334],
        "81": [0.09722, 0.68333, 0, 0.11111],
        "82": [0, 0.68333, 0, 0.08334],
        "83": [0, 0.68333, 0.075, 0.13889],
        "84": [0, 0.68333, 0.25417, 0],
        "85": [0, 0.68333, 0.09931, 0.08334],
        "86": [0, 0.68333, 0.08222, 0],
        "87": [0, 0.68333, 0.08222, 0.08334],
        "88": [0, 0.68333, 0.14643, 0.13889],
        "89": [0.09722, 0.68333, 0.08222, 0.08334],
        "90": [0, 0.68333, 0.07944, 0.13889]
    },
    "Fraktur-Regular": {
        "33": [0, 0.69141, 0, 0],
        "34": [0, 0.69141, 0, 0],
        "38": [0, 0.69141, 0, 0],
        "39": [0, 0.69141, 0, 0],
        "40": [0.24982, 0.74947, 0, 0],
        "41": [0.24982, 0.74947, 0, 0],
        "42": [0, 0.62119, 0, 0],
        "43": [0.08319, 0.58283, 0, 0],
        "44": [0, 0.10803, 0, 0],
        "45": [0.08319, 0.58283, 0, 0],
        "46": [0, 0.10803, 0, 0],
        "47": [0.24982, 0.74947, 0, 0],
        "48": [0, 0.47534, 0, 0],
        "49": [0, 0.47534, 0, 0],
        "50": [0, 0.47534, 0, 0],
        "51": [0.18906, 0.47534, 0, 0],
        "52": [0.18906, 0.47534, 0, 0],
        "53": [0.18906, 0.47534, 0, 0],
        "54": [0, 0.69141, 0, 0],
        "55": [0.18906, 0.47534, 0, 0],
        "56": [0, 0.69141, 0, 0],
        "57": [0.18906, 0.47534, 0, 0],
        "58": [0, 0.47534, 0, 0],
        "59": [0.12604, 0.47534, 0, 0],
        "61": [-0.13099, 0.36866, 0, 0],
        "63": [0, 0.69141, 0, 0],
        "65": [0, 0.69141, 0, 0],
        "66": [0, 0.69141, 0, 0],
        "67": [0, 0.69141, 0, 0],
        "68": [0, 0.69141, 0, 0],
        "69": [0, 0.69141, 0, 0],
        "70": [0.12604, 0.69141, 0, 0],
        "71": [0, 0.69141, 0, 0],
        "72": [0.06302, 0.69141, 0, 0],
        "73": [0, 0.69141, 0, 0],
        "74": [0.12604, 0.69141, 0, 0],
        "75": [0, 0.69141, 0, 0],
        "76": [0, 0.69141, 0, 0],
        "77": [0, 0.69141, 0, 0],
        "78": [0, 0.69141, 0, 0],
        "79": [0, 0.69141, 0, 0],
        "80": [0.18906, 0.69141, 0, 0],
        "81": [0.03781, 0.69141, 0, 0],
        "82": [0, 0.69141, 0, 0],
        "83": [0, 0.69141, 0, 0],
        "84": [0, 0.69141, 0, 0],
        "85": [0, 0.69141, 0, 0],
        "86": [0, 0.69141, 0, 0],
        "87": [0, 0.69141, 0, 0],
        "88": [0, 0.69141, 0, 0],
        "89": [0.18906, 0.69141, 0, 0],
        "90": [0.12604, 0.69141, 0, 0],
        "91": [0.24982, 0.74947, 0, 0],
        "93": [0.24982, 0.74947, 0, 0],
        "94": [0, 0.69141, 0, 0],
        "97": [0, 0.47534, 0, 0],
        "98": [0, 0.69141, 0, 0],
        "99": [0, 0.47534, 0, 0],
        "100": [0, 0.62119, 0, 0],
        "101": [0, 0.47534, 0, 0],
        "102": [0.18906, 0.69141, 0, 0],
        "103": [0.18906, 0.47534, 0, 0],
        "104": [0.18906, 0.69141, 0, 0],
        "105": [0, 0.69141, 0, 0],
        "106": [0, 0.69141, 0, 0],
        "107": [0, 0.69141, 0, 0],
        "108": [0, 0.69141, 0, 0],
        "109": [0, 0.47534, 0, 0],
        "110": [0, 0.47534, 0, 0],
        "111": [0, 0.47534, 0, 0],
        "112": [0.18906, 0.52396, 0, 0],
        "113": [0.18906, 0.47534, 0, 0],
        "114": [0, 0.47534, 0, 0],
        "115": [0, 0.47534, 0, 0],
        "116": [0, 0.62119, 0, 0],
        "117": [0, 0.47534, 0, 0],
        "118": [0, 0.52396, 0, 0],
        "119": [0, 0.52396, 0, 0],
        "120": [0.18906, 0.47534, 0, 0],
        "121": [0.18906, 0.47534, 0, 0],
        "122": [0.18906, 0.47534, 0, 0],
        "8216": [0, 0.69141, 0, 0],
        "8217": [0, 0.69141, 0, 0],
        "58112": [0, 0.62119, 0, 0],
        "58113": [0, 0.62119, 0, 0],
        "58114": [0.18906, 0.69141, 0, 0],
        "58115": [0.18906, 0.69141, 0, 0],
        "58116": [0.18906, 0.47534, 0, 0],
        "58117": [0, 0.69141, 0, 0],
        "58118": [0, 0.62119, 0, 0],
        "58119": [0, 0.47534, 0, 0]
    },
    "Main-Bold": {
        "33": [0, 0.69444, 0, 0],
        "34": [0, 0.69444, 0, 0],
        "35": [0.19444, 0.69444, 0, 0],
        "36": [0.05556, 0.75, 0, 0],
        "37": [0.05556, 0.75, 0, 0],
        "38": [0, 0.69444, 0, 0],
        "39": [0, 0.69444, 0, 0],
        "40": [0.25, 0.75, 0, 0],
        "41": [0.25, 0.75, 0, 0],
        "42": [0, 0.75, 0, 0],
        "43": [0.13333, 0.63333, 0, 0],
        "44": [0.19444, 0.15556, 0, 0],
        "45": [0, 0.44444, 0, 0],
        "46": [0, 0.15556, 0, 0],
        "47": [0.25, 0.75, 0, 0],
        "48": [0, 0.64444, 0, 0],
        "49": [0, 0.64444, 0, 0],
        "50": [0, 0.64444, 0, 0],
        "51": [0, 0.64444, 0, 0],
        "52": [0, 0.64444, 0, 0],
        "53": [0, 0.64444, 0, 0],
        "54": [0, 0.64444, 0, 0],
        "55": [0, 0.64444, 0, 0],
        "56": [0, 0.64444, 0, 0],
        "57": [0, 0.64444, 0, 0],
        "58": [0, 0.44444, 0, 0],
        "59": [0.19444, 0.44444, 0, 0],
        "60": [0.08556, 0.58556, 0, 0],
        "61": [-0.10889, 0.39111, 0, 0],
        "62": [0.08556, 0.58556, 0, 0],
        "63": [0, 0.69444, 0, 0],
        "64": [0, 0.69444, 0, 0],
        "65": [0, 0.68611, 0, 0],
        "66": [0, 0.68611, 0, 0],
        "67": [0, 0.68611, 0, 0],
        "68": [0, 0.68611, 0, 0],
        "69": [0, 0.68611, 0, 0],
        "70": [0, 0.68611, 0, 0],
        "71": [0, 0.68611, 0, 0],
        "72": [0, 0.68611, 0, 0],
        "73": [0, 0.68611, 0, 0],
        "74": [0, 0.68611, 0, 0],
        "75": [0, 0.68611, 0, 0],
        "76": [0, 0.68611, 0, 0],
        "77": [0, 0.68611, 0, 0],
        "78": [0, 0.68611, 0, 0],
        "79": [0, 0.68611, 0, 0],
        "80": [0, 0.68611, 0, 0],
        "81": [0.19444, 0.68611, 0, 0],
        "82": [0, 0.68611, 0, 0],
        "83": [0, 0.68611, 0, 0],
        "84": [0, 0.68611, 0, 0],
        "85": [0, 0.68611, 0, 0],
        "86": [0, 0.68611, 0.01597, 0],
        "87": [0, 0.68611, 0.01597, 0],
        "88": [0, 0.68611, 0, 0],
        "89": [0, 0.68611, 0.02875, 0],
        "90": [0, 0.68611, 0, 0],
        "91": [0.25, 0.75, 0, 0],
        "92": [0.25, 0.75, 0, 0],
        "93": [0.25, 0.75, 0, 0],
        "94": [0, 0.69444, 0, 0],
        "95": [0.31, 0.13444, 0.03194, 0],
        "96": [0, 0.69444, 0, 0],
        "97": [0, 0.44444, 0, 0],
        "98": [0, 0.69444, 0, 0],
        "99": [0, 0.44444, 0, 0],
        "100": [0, 0.69444, 0, 0],
        "101": [0, 0.44444, 0, 0],
        "102": [0, 0.69444, 0.10903, 0],
        "103": [0.19444, 0.44444, 0.01597, 0],
        "104": [0, 0.69444, 0, 0],
        "105": [0, 0.69444, 0, 0],
        "106": [0.19444, 0.69444, 0, 0],
        "107": [0, 0.69444, 0, 0],
        "108": [0, 0.69444, 0, 0],
        "109": [0, 0.44444, 0, 0],
        "110": [0, 0.44444, 0, 0],
        "111": [0, 0.44444, 0, 0],
        "112": [0.19444, 0.44444, 0, 0],
        "113": [0.19444, 0.44444, 0, 0],
        "114": [0, 0.44444, 0, 0],
        "115": [0, 0.44444, 0, 0],
        "116": [0, 0.63492, 0, 0],
        "117": [0, 0.44444, 0, 0],
        "118": [0, 0.44444, 0.01597, 0],
        "119": [0, 0.44444, 0.01597, 0],
        "120": [0, 0.44444, 0, 0],
        "121": [0.19444, 0.44444, 0.01597, 0],
        "122": [0, 0.44444, 0, 0],
        "123": [0.25, 0.75, 0, 0],
        "124": [0.25, 0.75, 0, 0],
        "125": [0.25, 0.75, 0, 0],
        "126": [0.35, 0.34444, 0, 0],
        "168": [0, 0.69444, 0, 0],
        "172": [0, 0.44444, 0, 0],
        "175": [0, 0.59611, 0, 0],
        "176": [0, 0.69444, 0, 0],
        "177": [0.13333, 0.63333, 0, 0],
        "180": [0, 0.69444, 0, 0],
        "215": [0.13333, 0.63333, 0, 0],
        "247": [0.13333, 0.63333, 0, 0],
        "305": [0, 0.44444, 0, 0],
        "567": [0.19444, 0.44444, 0, 0],
        "710": [0, 0.69444, 0, 0],
        "711": [0, 0.63194, 0, 0],
        "713": [0, 0.59611, 0, 0],
        "714": [0, 0.69444, 0, 0],
        "715": [0, 0.69444, 0, 0],
        "728": [0, 0.69444, 0, 0],
        "729": [0, 0.69444, 0, 0],
        "730": [0, 0.69444, 0, 0],
        "732": [0, 0.69444, 0, 0],
        "768": [0, 0.69444, 0, 0],
        "769": [0, 0.69444, 0, 0],
        "770": [0, 0.69444, 0, 0],
        "771": [0, 0.69444, 0, 0],
        "772": [0, 0.59611, 0, 0],
        "774": [0, 0.69444, 0, 0],
        "775": [0, 0.69444, 0, 0],
        "776": [0, 0.69444, 0, 0],
        "778": [0, 0.69444, 0, 0],
        "779": [0, 0.69444, 0, 0],
        "780": [0, 0.63194, 0, 0],
        "824": [0.19444, 0.69444, 0, 0],
        "915": [0, 0.68611, 0, 0],
        "916": [0, 0.68611, 0, 0],
        "920": [0, 0.68611, 0, 0],
        "923": [0, 0.68611, 0, 0],
        "926": [0, 0.68611, 0, 0],
        "928": [0, 0.68611, 0, 0],
        "931": [0, 0.68611, 0, 0],
        "933": [0, 0.68611, 0, 0],
        "934": [0, 0.68611, 0, 0],
        "936": [0, 0.68611, 0, 0],
        "937": [0, 0.68611, 0, 0],
        "8211": [0, 0.44444, 0.03194, 0],
        "8212": [0, 0.44444, 0.03194, 0],
        "8216": [0, 0.69444, 0, 0],
        "8217": [0, 0.69444, 0, 0],
        "8220": [0, 0.69444, 0, 0],
        "8221": [0, 0.69444, 0, 0],
        "8224": [0.19444, 0.69444, 0, 0],
        "8225": [0.19444, 0.69444, 0, 0],
        "8242": [0, 0.55556, 0, 0],
        "8407": [0, 0.72444, 0.15486, 0],
        "8463": [0, 0.69444, 0, 0],
        "8465": [0, 0.69444, 0, 0],
        "8467": [0, 0.69444, 0, 0],
        "8472": [0.19444, 0.44444, 0, 0],
        "8476": [0, 0.69444, 0, 0],
        "8501": [0, 0.69444, 0, 0],
        "8592": [-0.10889, 0.39111, 0, 0],
        "8593": [0.19444, 0.69444, 0, 0],
        "8594": [-0.10889, 0.39111, 0, 0],
        "8595": [0.19444, 0.69444, 0, 0],
        "8596": [-0.10889, 0.39111, 0, 0],
        "8597": [0.25, 0.75, 0, 0],
        "8598": [0.19444, 0.69444, 0, 0],
        "8599": [0.19444, 0.69444, 0, 0],
        "8600": [0.19444, 0.69444, 0, 0],
        "8601": [0.19444, 0.69444, 0, 0],
        "8636": [-0.10889, 0.39111, 0, 0],
        "8637": [-0.10889, 0.39111, 0, 0],
        "8640": [-0.10889, 0.39111, 0, 0],
        "8641": [-0.10889, 0.39111, 0, 0],
        "8656": [-0.10889, 0.39111, 0, 0],
        "8657": [0.19444, 0.69444, 0, 0],
        "8658": [-0.10889, 0.39111, 0, 0],
        "8659": [0.19444, 0.69444, 0, 0],
        "8660": [-0.10889, 0.39111, 0, 0],
        "8661": [0.25, 0.75, 0, 0],
        "8704": [0, 0.69444, 0, 0],
        "8706": [0, 0.69444, 0.06389, 0],
        "8707": [0, 0.69444, 0, 0],
        "8709": [0.05556, 0.75, 0, 0],
        "8711": [0, 0.68611, 0, 0],
        "8712": [0.08556, 0.58556, 0, 0],
        "8715": [0.08556, 0.58556, 0, 0],
        "8722": [0.13333, 0.63333, 0, 0],
        "8723": [0.13333, 0.63333, 0, 0],
        "8725": [0.25, 0.75, 0, 0],
        "8726": [0.25, 0.75, 0, 0],
        "8727": [-0.02778, 0.47222, 0, 0],
        "8728": [-0.02639, 0.47361, 0, 0],
        "8729": [-0.02639, 0.47361, 0, 0],
        "8730": [0.18, 0.82, 0, 0],
        "8733": [0, 0.44444, 0, 0],
        "8734": [0, 0.44444, 0, 0],
        "8736": [0, 0.69224, 0, 0],
        "8739": [0.25, 0.75, 0, 0],
        "8741": [0.25, 0.75, 0, 0],
        "8743": [0, 0.55556, 0, 0],
        "8744": [0, 0.55556, 0, 0],
        "8745": [0, 0.55556, 0, 0],
        "8746": [0, 0.55556, 0, 0],
        "8747": [0.19444, 0.69444, 0.12778, 0],
        "8764": [-0.10889, 0.39111, 0, 0],
        "8768": [0.19444, 0.69444, 0, 0],
        "8771": [0.00222, 0.50222, 0, 0],
        "8776": [0.02444, 0.52444, 0, 0],
        "8781": [0.00222, 0.50222, 0, 0],
        "8801": [0.00222, 0.50222, 0, 0],
        "8804": [0.19667, 0.69667, 0, 0],
        "8805": [0.19667, 0.69667, 0, 0],
        "8810": [0.08556, 0.58556, 0, 0],
        "8811": [0.08556, 0.58556, 0, 0],
        "8826": [0.08556, 0.58556, 0, 0],
        "8827": [0.08556, 0.58556, 0, 0],
        "8834": [0.08556, 0.58556, 0, 0],
        "8835": [0.08556, 0.58556, 0, 0],
        "8838": [0.19667, 0.69667, 0, 0],
        "8839": [0.19667, 0.69667, 0, 0],
        "8846": [0, 0.55556, 0, 0],
        "8849": [0.19667, 0.69667, 0, 0],
        "8850": [0.19667, 0.69667, 0, 0],
        "8851": [0, 0.55556, 0, 0],
        "8852": [0, 0.55556, 0, 0],
        "8853": [0.13333, 0.63333, 0, 0],
        "8854": [0.13333, 0.63333, 0, 0],
        "8855": [0.13333, 0.63333, 0, 0],
        "8856": [0.13333, 0.63333, 0, 0],
        "8857": [0.13333, 0.63333, 0, 0],
        "8866": [0, 0.69444, 0, 0],
        "8867": [0, 0.69444, 0, 0],
        "8868": [0, 0.69444, 0, 0],
        "8869": [0, 0.69444, 0, 0],
        "8900": [-0.02639, 0.47361, 0, 0],
        "8901": [-0.02639, 0.47361, 0, 0],
        "8902": [-0.02778, 0.47222, 0, 0],
        "8968": [0.25, 0.75, 0, 0],
        "8969": [0.25, 0.75, 0, 0],
        "8970": [0.25, 0.75, 0, 0],
        "8971": [0.25, 0.75, 0, 0],
        "8994": [-0.13889, 0.36111, 0, 0],
        "8995": [-0.13889, 0.36111, 0, 0],
        "9651": [0.19444, 0.69444, 0, 0],
        "9657": [-0.02778, 0.47222, 0, 0],
        "9661": [0.19444, 0.69444, 0, 0],
        "9667": [-0.02778, 0.47222, 0, 0],
        "9711": [0.19444, 0.69444, 0, 0],
        "9824": [0.12963, 0.69444, 0, 0],
        "9825": [0.12963, 0.69444, 0, 0],
        "9826": [0.12963, 0.69444, 0, 0],
        "9827": [0.12963, 0.69444, 0, 0],
        "9837": [0, 0.75, 0, 0],
        "9838": [0.19444, 0.69444, 0, 0],
        "9839": [0.19444, 0.69444, 0, 0],
        "10216": [0.25, 0.75, 0, 0],
        "10217": [0.25, 0.75, 0, 0],
        "10815": [0, 0.68611, 0, 0],
        "10927": [0.19667, 0.69667, 0, 0],
        "10928": [0.19667, 0.69667, 0, 0]
    },
    "Main-Italic": {
        "33": [0, 0.69444, 0.12417, 0],
        "34": [0, 0.69444, 0.06961, 0],
        "35": [0.19444, 0.69444, 0.06616, 0],
        "37": [0.05556, 0.75, 0.13639, 0],
        "38": [0, 0.69444, 0.09694, 0],
        "39": [0, 0.69444, 0.12417, 0],
        "40": [0.25, 0.75, 0.16194, 0],
        "41": [0.25, 0.75, 0.03694, 0],
        "42": [0, 0.75, 0.14917, 0],
        "43": [0.05667, 0.56167, 0.03694, 0],
        "44": [0.19444, 0.10556, 0, 0],
        "45": [0, 0.43056, 0.02826, 0],
        "46": [0, 0.10556, 0, 0],
        "47": [0.25, 0.75, 0.16194, 0],
        "48": [0, 0.64444, 0.13556, 0],
        "49": [0, 0.64444, 0.13556, 0],
        "50": [0, 0.64444, 0.13556, 0],
        "51": [0, 0.64444, 0.13556, 0],
        "52": [0.19444, 0.64444, 0.13556, 0],
        "53": [0, 0.64444, 0.13556, 0],
        "54": [0, 0.64444, 0.13556, 0],
        "55": [0.19444, 0.64444, 0.13556, 0],
        "56": [0, 0.64444, 0.13556, 0],
        "57": [0, 0.64444, 0.13556, 0],
        "58": [0, 0.43056, 0.0582, 0],
        "59": [0.19444, 0.43056, 0.0582, 0],
        "61": [-0.13313, 0.36687, 0.06616, 0],
        "63": [0, 0.69444, 0.1225, 0],
        "64": [0, 0.69444, 0.09597, 0],
        "65": [0, 0.68333, 0, 0],
        "66": [0, 0.68333, 0.10257, 0],
        "67": [0, 0.68333, 0.14528, 0],
        "68": [0, 0.68333, 0.09403, 0],
        "69": [0, 0.68333, 0.12028, 0],
        "70": [0, 0.68333, 0.13305, 0],
        "71": [0, 0.68333, 0.08722, 0],
        "72": [0, 0.68333, 0.16389, 0],
        "73": [0, 0.68333, 0.15806, 0],
        "74": [0, 0.68333, 0.14028, 0],
        "75": [0, 0.68333, 0.14528, 0],
        "76": [0, 0.68333, 0, 0],
        "77": [0, 0.68333, 0.16389, 0],
        "78": [0, 0.68333, 0.16389, 0],
        "79": [0, 0.68333, 0.09403, 0],
        "80": [0, 0.68333, 0.10257, 0],
        "81": [0.19444, 0.68333, 0.09403, 0],
        "82": [0, 0.68333, 0.03868, 0],
        "83": [0, 0.68333, 0.11972, 0],
        "84": [0, 0.68333, 0.13305, 0],
        "85": [0, 0.68333, 0.16389, 0],
        "86": [0, 0.68333, 0.18361, 0],
        "87": [0, 0.68333, 0.18361, 0],
        "88": [0, 0.68333, 0.15806, 0],
        "89": [0, 0.68333, 0.19383, 0],
        "90": [0, 0.68333, 0.14528, 0],
        "91": [0.25, 0.75, 0.1875, 0],
        "93": [0.25, 0.75, 0.10528, 0],
        "94": [0, 0.69444, 0.06646, 0],
        "95": [0.31, 0.12056, 0.09208, 0],
        "97": [0, 0.43056, 0.07671, 0],
        "98": [0, 0.69444, 0.06312, 0],
        "99": [0, 0.43056, 0.05653, 0],
        "100": [0, 0.69444, 0.10333, 0],
        "101": [0, 0.43056, 0.07514, 0],
        "102": [0.19444, 0.69444, 0.21194, 0],
        "103": [0.19444, 0.43056, 0.08847, 0],
        "104": [0, 0.69444, 0.07671, 0],
        "105": [0, 0.65536, 0.1019, 0],
        "106": [0.19444, 0.65536, 0.14467, 0],
        "107": [0, 0.69444, 0.10764, 0],
        "108": [0, 0.69444, 0.10333, 0],
        "109": [0, 0.43056, 0.07671, 0],
        "110": [0, 0.43056, 0.07671, 0],
        "111": [0, 0.43056, 0.06312, 0],
        "112": [0.19444, 0.43056, 0.06312, 0],
        "113": [0.19444, 0.43056, 0.08847, 0],
        "114": [0, 0.43056, 0.10764, 0],
        "115": [0, 0.43056, 0.08208, 0],
        "116": [0, 0.61508, 0.09486, 0],
        "117": [0, 0.43056, 0.07671, 0],
        "118": [0, 0.43056, 0.10764, 0],
        "119": [0, 0.43056, 0.10764, 0],
        "120": [0, 0.43056, 0.12042, 0],
        "121": [0.19444, 0.43056, 0.08847, 0],
        "122": [0, 0.43056, 0.12292, 0],
        "126": [0.35, 0.31786, 0.11585, 0],
        "163": [0, 0.69444, 0, 0],
        "305": [0, 0.43056, 0, 0.02778],
        "567": [0.19444, 0.43056, 0, 0.08334],
        "768": [0, 0.69444, 0, 0],
        "769": [0, 0.69444, 0.09694, 0],
        "770": [0, 0.69444, 0.06646, 0],
        "771": [0, 0.66786, 0.11585, 0],
        "772": [0, 0.56167, 0.10333, 0],
        "774": [0, 0.69444, 0.10806, 0],
        "775": [0, 0.66786, 0.11752, 0],
        "776": [0, 0.66786, 0.10474, 0],
        "778": [0, 0.69444, 0, 0],
        "779": [0, 0.69444, 0.1225, 0],
        "780": [0, 0.62847, 0.08295, 0],
        "915": [0, 0.68333, 0.13305, 0],
        "916": [0, 0.68333, 0, 0],
        "920": [0, 0.68333, 0.09403, 0],
        "923": [0, 0.68333, 0, 0],
        "926": [0, 0.68333, 0.15294, 0],
        "928": [0, 0.68333, 0.16389, 0],
        "931": [0, 0.68333, 0.12028, 0],
        "933": [0, 0.68333, 0.11111, 0],
        "934": [0, 0.68333, 0.05986, 0],
        "936": [0, 0.68333, 0.11111, 0],
        "937": [0, 0.68333, 0.10257, 0],
        "8211": [0, 0.43056, 0.09208, 0],
        "8212": [0, 0.43056, 0.09208, 0],
        "8216": [0, 0.69444, 0.12417, 0],
        "8217": [0, 0.69444, 0.12417, 0],
        "8220": [0, 0.69444, 0.1685, 0],
        "8221": [0, 0.69444, 0.06961, 0],
        "8463": [0, 0.68889, 0, 0]
    },
    "Main-Regular": {
        "32": [0, 0, 0, 0],
        "33": [0, 0.69444, 0, 0],
        "34": [0, 0.69444, 0, 0],
        "35": [0.19444, 0.69444, 0, 0],
        "36": [0.05556, 0.75, 0, 0],
        "37": [0.05556, 0.75, 0, 0],
        "38": [0, 0.69444, 0, 0],
        "39": [0, 0.69444, 0, 0],
        "40": [0.25, 0.75, 0, 0],
        "41": [0.25, 0.75, 0, 0],
        "42": [0, 0.75, 0, 0],
        "43": [0.08333, 0.58333, 0, 0],
        "44": [0.19444, 0.10556, 0, 0],
        "45": [0, 0.43056, 0, 0],
        "46": [0, 0.10556, 0, 0],
        "47": [0.25, 0.75, 0, 0],
        "48": [0, 0.64444, 0, 0],
        "49": [0, 0.64444, 0, 0],
        "50": [0, 0.64444, 0, 0],
        "51": [0, 0.64444, 0, 0],
        "52": [0, 0.64444, 0, 0],
        "53": [0, 0.64444, 0, 0],
        "54": [0, 0.64444, 0, 0],
        "55": [0, 0.64444, 0, 0],
        "56": [0, 0.64444, 0, 0],
        "57": [0, 0.64444, 0, 0],
        "58": [0, 0.43056, 0, 0],
        "59": [0.19444, 0.43056, 0, 0],
        "60": [0.0391, 0.5391, 0, 0],
        "61": [-0.13313, 0.36687, 0, 0],
        "62": [0.0391, 0.5391, 0, 0],
        "63": [0, 0.69444, 0, 0],
        "64": [0, 0.69444, 0, 0],
        "65": [0, 0.68333, 0, 0],
        "66": [0, 0.68333, 0, 0],
        "67": [0, 0.68333, 0, 0],
        "68": [0, 0.68333, 0, 0],
        "69": [0, 0.68333, 0, 0],
        "70": [0, 0.68333, 0, 0],
        "71": [0, 0.68333, 0, 0],
        "72": [0, 0.68333, 0, 0],
        "73": [0, 0.68333, 0, 0],
        "74": [0, 0.68333, 0, 0],
        "75": [0, 0.68333, 0, 0],
        "76": [0, 0.68333, 0, 0],
        "77": [0, 0.68333, 0, 0],
        "78": [0, 0.68333, 0, 0],
        "79": [0, 0.68333, 0, 0],
        "80": [0, 0.68333, 0, 0],
        "81": [0.19444, 0.68333, 0, 0],
        "82": [0, 0.68333, 0, 0],
        "83": [0, 0.68333, 0, 0],
        "84": [0, 0.68333, 0, 0],
        "85": [0, 0.68333, 0, 0],
        "86": [0, 0.68333, 0.01389, 0],
        "87": [0, 0.68333, 0.01389, 0],
        "88": [0, 0.68333, 0, 0],
        "89": [0, 0.68333, 0.025, 0],
        "90": [0, 0.68333, 0, 0],
        "91": [0.25, 0.75, 0, 0],
        "92": [0.25, 0.75, 0, 0],
        "93": [0.25, 0.75, 0, 0],
        "94": [0, 0.69444, 0, 0],
        "95": [0.31, 0.12056, 0.02778, 0],
        "96": [0, 0.69444, 0, 0],
        "97": [0, 0.43056, 0, 0],
        "98": [0, 0.69444, 0, 0],
        "99": [0, 0.43056, 0, 0],
        "100": [0, 0.69444, 0, 0],
        "101": [0, 0.43056, 0, 0],
        "102": [0, 0.69444, 0.07778, 0],
        "103": [0.19444, 0.43056, 0.01389, 0],
        "104": [0, 0.69444, 0, 0],
        "105": [0, 0.66786, 0, 0],
        "106": [0.19444, 0.66786, 0, 0],
        "107": [0, 0.69444, 0, 0],
        "108": [0, 0.69444, 0, 0],
        "109": [0, 0.43056, 0, 0],
        "110": [0, 0.43056, 0, 0],
        "111": [0, 0.43056, 0, 0],
        "112": [0.19444, 0.43056, 0, 0],
        "113": [0.19444, 0.43056, 0, 0],
        "114": [0, 0.43056, 0, 0],
        "115": [0, 0.43056, 0, 0],
        "116": [0, 0.61508, 0, 0],
        "117": [0, 0.43056, 0, 0],
        "118": [0, 0.43056, 0.01389, 0],
        "119": [0, 0.43056, 0.01389, 0],
        "120": [0, 0.43056, 0, 0],
        "121": [0.19444, 0.43056, 0.01389, 0],
        "122": [0, 0.43056, 0, 0],
        "123": [0.25, 0.75, 0, 0],
        "124": [0.25, 0.75, 0, 0],
        "125": [0.25, 0.75, 0, 0],
        "126": [0.35, 0.31786, 0, 0],
        "160": [0, 0, 0, 0],
        "168": [0, 0.66786, 0, 0],
        "172": [0, 0.43056, 0, 0],
        "175": [0, 0.56778, 0, 0],
        "176": [0, 0.69444, 0, 0],
        "177": [0.08333, 0.58333, 0, 0],
        "180": [0, 0.69444, 0, 0],
        "215": [0.08333, 0.58333, 0, 0],
        "247": [0.08333, 0.58333, 0, 0],
        "305": [0, 0.43056, 0, 0],
        "567": [0.19444, 0.43056, 0, 0],
        "710": [0, 0.69444, 0, 0],
        "711": [0, 0.62847, 0, 0],
        "713": [0, 0.56778, 0, 0],
        "714": [0, 0.69444, 0, 0],
        "715": [0, 0.69444, 0, 0],
        "728": [0, 0.69444, 0, 0],
        "729": [0, 0.66786, 0, 0],
        "730": [0, 0.69444, 0, 0],
        "732": [0, 0.66786, 0, 0],
        "768": [0, 0.69444, 0, 0],
        "769": [0, 0.69444, 0, 0],
        "770": [0, 0.69444, 0, 0],
        "771": [0, 0.66786, 0, 0],
        "772": [0, 0.56778, 0, 0],
        "774": [0, 0.69444, 0, 0],
        "775": [0, 0.66786, 0, 0],
        "776": [0, 0.66786, 0, 0],
        "778": [0, 0.69444, 0, 0],
        "779": [0, 0.69444, 0, 0],
        "780": [0, 0.62847, 0, 0],
        "824": [0.19444, 0.69444, 0, 0],
        "915": [0, 0.68333, 0, 0],
        "916": [0, 0.68333, 0, 0],
        "920": [0, 0.68333, 0, 0],
        "923": [0, 0.68333, 0, 0],
        "926": [0, 0.68333, 0, 0],
        "928": [0, 0.68333, 0, 0],
        "931": [0, 0.68333, 0, 0],
        "933": [0, 0.68333, 0, 0],
        "934": [0, 0.68333, 0, 0],
        "936": [0, 0.68333, 0, 0],
        "937": [0, 0.68333, 0, 0],
        "8211": [0, 0.43056, 0.02778, 0],
        "8212": [0, 0.43056, 0.02778, 0],
        "8216": [0, 0.69444, 0, 0],
        "8217": [0, 0.69444, 0, 0],
        "8220": [0, 0.69444, 0, 0],
        "8221": [0, 0.69444, 0, 0],
        "8224": [0.19444, 0.69444, 0, 0],
        "8225": [0.19444, 0.69444, 0, 0],
        "8230": [0, 0.12, 0, 0],
        "8242": [0, 0.55556, 0, 0],
        "8407": [0, 0.71444, 0.15382, 0],
        "8463": [0, 0.68889, 0, 0],
        "8465": [0, 0.69444, 0, 0],
        "8467": [0, 0.69444, 0, 0.11111],
        "8472": [0.19444, 0.43056, 0, 0.11111],
        "8476": [0, 0.69444, 0, 0],
        "8501": [0, 0.69444, 0, 0],
        "8592": [-0.13313, 0.36687, 0, 0],
        "8593": [0.19444, 0.69444, 0, 0],
        "8594": [-0.13313, 0.36687, 0, 0],
        "8595": [0.19444, 0.69444, 0, 0],
        "8596": [-0.13313, 0.36687, 0, 0],
        "8597": [0.25, 0.75, 0, 0],
        "8598": [0.19444, 0.69444, 0, 0],
        "8599": [0.19444, 0.69444, 0, 0],
        "8600": [0.19444, 0.69444, 0, 0],
        "8601": [0.19444, 0.69444, 0, 0],
        "8614": [0.011, 0.511, 0, 0],
        "8617": [0.011, 0.511, 0, 0],
        "8618": [0.011, 0.511, 0, 0],
        "8636": [-0.13313, 0.36687, 0, 0],
        "8637": [-0.13313, 0.36687, 0, 0],
        "8640": [-0.13313, 0.36687, 0, 0],
        "8641": [-0.13313, 0.36687, 0, 0],
        "8652": [0.011, 0.671, 0, 0],
        "8656": [-0.13313, 0.36687, 0, 0],
        "8657": [0.19444, 0.69444, 0, 0],
        "8658": [-0.13313, 0.36687, 0, 0],
        "8659": [0.19444, 0.69444, 0, 0],
        "8660": [-0.13313, 0.36687, 0, 0],
        "8661": [0.25, 0.75, 0, 0],
        "8704": [0, 0.69444, 0, 0],
        "8706": [0, 0.69444, 0.05556, 0.08334],
        "8707": [0, 0.69444, 0, 0],
        "8709": [0.05556, 0.75, 0, 0],
        "8711": [0, 0.68333, 0, 0],
        "8712": [0.0391, 0.5391, 0, 0],
        "8715": [0.0391, 0.5391, 0, 0],
        "8722": [0.08333, 0.58333, 0, 0],
        "8723": [0.08333, 0.58333, 0, 0],
        "8725": [0.25, 0.75, 0, 0],
        "8726": [0.25, 0.75, 0, 0],
        "8727": [-0.03472, 0.46528, 0, 0],
        "8728": [-0.05555, 0.44445, 0, 0],
        "8729": [-0.05555, 0.44445, 0, 0],
        "8730": [0.2, 0.8, 0, 0],
        "8733": [0, 0.43056, 0, 0],
        "8734": [0, 0.43056, 0, 0],
        "8736": [0, 0.69224, 0, 0],
        "8739": [0.25, 0.75, 0, 0],
        "8741": [0.25, 0.75, 0, 0],
        "8743": [0, 0.55556, 0, 0],
        "8744": [0, 0.55556, 0, 0],
        "8745": [0, 0.55556, 0, 0],
        "8746": [0, 0.55556, 0, 0],
        "8747": [0.19444, 0.69444, 0.11111, 0],
        "8764": [-0.13313, 0.36687, 0, 0],
        "8768": [0.19444, 0.69444, 0, 0],
        "8771": [-0.03625, 0.46375, 0, 0],
        "8773": [-0.022, 0.589, 0, 0],
        "8776": [-0.01688, 0.48312, 0, 0],
        "8781": [-0.03625, 0.46375, 0, 0],
        "8784": [-0.133, 0.67, 0, 0],
        "8800": [0.215, 0.716, 0, 0],
        "8801": [-0.03625, 0.46375, 0, 0],
        "8804": [0.13597, 0.63597, 0, 0],
        "8805": [0.13597, 0.63597, 0, 0],
        "8810": [0.0391, 0.5391, 0, 0],
        "8811": [0.0391, 0.5391, 0, 0],
        "8826": [0.0391, 0.5391, 0, 0],
        "8827": [0.0391, 0.5391, 0, 0],
        "8834": [0.0391, 0.5391, 0, 0],
        "8835": [0.0391, 0.5391, 0, 0],
        "8838": [0.13597, 0.63597, 0, 0],
        "8839": [0.13597, 0.63597, 0, 0],
        "8846": [0, 0.55556, 0, 0],
        "8849": [0.13597, 0.63597, 0, 0],
        "8850": [0.13597, 0.63597, 0, 0],
        "8851": [0, 0.55556, 0, 0],
        "8852": [0, 0.55556, 0, 0],
        "8853": [0.08333, 0.58333, 0, 0],
        "8854": [0.08333, 0.58333, 0, 0],
        "8855": [0.08333, 0.58333, 0, 0],
        "8856": [0.08333, 0.58333, 0, 0],
        "8857": [0.08333, 0.58333, 0, 0],
        "8866": [0, 0.69444, 0, 0],
        "8867": [0, 0.69444, 0, 0],
        "8868": [0, 0.69444, 0, 0],
        "8869": [0, 0.69444, 0, 0],
        "8872": [0.249, 0.75, 0, 0],
        "8900": [-0.05555, 0.44445, 0, 0],
        "8901": [-0.05555, 0.44445, 0, 0],
        "8902": [-0.03472, 0.46528, 0, 0],
        "8904": [0.005, 0.505, 0, 0],
        "8942": [0.03, 0.9, 0, 0],
        "8943": [-0.19, 0.31, 0, 0],
        "8945": [-0.1, 0.82, 0, 0],
        "8968": [0.25, 0.75, 0, 0],
        "8969": [0.25, 0.75, 0, 0],
        "8970": [0.25, 0.75, 0, 0],
        "8971": [0.25, 0.75, 0, 0],
        "8994": [-0.14236, 0.35764, 0, 0],
        "8995": [-0.14236, 0.35764, 0, 0],
        "9136": [0.244, 0.744, 0, 0],
        "9137": [0.244, 0.744, 0, 0],
        "9651": [0.19444, 0.69444, 0, 0],
        "9657": [-0.03472, 0.46528, 0, 0],
        "9661": [0.19444, 0.69444, 0, 0],
        "9667": [-0.03472, 0.46528, 0, 0],
        "9711": [0.19444, 0.69444, 0, 0],
        "9824": [0.12963, 0.69444, 0, 0],
        "9825": [0.12963, 0.69444, 0, 0],
        "9826": [0.12963, 0.69444, 0, 0],
        "9827": [0.12963, 0.69444, 0, 0],
        "9837": [0, 0.75, 0, 0],
        "9838": [0.19444, 0.69444, 0, 0],
        "9839": [0.19444, 0.69444, 0, 0],
        "10216": [0.25, 0.75, 0, 0],
        "10217": [0.25, 0.75, 0, 0],
        "10222": [0.244, 0.744, 0, 0],
        "10223": [0.244, 0.744, 0, 0],
        "10229": [0.011, 0.511, 0, 0],
        "10230": [0.011, 0.511, 0, 0],
        "10231": [0.011, 0.511, 0, 0],
        "10232": [0.024, 0.525, 0, 0],
        "10233": [0.024, 0.525, 0, 0],
        "10234": [0.024, 0.525, 0, 0],
        "10236": [0.011, 0.511, 0, 0],
        "10815": [0, 0.68333, 0, 0],
        "10927": [0.13597, 0.63597, 0, 0],
        "10928": [0.13597, 0.63597, 0, 0]
    },
    "Math-BoldItalic": {
        "47": [0.19444, 0.69444, 0, 0],
        "65": [0, 0.68611, 0, 0],
        "66": [0, 0.68611, 0.04835, 0],
        "67": [0, 0.68611, 0.06979, 0],
        "68": [0, 0.68611, 0.03194, 0],
        "69": [0, 0.68611, 0.05451, 0],
        "70": [0, 0.68611, 0.15972, 0],
        "71": [0, 0.68611, 0, 0],
        "72": [0, 0.68611, 0.08229, 0],
        "73": [0, 0.68611, 0.07778, 0],
        "74": [0, 0.68611, 0.10069, 0],
        "75": [0, 0.68611, 0.06979, 0],
        "76": [0, 0.68611, 0, 0],
        "77": [0, 0.68611, 0.11424, 0],
        "78": [0, 0.68611, 0.11424, 0],
        "79": [0, 0.68611, 0.03194, 0],
        "80": [0, 0.68611, 0.15972, 0],
        "81": [0.19444, 0.68611, 0, 0],
        "82": [0, 0.68611, 0.00421, 0],
        "83": [0, 0.68611, 0.05382, 0],
        "84": [0, 0.68611, 0.15972, 0],
        "85": [0, 0.68611, 0.11424, 0],
        "86": [0, 0.68611, 0.25555, 0],
        "87": [0, 0.68611, 0.15972, 0],
        "88": [0, 0.68611, 0.07778, 0],
        "89": [0, 0.68611, 0.25555, 0],
        "90": [0, 0.68611, 0.06979, 0],
        "97": [0, 0.44444, 0, 0],
        "98": [0, 0.69444, 0, 0],
        "99": [0, 0.44444, 0, 0],
        "100": [0, 0.69444, 0, 0],
        "101": [0, 0.44444, 0, 0],
        "102": [0.19444, 0.69444, 0.11042, 0],
        "103": [0.19444, 0.44444, 0.03704, 0],
        "104": [0, 0.69444, 0, 0],
        "105": [0, 0.69326, 0, 0],
        "106": [0.19444, 0.69326, 0.0622, 0],
        "107": [0, 0.69444, 0.01852, 0],
        "108": [0, 0.69444, 0.0088, 0],
        "109": [0, 0.44444, 0, 0],
        "110": [0, 0.44444, 0, 0],
        "111": [0, 0.44444, 0, 0],
        "112": [0.19444, 0.44444, 0, 0],
        "113": [0.19444, 0.44444, 0.03704, 0],
        "114": [0, 0.44444, 0.03194, 0],
        "115": [0, 0.44444, 0, 0],
        "116": [0, 0.63492, 0, 0],
        "117": [0, 0.44444, 0, 0],
        "118": [0, 0.44444, 0.03704, 0],
        "119": [0, 0.44444, 0.02778, 0],
        "120": [0, 0.44444, 0, 0],
        "121": [0.19444, 0.44444, 0.03704, 0],
        "122": [0, 0.44444, 0.04213, 0],
        "915": [0, 0.68611, 0.15972, 0],
        "916": [0, 0.68611, 0, 0],
        "920": [0, 0.68611, 0.03194, 0],
        "923": [0, 0.68611, 0, 0],
        "926": [0, 0.68611, 0.07458, 0],
        "928": [0, 0.68611, 0.08229, 0],
        "931": [0, 0.68611, 0.05451, 0],
        "933": [0, 0.68611, 0.15972, 0],
        "934": [0, 0.68611, 0, 0],
        "936": [0, 0.68611, 0.11653, 0],
        "937": [0, 0.68611, 0.04835, 0],
        "945": [0, 0.44444, 0, 0],
        "946": [0.19444, 0.69444, 0.03403, 0],
        "947": [0.19444, 0.44444, 0.06389, 0],
        "948": [0, 0.69444, 0.03819, 0],
        "949": [0, 0.44444, 0, 0],
        "950": [0.19444, 0.69444, 0.06215, 0],
        "951": [0.19444, 0.44444, 0.03704, 0],
        "952": [0, 0.69444, 0.03194, 0],
        "953": [0, 0.44444, 0, 0],
        "954": [0, 0.44444, 0, 0],
        "955": [0, 0.69444, 0, 0],
        "956": [0.19444, 0.44444, 0, 0],
        "957": [0, 0.44444, 0.06898, 0],
        "958": [0.19444, 0.69444, 0.03021, 0],
        "959": [0, 0.44444, 0, 0],
        "960": [0, 0.44444, 0.03704, 0],
        "961": [0.19444, 0.44444, 0, 0],
        "962": [0.09722, 0.44444, 0.07917, 0],
        "963": [0, 0.44444, 0.03704, 0],
        "964": [0, 0.44444, 0.13472, 0],
        "965": [0, 0.44444, 0.03704, 0],
        "966": [0.19444, 0.44444, 0, 0],
        "967": [0.19444, 0.44444, 0, 0],
        "968": [0.19444, 0.69444, 0.03704, 0],
        "969": [0, 0.44444, 0.03704, 0],
        "977": [0, 0.69444, 0, 0],
        "981": [0.19444, 0.69444, 0, 0],
        "982": [0, 0.44444, 0.03194, 0],
        "1009": [0.19444, 0.44444, 0, 0],
        "1013": [0, 0.44444, 0, 0]
    },
    "Math-Italic": {
        "47": [0.19444, 0.69444, 0, 0],
        "65": [0, 0.68333, 0, 0.13889],
        "66": [0, 0.68333, 0.05017, 0.08334],
        "67": [0, 0.68333, 0.07153, 0.08334],
        "68": [0, 0.68333, 0.02778, 0.05556],
        "69": [0, 0.68333, 0.05764, 0.08334],
        "70": [0, 0.68333, 0.13889, 0.08334],
        "71": [0, 0.68333, 0, 0.08334],
        "72": [0, 0.68333, 0.08125, 0.05556],
        "73": [0, 0.68333, 0.07847, 0.11111],
        "74": [0, 0.68333, 0.09618, 0.16667],
        "75": [0, 0.68333, 0.07153, 0.05556],
        "76": [0, 0.68333, 0, 0.02778],
        "77": [0, 0.68333, 0.10903, 0.08334],
        "78": [0, 0.68333, 0.10903, 0.08334],
        "79": [0, 0.68333, 0.02778, 0.08334],
        "80": [0, 0.68333, 0.13889, 0.08334],
        "81": [0.19444, 0.68333, 0, 0.08334],
        "82": [0, 0.68333, 0.00773, 0.08334],
        "83": [0, 0.68333, 0.05764, 0.08334],
        "84": [0, 0.68333, 0.13889, 0.08334],
        "85": [0, 0.68333, 0.10903, 0.02778],
        "86": [0, 0.68333, 0.22222, 0],
        "87": [0, 0.68333, 0.13889, 0],
        "88": [0, 0.68333, 0.07847, 0.08334],
        "89": [0, 0.68333, 0.22222, 0],
        "90": [0, 0.68333, 0.07153, 0.08334],
        "97": [0, 0.43056, 0, 0],
        "98": [0, 0.69444, 0, 0],
        "99": [0, 0.43056, 0, 0.05556],
        "100": [0, 0.69444, 0, 0.16667],
        "101": [0, 0.43056, 0, 0.05556],
        "102": [0.19444, 0.69444, 0.10764, 0.16667],
        "103": [0.19444, 0.43056, 0.03588, 0.02778],
        "104": [0, 0.69444, 0, 0],
        "105": [0, 0.65952, 0, 0],
        "106": [0.19444, 0.65952, 0.05724, 0],
        "107": [0, 0.69444, 0.03148, 0],
        "108": [0, 0.69444, 0.01968, 0.08334],
        "109": [0, 0.43056, 0, 0],
        "110": [0, 0.43056, 0, 0],
        "111": [0, 0.43056, 0, 0.05556],
        "112": [0.19444, 0.43056, 0, 0.08334],
        "113": [0.19444, 0.43056, 0.03588, 0.08334],
        "114": [0, 0.43056, 0.02778, 0.05556],
        "115": [0, 0.43056, 0, 0.05556],
        "116": [0, 0.61508, 0, 0.08334],
        "117": [0, 0.43056, 0, 0.02778],
        "118": [0, 0.43056, 0.03588, 0.02778],
        "119": [0, 0.43056, 0.02691, 0.08334],
        "120": [0, 0.43056, 0, 0.02778],
        "121": [0.19444, 0.43056, 0.03588, 0.05556],
        "122": [0, 0.43056, 0.04398, 0.05556],
        "915": [0, 0.68333, 0.13889, 0.08334],
        "916": [0, 0.68333, 0, 0.16667],
        "920": [0, 0.68333, 0.02778, 0.08334],
        "923": [0, 0.68333, 0, 0.16667],
        "926": [0, 0.68333, 0.07569, 0.08334],
        "928": [0, 0.68333, 0.08125, 0.05556],
        "931": [0, 0.68333, 0.05764, 0.08334],
        "933": [0, 0.68333, 0.13889, 0.05556],
        "934": [0, 0.68333, 0, 0.08334],
        "936": [0, 0.68333, 0.11, 0.05556],
        "937": [0, 0.68333, 0.05017, 0.08334],
        "945": [0, 0.43056, 0.0037, 0.02778],
        "946": [0.19444, 0.69444, 0.05278, 0.08334],
        "947": [0.19444, 0.43056, 0.05556, 0],
        "948": [0, 0.69444, 0.03785, 0.05556],
        "949": [0, 0.43056, 0, 0.08334],
        "950": [0.19444, 0.69444, 0.07378, 0.08334],
        "951": [0.19444, 0.43056, 0.03588, 0.05556],
        "952": [0, 0.69444, 0.02778, 0.08334],
        "953": [0, 0.43056, 0, 0.05556],
        "954": [0, 0.43056, 0, 0],
        "955": [0, 0.69444, 0, 0],
        "956": [0.19444, 0.43056, 0, 0.02778],
        "957": [0, 0.43056, 0.06366, 0.02778],
        "958": [0.19444, 0.69444, 0.04601, 0.11111],
        "959": [0, 0.43056, 0, 0.05556],
        "960": [0, 0.43056, 0.03588, 0],
        "961": [0.19444, 0.43056, 0, 0.08334],
        "962": [0.09722, 0.43056, 0.07986, 0.08334],
        "963": [0, 0.43056, 0.03588, 0],
        "964": [0, 0.43056, 0.1132, 0.02778],
        "965": [0, 0.43056, 0.03588, 0.02778],
        "966": [0.19444, 0.43056, 0, 0.08334],
        "967": [0.19444, 0.43056, 0, 0.05556],
        "968": [0.19444, 0.69444, 0.03588, 0.11111],
        "969": [0, 0.43056, 0.03588, 0],
        "977": [0, 0.69444, 0, 0.08334],
        "981": [0.19444, 0.69444, 0, 0.08334],
        "982": [0, 0.43056, 0.02778, 0],
        "1009": [0.19444, 0.43056, 0, 0.08334],
        "1013": [0, 0.43056, 0, 0.05556]
    },
    "Math-Regular": {
        "65": [0, 0.68333, 0, 0.13889],
        "66": [0, 0.68333, 0.05017, 0.08334],
        "67": [0, 0.68333, 0.07153, 0.08334],
        "68": [0, 0.68333, 0.02778, 0.05556],
        "69": [0, 0.68333, 0.05764, 0.08334],
        "70": [0, 0.68333, 0.13889, 0.08334],
        "71": [0, 0.68333, 0, 0.08334],
        "72": [0, 0.68333, 0.08125, 0.05556],
        "73": [0, 0.68333, 0.07847, 0.11111],
        "74": [0, 0.68333, 0.09618, 0.16667],
        "75": [0, 0.68333, 0.07153, 0.05556],
        "76": [0, 0.68333, 0, 0.02778],
        "77": [0, 0.68333, 0.10903, 0.08334],
        "78": [0, 0.68333, 0.10903, 0.08334],
        "79": [0, 0.68333, 0.02778, 0.08334],
        "80": [0, 0.68333, 0.13889, 0.08334],
        "81": [0.19444, 0.68333, 0, 0.08334],
        "82": [0, 0.68333, 0.00773, 0.08334],
        "83": [0, 0.68333, 0.05764, 0.08334],
        "84": [0, 0.68333, 0.13889, 0.08334],
        "85": [0, 0.68333, 0.10903, 0.02778],
        "86": [0, 0.68333, 0.22222, 0],
        "87": [0, 0.68333, 0.13889, 0],
        "88": [0, 0.68333, 0.07847, 0.08334],
        "89": [0, 0.68333, 0.22222, 0],
        "90": [0, 0.68333, 0.07153, 0.08334],
        "97": [0, 0.43056, 0, 0],
        "98": [0, 0.69444, 0, 0],
        "99": [0, 0.43056, 0, 0.05556],
        "100": [0, 0.69444, 0, 0.16667],
        "101": [0, 0.43056, 0, 0.05556],
        "102": [0.19444, 0.69444, 0.10764, 0.16667],
        "103": [0.19444, 0.43056, 0.03588, 0.02778],
        "104": [0, 0.69444, 0, 0],
        "105": [0, 0.65952, 0, 0],
        "106": [0.19444, 0.65952, 0.05724, 0],
        "107": [0, 0.69444, 0.03148, 0],
        "108": [0, 0.69444, 0.01968, 0.08334],
        "109": [0, 0.43056, 0, 0],
        "110": [0, 0.43056, 0, 0],
        "111": [0, 0.43056, 0, 0.05556],
        "112": [0.19444, 0.43056, 0, 0.08334],
        "113": [0.19444, 0.43056, 0.03588, 0.08334],
        "114": [0, 0.43056, 0.02778, 0.05556],
        "115": [0, 0.43056, 0, 0.05556],
        "116": [0, 0.61508, 0, 0.08334],
        "117": [0, 0.43056, 0, 0.02778],
        "118": [0, 0.43056, 0.03588, 0.02778],
        "119": [0, 0.43056, 0.02691, 0.08334],
        "120": [0, 0.43056, 0, 0.02778],
        "121": [0.19444, 0.43056, 0.03588, 0.05556],
        "122": [0, 0.43056, 0.04398, 0.05556],
        "915": [0, 0.68333, 0.13889, 0.08334],
        "916": [0, 0.68333, 0, 0.16667],
        "920": [0, 0.68333, 0.02778, 0.08334],
        "923": [0, 0.68333, 0, 0.16667],
        "926": [0, 0.68333, 0.07569, 0.08334],
        "928": [0, 0.68333, 0.08125, 0.05556],
        "931": [0, 0.68333, 0.05764, 0.08334],
        "933": [0, 0.68333, 0.13889, 0.05556],
        "934": [0, 0.68333, 0, 0.08334],
        "936": [0, 0.68333, 0.11, 0.05556],
        "937": [0, 0.68333, 0.05017, 0.08334],
        "945": [0, 0.43056, 0.0037, 0.02778],
        "946": [0.19444, 0.69444, 0.05278, 0.08334],
        "947": [0.19444, 0.43056, 0.05556, 0],
        "948": [0, 0.69444, 0.03785, 0.05556],
        "949": [0, 0.43056, 0, 0.08334],
        "950": [0.19444, 0.69444, 0.07378, 0.08334],
        "951": [0.19444, 0.43056, 0.03588, 0.05556],
        "952": [0, 0.69444, 0.02778, 0.08334],
        "953": [0, 0.43056, 0, 0.05556],
        "954": [0, 0.43056, 0, 0],
        "955": [0, 0.69444, 0, 0],
        "956": [0.19444, 0.43056, 0, 0.02778],
        "957": [0, 0.43056, 0.06366, 0.02778],
        "958": [0.19444, 0.69444, 0.04601, 0.11111],
        "959": [0, 0.43056, 0, 0.05556],
        "960": [0, 0.43056, 0.03588, 0],
        "961": [0.19444, 0.43056, 0, 0.08334],
        "962": [0.09722, 0.43056, 0.07986, 0.08334],
        "963": [0, 0.43056, 0.03588, 0],
        "964": [0, 0.43056, 0.1132, 0.02778],
        "965": [0, 0.43056, 0.03588, 0.02778],
        "966": [0.19444, 0.43056, 0, 0.08334],
        "967": [0.19444, 0.43056, 0, 0.05556],
        "968": [0.19444, 0.69444, 0.03588, 0.11111],
        "969": [0, 0.43056, 0.03588, 0],
        "977": [0, 0.69444, 0, 0.08334],
        "981": [0.19444, 0.69444, 0, 0.08334],
        "982": [0, 0.43056, 0.02778, 0],
        "1009": [0.19444, 0.43056, 0, 0.08334],
        "1013": [0, 0.43056, 0, 0.05556]
    },
    "SansSerif-Regular": {
        "33": [0, 0.69444, 0, 0],
        "34": [0, 0.69444, 0, 0],
        "35": [0.19444, 0.69444, 0, 0],
        "36": [0.05556, 0.75, 0, 0],
        "37": [0.05556, 0.75, 0, 0],
        "38": [0, 0.69444, 0, 0],
        "39": [0, 0.69444, 0, 0],
        "40": [0.25, 0.75, 0, 0],
        "41": [0.25, 0.75, 0, 0],
        "42": [0, 0.75, 0, 0],
        "43": [0.08333, 0.58333, 0, 0],
        "44": [0.125, 0.08333, 0, 0],
        "45": [0, 0.44444, 0, 0],
        "46": [0, 0.08333, 0, 0],
        "47": [0.25, 0.75, 0, 0],
        "48": [0, 0.65556, 0, 0],
        "49": [0, 0.65556, 0, 0],
        "50": [0, 0.65556, 0, 0],
        "51": [0, 0.65556, 0, 0],
        "52": [0, 0.65556, 0, 0],
        "53": [0, 0.65556, 0, 0],
        "54": [0, 0.65556, 0, 0],
        "55": [0, 0.65556, 0, 0],
        "56": [0, 0.65556, 0, 0],
        "57": [0, 0.65556, 0, 0],
        "58": [0, 0.44444, 0, 0],
        "59": [0.125, 0.44444, 0, 0],
        "61": [-0.13, 0.37, 0, 0],
        "63": [0, 0.69444, 0, 0],
        "64": [0, 0.69444, 0, 0],
        "65": [0, 0.69444, 0, 0],
        "66": [0, 0.69444, 0, 0],
        "67": [0, 0.69444, 0, 0],
        "68": [0, 0.69444, 0, 0],
        "69": [0, 0.69444, 0, 0],
        "70": [0, 0.69444, 0, 0],
        "71": [0, 0.69444, 0, 0],
        "72": [0, 0.69444, 0, 0],
        "73": [0, 0.69444, 0, 0],
        "74": [0, 0.69444, 0, 0],
        "75": [0, 0.69444, 0, 0],
        "76": [0, 0.69444, 0, 0],
        "77": [0, 0.69444, 0, 0],
        "78": [0, 0.69444, 0, 0],
        "79": [0, 0.69444, 0, 0],
        "80": [0, 0.69444, 0, 0],
        "81": [0.125, 0.69444, 0, 0],
        "82": [0, 0.69444, 0, 0],
        "83": [0, 0.69444, 0, 0],
        "84": [0, 0.69444, 0, 0],
        "85": [0, 0.69444, 0, 0],
        "86": [0, 0.69444, 0.01389, 0],
        "87": [0, 0.69444, 0.01389, 0],
        "88": [0, 0.69444, 0, 0],
        "89": [0, 0.69444, 0.025, 0],
        "90": [0, 0.69444, 0, 0],
        "91": [0.25, 0.75, 0, 0],
        "93": [0.25, 0.75, 0, 0],
        "94": [0, 0.69444, 0, 0],
        "95": [0.35, 0.09444, 0.02778, 0],
        "97": [0, 0.44444, 0, 0],
        "98": [0, 0.69444, 0, 0],
        "99": [0, 0.44444, 0, 0],
        "100": [0, 0.69444, 0, 0],
        "101": [0, 0.44444, 0, 0],
        "102": [0, 0.69444, 0.06944, 0],
        "103": [0.19444, 0.44444, 0.01389, 0],
        "104": [0, 0.69444, 0, 0],
        "105": [0, 0.67937, 0, 0],
        "106": [0.19444, 0.67937, 0, 0],
        "107": [0, 0.69444, 0, 0],
        "108": [0, 0.69444, 0, 0],
        "109": [0, 0.44444, 0, 0],
        "110": [0, 0.44444, 0, 0],
        "111": [0, 0.44444, 0, 0],
        "112": [0.19444, 0.44444, 0, 0],
        "113": [0.19444, 0.44444, 0, 0],
        "114": [0, 0.44444, 0.01389, 0],
        "115": [0, 0.44444, 0, 0],
        "116": [0, 0.57143, 0, 0],
        "117": [0, 0.44444, 0, 0],
        "118": [0, 0.44444, 0.01389, 0],
        "119": [0, 0.44444, 0.01389, 0],
        "120": [0, 0.44444, 0, 0],
        "121": [0.19444, 0.44444, 0.01389, 0],
        "122": [0, 0.44444, 0, 0],
        "126": [0.35, 0.32659, 0, 0],
        "305": [0, 0.44444, 0, 0],
        "567": [0.19444, 0.44444, 0, 0],
        "768": [0, 0.69444, 0, 0],
        "769": [0, 0.69444, 0, 0],
        "770": [0, 0.69444, 0, 0],
        "771": [0, 0.67659, 0, 0],
        "772": [0, 0.60889, 0, 0],
        "774": [0, 0.69444, 0, 0],
        "775": [0, 0.67937, 0, 0],
        "776": [0, 0.67937, 0, 0],
        "778": [0, 0.69444, 0, 0],
        "779": [0, 0.69444, 0, 0],
        "780": [0, 0.63194, 0, 0],
        "915": [0, 0.69444, 0, 0],
        "916": [0, 0.69444, 0, 0],
        "920": [0, 0.69444, 0, 0],
        "923": [0, 0.69444, 0, 0],
        "926": [0, 0.69444, 0, 0],
        "928": [0, 0.69444, 0, 0],
        "931": [0, 0.69444, 0, 0],
        "933": [0, 0.69444, 0, 0],
        "934": [0, 0.69444, 0, 0],
        "936": [0, 0.69444, 0, 0],
        "937": [0, 0.69444, 0, 0],
        "8211": [0, 0.44444, 0.02778, 0],
        "8212": [0, 0.44444, 0.02778, 0],
        "8216": [0, 0.69444, 0, 0],
        "8217": [0, 0.69444, 0, 0],
        "8220": [0, 0.69444, 0, 0],
        "8221": [0, 0.69444, 0, 0]
    },
    "Script-Regular": {
        "65": [0, 0.7, 0.22925, 0],
        "66": [0, 0.7, 0.04087, 0],
        "67": [0, 0.7, 0.1689, 0],
        "68": [0, 0.7, 0.09371, 0],
        "69": [0, 0.7, 0.18583, 0],
        "70": [0, 0.7, 0.13634, 0],
        "71": [0, 0.7, 0.17322, 0],
        "72": [0, 0.7, 0.29694, 0],
        "73": [0, 0.7, 0.19189, 0],
        "74": [0.27778, 0.7, 0.19189, 0],
        "75": [0, 0.7, 0.31259, 0],
        "76": [0, 0.7, 0.19189, 0],
        "77": [0, 0.7, 0.15981, 0],
        "78": [0, 0.7, 0.3525, 0],
        "79": [0, 0.7, 0.08078, 0],
        "80": [0, 0.7, 0.08078, 0],
        "81": [0, 0.7, 0.03305, 0],
        "82": [0, 0.7, 0.06259, 0],
        "83": [0, 0.7, 0.19189, 0],
        "84": [0, 0.7, 0.29087, 0],
        "85": [0, 0.7, 0.25815, 0],
        "86": [0, 0.7, 0.27523, 0],
        "87": [0, 0.7, 0.27523, 0],
        "88": [0, 0.7, 0.26006, 0],
        "89": [0, 0.7, 0.2939, 0],
        "90": [0, 0.7, 0.24037, 0]
    },
    "Size1-Regular": {
        "40": [0.35001, 0.85, 0, 0],
        "41": [0.35001, 0.85, 0, 0],
        "47": [0.35001, 0.85, 0, 0],
        "91": [0.35001, 0.85, 0, 0],
        "92": [0.35001, 0.85, 0, 0],
        "93": [0.35001, 0.85, 0, 0],
        "123": [0.35001, 0.85, 0, 0],
        "125": [0.35001, 0.85, 0, 0],
        "710": [0, 0.72222, 0, 0],
        "732": [0, 0.72222, 0, 0],
        "770": [0, 0.72222, 0, 0],
        "771": [0, 0.72222, 0, 0],
        "8214": [-0.00099, 0.601, 0, 0],
        "8593": [1e-05, 0.6, 0, 0],
        "8595": [1e-05, 0.6, 0, 0],
        "8657": [1e-05, 0.6, 0, 0],
        "8659": [1e-05, 0.6, 0, 0],
        "8719": [0.25001, 0.75, 0, 0],
        "8720": [0.25001, 0.75, 0, 0],
        "8721": [0.25001, 0.75, 0, 0],
        "8730": [0.35001, 0.85, 0, 0],
        "8739": [-0.00599, 0.606, 0, 0],
        "8741": [-0.00599, 0.606, 0, 0],
        "8747": [0.30612, 0.805, 0.19445, 0],
        "8748": [0.306, 0.805, 0.19445, 0],
        "8749": [0.306, 0.805, 0.19445, 0],
        "8750": [0.30612, 0.805, 0.19445, 0],
        "8896": [0.25001, 0.75, 0, 0],
        "8897": [0.25001, 0.75, 0, 0],
        "8898": [0.25001, 0.75, 0, 0],
        "8899": [0.25001, 0.75, 0, 0],
        "8968": [0.35001, 0.85, 0, 0],
        "8969": [0.35001, 0.85, 0, 0],
        "8970": [0.35001, 0.85, 0, 0],
        "8971": [0.35001, 0.85, 0, 0],
        "9168": [-0.00099, 0.601, 0, 0],
        "10216": [0.35001, 0.85, 0, 0],
        "10217": [0.35001, 0.85, 0, 0],
        "10752": [0.25001, 0.75, 0, 0],
        "10753": [0.25001, 0.75, 0, 0],
        "10754": [0.25001, 0.75, 0, 0],
        "10756": [0.25001, 0.75, 0, 0],
        "10758": [0.25001, 0.75, 0, 0]
    },
    "Size2-Regular": {
        "40": [0.65002, 1.15, 0, 0],
        "41": [0.65002, 1.15, 0, 0],
        "47": [0.65002, 1.15, 0, 0],
        "91": [0.65002, 1.15, 0, 0],
        "92": [0.65002, 1.15, 0, 0],
        "93": [0.65002, 1.15, 0, 0],
        "123": [0.65002, 1.15, 0, 0],
        "125": [0.65002, 1.15, 0, 0],
        "710": [0, 0.75, 0, 0],
        "732": [0, 0.75, 0, 0],
        "770": [0, 0.75, 0, 0],
        "771": [0, 0.75, 0, 0],
        "8719": [0.55001, 1.05, 0, 0],
        "8720": [0.55001, 1.05, 0, 0],
        "8721": [0.55001, 1.05, 0, 0],
        "8730": [0.65002, 1.15, 0, 0],
        "8747": [0.86225, 1.36, 0.44445, 0],
        "8748": [0.862, 1.36, 0.44445, 0],
        "8749": [0.862, 1.36, 0.44445, 0],
        "8750": [0.86225, 1.36, 0.44445, 0],
        "8896": [0.55001, 1.05, 0, 0],
        "8897": [0.55001, 1.05, 0, 0],
        "8898": [0.55001, 1.05, 0, 0],
        "8899": [0.55001, 1.05, 0, 0],
        "8968": [0.65002, 1.15, 0, 0],
        "8969": [0.65002, 1.15, 0, 0],
        "8970": [0.65002, 1.15, 0, 0],
        "8971": [0.65002, 1.15, 0, 0],
        "10216": [0.65002, 1.15, 0, 0],
        "10217": [0.65002, 1.15, 0, 0],
        "10752": [0.55001, 1.05, 0, 0],
        "10753": [0.55001, 1.05, 0, 0],
        "10754": [0.55001, 1.05, 0, 0],
        "10756": [0.55001, 1.05, 0, 0],
        "10758": [0.55001, 1.05, 0, 0]
    },
    "Size3-Regular": {
        "40": [0.95003, 1.45, 0, 0],
        "41": [0.95003, 1.45, 0, 0],
        "47": [0.95003, 1.45, 0, 0],
        "91": [0.95003, 1.45, 0, 0],
        "92": [0.95003, 1.45, 0, 0],
        "93": [0.95003, 1.45, 0, 0],
        "123": [0.95003, 1.45, 0, 0],
        "125": [0.95003, 1.45, 0, 0],
        "710": [0, 0.75, 0, 0],
        "732": [0, 0.75, 0, 0],
        "770": [0, 0.75, 0, 0],
        "771": [0, 0.75, 0, 0],
        "8730": [0.95003, 1.45, 0, 0],
        "8968": [0.95003, 1.45, 0, 0],
        "8969": [0.95003, 1.45, 0, 0],
        "8970": [0.95003, 1.45, 0, 0],
        "8971": [0.95003, 1.45, 0, 0],
        "10216": [0.95003, 1.45, 0, 0],
        "10217": [0.95003, 1.45, 0, 0]
    },
    "Size4-Regular": {
        "40": [1.25003, 1.75, 0, 0],
        "41": [1.25003, 1.75, 0, 0],
        "47": [1.25003, 1.75, 0, 0],
        "91": [1.25003, 1.75, 0, 0],
        "92": [1.25003, 1.75, 0, 0],
        "93": [1.25003, 1.75, 0, 0],
        "123": [1.25003, 1.75, 0, 0],
        "125": [1.25003, 1.75, 0, 0],
        "710": [0, 0.825, 0, 0],
        "732": [0, 0.825, 0, 0],
        "770": [0, 0.825, 0, 0],
        "771": [0, 0.825, 0, 0],
        "8730": [1.25003, 1.75, 0, 0],
        "8968": [1.25003, 1.75, 0, 0],
        "8969": [1.25003, 1.75, 0, 0],
        "8970": [1.25003, 1.75, 0, 0],
        "8971": [1.25003, 1.75, 0, 0],
        "9115": [0.64502, 1.155, 0, 0],
        "9116": [1e-05, 0.6, 0, 0],
        "9117": [0.64502, 1.155, 0, 0],
        "9118": [0.64502, 1.155, 0, 0],
        "9119": [1e-05, 0.6, 0, 0],
        "9120": [0.64502, 1.155, 0, 0],
        "9121": [0.64502, 1.155, 0, 0],
        "9122": [-0.00099, 0.601, 0, 0],
        "9123": [0.64502, 1.155, 0, 0],
        "9124": [0.64502, 1.155, 0, 0],
        "9125": [-0.00099, 0.601, 0, 0],
        "9126": [0.64502, 1.155, 0, 0],
        "9127": [1e-05, 0.9, 0, 0],
        "9128": [0.65002, 1.15, 0, 0],
        "9129": [0.90001, 0, 0, 0],
        "9130": [0, 0.3, 0, 0],
        "9131": [1e-05, 0.9, 0, 0],
        "9132": [0.65002, 1.15, 0, 0],
        "9133": [0.90001, 0, 0, 0],
        "9143": [0.88502, 0.915, 0, 0],
        "10216": [1.25003, 1.75, 0, 0],
        "10217": [1.25003, 1.75, 0, 0],
        "57344": [-0.00499, 0.605, 0, 0],
        "57345": [-0.00499, 0.605, 0, 0],
        "57680": [0, 0.12, 0, 0],
        "57681": [0, 0.12, 0, 0],
        "57682": [0, 0.12, 0, 0],
        "57683": [0, 0.12, 0, 0]
    },
    "Typewriter-Regular": {
        "33": [0, 0.61111, 0, 0],
        "34": [0, 0.61111, 0, 0],
        "35": [0, 0.61111, 0, 0],
        "36": [0.08333, 0.69444, 0, 0],
        "37": [0.08333, 0.69444, 0, 0],
        "38": [0, 0.61111, 0, 0],
        "39": [0, 0.61111, 0, 0],
        "40": [0.08333, 0.69444, 0, 0],
        "41": [0.08333, 0.69444, 0, 0],
        "42": [0, 0.52083, 0, 0],
        "43": [-0.08056, 0.53055, 0, 0],
        "44": [0.13889, 0.125, 0, 0],
        "45": [-0.08056, 0.53055, 0, 0],
        "46": [0, 0.125, 0, 0],
        "47": [0.08333, 0.69444, 0, 0],
        "48": [0, 0.61111, 0, 0],
        "49": [0, 0.61111, 0, 0],
        "50": [0, 0.61111, 0, 0],
        "51": [0, 0.61111, 0, 0],
        "52": [0, 0.61111, 0, 0],
        "53": [0, 0.61111, 0, 0],
        "54": [0, 0.61111, 0, 0],
        "55": [0, 0.61111, 0, 0],
        "56": [0, 0.61111, 0, 0],
        "57": [0, 0.61111, 0, 0],
        "58": [0, 0.43056, 0, 0],
        "59": [0.13889, 0.43056, 0, 0],
        "60": [-0.05556, 0.55556, 0, 0],
        "61": [-0.19549, 0.41562, 0, 0],
        "62": [-0.05556, 0.55556, 0, 0],
        "63": [0, 0.61111, 0, 0],
        "64": [0, 0.61111, 0, 0],
        "65": [0, 0.61111, 0, 0],
        "66": [0, 0.61111, 0, 0],
        "67": [0, 0.61111, 0, 0],
        "68": [0, 0.61111, 0, 0],
        "69": [0, 0.61111, 0, 0],
        "70": [0, 0.61111, 0, 0],
        "71": [0, 0.61111, 0, 0],
        "72": [0, 0.61111, 0, 0],
        "73": [0, 0.61111, 0, 0],
        "74": [0, 0.61111, 0, 0],
        "75": [0, 0.61111, 0, 0],
        "76": [0, 0.61111, 0, 0],
        "77": [0, 0.61111, 0, 0],
        "78": [0, 0.61111, 0, 0],
        "79": [0, 0.61111, 0, 0],
        "80": [0, 0.61111, 0, 0],
        "81": [0.13889, 0.61111, 0, 0],
        "82": [0, 0.61111, 0, 0],
        "83": [0, 0.61111, 0, 0],
        "84": [0, 0.61111, 0, 0],
        "85": [0, 0.61111, 0, 0],
        "86": [0, 0.61111, 0, 0],
        "87": [0, 0.61111, 0, 0],
        "88": [0, 0.61111, 0, 0],
        "89": [0, 0.61111, 0, 0],
        "90": [0, 0.61111, 0, 0],
        "91": [0.08333, 0.69444, 0, 0],
        "92": [0.08333, 0.69444, 0, 0],
        "93": [0.08333, 0.69444, 0, 0],
        "94": [0, 0.61111, 0, 0],
        "95": [0.09514, 0, 0, 0],
        "96": [0, 0.61111, 0, 0],
        "97": [0, 0.43056, 0, 0],
        "98": [0, 0.61111, 0, 0],
        "99": [0, 0.43056, 0, 0],
        "100": [0, 0.61111, 0, 0],
        "101": [0, 0.43056, 0, 0],
        "102": [0, 0.61111, 0, 0],
        "103": [0.22222, 0.43056, 0, 0],
        "104": [0, 0.61111, 0, 0],
        "105": [0, 0.61111, 0, 0],
        "106": [0.22222, 0.61111, 0, 0],
        "107": [0, 0.61111, 0, 0],
        "108": [0, 0.61111, 0, 0],
        "109": [0, 0.43056, 0, 0],
        "110": [0, 0.43056, 0, 0],
        "111": [0, 0.43056, 0, 0],
        "112": [0.22222, 0.43056, 0, 0],
        "113": [0.22222, 0.43056, 0, 0],
        "114": [0, 0.43056, 0, 0],
        "115": [0, 0.43056, 0, 0],
        "116": [0, 0.55358, 0, 0],
        "117": [0, 0.43056, 0, 0],
        "118": [0, 0.43056, 0, 0],
        "119": [0, 0.43056, 0, 0],
        "120": [0, 0.43056, 0, 0],
        "121": [0.22222, 0.43056, 0, 0],
        "122": [0, 0.43056, 0, 0],
        "123": [0.08333, 0.69444, 0, 0],
        "124": [0.08333, 0.69444, 0, 0],
        "125": [0.08333, 0.69444, 0, 0],
        "126": [0, 0.61111, 0, 0],
        "127": [0, 0.61111, 0, 0],
        "305": [0, 0.43056, 0, 0],
        "567": [0.22222, 0.43056, 0, 0],
        "768": [0, 0.61111, 0, 0],
        "769": [0, 0.61111, 0, 0],
        "770": [0, 0.61111, 0, 0],
        "771": [0, 0.61111, 0, 0],
        "772": [0, 0.56555, 0, 0],
        "774": [0, 0.61111, 0, 0],
        "776": [0, 0.61111, 0, 0],
        "778": [0, 0.61111, 0, 0],
        "780": [0, 0.56597, 0, 0],
        "915": [0, 0.61111, 0, 0],
        "916": [0, 0.61111, 0, 0],
        "920": [0, 0.61111, 0, 0],
        "923": [0, 0.61111, 0, 0],
        "926": [0, 0.61111, 0, 0],
        "928": [0, 0.61111, 0, 0],
        "931": [0, 0.61111, 0, 0],
        "933": [0, 0.61111, 0, 0],
        "934": [0, 0.61111, 0, 0],
        "936": [0, 0.61111, 0, 0],
        "937": [0, 0.61111, 0, 0],
        "2018": [0, 0.61111, 0, 0],
        "2019": [0, 0.61111, 0, 0],
        "8242": [0, 0.61111, 0, 0]
    }
};

},{}],19:[function(require,module,exports){
var utils = require("./utils");
var ParseError = require("./ParseError");
var parseData = require("./parseData");
var ParseNode = parseData.ParseNode;

/* This file contains a list of functions that we parse, identified by
 * the calls to defineFunction.
 *
 * The first argument to defineFunction is a single name or a list of names.
 * All functions named in such a list will share a single implementation.
 *
 * Each declared function can have associated properties, which
 * include the following:
 *
 *  - numArgs: The number of arguments the function takes.
 *             If this is the only property, it can be passed as a number
 *             instead of an element of a properties object.
 *  - argTypes: (optional) An array corresponding to each argument of the
 *              function, giving the type of argument that should be parsed. Its
 *              length should be equal to `numArgs + numOptionalArgs`. Valid
 *              types:
 *               - "size": A size-like thing, such as "1em" or "5ex"
 *               - "color": An html color, like "#abc" or "blue"
 *               - "original": The same type as the environment that the
 *                             function being parsed is in (e.g. used for the
 *                             bodies of functions like \color where the first
 *                             argument is special and the second argument is
 *                             parsed normally)
 *              Other possible types (probably shouldn't be used)
 *               - "text": Text-like (e.g. \text)
 *               - "math": Normal math
 *              If undefined, this will be treated as an appropriate length
 *              array of "original" strings
 *  - greediness: (optional) The greediness of the function to use ungrouped
 *                arguments.
 *
 *                E.g. if you have an expression
 *                  \sqrt \frac 1 2
 *                since \frac has greediness=2 vs \sqrt's greediness=1, \frac
 *                will use the two arguments '1' and '2' as its two arguments,
 *                then that whole function will be used as the argument to
 *                \sqrt. On the other hand, the expressions
 *                  \frac \frac 1 2 3
 *                and
 *                  \frac \sqrt 1 2
 *                will fail because \frac and \frac have equal greediness
 *                and \sqrt has a lower greediness than \frac respectively. To
 *                make these parse, we would have to change them to:
 *                  \frac {\frac 1 2} 3
 *                and
 *                  \frac {\sqrt 1} 2
 *
 *                The default value is `1`
 *  - allowedInText: (optional) Whether or not the function is allowed inside
 *                   text mode (default false)
 *  - numOptionalArgs: (optional) The number of optional arguments the function
 *                     should parse. If the optional arguments aren't found,
 *                     `null` will be passed to the handler in their place.
 *                     (default 0)
 *  - infix: (optional) Must be true if the function is an infix operator.
 *
 * The last argument is that implementation, the handler for the function(s).
 * It is called to handle these functions and their arguments.
 * It receives two arguments:
 *  - context contains information and references provided by the parser
 *  - args is an array of arguments obtained from TeX input
 * The context contains the following properties:
 *  - funcName: the text (i.e. name) of the function, including \
 *  - parser: the parser object
 *  - lexer: the lexer object
 *  - positions: the positions in the overall string of the function
 *               and the arguments.
 * The latter three should only be used to produce error messages.
 *
 * The function should return an object with the following keys:
 *  - type: The type of element that this is. This is then used in
 *          buildHTML/buildMathML to determine which function
 *          should be called to build this node into a DOM node
 * Any other data can be added to the object, which will be passed
 * in to the function in buildHTML/buildMathML as `group.value`.
 */

function defineFunction(names, props, handler) {
    if (typeof names === "string") {
        names = [names];
    }
    if (typeof props === "number") {
        props = { numArgs: props };
    }
    // Set default values of functions
    var data = {
        numArgs: props.numArgs,
        argTypes: props.argTypes,
        greediness: (props.greediness === undefined) ? 1 : props.greediness,
        allowedInText: !!props.allowedInText,
        numOptionalArgs: props.numOptionalArgs || 0,
        infix: !!props.infix,
        handler: handler
    };
    for (var i = 0; i < names.length; ++i) {
        module.exports[names[i]] = data;
    }
}

// Since the corresponding buildHTML/buildMathML function expects a
// list of elements, we normalize for different kinds of arguments
var ordargument = function(arg) {
    if (arg.type === "ordgroup") {
        return arg.value;
    } else {
        return [arg];
    }
};

// A normal square root
defineFunction("\\sqrt", {
    numArgs: 1,
    numOptionalArgs: 1
}, function(context, args) {
    var index = args[0];
    var body = args[1];
    return {
        type: "sqrt",
        body: body,
        index: index
    };
});

// Non-mathy text, possibly in a font
var textFunctionStyles = {
    "\\text": undefined, "\\textrm": "mathrm", "\\textsf": "mathsf",
    "\\texttt": "mathtt", "\\textnormal": "mathrm", "\\textbf": "mathbf",
    "\\textit": "textit"
};

defineFunction([
    "\\text", "\\textrm", "\\textsf", "\\texttt", "\\textnormal",
    "\\textbf", "\\textit"
], {
    numArgs: 1,
    argTypes: ["text"],
    greediness: 2,
    allowedInText: true
}, function(context, args) {
    var body = args[0];
    return {
        type: "text",
        body: ordargument(body),
        style: textFunctionStyles[context.funcName]
    };
});

// A two-argument custom color
defineFunction("\\color", {
    numArgs: 2,
    allowedInText: true,
    greediness: 3,
    argTypes: ["color", "original"]
}, function(context, args) {
    var color = args[0];
    var body = args[1];
    return {
        type: "color",
        color: color.value,
        value: ordargument(body)
    };
});

// An overline
defineFunction("\\overline", {
    numArgs: 1
}, function(context, args) {
    var body = args[0];
    return {
        type: "overline",
        body: body
    };
});

// An underline
defineFunction("\\underline", {
    numArgs: 1
}, function(context, args) {
    var body = args[0];
    return {
        type: "underline",
        body: body
    };
});

// A box of the width and height
defineFunction("\\rule", {
    numArgs: 2,
    numOptionalArgs: 1,
    argTypes: ["size", "size", "size"]
}, function(context, args) {
    var shift = args[0];
    var width = args[1];
    var height = args[2];
    return {
        type: "rule",
        shift: shift && shift.value,
        width: width.value,
        height: height.value
    };
});

// TODO: In TeX, \mkern only accepts mu-units, and \kern does not accept
// mu-units. In current KaTeX we relax this; both commands accept any unit.
defineFunction(["\\kern", "\\mkern"], {
    numArgs: 1,
    argTypes: ["size"]
}, function(context, args) {
    return {
        type: "kern",
        dimension: args[0].value
    };
});

// A KaTeX logo
defineFunction("\\KaTeX", {
    numArgs: 0
}, function(context) {
    return {
        type: "katex"
    };
});

defineFunction("\\phantom", {
    numArgs: 1
}, function(context, args) {
    var body = args[0];
    return {
        type: "phantom",
        value: ordargument(body)
    };
});

// Math class commands except \mathop
defineFunction([
    "\\mathord", "\\mathbin", "\\mathrel", "\\mathopen",
    "\\mathclose", "\\mathpunct", "\\mathinner"
], {
    numArgs: 1
}, function(context, args) {
    var body = args[0];
    return {
        type: "mclass",
        mclass: "m" + context.funcName.substr(5),
        value: ordargument(body)
    };
});

// Build a relation by placing one symbol on top of another
defineFunction("\\stackrel", {
    numArgs: 2
}, function(context, args) {
    var top = args[0];
    var bottom = args[1];

    var bottomop = new ParseNode("op", {
        type: "op",
        limits: true,
        alwaysHandleSupSub: true,
        symbol: false,
        value: ordargument(bottom)
    }, bottom.mode);

    var supsub = new ParseNode("supsub", {
        base: bottomop,
        sup: top,
        sub: null
    }, top.mode);

    return {
        type: "mclass",
        mclass: "mrel",
        value: [supsub]
    };
});

// \mod-type functions
defineFunction("\\bmod", {
    numArgs: 0
}, function(context, args) {
    return {
        type: "mod",
        modType: "bmod",
        value: null
    };
});

defineFunction(["\\pod", "\\pmod", "\\mod"], {
    numArgs: 1
}, function(context, args) {
    var body = args[0];
    return {
        type: "mod",
        modType: context.funcName.substr(1),
        value: ordargument(body)
    };
});

// Extra data needed for the delimiter handler down below
var delimiterSizes = {
    "\\bigl" : {mclass: "mopen",    size: 1},
    "\\Bigl" : {mclass: "mopen",    size: 2},
    "\\biggl": {mclass: "mopen",    size: 3},
    "\\Biggl": {mclass: "mopen",    size: 4},
    "\\bigr" : {mclass: "mclose",   size: 1},
    "\\Bigr" : {mclass: "mclose",   size: 2},
    "\\biggr": {mclass: "mclose",   size: 3},
    "\\Biggr": {mclass: "mclose",   size: 4},
    "\\bigm" : {mclass: "mrel",     size: 1},
    "\\Bigm" : {mclass: "mrel",     size: 2},
    "\\biggm": {mclass: "mrel",     size: 3},
    "\\Biggm": {mclass: "mrel",     size: 4},
    "\\big"  : {mclass: "mord",     size: 1},
    "\\Big"  : {mclass: "mord",     size: 2},
    "\\bigg" : {mclass: "mord",     size: 3},
    "\\Bigg" : {mclass: "mord",     size: 4}
};

var delimiters = [
    "(", ")", "[", "\\lbrack", "]", "\\rbrack",
    "\\{", "\\lbrace", "\\}", "\\rbrace",
    "\\lfloor", "\\rfloor", "\\lceil", "\\rceil",
    "<", ">", "\\langle", "\\rangle", "\\lt", "\\gt",
    "\\lvert", "\\rvert", "\\lVert", "\\rVert",
    "\\lgroup", "\\rgroup", "\\lmoustache", "\\rmoustache",
    "/", "\\backslash",
    "|", "\\vert", "\\|", "\\Vert",
    "\\uparrow", "\\Uparrow",
    "\\downarrow", "\\Downarrow",
    "\\updownarrow", "\\Updownarrow",
    "."
];

var fontAliases = {
    "\\Bbb": "\\mathbb",
    "\\bold": "\\mathbf",
    "\\frak": "\\mathfrak"
};

// Single-argument color functions
defineFunction([
    "\\blue", "\\orange", "\\pink", "\\red",
    "\\green", "\\gray", "\\purple",
    "\\blueA", "\\blueB", "\\blueC", "\\blueD", "\\blueE",
    "\\tealA", "\\tealB", "\\tealC", "\\tealD", "\\tealE",
    "\\greenA", "\\greenB", "\\greenC", "\\greenD", "\\greenE",
    "\\goldA", "\\goldB", "\\goldC", "\\goldD", "\\goldE",
    "\\redA", "\\redB", "\\redC", "\\redD", "\\redE",
    "\\maroonA", "\\maroonB", "\\maroonC", "\\maroonD", "\\maroonE",
    "\\purpleA", "\\purpleB", "\\purpleC", "\\purpleD", "\\purpleE",
    "\\mintA", "\\mintB", "\\mintC",
    "\\grayA", "\\grayB", "\\grayC", "\\grayD", "\\grayE",
    "\\grayF", "\\grayG", "\\grayH", "\\grayI",
    "\\kaBlue", "\\kaGreen"
], {
    numArgs: 1,
    allowedInText: true,
    greediness: 3
}, function(context, args) {
    var body = args[0];
    return {
        type: "color",
        color: "katex-" + context.funcName.slice(1),
        value: ordargument(body)
    };
});

// There are 2 flags for operators; whether they produce limits in
// displaystyle, and whether they are symbols and should grow in
// displaystyle. These four groups cover the four possible choices.

// No limits, not symbols
defineFunction([
    "\\arcsin", "\\arccos", "\\arctan", "\\arg", "\\cos", "\\cosh",
    "\\cot", "\\coth", "\\csc", "\\deg", "\\dim", "\\exp", "\\hom",
    "\\ker", "\\lg", "\\ln", "\\log", "\\sec", "\\sin", "\\sinh",
    "\\tan", "\\tanh"
], {
    numArgs: 0
}, function(context) {
    return {
        type: "op",
        limits: false,
        symbol: false,
        body: context.funcName
    };
});

// Limits, not symbols
defineFunction([
    "\\det", "\\gcd", "\\inf", "\\lim", "\\liminf", "\\limsup", "\\max",
    "\\min", "\\Pr", "\\sup"
], {
    numArgs: 0
}, function(context) {
    return {
        type: "op",
        limits: true,
        symbol: false,
        body: context.funcName
    };
});

// No limits, symbols
defineFunction([
    "\\int", "\\iint", "\\iiint", "\\oint"
], {
    numArgs: 0
}, function(context) {
    return {
        type: "op",
        limits: false,
        symbol: true,
        body: context.funcName
    };
});

// Limits, symbols
defineFunction([
    "\\coprod", "\\bigvee", "\\bigwedge", "\\biguplus", "\\bigcap",
    "\\bigcup", "\\intop", "\\prod", "\\sum", "\\bigotimes",
    "\\bigoplus", "\\bigodot", "\\bigsqcup", "\\smallint"
], {
    numArgs: 0
}, function(context) {
    return {
        type: "op",
        limits: true,
        symbol: true,
        body: context.funcName
    };
});

// \mathop class command
defineFunction("\\mathop", {
    numArgs: 1
}, function(context, args) {
    var body = args[0];
    return {
        type: "op",
        limits: false,
        symbol: false,
        value: ordargument(body)
    };
});

// Fractions
defineFunction([
    "\\dfrac", "\\frac", "\\tfrac",
    "\\dbinom", "\\binom", "\\tbinom",
    "\\\\atopfrac" // can’t be entered directly
], {
    numArgs: 2,
    greediness: 2
}, function(context, args) {
    var numer = args[0];
    var denom = args[1];
    var hasBarLine;
    var leftDelim = null;
    var rightDelim = null;
    var size = "auto";

    switch (context.funcName) {
        case "\\dfrac":
        case "\\frac":
        case "\\tfrac":
            hasBarLine = true;
            break;
        case "\\\\atopfrac":
            hasBarLine = false;
            break;
        case "\\dbinom":
        case "\\binom":
        case "\\tbinom":
            hasBarLine = false;
            leftDelim = "(";
            rightDelim = ")";
            break;
        default:
            throw new Error("Unrecognized genfrac command");
    }

    switch (context.funcName) {
        case "\\dfrac":
        case "\\dbinom":
            size = "display";
            break;
        case "\\tfrac":
        case "\\tbinom":
            size = "text";
            break;
    }

    return {
        type: "genfrac",
        numer: numer,
        denom: denom,
        hasBarLine: hasBarLine,
        leftDelim: leftDelim,
        rightDelim: rightDelim,
        size: size
    };
});

// Left and right overlap functions
defineFunction(["\\llap", "\\rlap"], {
    numArgs: 1,
    allowedInText: true
}, function(context, args) {
    var body = args[0];
    return {
        type: context.funcName.slice(1),
        body: body
    };
});

// Delimiter functions
var checkDelimiter = function(delim, context) {
    if (utils.contains(delimiters, delim.value)) {
        return delim;
    } else {
        throw new ParseError(
            "Invalid delimiter: '" + delim.value + "' after '" +
            context.funcName + "'", delim);
    }
};

defineFunction([
    "\\bigl", "\\Bigl", "\\biggl", "\\Biggl",
    "\\bigr", "\\Bigr", "\\biggr", "\\Biggr",
    "\\bigm", "\\Bigm", "\\biggm", "\\Biggm",
    "\\big",  "\\Big",  "\\bigg",  "\\Bigg"
], {
    numArgs: 1
}, function(context, args) {
    var delim = checkDelimiter(args[0], context);

    return {
        type: "delimsizing",
        size: delimiterSizes[context.funcName].size,
        mclass: delimiterSizes[context.funcName].mclass,
        value: delim.value
    };
});

defineFunction([
    "\\left", "\\right"
], {
    numArgs: 1
}, function(context, args) {
    var delim = checkDelimiter(args[0], context);

    // \left and \right are caught somewhere in Parser.js, which is
    // why this data doesn't match what is in buildHTML.
    return {
        type: "leftright",
        value: delim.value
    };
});

defineFunction("\\middle", {
    numArgs: 1
}, function(context, args) {
    var delim = checkDelimiter(args[0], context);
    if (!context.parser.leftrightDepth) {
        throw new ParseError("\\middle without preceding \\left", delim);
    }

    return {
        type: "middle",
        value: delim.value
    };
});

// Sizing functions (handled in Parser.js explicitly, hence no handler)
defineFunction([
    "\\tiny", "\\scriptsize", "\\footnotesize", "\\small",
    "\\normalsize", "\\large", "\\Large", "\\LARGE", "\\huge", "\\Huge"
], 0, null);

// Style changing functions (handled in Parser.js explicitly, hence no
// handler)
defineFunction([
    "\\displaystyle", "\\textstyle", "\\scriptstyle",
    "\\scriptscriptstyle"
], 0, null);

defineFunction([
    // styles
    "\\mathrm", "\\mathit", "\\mathbf",

    // families
    "\\mathbb", "\\mathcal", "\\mathfrak", "\\mathscr", "\\mathsf",
    "\\mathtt",

    // aliases
    "\\Bbb", "\\bold", "\\frak"
], {
    numArgs: 1,
    greediness: 2
}, function(context, args) {
    var body = args[0];
    var func = context.funcName;
    if (func in fontAliases) {
        func = fontAliases[func];
    }
    return {
        type: "font",
        font: func.slice(1),
        body: body
    };
});

// Accents
defineFunction([
    "\\acute", "\\grave", "\\ddot", "\\tilde", "\\bar", "\\breve",
    "\\check", "\\hat", "\\vec", "\\dot"
    // We don't support expanding accents yet
    // "\\widetilde", "\\widehat"
], {
    numArgs: 1
}, function(context, args) {
    var base = args[0];
    return {
        type: "accent",
        accent: context.funcName,
        base: base
    };
});

// Infix generalized fractions
defineFunction(["\\over", "\\choose", "\\atop"], {
    numArgs: 0,
    infix: true
}, function(context) {
    var replaceWith;
    switch (context.funcName) {
        case "\\over":
            replaceWith = "\\frac";
            break;
        case "\\choose":
            replaceWith = "\\binom";
            break;
        case "\\atop":
            replaceWith = "\\\\atopfrac";
            break;
        default:
            throw new Error("Unrecognized infix genfrac command");
    }
    return {
        type: "infix",
        replaceWith: replaceWith,
        token: context.token
    };
});

// Row breaks for aligned data
defineFunction(["\\\\", "\\cr"], {
    numArgs: 0,
    numOptionalArgs: 1,
    argTypes: ["size"]
}, function(context, args) {
    var size = args[0];
    return {
        type: "cr",
        size: size
    };
});

// Environment delimiters
defineFunction(["\\begin", "\\end"], {
    numArgs: 1,
    argTypes: ["text"]
}, function(context, args) {
    var nameGroup = args[0];
    if (nameGroup.type !== "ordgroup") {
        throw new ParseError("Invalid environment name", nameGroup);
    }
    var name = "";
    for (var i = 0; i < nameGroup.value.length; ++i) {
        name += nameGroup.value[i].value;
    }
    return {
        type: "environment",
        name: name,
        nameGroup: nameGroup
    };
});

},{"./ParseError":6,"./parseData":21,"./utils":25}],20:[function(require,module,exports){
/**
 * These objects store data about MathML nodes. This is the MathML equivalent
 * of the types in domTree.js. Since MathML handles its own rendering, and
 * since we're mainly using MathML to improve accessibility, we don't manage
 * any of the styling state that the plain DOM nodes do.
 *
 * The `toNode` and `toMarkup` functions work simlarly to how they do in
 * domTree.js, creating namespaced DOM nodes and HTML text markup respectively.
 */

var utils = require("./utils");

/**
 * This node represents a general purpose MathML node of any type. The
 * constructor requires the type of node to create (for example, `"mo"` or
 * `"mspace"`, corresponding to `<mo>` and `<mspace>` tags).
 */
function MathNode(type, children) {
    this.type = type;
    this.attributes = {};
    this.children = children || [];
}

/**
 * Sets an attribute on a MathML node. MathML depends on attributes to convey a
 * semantic content, so this is used heavily.
 */
MathNode.prototype.setAttribute = function(name, value) {
    this.attributes[name] = value;
};

/**
 * Converts the math node into a MathML-namespaced DOM element.
 */
MathNode.prototype.toNode = function() {
    var node = document.createElementNS(
        "http://www.w3.org/1998/Math/MathML", this.type);

    for (var attr in this.attributes) {
        if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) {
            node.setAttribute(attr, this.attributes[attr]);
        }
    }

    for (var i = 0; i < this.children.length; i++) {
        node.appendChild(this.children[i].toNode());
    }

    return node;
};

/**
 * Converts the math node into an HTML markup string.
 */
MathNode.prototype.toMarkup = function() {
    var markup = "<" + this.type;

    // Add the attributes
    for (var attr in this.attributes) {
        if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) {
            markup += " " + attr + "=\"";
            markup += utils.escape(this.attributes[attr]);
            markup += "\"";
        }
    }

    markup += ">";

    for (var i = 0; i < this.children.length; i++) {
        markup += this.children[i].toMarkup();
    }

    markup += "</" + this.type + ">";

    return markup;
};

/**
 * This node represents a piece of text.
 */
function TextNode(text) {
    this.text = text;
}

/**
 * Converts the text node into a DOM text node.
 */
TextNode.prototype.toNode = function() {
    return document.createTextNode(this.text);
};

/**
 * Converts the text node into HTML markup (which is just the text itself).
 */
TextNode.prototype.toMarkup = function() {
    return utils.escape(this.text);
};

module.exports = {
    MathNode: MathNode,
    TextNode: TextNode
};

},{"./utils":25}],21:[function(require,module,exports){
/**
 * The resulting parse tree nodes of the parse tree.
 *
 * It is possible to provide position information, so that a ParseNode can
 * fulfil a role similar to a Token in error reporting.
 * For details on the corresponding properties see Token constructor.
 * Providing such information can lead to better error reporting.
 *
 * @param {string}  type       type of node, like e.g. "ordgroup"
 * @param {?object} value      type-specific representation of the node
 * @param {string}  mode       parse mode in action for this node,
 *                             "math" or "text"
 * @param {Token=} firstToken  first token of the input for this node,
 *                             will omit position information if unset
 * @param {Token=} lastToken   last token of the input for this node,
 *                             will default to firstToken if unset
 */
function ParseNode(type, value, mode, firstToken, lastToken) {
    this.type = type;
    this.value = value;
    this.mode = mode;
    if (firstToken && (!lastToken || lastToken.lexer === firstToken.lexer)) {
        this.lexer = firstToken.lexer;
        this.start = firstToken.start;
        this.end = (lastToken || firstToken).end;
    }
}

module.exports = {
    ParseNode: ParseNode
};


},{}],22:[function(require,module,exports){
/**
 * Provides a single function for parsing an expression using a Parser
 * TODO(emily): Remove this
 */

var Parser = require("./Parser");

/**
 * Parses an expression using a Parser, then returns the parsed result.
 */
var parseTree = function(toParse, settings) {
    if (!(typeof toParse === 'string' || toParse instanceof String)) {
        throw new TypeError('KaTeX can only parse string typed expression');
    }
    var parser = new Parser(toParse, settings);

    return parser.parse();
};

module.exports = parseTree;

},{"./Parser":7}],23:[function(require,module,exports){
/**
 * This file holds a list of all no-argument functions and single-character
 * symbols (like 'a' or ';').
 *
 * For each of the symbols, there are three properties they can have:
 * - font (required): the font to be used for this symbol. Either "main" (the
     normal font), or "ams" (the ams fonts).
 * - group (required): the ParseNode group type the symbol should have (i.e.
     "textord", "mathord", etc).
     See https://github.com/Khan/KaTeX/wiki/Examining-TeX#group-types
 * - replace: the character that this symbol or function should be
 *   replaced with (i.e. "\phi" has a replace value of "\u03d5", the phi
 *   character in the main font).
 *
 * The outermost map in the table indicates what mode the symbols should be
 * accepted in (e.g. "math" or "text").
 */

module.exports = {
    math: {},
    text: {}
};

function defineSymbol(mode, font, group, replace, name) {
    module.exports[mode][name] = {
        font: font,
        group: group,
        replace: replace
    };
}

// Some abbreviations for commonly used strings.
// This helps minify the code, and also spotting typos using jshint.

// modes:
var math = "math";
var text = "text";

// fonts:
var main = "main";
var ams = "ams";

// groups:
var accent = "accent";
var bin = "bin";
var close = "close";
var inner = "inner";
var mathord = "mathord";
var op = "op";
var open = "open";
var punct = "punct";
var rel = "rel";
var spacing = "spacing";
var textord = "textord";

// Now comes the symbol table

// Relation Symbols
defineSymbol(math, main, rel, "\u2261", "\\equiv");
defineSymbol(math, main, rel, "\u227a", "\\prec");
defineSymbol(math, main, rel, "\u227b", "\\succ");
defineSymbol(math, main, rel, "\u223c", "\\sim");
defineSymbol(math, main, rel, "\u22a5", "\\perp");
defineSymbol(math, main, rel, "\u2aaf", "\\preceq");
defineSymbol(math, main, rel, "\u2ab0", "\\succeq");
defineSymbol(math, main, rel, "\u2243", "\\simeq");
defineSymbol(math, main, rel, "\u2223", "\\mid");
defineSymbol(math, main, rel, "\u226a", "\\ll");
defineSymbol(math, main, rel, "\u226b", "\\gg");
defineSymbol(math, main, rel, "\u224d", "\\asymp");
defineSymbol(math, main, rel, "\u2225", "\\parallel");
defineSymbol(math, main, rel, "\u22c8", "\\bowtie");
defineSymbol(math, main, rel, "\u2323", "\\smile");
defineSymbol(math, main, rel, "\u2291", "\\sqsubseteq");
defineSymbol(math, main, rel, "\u2292", "\\sqsupseteq");
defineSymbol(math, main, rel, "\u2250", "\\doteq");
defineSymbol(math, main, rel, "\u2322", "\\frown");
defineSymbol(math, main, rel, "\u220b", "\\ni");
defineSymbol(math, main, rel, "\u221d", "\\propto");
defineSymbol(math, main, rel, "\u22a2", "\\vdash");
defineSymbol(math, main, rel, "\u22a3", "\\dashv");
defineSymbol(math, main, rel, "\u220b", "\\owns");

// Punctuation
defineSymbol(math, main, punct, "\u002e", "\\ldotp");
defineSymbol(math, main, punct, "\u22c5", "\\cdotp");

// Misc Symbols
defineSymbol(math, main, textord, "\u0023", "\\#");
defineSymbol(text, main, textord, "\u0023", "\\#");
defineSymbol(math, main, textord, "\u0026", "\\&");
defineSymbol(text, main, textord, "\u0026", "\\&");
defineSymbol(math, main, textord, "\u2135", "\\aleph");
defineSymbol(math, main, textord, "\u2200", "\\forall");
defineSymbol(math, main, textord, "\u210f", "\\hbar");
defineSymbol(math, main, textord, "\u2203", "\\exists");
defineSymbol(math, main, textord, "\u2207", "\\nabla");
defineSymbol(math, main, textord, "\u266d", "\\flat");
defineSymbol(math, main, textord, "\u2113", "\\ell");
defineSymbol(math, main, textord, "\u266e", "\\natural");
defineSymbol(math, main, textord, "\u2663", "\\clubsuit");
defineSymbol(math, main, textord, "\u2118", "\\wp");
defineSymbol(math, main, textord, "\u266f", "\\sharp");
defineSymbol(math, main, textord, "\u2662", "\\diamondsuit");
defineSymbol(math, main, textord, "\u211c", "\\Re");
defineSymbol(math, main, textord, "\u2661", "\\heartsuit");
defineSymbol(math, main, textord, "\u2111", "\\Im");
defineSymbol(math, main, textord, "\u2660", "\\spadesuit");

// Math and Text
defineSymbol(math, main, textord, "\u2020", "\\dag");
defineSymbol(math, main, textord, "\u2021", "\\ddag");

// Large Delimiters
defineSymbol(math, main, close, "\u23b1", "\\rmoustache");
defineSymbol(math, main, open, "\u23b0", "\\lmoustache");
defineSymbol(math, main, close, "\u27ef", "\\rgroup");
defineSymbol(math, main, open, "\u27ee", "\\lgroup");

// Binary Operators
defineSymbol(math, main, bin, "\u2213", "\\mp");
defineSymbol(math, main, bin, "\u2296", "\\ominus");
defineSymbol(math, main, bin, "\u228e", "\\uplus");
defineSymbol(math, main, bin, "\u2293", "\\sqcap");
defineSymbol(math, main, bin, "\u2217", "\\ast");
defineSymbol(math, main, bin, "\u2294", "\\sqcup");
defineSymbol(math, main, bin, "\u25ef", "\\bigcirc");
defineSymbol(math, main, bin, "\u2219", "\\bullet");
defineSymbol(math, main, bin, "\u2021", "\\ddagger");
defineSymbol(math, main, bin, "\u2240", "\\wr");
defineSymbol(math, main, bin, "\u2a3f", "\\amalg");

// Arrow Symbols
defineSymbol(math, main, rel, "\u27f5", "\\longleftarrow");
defineSymbol(math, main, rel, "\u21d0", "\\Leftarrow");
defineSymbol(math, main, rel, "\u27f8", "\\Longleftarrow");
defineSymbol(math, main, rel, "\u27f6", "\\longrightarrow");
defineSymbol(math, main, rel, "\u21d2", "\\Rightarrow");
defineSymbol(math, main, rel, "\u27f9", "\\Longrightarrow");
defineSymbol(math, main, rel, "\u2194", "\\leftrightarrow");
defineSymbol(math, main, rel, "\u27f7", "\\longleftrightarrow");
defineSymbol(math, main, rel, "\u21d4", "\\Leftrightarrow");
defineSymbol(math, main, rel, "\u27fa", "\\Longleftrightarrow");
defineSymbol(math, main, rel, "\u21a6", "\\mapsto");
defineSymbol(math, main, rel, "\u27fc", "\\longmapsto");
defineSymbol(math, main, rel, "\u2197", "\\nearrow");
defineSymbol(math, main, rel, "\u21a9", "\\hookleftarrow");
defineSymbol(math, main, rel, "\u21aa", "\\hookrightarrow");
defineSymbol(math, main, rel, "\u2198", "\\searrow");
defineSymbol(math, main, rel, "\u21bc", "\\leftharpoonup");
defineSymbol(math, main, rel, "\u21c0", "\\rightharpoonup");
defineSymbol(math, main, rel, "\u2199", "\\swarrow");
defineSymbol(math, main, rel, "\u21bd", "\\leftharpoondown");
defineSymbol(math, main, rel, "\u21c1", "\\rightharpoondown");
defineSymbol(math, main, rel, "\u2196", "\\nwarrow");
defineSymbol(math, main, rel, "\u21cc", "\\rightleftharpoons");

// AMS Negated Binary Relations
defineSymbol(math, ams, rel, "\u226e", "\\nless");
defineSymbol(math, ams, rel, "\ue010", "\\nleqslant");
defineSymbol(math, ams, rel, "\ue011", "\\nleqq");
defineSymbol(math, ams, rel, "\u2a87", "\\lneq");
defineSymbol(math, ams, rel, "\u2268", "\\lneqq");
defineSymbol(math, ams, rel, "\ue00c", "\\lvertneqq");
defineSymbol(math, ams, rel, "\u22e6", "\\lnsim");
defineSymbol(math, ams, rel, "\u2a89", "\\lnapprox");
defineSymbol(math, ams, rel, "\u2280", "\\nprec");
defineSymbol(math, ams, rel, "\u22e0", "\\npreceq");
defineSymbol(math, ams, rel, "\u22e8", "\\precnsim");
defineSymbol(math, ams, rel, "\u2ab9", "\\precnapprox");
defineSymbol(math, ams, rel, "\u2241", "\\nsim");
defineSymbol(math, ams, rel, "\ue006", "\\nshortmid");
defineSymbol(math, ams, rel, "\u2224", "\\nmid");
defineSymbol(math, ams, rel, "\u22ac", "\\nvdash");
defineSymbol(math, ams, rel, "\u22ad", "\\nvDash");
defineSymbol(math, ams, rel, "\u22ea", "\\ntriangleleft");
defineSymbol(math, ams, rel, "\u22ec", "\\ntrianglelefteq");
defineSymbol(math, ams, rel, "\u228a", "\\subsetneq");
defineSymbol(math, ams, rel, "\ue01a", "\\varsubsetneq");
defineSymbol(math, ams, rel, "\u2acb", "\\subsetneqq");
defineSymbol(math, ams, rel, "\ue017", "\\varsubsetneqq");
defineSymbol(math, ams, rel, "\u226f", "\\ngtr");
defineSymbol(math, ams, rel, "\ue00f", "\\ngeqslant");
defineSymbol(math, ams, rel, "\ue00e", "\\ngeqq");
defineSymbol(math, ams, rel, "\u2a88", "\\gneq");
defineSymbol(math, ams, rel, "\u2269", "\\gneqq");
defineSymbol(math, ams, rel, "\ue00d", "\\gvertneqq");
defineSymbol(math, ams, rel, "\u22e7", "\\gnsim");
defineSymbol(math, ams, rel, "\u2a8a", "\\gnapprox");
defineSymbol(math, ams, rel, "\u2281", "\\nsucc");
defineSymbol(math, ams, rel, "\u22e1", "\\nsucceq");
defineSymbol(math, ams, rel, "\u22e9", "\\succnsim");
defineSymbol(math, ams, rel, "\u2aba", "\\succnapprox");
defineSymbol(math, ams, rel, "\u2246", "\\ncong");
defineSymbol(math, ams, rel, "\ue007", "\\nshortparallel");
defineSymbol(math, ams, rel, "\u2226", "\\nparallel");
defineSymbol(math, ams, rel, "\u22af", "\\nVDash");
defineSymbol(math, ams, rel, "\u22eb", "\\ntriangleright");
defineSymbol(math, ams, rel, "\u22ed", "\\ntrianglerighteq");
defineSymbol(math, ams, rel, "\ue018", "\\nsupseteqq");
defineSymbol(math, ams, rel, "\u228b", "\\supsetneq");
defineSymbol(math, ams, rel, "\ue01b", "\\varsupsetneq");
defineSymbol(math, ams, rel, "\u2acc", "\\supsetneqq");
defineSymbol(math, ams, rel, "\ue019", "\\varsupsetneqq");
defineSymbol(math, ams, rel, "\u22ae", "\\nVdash");
defineSymbol(math, ams, rel, "\u2ab5", "\\precneqq");
defineSymbol(math, ams, rel, "\u2ab6", "\\succneqq");
defineSymbol(math, ams, rel, "\ue016", "\\nsubseteqq");
defineSymbol(math, ams, bin, "\u22b4", "\\unlhd");
defineSymbol(math, ams, bin, "\u22b5", "\\unrhd");

// AMS Negated Arrows
defineSymbol(math, ams, rel, "\u219a", "\\nleftarrow");
defineSymbol(math, ams, rel, "\u219b", "\\nrightarrow");
defineSymbol(math, ams, rel, "\u21cd", "\\nLeftarrow");
defineSymbol(math, ams, rel, "\u21cf", "\\nRightarrow");
defineSymbol(math, ams, rel, "\u21ae", "\\nleftrightarrow");
defineSymbol(math, ams, rel, "\u21ce", "\\nLeftrightarrow");

// AMS Misc
defineSymbol(math, ams, rel, "\u25b3", "\\vartriangle");
defineSymbol(math, ams, textord, "\u210f", "\\hslash");
defineSymbol(math, ams, textord, "\u25bd", "\\triangledown");
defineSymbol(math, ams, textord, "\u25ca", "\\lozenge");
defineSymbol(math, ams, textord, "\u24c8", "\\circledS");
defineSymbol(math, ams, textord, "\u00ae", "\\circledR");
defineSymbol(math, ams, textord, "\u2221", "\\measuredangle");
defineSymbol(math, ams, textord, "\u2204", "\\nexists");
defineSymbol(math, ams, textord, "\u2127", "\\mho");
defineSymbol(math, ams, textord, "\u2132", "\\Finv");
defineSymbol(math, ams, textord, "\u2141", "\\Game");
defineSymbol(math, ams, textord, "\u006b", "\\Bbbk");
defineSymbol(math, ams, textord, "\u2035", "\\backprime");
defineSymbol(math, ams, textord, "\u25b2", "\\blacktriangle");
defineSymbol(math, ams, textord, "\u25bc", "\\blacktriangledown");
defineSymbol(math, ams, textord, "\u25a0", "\\blacksquare");
defineSymbol(math, ams, textord, "\u29eb", "\\blacklozenge");
defineSymbol(math, ams, textord, "\u2605", "\\bigstar");
defineSymbol(math, ams, textord, "\u2222", "\\sphericalangle");
defineSymbol(math, ams, textord, "\u2201", "\\complement");
defineSymbol(math, ams, textord, "\u00f0", "\\eth");
defineSymbol(math, ams, textord, "\u2571", "\\diagup");
defineSymbol(math, ams, textord, "\u2572", "\\diagdown");
defineSymbol(math, ams, textord, "\u25a1", "\\square");
defineSymbol(math, ams, textord, "\u25a1", "\\Box");
defineSymbol(math, ams, textord, "\u25ca", "\\Diamond");
defineSymbol(math, ams, textord, "\u00a5", "\\yen");
defineSymbol(math, ams, textord, "\u2713", "\\checkmark");

// AMS Hebrew
defineSymbol(math, ams, textord, "\u2136", "\\beth");
defineSymbol(math, ams, textord, "\u2138", "\\daleth");
defineSymbol(math, ams, textord, "\u2137", "\\gimel");

// AMS Greek
defineSymbol(math, ams, textord, "\u03dd", "\\digamma");
defineSymbol(math, ams, textord, "\u03f0", "\\varkappa");

// AMS Delimiters
defineSymbol(math, ams, open, "\u250c", "\\ulcorner");
defineSymbol(math, ams, close, "\u2510", "\\urcorner");
defineSymbol(math, ams, open, "\u2514", "\\llcorner");
defineSymbol(math, ams, close, "\u2518", "\\lrcorner");

// AMS Binary Relations
defineSymbol(math, ams, rel, "\u2266", "\\leqq");
defineSymbol(math, ams, rel, "\u2a7d", "\\leqslant");
defineSymbol(math, ams, rel, "\u2a95", "\\eqslantless");
defineSymbol(math, ams, rel, "\u2272", "\\lesssim");
defineSymbol(math, ams, rel, "\u2a85", "\\lessapprox");
defineSymbol(math, ams, rel, "\u224a", "\\approxeq");
defineSymbol(math, ams, bin, "\u22d6", "\\lessdot");
defineSymbol(math, ams, rel, "\u22d8", "\\lll");
defineSymbol(math, ams, rel, "\u2276", "\\lessgtr");
defineSymbol(math, ams, rel, "\u22da", "\\lesseqgtr");
defineSymbol(math, ams, rel, "\u2a8b", "\\lesseqqgtr");
defineSymbol(math, ams, rel, "\u2251", "\\doteqdot");
defineSymbol(math, ams, rel, "\u2253", "\\risingdotseq");
defineSymbol(math, ams, rel, "\u2252", "\\fallingdotseq");
defineSymbol(math, ams, rel, "\u223d", "\\backsim");
defineSymbol(math, ams, rel, "\u22cd", "\\backsimeq");
defineSymbol(math, ams, rel, "\u2ac5", "\\subseteqq");
defineSymbol(math, ams, rel, "\u22d0", "\\Subset");
defineSymbol(math, ams, rel, "\u228f", "\\sqsubset");
defineSymbol(math, ams, rel, "\u227c", "\\preccurlyeq");
defineSymbol(math, ams, rel, "\u22de", "\\curlyeqprec");
defineSymbol(math, ams, rel, "\u227e", "\\precsim");
defineSymbol(math, ams, rel, "\u2ab7", "\\precapprox");
defineSymbol(math, ams, rel, "\u22b2", "\\vartriangleleft");
defineSymbol(math, ams, rel, "\u22b4", "\\trianglelefteq");
defineSymbol(math, ams, rel, "\u22a8", "\\vDash");
defineSymbol(math, ams, rel, "\u22aa", "\\Vvdash");
defineSymbol(math, ams, rel, "\u2323", "\\smallsmile");
defineSymbol(math, ams, rel, "\u2322", "\\smallfrown");
defineSymbol(math, ams, rel, "\u224f", "\\bumpeq");
defineSymbol(math, ams, rel, "\u224e", "\\Bumpeq");
defineSymbol(math, ams, rel, "\u2267", "\\geqq");
defineSymbol(math, ams, rel, "\u2a7e", "\\geqslant");
defineSymbol(math, ams, rel, "\u2a96", "\\eqslantgtr");
defineSymbol(math, ams, rel, "\u2273", "\\gtrsim");
defineSymbol(math, ams, rel, "\u2a86", "\\gtrapprox");
defineSymbol(math, ams, bin, "\u22d7", "\\gtrdot");
defineSymbol(math, ams, rel, "\u22d9", "\\ggg");
defineSymbol(math, ams, rel, "\u2277", "\\gtrless");
defineSymbol(math, ams, rel, "\u22db", "\\gtreqless");
defineSymbol(math, ams, rel, "\u2a8c", "\\gtreqqless");
defineSymbol(math, ams, rel, "\u2256", "\\eqcirc");
defineSymbol(math, ams, rel, "\u2257", "\\circeq");
defineSymbol(math, ams, rel, "\u225c", "\\triangleq");
defineSymbol(math, ams, rel, "\u223c", "\\thicksim");
defineSymbol(math, ams, rel, "\u2248", "\\thickapprox");
defineSymbol(math, ams, rel, "\u2ac6", "\\supseteqq");
defineSymbol(math, ams, rel, "\u22d1", "\\Supset");
defineSymbol(math, ams, rel, "\u2290", "\\sqsupset");
defineSymbol(math, ams, rel, "\u227d", "\\succcurlyeq");
defineSymbol(math, ams, rel, "\u22df", "\\curlyeqsucc");
defineSymbol(math, ams, rel, "\u227f", "\\succsim");
defineSymbol(math, ams, rel, "\u2ab8", "\\succapprox");
defineSymbol(math, ams, rel, "\u22b3", "\\vartriangleright");
defineSymbol(math, ams, rel, "\u22b5", "\\trianglerighteq");
defineSymbol(math, ams, rel, "\u22a9", "\\Vdash");
defineSymbol(math, ams, rel, "\u2223", "\\shortmid");
defineSymbol(math, ams, rel, "\u2225", "\\shortparallel");
defineSymbol(math, ams, rel, "\u226c", "\\between");
defineSymbol(math, ams, rel, "\u22d4", "\\pitchfork");
defineSymbol(math, ams, rel, "\u221d", "\\varpropto");
defineSymbol(math, ams, rel, "\u25c0", "\\blacktriangleleft");
defineSymbol(math, ams, rel, "\u2234", "\\therefore");
defineSymbol(math, ams, rel, "\u220d", "\\backepsilon");
defineSymbol(math, ams, rel, "\u25b6", "\\blacktriangleright");
defineSymbol(math, ams, rel, "\u2235", "\\because");
defineSymbol(math, ams, rel, "\u22d8", "\\llless");
defineSymbol(math, ams, rel, "\u22d9", "\\gggtr");
defineSymbol(math, ams, bin, "\u22b2", "\\lhd");
defineSymbol(math, ams, bin, "\u22b3", "\\rhd");
defineSymbol(math, ams, rel, "\u2242", "\\eqsim");
defineSymbol(math, main, rel, "\u22c8", "\\Join");
defineSymbol(math, ams, rel, "\u2251", "\\Doteq");

// AMS Binary Operators
defineSymbol(math, ams, bin, "\u2214", "\\dotplus");
defineSymbol(math, ams, bin, "\u2216", "\\smallsetminus");
defineSymbol(math, ams, bin, "\u22d2", "\\Cap");
defineSymbol(math, ams, bin, "\u22d3", "\\Cup");
defineSymbol(math, ams, bin, "\u2a5e", "\\doublebarwedge");
defineSymbol(math, ams, bin, "\u229f", "\\boxminus");
defineSymbol(math, ams, bin, "\u229e", "\\boxplus");
defineSymbol(math, ams, bin, "\u22c7", "\\divideontimes");
defineSymbol(math, ams, bin, "\u22c9", "\\ltimes");
defineSymbol(math, ams, bin, "\u22ca", "\\rtimes");
defineSymbol(math, ams, bin, "\u22cb", "\\leftthreetimes");
defineSymbol(math, ams, bin, "\u22cc", "\\rightthreetimes");
defineSymbol(math, ams, bin, "\u22cf", "\\curlywedge");
defineSymbol(math, ams, bin, "\u22ce", "\\curlyvee");
defineSymbol(math, ams, bin, "\u229d", "\\circleddash");
defineSymbol(math, ams, bin, "\u229b", "\\circledast");
defineSymbol(math, ams, bin, "\u22c5", "\\centerdot");
defineSymbol(math, ams, bin, "\u22ba", "\\intercal");
defineSymbol(math, ams, bin, "\u22d2", "\\doublecap");
defineSymbol(math, ams, bin, "\u22d3", "\\doublecup");
defineSymbol(math, ams, bin, "\u22a0", "\\boxtimes");

// AMS Arrows
defineSymbol(math, ams, rel, "\u21e2", "\\dashrightarrow");
defineSymbol(math, ams, rel, "\u21e0", "\\dashleftarrow");
defineSymbol(math, ams, rel, "\u21c7", "\\leftleftarrows");
defineSymbol(math, ams, rel, "\u21c6", "\\leftrightarrows");
defineSymbol(math, ams, rel, "\u21da", "\\Lleftarrow");
defineSymbol(math, ams, rel, "\u219e", "\\twoheadleftarrow");
defineSymbol(math, ams, rel, "\u21a2", "\\leftarrowtail");
defineSymbol(math, ams, rel, "\u21ab", "\\looparrowleft");
defineSymbol(math, ams, rel, "\u21cb", "\\leftrightharpoons");
defineSymbol(math, ams, rel, "\u21b6", "\\curvearrowleft");
defineSymbol(math, ams, rel, "\u21ba", "\\circlearrowleft");
defineSymbol(math, ams, rel, "\u21b0", "\\Lsh");
defineSymbol(math, ams, rel, "\u21c8", "\\upuparrows");
defineSymbol(math, ams, rel, "\u21bf", "\\upharpoonleft");
defineSymbol(math, ams, rel, "\u21c3", "\\downharpoonleft");
defineSymbol(math, ams, rel, "\u22b8", "\\multimap");
defineSymbol(math, ams, rel, "\u21ad", "\\leftrightsquigarrow");
defineSymbol(math, ams, rel, "\u21c9", "\\rightrightarrows");
defineSymbol(math, ams, rel, "\u21c4", "\\rightleftarrows");
defineSymbol(math, ams, rel, "\u21a0", "\\twoheadrightarrow");
defineSymbol(math, ams, rel, "\u21a3", "\\rightarrowtail");
defineSymbol(math, ams, rel, "\u21ac", "\\looparrowright");
defineSymbol(math, ams, rel, "\u21b7", "\\curvearrowright");
defineSymbol(math, ams, rel, "\u21bb", "\\circlearrowright");
defineSymbol(math, ams, rel, "\u21b1", "\\Rsh");
defineSymbol(math, ams, rel, "\u21ca", "\\downdownarrows");
defineSymbol(math, ams, rel, "\u21be", "\\upharpoonright");
defineSymbol(math, ams, rel, "\u21c2", "\\downharpoonright");
defineSymbol(math, ams, rel, "\u21dd", "\\rightsquigarrow");
defineSymbol(math, ams, rel, "\u21dd", "\\leadsto");
defineSymbol(math, ams, rel, "\u21db", "\\Rrightarrow");
defineSymbol(math, ams, rel, "\u21be", "\\restriction");

defineSymbol(math, main, textord, "\u2018", "`");
defineSymbol(math, main, textord, "$", "\\$");
defineSymbol(text, main, textord, "$", "\\$");
defineSymbol(math, main, textord, "%", "\\%");
defineSymbol(text, main, textord, "%", "\\%");
defineSymbol(math, main, textord, "_", "\\_");
defineSymbol(text, main, textord, "_", "\\_");
defineSymbol(math, main, textord, "\u2220", "\\angle");
defineSymbol(math, main, textord, "\u221e", "\\infty");
defineSymbol(math, main, textord, "\u2032", "\\prime");
defineSymbol(math, main, textord, "\u25b3", "\\triangle");
defineSymbol(math, main, textord, "\u0393", "\\Gamma");
defineSymbol(math, main, textord, "\u0394", "\\Delta");
defineSymbol(math, main, textord, "\u0398", "\\Theta");
defineSymbol(math, main, textord, "\u039b", "\\Lambda");
defineSymbol(math, main, textord, "\u039e", "\\Xi");
defineSymbol(math, main, textord, "\u03a0", "\\Pi");
defineSymbol(math, main, textord, "\u03a3", "\\Sigma");
defineSymbol(math, main, textord, "\u03a5", "\\Upsilon");
defineSymbol(math, main, textord, "\u03a6", "\\Phi");
defineSymbol(math, main, textord, "\u03a8", "\\Psi");
defineSymbol(math, main, textord, "\u03a9", "\\Omega");
defineSymbol(math, main, textord, "\u00ac", "\\neg");
defineSymbol(math, main, textord, "\u00ac", "\\lnot");
defineSymbol(math, main, textord, "\u22a4", "\\top");
defineSymbol(math, main, textord, "\u22a5", "\\bot");
defineSymbol(math, main, textord, "\u2205", "\\emptyset");
defineSymbol(math, ams, textord, "\u2205", "\\varnothing");
defineSymbol(math, main, mathord, "\u03b1", "\\alpha");
defineSymbol(math, main, mathord, "\u03b2", "\\beta");
defineSymbol(math, main, mathord, "\u03b3", "\\gamma");
defineSymbol(math, main, mathord, "\u03b4", "\\delta");
defineSymbol(math, main, mathord, "\u03f5", "\\epsilon");
defineSymbol(math, main, mathord, "\u03b6", "\\zeta");
defineSymbol(math, main, mathord, "\u03b7", "\\eta");
defineSymbol(math, main, mathord, "\u03b8", "\\theta");
defineSymbol(math, main, mathord, "\u03b9", "\\iota");
defineSymbol(math, main, mathord, "\u03ba", "\\kappa");
defineSymbol(math, main, mathord, "\u03bb", "\\lambda");
defineSymbol(math, main, mathord, "\u03bc", "\\mu");
defineSymbol(math, main, mathord, "\u03bd", "\\nu");
defineSymbol(math, main, mathord, "\u03be", "\\xi");
defineSymbol(math, main, mathord, "o", "\\omicron");
defineSymbol(math, main, mathord, "\u03c0", "\\pi");
defineSymbol(math, main, mathord, "\u03c1", "\\rho");
defineSymbol(math, main, mathord, "\u03c3", "\\sigma");
defineSymbol(math, main, mathord, "\u03c4", "\\tau");
defineSymbol(math, main, mathord, "\u03c5", "\\upsilon");
defineSymbol(math, main, mathord, "\u03d5", "\\phi");
defineSymbol(math, main, mathord, "\u03c7", "\\chi");
defineSymbol(math, main, mathord, "\u03c8", "\\psi");
defineSymbol(math, main, mathord, "\u03c9", "\\omega");
defineSymbol(math, main, mathord, "\u03b5", "\\varepsilon");
defineSymbol(math, main, mathord, "\u03d1", "\\vartheta");
defineSymbol(math, main, mathord, "\u03d6", "\\varpi");
defineSymbol(math, main, mathord, "\u03f1", "\\varrho");
defineSymbol(math, main, mathord, "\u03c2", "\\varsigma");
defineSymbol(math, main, mathord, "\u03c6", "\\varphi");
defineSymbol(math, main, bin, "\u2217", "*");
defineSymbol(math, main, bin, "+", "+");
defineSymbol(math, main, bin, "\u2212", "-");
defineSymbol(math, main, bin, "\u22c5", "\\cdot");
defineSymbol(math, main, bin, "\u2218", "\\circ");
defineSymbol(math, main, bin, "\u00f7", "\\div");
defineSymbol(math, main, bin, "\u00b1", "\\pm");
defineSymbol(math, main, bin, "\u00d7", "\\times");
defineSymbol(math, main, bin, "\u2229", "\\cap");
defineSymbol(math, main, bin, "\u222a", "\\cup");
defineSymbol(math, main, bin, "\u2216", "\\setminus");
defineSymbol(math, main, bin, "\u2227", "\\land");
defineSymbol(math, main, bin, "\u2228", "\\lor");
defineSymbol(math, main, bin, "\u2227", "\\wedge");
defineSymbol(math, main, bin, "\u2228", "\\vee");
defineSymbol(math, main, textord, "\u221a", "\\surd");
defineSymbol(math, main, open, "(", "(");
defineSymbol(math, main, open, "[", "[");
defineSymbol(math, main, open, "\u27e8", "\\langle");
defineSymbol(math, main, open, "\u2223", "\\lvert");
defineSymbol(math, main, open, "\u2225", "\\lVert");
defineSymbol(math, main, close, ")", ")");
defineSymbol(math, main, close, "]", "]");
defineSymbol(math, main, close, "?", "?");
defineSymbol(math, main, close, "!", "!");
defineSymbol(math, main, close, "\u27e9", "\\rangle");
defineSymbol(math, main, close, "\u2223", "\\rvert");
defineSymbol(math, main, close, "\u2225", "\\rVert");
defineSymbol(math, main, rel, "=", "=");
defineSymbol(math, main, rel, "<", "<");
defineSymbol(math, main, rel, ">", ">");
defineSymbol(math, main, rel, ":", ":");
defineSymbol(math, main, rel, "\u2248", "\\approx");
defineSymbol(math, main, rel, "\u2245", "\\cong");
defineSymbol(math, main, rel, "\u2265", "\\ge");
defineSymbol(math, main, rel, "\u2265", "\\geq");
defineSymbol(math, main, rel, "\u2190", "\\gets");
defineSymbol(math, main, rel, ">", "\\gt");
defineSymbol(math, main, rel, "\u2208", "\\in");
defineSymbol(math, main, rel, "\u2209", "\\notin");
defineSymbol(math, main, rel, "\u2282", "\\subset");
defineSymbol(math, main, rel, "\u2283", "\\supset");
defineSymbol(math, main, rel, "\u2286", "\\subseteq");
defineSymbol(math, main, rel, "\u2287", "\\supseteq");
defineSymbol(math, ams, rel, "\u2288", "\\nsubseteq");
defineSymbol(math, ams, rel, "\u2289", "\\nsupseteq");
defineSymbol(math, main, rel, "\u22a8", "\\models");
defineSymbol(math, main, rel, "\u2190", "\\leftarrow");
defineSymbol(math, main, rel, "\u2264", "\\le");
defineSymbol(math, main, rel, "\u2264", "\\leq");
defineSymbol(math, main, rel, "<", "\\lt");
defineSymbol(math, main, rel, "\u2260", "\\ne");
defineSymbol(math, main, rel, "\u2260", "\\neq");
defineSymbol(math, main, rel, "\u2192", "\\rightarrow");
defineSymbol(math, main, rel, "\u2192", "\\to");
defineSymbol(math, ams, rel, "\u2271", "\\ngeq");
defineSymbol(math, ams, rel, "\u2270", "\\nleq");
defineSymbol(math, main, spacing, null, "\\!");
defineSymbol(math, main, spacing, "\u00a0", "\\ ");
defineSymbol(math, main, spacing, "\u00a0", "~");
defineSymbol(math, main, spacing, null, "\\,");
defineSymbol(math, main, spacing, null, "\\:");
defineSymbol(math, main, spacing, null, "\\;");
defineSymbol(math, main, spacing, null, "\\enspace");
defineSymbol(math, main, spacing, null, "\\qquad");
defineSymbol(math, main, spacing, null, "\\quad");
defineSymbol(math, main, spacing, "\u00a0", "\\space");
defineSymbol(math, main, punct, ",", ",");
defineSymbol(math, main, punct, ";", ";");
defineSymbol(math, main, punct, ":", "\\colon");
defineSymbol(math, ams, bin, "\u22bc", "\\barwedge");
defineSymbol(math, ams, bin, "\u22bb", "\\veebar");
defineSymbol(math, main, bin, "\u2299", "\\odot");
defineSymbol(math, main, bin, "\u2295", "\\oplus");
defineSymbol(math, main, bin, "\u2297", "\\otimes");
defineSymbol(math, main, textord, "\u2202", "\\partial");
defineSymbol(math, main, bin, "\u2298", "\\oslash");
defineSymbol(math, ams, bin, "\u229a", "\\circledcirc");
defineSymbol(math, ams, bin, "\u22a1", "\\boxdot");
defineSymbol(math, main, bin, "\u25b3", "\\bigtriangleup");
defineSymbol(math, main, bin, "\u25bd", "\\bigtriangledown");
defineSymbol(math, main, bin, "\u2020", "\\dagger");
defineSymbol(math, main, bin, "\u22c4", "\\diamond");
defineSymbol(math, main, bin, "\u22c6", "\\star");
defineSymbol(math, main, bin, "\u25c3", "\\triangleleft");
defineSymbol(math, main, bin, "\u25b9", "\\triangleright");
defineSymbol(math, main, open, "{", "\\{");
defineSymbol(text, main, textord, "{", "\\{");
defineSymbol(math, main, close, "}", "\\}");
defineSymbol(text, main, textord, "}", "\\}");
defineSymbol(math, main, open, "{", "\\lbrace");
defineSymbol(math, main, close, "}", "\\rbrace");
defineSymbol(math, main, open, "[", "\\lbrack");
defineSymbol(math, main, close, "]", "\\rbrack");
defineSymbol(math, main, open, "\u230a", "\\lfloor");
defineSymbol(math, main, close, "\u230b", "\\rfloor");
defineSymbol(math, main, open, "\u2308", "\\lceil");
defineSymbol(math, main, close, "\u2309", "\\rceil");
defineSymbol(math, main, textord, "\\", "\\backslash");
defineSymbol(math, main, textord, "\u2223", "|");
defineSymbol(math, main, textord, "\u2223", "\\vert");
defineSymbol(math, main, textord, "\u2225", "\\|");
defineSymbol(math, main, textord, "\u2225", "\\Vert");
defineSymbol(math, main, rel, "\u2191", "\\uparrow");
defineSymbol(math, main, rel, "\u21d1", "\\Uparrow");
defineSymbol(math, main, rel, "\u2193", "\\downarrow");
defineSymbol(math, main, rel, "\u21d3", "\\Downarrow");
defineSymbol(math, main, rel, "\u2195", "\\updownarrow");
defineSymbol(math, main, rel, "\u21d5", "\\Updownarrow");
defineSymbol(math, math, op, "\u2210", "\\coprod");
defineSymbol(math, math, op, "\u22c1", "\\bigvee");
defineSymbol(math, math, op, "\u22c0", "\\bigwedge");
defineSymbol(math, math, op, "\u2a04", "\\biguplus");
defineSymbol(math, math, op, "\u22c2", "\\bigcap");
defineSymbol(math, math, op, "\u22c3", "\\bigcup");
defineSymbol(math, math, op, "\u222b", "\\int");
defineSymbol(math, math, op, "\u222b", "\\intop");
defineSymbol(math, math, op, "\u222c", "\\iint");
defineSymbol(math, math, op, "\u222d", "\\iiint");
defineSymbol(math, math, op, "\u220f", "\\prod");
defineSymbol(math, math, op, "\u2211", "\\sum");
defineSymbol(math, math, op, "\u2a02", "\\bigotimes");
defineSymbol(math, math, op, "\u2a01", "\\bigoplus");
defineSymbol(math, math, op, "\u2a00", "\\bigodot");
defineSymbol(math, math, op, "\u222e", "\\oint");
defineSymbol(math, math, op, "\u2a06", "\\bigsqcup");
defineSymbol(math, math, op, "\u222b", "\\smallint");
defineSymbol(text, main, inner, "\u2026", "\\textellipsis");
defineSymbol(math, main, inner, "\u2026", "\\mathellipsis");
defineSymbol(text, main, inner, "\u2026", "\\ldots");
defineSymbol(math, main, inner, "\u2026", "\\ldots");
defineSymbol(math, main, inner, "\u22ef", "\\cdots");
defineSymbol(math, main, inner, "\u22f1", "\\ddots");
defineSymbol(math, main, textord, "\u22ee", "\\vdots");
defineSymbol(math, main, accent, "\u00b4", "\\acute");
defineSymbol(math, main, accent, "\u0060", "\\grave");
defineSymbol(math, main, accent, "\u00a8", "\\ddot");
defineSymbol(math, main, accent, "\u007e", "\\tilde");
defineSymbol(math, main, accent, "\u00af", "\\bar");
defineSymbol(math, main, accent, "\u02d8", "\\breve");
defineSymbol(math, main, accent, "\u02c7", "\\check");
defineSymbol(math, main, accent, "\u005e", "\\hat");
defineSymbol(math, main, accent, "\u20d7", "\\vec");
defineSymbol(math, main, accent, "\u02d9", "\\dot");
defineSymbol(math, main, mathord, "\u0131", "\\imath");
defineSymbol(math, main, mathord, "\u0237", "\\jmath");

defineSymbol(text, main, textord, "\u2013", "--");
defineSymbol(text, main, textord, "\u2014", "---");
defineSymbol(text, main, textord, "\u2018", "`");
defineSymbol(text, main, textord, "\u2019", "'");
defineSymbol(text, main, textord, "\u201c", "``");
defineSymbol(text, main, textord, "\u201d", "''");
defineSymbol(math, main, textord, "\u00b0", "\\degree");
defineSymbol(text, main, textord, "\u00b0", "\\degree");
defineSymbol(math, main, mathord, "\u00a3", "\\pounds");
defineSymbol(math, ams, textord, "\u2720", "\\maltese");
defineSymbol(text, ams, textord, "\u2720", "\\maltese");

defineSymbol(text, main, spacing, "\u00a0", "\\ ");
defineSymbol(text, main, spacing, "\u00a0", " ");
defineSymbol(text, main, spacing, "\u00a0", "~");

// There are lots of symbols which are the same, so we add them in afterwards.
var i;
var ch;

// All of these are textords in math mode
var mathTextSymbols = "0123456789/@.\"";
for (i = 0; i < mathTextSymbols.length; i++) {
    ch = mathTextSymbols.charAt(i);
    defineSymbol(math, main, textord, ch, ch);
}

// All of these are textords in text mode
var textSymbols = "0123456789!@*()-=+[]\";:?/.,";
for (i = 0; i < textSymbols.length; i++) {
    ch = textSymbols.charAt(i);
    defineSymbol(text, main, textord, ch, ch);
}

// All of these are textords in text mode, and mathords in math mode
var letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
for (i = 0; i < letters.length; i++) {
    ch = letters.charAt(i);
    defineSymbol(math, main, mathord, ch, ch);
    defineSymbol(text, main, textord, ch, ch);
}

// Latin-1 letters
for (i = 0x00C0; i <= 0x00D6; i++) {
    ch = String.fromCharCode(i);
    defineSymbol(text, main, textord, ch, ch);
}

for (i = 0x00D8; i <= 0x00F6; i++) {
    ch = String.fromCharCode(i);
    defineSymbol(text, main, textord, ch, ch);
}

for (i = 0x00F8; i <= 0x00FF; i++) {
    ch = String.fromCharCode(i);
    defineSymbol(text, main, textord, ch, ch);
}

// Cyrillic
for (i = 0x0410; i <= 0x044F; i++) {
    ch = String.fromCharCode(i);
    defineSymbol(text, main, textord, ch, ch);
}

// Unicode versions of existing characters
defineSymbol(text, main, textord, "\u2013", "–");
defineSymbol(text, main, textord, "\u2014", "—");
defineSymbol(text, main, textord, "\u2018", "‘");
defineSymbol(text, main, textord, "\u2019", "’");
defineSymbol(text, main, textord, "\u201c", "“");
defineSymbol(text, main, textord, "\u201d", "”");

},{}],24:[function(require,module,exports){
var hangulRegex = /[\uAC00-\uD7AF]/;

// This regex combines
// - Hiragana: [\u3040-\u309F]
// - Katakana: [\u30A0-\u30FF]
// - CJK ideograms: [\u4E00-\u9FAF]
// - Hangul syllables: [\uAC00-\uD7AF]
// Notably missing are halfwidth Katakana and Romanji glyphs.
var cjkRegex =
    /[\u3040-\u309F]|[\u30A0-\u30FF]|[\u4E00-\u9FAF]|[\uAC00-\uD7AF]/;

module.exports = {
    cjkRegex: cjkRegex,
    hangulRegex: hangulRegex
};

},{}],25:[function(require,module,exports){
/**
 * This file contains a list of utility functions which are useful in other
 * files.
 */

/**
 * Provide an `indexOf` function which works in IE8, but defers to native if
 * possible.
 */
var nativeIndexOf = Array.prototype.indexOf;
var indexOf = function(list, elem) {
    if (list == null) {
        return -1;
    }
    if (nativeIndexOf && list.indexOf === nativeIndexOf) {
        return list.indexOf(elem);
    }
    var i = 0;
    var l = list.length;
    for (; i < l; i++) {
        if (list[i] === elem) {
            return i;
        }
    }
    return -1;
};

/**
 * Return whether an element is contained in a list
 */
var contains = function(list, elem) {
    return indexOf(list, elem) !== -1;
};

/**
 * Provide a default value if a setting is undefined
 */
var deflt = function(setting, defaultIfUndefined) {
    return setting === undefined ? defaultIfUndefined : setting;
};

// hyphenate and escape adapted from Facebook's React under Apache 2 license

var uppercase = /([A-Z])/g;
var hyphenate = function(str) {
    return str.replace(uppercase, "-$1").toLowerCase();
};

var ESCAPE_LOOKUP = {
    "&": "&amp;",
    ">": "&gt;",
    "<": "&lt;",
    "\"": "&quot;",
    "'": "&#x27;"
};

var ESCAPE_REGEX = /[&><"']/g;

function escaper(match) {
    return ESCAPE_LOOKUP[match];
}

/**
 * Escapes text to prevent scripting attacks.
 *
 * @param {*} text Text value to escape.
 * @return {string} An escaped string.
 */
function escape(text) {
    return ("" + text).replace(ESCAPE_REGEX, escaper);
}

/**
 * A function to set the text content of a DOM element in all supported
 * browsers. Note that we don't define this if there is no document.
 */
var setTextContent;
if (typeof document !== "undefined") {
    var testNode = document.createElement("span");
    if ("textContent" in testNode) {
        setTextContent = function(node, text) {
            node.textContent = text;
        };
    } else {
        setTextContent = function(node, text) {
            node.innerText = text;
        };
    }
}

/**
 * A function to clear a node.
 */
function clearNode(node) {
    setTextContent(node, "");
}

module.exports = {
    contains: contains,
    deflt: deflt,
    escape: escape,
    hyphenate: hyphenate,
    indexOf: indexOf,
    setTextContent: setTextContent,
    clearNode: clearNode
};

},{}]},{},[1])(1)
});

/***/ }),
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/output_3_0.9db7dc7.jpeg";

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_AMS-Regular.9971d27.ttf";

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_AMS-Regular.e78f217.woff";

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_AMS-Regular.f4c3270.woff2";

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Caligraphic-Bold.743b42a.ttf";

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Caligraphic-Bold.bac6199.woff";

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Caligraphic-Bold.a2e0522.woff2";

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Caligraphic-Regular.244db27.ttf";

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Caligraphic-Regular.a64e134.woff";

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Caligraphic-Regular.479a68e.woff2";

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Fraktur-Bold.ad26cc8.ttf";

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Fraktur-Bold.0a0aa19.woff";

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Fraktur-Bold.8e5f883.woff2";

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Fraktur-Regular.d459632.ttf";

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Fraktur-Regular.f980ca7.woff";

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Fraktur-Regular.ae2b6f4.woff2";

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Main-Bold.e69b951.ttf";

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Main-Bold.d8a629d.woff";

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Main-Bold.83f8b32.woff2";

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Main-Italic.1b22614.ttf";

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Main-Italic.8dd42e0.woff";

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Main-Italic.07510ed.woff2";

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Main-Regular.d9162df.ttf";

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Main-Regular.2dffc87.woff";

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Main-Regular.bd65225.woff2";

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Math-Italic.55fbb3a.ttf";

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Math-Italic.da58601.woff";

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Math-Italic.afeebb7.woff2";

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_SansSerif-Regular.8075d14.ttf";

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_SansSerif-Regular.48c7df6.woff";

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_SansSerif-Regular.7d5fa3e.woff2";

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Script-Regular.abb12fc.ttf";

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Script-Regular.5acb381.woff";

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Script-Regular.c472b57.woff2";

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Size1-Regular.8cc60fd.ttf";

/***/ }),
/* 99 */
/***/ (function(module, exports) {

module.exports = "data:application/font-woff;base64,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"

/***/ }),
/* 100 */
/***/ (function(module, exports) {

module.exports = "data:application/font-woff2;base64,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"

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Size2-Regular.5976fff.ttf";

/***/ }),
/* 102 */
/***/ (function(module, exports) {

module.exports = "data:application/font-woff;base64,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"

/***/ }),
/* 103 */
/***/ (function(module, exports) {

module.exports = "data:application/font-woff2;base64,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"

/***/ }),
/* 104 */
/***/ (function(module, exports) {

module.exports = "data:application/x-font-ttf;base64,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"

/***/ }),
/* 105 */
/***/ (function(module, exports) {

module.exports = "data:application/font-woff;base64,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"

/***/ }),
/* 106 */
/***/ (function(module, exports) {

module.exports = "data:application/font-woff2;base64,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"

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Size4-Regular.81ab95e.ttf";

/***/ }),
/* 108 */
/***/ (function(module, exports) {

module.exports = "data:application/font-woff;base64,d09GRgABAAAAABk4AA8AAAAALBQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAZHAAAABwAAAAcZO5Rr09TLzIAAAHMAAAATgAAAGBG5l0GY21hcAAAArQAAAC7AAABygH7nbxjdnQgAAAJgAAAAAsAAAAMAAAAAGZwZ20AAANwAAAFqAAAC5fVFNvwZ2FzcAAAGRQAAAAIAAAACAAAABBnbHlmAAAJ/AAACxQAABGItJ3JomhlYWQAAAFYAAAAMwAAADYCoTwfaGhlYQAAAYwAAAAgAAAAJAcyAp5obXR4AAACHAAAAJUAAADYlmIQXWxvY2EAAAmMAAAAbgAAAG57nHdebWF4cAAAAawAAAAfAAAAIADKAHFuYW1lAAAVEAAAAx4AAAePJMpbIXBvc3QAABgwAAAA4wAAAcgLwGLWcHJlcAAACRgAAABoAAAAf+LQSDp42mNgZGBgAOJ381i3xPPbfGWQZ34BFGG4uL1mMYz+MfG3HHse2zUgl4OBCSQKAIqPDjwAeNpjYGRgYLv2W44hij3xx8T/L9jzGIAiKMAMAKWkBtV42mNgZGBgMGMIZ2BiAAEQKcBQDiSlGDhAAgAViwE8AHjaY2BiZmWcwMDKwMDUxbSHgYGhB0IzPmAwZGRiQAINDAzvBRjevIXxA9JcUxgcGBTe/2dW+G/BEMV2jeWRAgNDfxwzXIsCAyMA+g8QggAAeNpj+MVgxAAEjL5A4hcDA7MEw1sgVmT5x2DB5M7IC6EZWJnVGCaAMEgNe+L/T+yJDEwMDD8mAvFC5hcM+Uz1jLxM9QysMJo5m1EZgRnkgfRJEM00m9EegRkYgDQ7iGauZGxgrmRYBaGR2QyrWBQY8oF29wBxOosC0z4QZjz0/wUQf4PTE4BYB+gPIGZIYWAAAHIuNDMAAAB42mNgYGBmgGAZBkYGEDgC5DGC+SwMK4C0GoMCkMUGJDUZ9BliGaoZahkWMB1jusPMrCSlzK28Vnm7+ssHjA9D3v///x+oXoFBA6guGkkdE1Adh/JsoLoXDxgeBrz/C1T4+P+d/9f/r/nf/7/vf85f979Gf3nvfr/Ldaf6TtENJwUduXsCZlD3EAEY2RjgihmZgAQTugKIF0GAhRVMsTEQD9g5OPHKczFwM1ADCEIoHhK08PLBWABKzTQwAHjarVZpc9NWFJW8JE5ClpKFFnV54sVpaj+ZlEIwYEKQLLvgLs7WSlBaKXbSfYGWGX6Df82VaWfoN35az32yTSBJO8OUYXzPuzp6d78KGUqQsRf4oRCtZ8bMVovGdu4FdNmi1TA6FL29gDLF+O+CUTA6Hblv2TYZIRmerPcN0/Ai1yFTkYgOHcoo0RX0vE25lXv9VXPS8zv+9v3AlrbVCwS124FNm6ElqMqoGoYiSUlxl1ahGpwErfHzNWY+bwcCTvRiQZPtIIJG8LNJRuuM1iMrCsPQIrMchpKMdnAQhg5llcA9uWIMh/JeO6C8dGlMunA/JDNyKKck/BLdJL/vCn6SGudfMiK/Q9mSDb0neqKHu5O1fBFhbQVR24q3w0CGeLq5E+CRxUENLDuUVzTulftGJk3NGI7SlUixdGPK7B+S2YF9ypccGleCnZzyOs9yxr7gG2gzCpkS1bWTBdUfnzI83y3Zo2RPqJeTP5neYpbhgoeII+H3ZMyF0JkyLM4mCQtODr2kbFHG9dTE1Cmv0zLeMqwXoR196YzSAfWnJrN+YFvSDku2Q9MqyWR86sZ1h2YUiELQGe8uvw4g3ZCm+bSN0zRODs3imjmdEoEMdGCXZrxI9CJBM0iaQ3OqtRskuW49XKbpA/nEoTdUayto7aRKy4Z+XuvPqsSY9faCZHbWIzN2abbMTYrWdZMz/DONHzKXUIlssR0knDxE6/ZQXjZbsiVeG2Irfc6voPdZEyKSJvxvQvtyqU4pYGIY8xLZQjdt9E3T1LWaV0ZiZPzdgGalK3yaQlNOIr+RKyKY/2tuzjRmDNftRcnZsTI9LlsXkKYFxDZfdmhRJSbLJeSZ5TmVZFm+qZIcy7dUkmd5XiVjLC2VjLN8WyUFlu+oZILlB0pUyHzgUEmDhw6VNXjk0LvKoOnya/j4Hnx8F3cL+MjSho8sL8BHlhI+slyGjyyL8JHlCnxk+T58ZLkKH1kqJWq61RwFs3OR8FCfyNPlwPgo7reKIqdMDibpIpq4KU6phIyrktfYvzLQSg6tjcpjLtHFUpI3F/0Aa4gD/PBoZo4/vqTEFe3vR+CZ/nEjmLATjbPeWPrT4H/1DVlNLpmLiOgy4ofDJ/uLxo6rDl1RlXM1h9b/i4om7IB+FSUxloqiIpo8vEjlnV6vKZuY9gBrHWsRE71umosLsF/FllnCgOC/ptCEVz7oVaQQtR7uuvbisaikd1AOd4IlKOJ539wKnmZEVlhPMyvZ86HLO7CAbSo1WzYwfd6roxTxHkqXfcaLupKyXtzF44wXW8AR76BX34nhEhazbKCGEhYaiAtCW8F9JxiR6bbLYcCR+zwaKn/sVtzIERW1E/htp1vuhS2U/DrnQECTXxnkQNaQmhtaTQUMjxAN2WRjXK2aThkHMMiosRtURA3fRvZ4oBTsyzDlY0Wc7hz9+qaFOqmDB5WR3MY3Bx54w9JE/Hl+NcRhKTeUFBXOWgOLuRZWkoq5gAG8NVK3j6o3X2afyLmtqFo+8VJX0bVyD4a5WeDtcQ7KUqEKqN6ow4bZ5eaSaPUKhiS9ro6lgR3+Gq3Y/L+6j93n/VKTWCFH6m2HAx99TsYw/gbHb8tBAgZxjEJuIuTFdDjxdccczlfoMmbx41P0d7BzzYV5ugJ8V9FViBZnzUdeRQOfsmGePlHcjtQC/FT1sWcAPgMwGXyu+qbWtAG0Zos5PsA2cxjsMIfBLnMY7DHnNsAXzGHwJXMYBMxhEDLHA7jHHAb3mcPgK+YweMCcBsDXzGHwDXMYRMxhEDPHBdhnDoMOcxh0mcPgQNH1UZoP+UAbQN9qdAvoO91POGzi8L2iGyP2D3zQ7B81YvZPGjH1Z0W1EfUXPmjqrxox9TeNmPpQ0c0R9REfNPV3jZj6h0ZMfayeTuQywz+e3DIVDii73H4y/KY4/wARbE1geNpj8N7BcCIoYiMjY1/kBsadHAwcDMkFGxnYnDYyMGhBaA4UeicDAwMnMouZwWWjCmNHYMQGh46IjcwpLhvVQLxdHA0MjCwOHckhESAlkUCwkYFHawfj/9YNLL0bmYC6WFNcAJhIJBt42mNgQAAAAAwAAQAAAAAWABYAFgAWAEwAhACsAMIA7AECAYgCCgIKAjgClALCAx4DVgNqA34DkgOmA9oEBgQ6BHAEnATQBOQE9AUIBRoFKgU+BXoFzgYEBiwGZAa4BvQHKAdYB4YHoAe8B+wIGAhKCH4IjgiiCLYIxAAAeNqtWHtwVNUZv985956zd/fu7n3sIwl5bTZkMQuB7DPyigzyCBBRDDBCUVSwURiU+iiVMKYEFPExYEUHH+04U8VxfHUYR9SpTqftqNVSbVGr1jJOZxiVoR0hhmCyl37n3F0kPjr8US67e3P35Pf7vt/3ne/7ThSiZBRFeYNEFapwxfcCU0EhU9JZK2ulslYy88CaTIZES0cz8BsFlGMjDWSIva+MU9j+EIEpaSXCk02plpRimVAoFqZBLMIZJZbp2HFcadrAUm437K92iGWx0IErb7zxygMjacaAtsEx+lv6Cvy73gHGnCPu6+7O0oelv7s73dePIFcCuVqRq05wAXI5uWmQicfiigmMJ1kamvK5YsGxLZOSVEvC8QWRDPa73SnGuMYs68lV27atetJif9aRzXWGd7h2GwU/jb4LcdhBFpAu2AHxd6MoAPJ1jDSof0S+CPIFBB8UMrFohEWZwlmyqSWfK+QLinqvv8YBGHmW6KZhA6hL2J8MywAV+OCAatgBcRfYogAE0f5ZiMcRDxSBZyWiSSsbhSDkjh4daQi82DX4cdcY7iiuDRLpayGLvirxiDBBSKykcqkOy3A4UZcA2Iapk5FnAdgBwzbUwQGOvAG8C2zhQCSmNtIA55f5qdQvn7AS+aylQc59+yi7p2uwqyswXq7dhbbuwbXLcO0U6TtPYlTxsii+t0GqTc3lp5NCbiYpzoRioRMcs1gQVydk43UQ4SHgjDPLFO88FpeXZcbLd3WA+Am7b247ukeoz1k5i2AO4C1RyayVjo/iY262rktMjiWYv/3SqnoGEFixcPG0CVUNKzAe/gU1iXiNf2Q802f0LviRAffCbrO+tru/FRGoxjRV0yghRIXW/u7aegt2wz1G+3kbFldXB5hl6Oq4FbnO+brb527R+9ddnGqujzSt6/d+3rQyURMJqbpxthZLUIu2ciymkYojlh2L1wP+z8RqCWtiwu8QUM9tFgYvUTxprLJExZaylqZUEnZRPWBGJrb8PIFbBUALXTWfYNQIMDr/qpAGqAqrvqy4MBK2GWXZ1Ep0X18eTeUnt2dT0eU6AL9uMSfsNZP7Y3Wr74zUGO6N7tML6pbvmUQ0rpmoBpm0Z3ndAvcZ9ydGTWTd0kKLn1lBrtZNvHq7DgOwTd98bU1TOl6Vbqq5drMO22BAv/pXk1Um98Lp46Sdb6DdShVq4Jf50JzNqPFMNCK2wiTQVJGSYvvBX+CQQejznKlMJ27anYSvVtA5phz5dP371E9iiVWrV69qiKBRuA8UQubxVbSodCB2nbfPRKqLK5spFsYXsqgvZj33ckqWF5StJdnEmcaS4raYk0lIrmiOz29bcF3/JS3ntUx5CeKzVNCAQ9J8ce7He6ZnFvQuXJZpbp0w8SX3yAUqZkZAbTZfmvswzRPdSGd1VXWWRnB9Q70GuqMXrA58XFfNKs+n6n4bn7ZKTYZ3k3YleE6afL3hjCaa/39q4nCpyfBjZN7p0f+LJl+7zfF5k39Ikxnt56pJY905aKJcP1JPR3Gv1IqaSYXdShEtj8UjsmbmcylCc7grUp0Qc2z4EEqgBXkASn+jNGqYiwYaTbNmUTf0rh2d4b+LBvycD66nOiEr4AAZJhc0Jmr2Pgilx0v7JJ+sqT9DPu3smpqwsKKudz/xKup9ldq3sbzuTO1LYuVb3yXrXmDDD+JlERGCXZAUcIP3dSnfiyfX5WFCl3v/SG9gA1ZSiZcsbaQL1a2yPwYlngiaHyjDKi7j1gb5QtEWvTJL5zD/W78PiwqYnk00oNGL4XbuA1vdyqgacg+XTJc9kmg0ANPGzv7nA1oFH+o+EDynh+AxcpVSjTxhUaO0JtYks6JlBpidmD1TATMnFrUi8CjY44IFirUWVHJhIBrEToElBKj/1megjaoATde4T+wo29+H9t8j7Ze4UOnvtIWKsoZZWQ/RSLwG05EuZJYDPu7ef3mjKrDT6InV8Ien/aXtlIFPh5fJO19BR9bGIgdG4+Bf3d7SzsEQ6tlQ2kjmoU6it4fH9HYn5nyjVC7lB+FTgxUIIRGsF0QamS2Javftbmik6k8DyOTOLbWfdN+sMJ04BDeR+UdzaQ19evP0EJl3blqR2eeuFfrQhz54WoVErB05jxQLtlMQN55UjGNZ56yjmjU27N5Xa2mko+jF2r0VY13q06k/nTuKo8hN737VSsuRHv3MTYlIi5h0ljaTh1Crb+d8J6x0T5U2c95zqluuw7dfkBU4x5XXJTBHobOHrCg94eH0Ic7Ad3K9swd4qY/zU9090i+ltBlWlvlkrlty78DKHrWtZ/gU249YHBeu/A4Xr3AhRh9iDHxnv/Ae9/HSO2z/8CnJBf0Ym4N0QEniuqi0KS7KqShy4iMSxQt/8KLlqdsJ5A2GknavNTE4AGZrjoh4GXsyFwbpgEhJpub3rQVau0sNnD/+OOaKCOCnx/RXdk1u4dLHp0rrYVjdoeSQt/bseivZsWCVuz3u2jSwMnsKp8x8S65caNEa2E4uOE+SB1Z3rggx39Y5BY4jIZBe+dQ8gFvXuKxXPLtDZtEnn+uP3nZph65qFw+suUH//Plp8vE/vjCA36kTaAKizz54m/HFv6inz+gWclDxy30SHDOX5WXmZoSNscpsEiUHWTLwyKI0jk4qzbWaCA4+s30LZzA6wFjPQ8tW+Q9AHVZ9FOXLr4xZUx5cpjJwKrGAYSh4M+hYTcS4XQmB57RQXvopbiCPL394+y0TwLvZS4TGAg9j23hmj+Px4GxZcVQSgqbKVz73HJ4RArcvnuFpONZ+uhVYV/8Nvfqx/dOF9ccHK9bbjlfL+0vrycFyTOvG2h+3hUyV7jkmqF5KVUwwz4rp2dGrRHRsnO+oBM89NSZ4z037nmD7X4AqInNvdAsMY0ybK7qM/1buyRES7cIsEx+5PF6Fb+ziMy66I2A6Yg9ctDYsbPMqFCb49b0/78KjlCV2wJNrgNTdywJTx3+per169C5yhO5TapA3rgl9Qmoay2sAeMtkrCb2OLAcYQo5AoygJUZt9QeHljIe7O6+etNH4NcN3+he/IqSnovInWTgKc0XfPgR9z33gdI6cpwcD4Ylz90jjeQ17JViTnJ8yFPMOzb6kRFDDAbGdrh3oqF3D50kPizsJBRxq04M4ZEiYpCTx23yT3KYBjGzHFP/ekkpVWrVTcei5LDE/zHi70X8mJg5vLqLhbygFLFfSCXHQZQSznaaziUwZ4lb5YQjQXJyCMmMkUaEPEHfPKE9q5sRm5YSpSYb3xLUEtjkVZx8j5CNio7YmsBWm1KeKBY5XMOlBqEQZCATDJd+qVR+R82RVUoAf0eXPbNQTGCyJSzMMfKqasDycNj9Ha/hpNtQ8aP0Vgj7xenPTqfhbWWT7B+64OKpvDwtZKQXcqr0TlVYAG3mW9R/zRZqqxZWM2La+s0vn28HVB5+jyVD27tm6hiYXjxS8UvnxyIM99/pIcT/CPFF3zNUxE/lc1kJ3QBRLjefuEQk/JoauP2W/kU+ZoW52tCxtG/mVJPA9PpaMr9reyiJ6dCRnlMVlLifodNvQ7e02xH5S4uyDlXG1bLpAnsyVEnEoFmdKGMCCS+/YkoVcsE8hI3biWoJjLY3R8NIJs8fQ/j2EXKIudJX7gveCUsAy+ZaPloV0CU4JNSpmnLF8rAnjv/AzYlqM6gSYkO31Cccbfb0CVxenbDjjChneB5Cjc70sWQ+EfXDrzdtEt97iyYqa8p/G9G8v42057PRLL7WeP/OfZ3o5wquWvMNX7v3vfJf3UY+cXjapVTBTttAEB0HCGoQEQiJQ3voSkiItMGJIRcCQoqgkSIiEAQhDq3Q4izxQmJH9iYBfqLXqj/SL+ipH9If6L19Xi8lQWkpxSt7345n3szOzC4RLVpZsih56vTZYItm6KfBKZq2Xhk8QUvWlcGTtGB9MXiKXqdmDE7TQqph8KxlT341OEsv028MnqOZ9AeD52k6fQNma/IFVp+0lxhbtEjfDU5R1poxeIKq1pLBk7RsfTR4iratbwanaTn11uDZ1PtUy+AslaZ+GDxHi+l3Bs9TNi1phwLq0g2FJKlFHilitEIu5TCvURFjg1Y1cvAy2iVBkdb1sWpAU0LiYxaUh6SmsU2ZR5kdKgHt4Q/XXBX849QETwdWtBN0b0LZ8hRbcXNsrVjcWF0rOkW2KyLZ8lnDlcJ3RZ7VfNfOPFR2SmzP4z6ruLwpOmDbA/UxqE/pDEFLugUuQcyPxelZQ94KLI4ga1GP2tANsRStXpsDVLERH+HHcwgNoTdg63SU9RbGca8+5KsGvqoGYUuwNbvIymzI9+pvX//INdb2BDqhLk6gE+ogRoc2gRTGBSx7mAMkXOr9xOXoa611FIVORBjJwGeO7WwypS54TwWe9JHSvmOv554X29PaLP+ERot5tmigh43W4eD26BLzNdZJxbbh57kNOernymjxEZ1hf3l4HMBTHA3TOYp0ffr4NiG56ypG+2Do6K4an+H4MGUgj+sWjVg2gC6ABjrzMUOi0cbs6mxFxlsPuKn9Mx2R0NY1XH+MDpAVoXd8z1wfYYjzPb677JHIRv0yRNXHK3VnnOMby+5zwrXHCh1qrHCWMroqCvGUqYARgS2uVheyCL4izXWX5QIiryLSP10V+bF3BVvZGgwGdocr75Jf2ziQ27nH7g9jcwURTySJXT4zkMpjRyISYV80WXzE2T7viOHDbWcyx56Mkp+N4EINeCgYBG3pCj+CWc9vipApT7BGrc4OusJPlOuJQp4NHU07ITO2jPe5bPPztmA6Es6qlUPGVTnjKdUtFwqRG8quiuxItuOQCwdV5Ou/kvw3wmfcrr8A4p56dgAAeNptzkdOA0EQheH6x4AxNsnkaDIs2zM4bYA27jkGQoSFJcIGTsBZuBOcBkzP846SWp+qpdJ7llicnw9L7b9pjx6WWMmqVrO6XdilXdmN3ZLYl31TYsI+mWSKMtNUmKFKjVnmmGeBReosscwKq6yxzgabbLHNDrs02GOfAw454pgTTjkrv78MnfMumrm08jZ8eni8f32++/tJM9eVPellv7A39loOZJB5YZEwsilTmclz2ZJt2ZHq4dXDq4dXvle+V36/uOuErox3wTknY4/QbDk53lOZydgr5PlABpn/AtN8YLEAAAEAAf//AA8AAAABAAAAAMw9os8AAAAAxvkyTwAAAADRt3yQ"

/***/ }),
/* 109 */
/***/ (function(module, exports) {

module.exports = "data:application/font-woff2;base64,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"

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Typewriter-Regular.2901747.ttf";

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Typewriter-Regular.3e9e27f.woff";

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/KaTeX_Typewriter-Regular.8a6d8ed.woff2";

/***/ }),
/* 113 */,
/* 114 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "research-article"
  }, [_c('div', {
    domProps: {
      "innerHTML": _vm._s(_vm.rawHtml)
    }
  })])
},staticRenderFns: []}

/***/ })
]);
//# sourceMappingURL=0.c2751a05348cf053239b.js.map