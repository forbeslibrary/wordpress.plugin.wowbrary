/**
 * plugin.js
 *
 * Wowbrary Shortcode Plugin
 * Forbes Library
 */

/*global tinymce:true */

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

	editor.on('dblclick', function(e) {
		if (tinymce.DOM.is(e.target, '.wowbraryShortcodeGUI, .wowbraryShortcodeGUI *')) {
			editor.execCommand('Wowbrary');
			e.stopPropagation();
		}
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
		if (e.save || e.source_view) {
			e.content = self._undo_wowbrary_shortcode(e.content);
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

		var win = tinymce.activeEditor.windowManager.open({
			type: 'window',
			title: 'Wowbrary Widget Edit',
			bodyType: 'tabpanel',
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
			onPostRender: function() {
				this.find('[name]').each(function(item) {
					if (item.name() in data) {
						item.value(data[item.name()]);
					}
				});
			},
			body: wowbraryFormData
		});
	}

	/**
	 * Replace the wowbrary shortcode with the wowbrary GUI
	 */
	self._do_wowbrary_shortcode = function (content) {
		return content.replace(/\[wowbrary([^\]]*)\]/g, function(match, p1) {
			// we store the shortcode, minus the brackets, in the data-wowbrary attribute
			var matchAtr = tinymce.DOM.encode(JSON.stringify('wowbrary' + p1));
			var replacement = '';
			replacement += '<div class="wowbraryShortcodeGUI mceNonEditable mceItem" ';
			replacement += 'data-wowbrary="' + (matchAtr) + '">';
			replacement += '<h2>Wowbrary</h2>';
			replacement += 'wowbrary ' + p1;
			replacement += '</div>';
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

var wowbraryFormData = [
	{
		title: 'Content',
		type: 'form',
		items: [
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
			{type: 'checkbox', name: 'noelectronic', text: 'Block electronic?', label: ' '},
			{type: 'textbox', name: 'count', size: 40, label: 'Max Count'},
			{type: 'textbox', name: 'zinio', size: 40, label: 'Zinio Count'},
			{type: 'label', text: '(To use Zinio you must also configure your Zinio account information with Wowbrary)'}
		]
	},
	{
		title: 'Size',
		type: 'form',
		items: [
			{type: 'textbox', name: 'height', size: 40, label: 'Height'},
			{type: 'textbox', name: 'width', size: 40, label: 'Max Width'},
			{type: 'textbox', name: 'container', size: 40, label: 'Selector'},
			{type: 'label', text: '(If selector is set, the widget will be resized to match the size of the selected element.)'}
		]
	},
	{
		title: 'Appearance',
		type: 'form',
		items: [
			{type: 'textbox', name: 'headingtext', size:30, label: 'Heading Text'},
			{type: 'listbox', name: 'imagesize', label: 'Image Size', values: [
				{text: 'Small', value: 'S'},
				{text: 'Medium', value: 'M'},
				{text: 'Large', value: 'L'}
			]},
			{type: 'textbox', name: 'imagescale', size: 40, label: 'Image Scale (%)'},
			{type: 'textbox', name: 'reflectionsize', size: 40, label: 'Reflection Size (%)'},
			{type: 'textbox', name: 'spacing', size: 40, label: 'Spacing'}
		]
	},
	{
		title: 'Motion',
		type: 'form',
		items: [
			{type: 'listbox', name: 'motion', label: 'Motion', values: [
				{text: 'One at a time', value: 'one-at-a-time'},
				{text: 'Continuous', value: 'continuous'},
				{text: 'All at once', value: 'all-at-once'},
				{text: 'Morph', value: 'morph'}
			]},
			{type: 'checkbox', name: 'switchonlyonclick', text: 'Switch only on click?', label: ' '},
			{type: 'textbox', name: 'switchtime', size: 40, label: 'Switch Time (ms)'},
			{type: 'textbox', name: 'pause', size: 40, label: 'Pause Time (ms)'}
		]
	},
	{
		title: 'Buttons',
		type: 'form',
		items: [
			{type: 'textbox', name: 'buttonheight', size: 40, label: 'Button Height'},
			{type: 'listbox', name: 'buttonstyle', label: 'Button Style', values: [
				{text: 'Classic', value: 'classic'},
				{text: 'Modern', value: 'modern'}
			]},
			{type: 'textbox', name: 'buttoncolor', size: 40, label: 'Background Color'},
			{type: 'textbox', name: 'buttontextcolor', size: 40, label: 'Text Color'},
			{type: 'textbox', name: 'buttonsymbolcolor', size: 40, label: 'Symbol Color'},
			{type: 'checkbox', name: 'reverse', text: 'Reverse arrow meanings', label: ' '},
			{type: 'checkbox', name: 'sidearrows', text: 'Put arrow buttons on the side rather than the bottom?', label: ' '}
		]
	},
	{
		title: 'Style (Advanced)',
		type: 'form',
		items: [
			{type: 'textbox', name: 'borderstyle', size: 40, label: 'Border Style'},
			{type: 'textbox', name: 'background', size: 40, label: 'Background Color'},
			{type: 'textbox', name: 'headingstyle', size: 40, label: 'Heading Style', multiline: 'True', minHeight: 60},
			{type: 'textbox', name: 'titlestyle', size: 40, label: 'Title Style', multiline: 'True', minHeight: 60},
			{type: 'checkbox', name: 'notitles', text: 'Don’t Use Titles', label: ' '}
		]
	},
	{
		title: 'Other (advanced)',
		type: 'form',
		items: [
			{type: 'textbox', name: 'target', size: 40, label: 'Link Target'},
			{type: 'checkbox', name: 'captionflip', text: 'Use screenreader-friendly title attributes', label: ' '},
			{type: 'checkbox', name: 'debug', text: 'Display debug info', label: ' '},
			{type: 'checkbox', name: 'iframe', text: 'Put widget in iframe', label: ' '}
		]
	}
];
