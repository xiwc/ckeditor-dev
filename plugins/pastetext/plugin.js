﻿/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @file Paste as plain text plugin
 */

(function() {
	// The pastetext command definition.
	var pasteTextCmd = {
		// Snapshots are done manually by editable.insertXXX methods.
		canUndo: false,
		async: true,

		exec: function( editor ) {
			editor.getClipboardData({ title: editor.lang.pastetext.title }, function( data ) {
				data && editor.fire( 'paste', { type: 'text', data: data.data, htmlified: true } );

				editor.fire( 'afterCommandExec', {
					name: 'pastetext',
					command: pasteTextCmd,
					returnValue: !!data
				});
			});
		}
	};

	// Register the plugin.
	CKEDITOR.plugins.add( 'pastetext', {
		requires: 'clipboard',
		lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en-au,en-ca,en-gb,en,eo,es,et,eu,fa,fi,fo,fr-ca,fr,gl,gu,he,hi,hr,hu,is,it,ja,ka,km,ko,lt,lv,mk,mn,ms,nb,nl,no,pl,pt-br,pt,ro,ru,sk,sl,sr-latn,sr,sv,th,tr,ug,uk,vi,zh-cn,zh', // %REMOVE_LINE_CORE%
		icons: 'pastetext,pastetext-rtl', // %REMOVE_LINE_CORE%
		init: function( editor ) {
			var commandName = 'pastetext';

			editor.addCommand( commandName, pasteTextCmd );

			editor.ui.addButton && editor.ui.addButton( 'PasteText', {
				label: editor.lang.pastetext.button,
				command: commandName
			});

			if ( editor.config.forcePasteAsPlainText ) {
				editor.on( 'beforePaste', function( evt ) {
					// Do NOT overwrite if HTML format is explicitly requested.
					// This allows pastefromword dominates over pastetext.
					if ( evt.data.type != 'html' )
						evt.data.type = 'text';
				});
			}

			editor.on( 'pasteState', function( evt ) {
				editor.getCommand( commandName ).setState( evt.data );
			});
		}
	});
})();


/**
 * Whether to force all pasting operations to insert on plain text into the
 * editor, loosing any formatting information possibly available in the source
 * text.
 * <strong>Note:</strong> paste from word (dialog) is not affected by this configuration.
 * @name CKEDITOR.config.forcePasteAsPlainText
 * @type Boolean
 * @default false
 * @example
 * config.forcePasteAsPlainText = true;
 */
