# jQuery Extensions

This respository is a collection of plugins for jQuery that generally make
things better.

## Extensions

### Autocomplete Quick Search
Replaces jQuery UI Autocomplete's default behavior of matching each item in an
array sequentially with a trie. This makes queries super-quick, especially on
really large sources. There's a demo with a 100,000 entry source that can be autocompleted in a second. The same demo pretty much freezes the default autocomplete. This plugin makes it impossible to autocomplete things that aren't prefixes (e.g. it can't autocomplete "qu" to "jQuery").

