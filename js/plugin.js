/**
 * plugin.js
 *
 * Wowbrary Shortcode Plugin
 * Forbes Library
 */

/*global tinymce:true */
/*global console:true */

tinymce.PluginManager.add('wowbrary_shortcode', wowbraryShortcodePlugin, ['noneditable']);

/**
 * Plugin for definition lists.
 */
function wowbraryShortcodePlugin(editor, url) {
	var self = this;

	editor.contentCSS.push(url + '/plugin-style.css');

	editor.addCommand('Wowbrary', showDialog);

	// add Wowbrary button. This will be used  to add and edit Wowbrary shot codes
	editor.addButton('Wowbrary', {
		text: 'Wowbrary',
		tooltip: 'Add/Edit Wowbrary content...',
		icon: false,
		cmd: 'Wowbrary',
		stateSelector: 'div.wowbraryShortcodeGUI'
	});

	// replace shortcode before editor content is set
	editor.on('BeforeSetContent', function(e) {
		e.content = self._do_wowbrary_shortcode(e.content);
	});

	// replace shortcode as its inserted into editor (which uses the exec command)
	editor.on('ExecCommand', function(e) {
		if (e.command === 'mceInsertContent') {
			tinymce.activeEditor.setContent(self._do_wowbrary_shortcode(tinymce.activeEditor.getContent()));
		}
	});

	// replace the wowbrary gui with the original shortcode on save
	editor.on('PostProcess', function(e) {
		console.log(e);
		if (e.save || e.source_view) {
			console.log('replacing');
			e.content = self._undo_wowbrary_shortcode(e.content);
			console.log(e.content);
		}
	});

	/**
	 * Show the Dialog for creating or updating a [wowbrary] shortcode
	 */
	function showDialog() {
		var data = {};

		var el = editor.selection.getNode();
		// is this a [wowbrary] shortcode ?
		if (tinymce.DOM.hasClass(el, 'wowbraryShortcodeGUI')) {
			var data_string = JSON.parse(tinymce.DOM.getAttrib(el, 'data-wowbrary', ''));
			var regex = /([A-Za-z0-9_]+)\s*=(\s*"([^"\]]*)"|'([^"\]]*)'|([^\]\s]+))/g;
			var matches;
			while ((matches = regex.exec(data_string)) !== null) {
				data[matches[1]] = matches[3] || matches[4] || matches[5];
			}
		}

		var win = tinymce.ui.Factory.create({
			type: 'window',
			layout: "flex",
			pack: "center",
			align: "center",
			onSubmit: function() {
				var shortcode = '[wowbrary';
				var items = win.find('*');
				for (var i = 0; i < items.length; i++) {
					if (items[i].name() && items[i].value()) {
						shortcode += ' ' + items[i].name() + '=';
						shortcode += '"' + items[i].value() + '"';
					}
				}
				shortcode += ']';
				editor.insertContent(shortcode);
			},
			items: {
				type: "form",
				padding: 20,
				labelGap: 30,
				spacing: 10,
				onPostRender: function() {
					this.find('[name]').each(function(item) {
						if (item.name() in data) {
							item.value(data[item.name()]);
						}
					});
				},
				items: [
					{type: 'textbox', name: 'height', size: 40, label: 'Height'},
					{type: 'textbox', name: 'count', size: 40, label: 'Max Count'},
					{type: 'listbox', name: 'motion', label: 'Motion', values: [
						{text: 'One at a time', value: 'one-at-a-time'},
						{text: 'Continuous', value: 'continuous'},
						{text: 'All at once', value: 'all-at-once'},
						{text: 'Morph', value: 'morph'}
					]},
					{type: 'checkbox', name: 'noelectronic', text: 'Block electronic?', label: ' '},
					{type: 'listbox', name: 'category', label: 'Category', values: [
						{value: 'GEN', text: 'Top Choices'},
						{value: 'ART', text: 'Arts & Photography'},
						{value: 'BIO', text: 'Biographies & Memoirs'},
						{value: 'BUS', text: 'Business & Investing'},
						{value: 'CDS', text: 'CDs: Music & Shows'},
						{value: 'CHI', text: 'Business & Investing'},
						{value: 'CGR', text: 'Comics & Graphic Novels'},
						{value: 'COM', text: 'Computers & Internet'},
						{value: 'COO', text: 'Cooking, Food & Wine'},
						{value: 'DVD', text: 'DVDs'},
						{value: 'EBO', text: 'eBooks & eAudios'},
						{value: 'ENT', text: 'Entertainment'},
						{value: 'HEA', text: 'Health, Mind & Body'},
						{value: 'HIS', text: 'History'},
						{value: 'HOM', text: 'Home & Garden'},
						{value: 'LRG', text: 'Large Print'},
						{value: 'LIT', text: 'Literature & Fiction'},
						{value: 'MYS', text: 'Mysteries & Thrillers'},
						{value: 'NEN', text: 'Non-English'},
						{value: 'OUT', text: 'Outdoors & Nature'},
						{value: 'PAR', text: 'Parenting & Family'},
						{value: 'PRO', text: 'Professional & Technical'},
						{value: 'REF', text: 'Reference'},
						{value: 'REL', text: 'Religion & Spirituality'},
						{value: 'ROM', text: 'Romance'},
						{value: 'SCI', text: 'Science'},
						{value: 'SFF', text: 'Science Fiction & Fantasy'},
						{value: 'SOC', text: 'Society'},
						{value: 'SPO', text: 'Sports'},
						{value: 'TEE', text: 'Teen'},
						{value: 'TRA', text: 'Travel'}
					]},
					{type: 'button', name: 'submit', text:'submit', onclick: function() {
						win.submit();
					}}
				]
			}
		}).renderTo().reflow();
	}

	/**
	 * Replace the wowbrary shortcode with the wowbrary GUI
	 */
	self._do_wowbrary_shortcode = function (content) {
		return content.replace(/\[wowbrary([^\]]*)\]/g, function(match, p1, offset) {
			// we store the shortcode, minus the brackets, in the data-wowbrary attribute
			var matchAtr = tinymce.DOM.encode(JSON.stringify('wowbrary ' + p1));
			var replacement = '';
			if (offset === 0) {
				replacement += '<p>&nbsp;</p>';
			}
			replacement += '<div class="wowbraryShortcodeGUI mceNonEditable mceItem" ';
			replacement += 'data-wowbrary="' + (matchAtr) + '">';
			replacement += '<h2>Wowbrary</h2>';
			replacement += 'wowbrary ' + p1;
			replacement += '</div>';
			if (offset + match.length >= content.length) {
				replacement += '<p>&nbsp;</p>';
			}
			return replacement;
		});
	};

	/**
	 * Replace the wowbrary GUI with the orignal shortcode
	 */
	self._undo_wowbrary_shortcode = function (html) {
		var writer = new tinymce.html.Writer();
		var state = {
			depth: 0,
			ignoring: false
		};

		new tinymce.html.SaxParser({
			validate: false,
			allow_conditional_comments: false,

			comment: function(text) {
				if (state.ignoring) {
					return;
				}
				writer.comment(text);
			},

			cdata: function(text) {
				if (state.ignoring) {
					return;
				}
				writer.cdata(text);
			},

			text: function(text, raw) {
				if (state.ignoring) {
					return;
				}
				writer.text(text, raw);
			},

			start: function(name, attrs, empty) {
				for (var i = 0; i < attrs.length; i++) {
					if (attrs[i].name == 'data-wowbrary') {
						state.ignoring = true;
						writer.text('[' + JSON.parse(attrs[i].value) + ']');
						break;
					}
				}
				if (state.ignoring) {
					state.depth += 1;
					return;
				}
				writer.start(name, attrs, empty);
			},

			end: function(name) {
				if (state.ignoring) {
					state.depth += -1;
					if (state.depth === 0) {
						state.ignoring = false;
					}
					return;
				}
				writer.end(name);
			}
		}, new tinymce.html.Schema({})).parse(html);

		return writer.getContent();
	};

}
