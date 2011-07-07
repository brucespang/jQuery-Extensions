/*
 * jQuery UI Autocomplete Quick Search Extension
 *
 * Uses a trie instead of linear scanning the source input for extra-speedy
 * prefix-only autocompletion.
 *
 * Copyright 2011, Bruce Spang (http://brucespang.com)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * http://github.com/brucespang/jQuery-Extensions
 */
(function( $ ) {

	$.ui.autocomplete.prototype._createTrie = function( source ) {
		function Node(value, isWordEnd) {
			this.value = value;
			this.isWordEnd = isWordEnd;
			this.children = {};
		}

		var root = new Node( '', false );
		for ( var i in source ) {
			var string = source[i].label || source[i].value || source[i];
			var node = root;

			for ( var j = 1; j <= string.length; j++ ) {
				var substring = string.substring( 0, j );
				var lower = substring.toLowerCase();

				if ( !node.children[lower] ) {
					node.children[lower] = new Node(substring, false);
				}
				node = node.children[lower];
			}

			// node will reference the complete string 
			node.isWordEnd = true;
		}

		return root;
	}

	$.ui.autocomplete.prototype.__initSource = $.ui.autocomplete.prototype._initSource;

	$.ui.autocomplete.prototype._initSource = function() {
		if ( $.isArray(this.options.source) ) {
			var trie = this._createTrie(this.options.source);
			this.source = function( request, response ) {
				response( $.ui.autocomplete.search( trie, request.term.toLowerCase() ) );
			};
		} else {
			this.__initSource();
		}
	}

	$.extend( $.ui.autocomplete, {
		search: function( node, term ) {
			var cached = $.data( document.body, 'jQuery.ui.autocomplete.quickSearch.'+term );

			if ( cached !== undefined ) {
				return cached;
			} else {
				function valuesInChildren( node ) {
					var values = [];

					if ( node.isWordEnd ) {
						values.push( node.value );
					}

					for( var c in node.children ) {
						values = values.concat( valuesInChildren( node.children[c] ) );
					}

					return values;
				}

				for ( var i = 1; i <= term.length; i++ ) {
					var substring = term.substring( 0, i );
					if ( node.children ) {
						if ( node.children[substring] ) {
							node = node.children[substring];
						} else {
							node = false;
						}
					}
				}

				var results = valuesInChildren( node );
				$.data( document.body, 'jQuery.ui.autocomplete.quickSearch.'+term, results );
				return results;
			}
		}
	});
}( jQuery ));
