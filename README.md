# Wowbrary Plugin for Wordpress
A Wordpress plugin for libraries that use Wowbrary. Your institution must have an account with [Wowbrary](http://wowbrary.org/) to use this software.

**Please note that this software is not endorsed or supported by Wowbrary.**

## Features

+ Adds the `[wowbrary]` shortcode which allows you to add Wowbrary widgets wherever you can include Wordpress shortcodes.
+ Adds an editor for `[wowbrary]` shortcodes to the TinyMCE editor. Click the Wowbrary button to add a Wowbrary widget. To
edit an existing widget you may select it and click the Wowbrary button or simply doubleclick.
+ Provides an option to automatically resize the a Wowbrary widget to fit the width of a specified container element.

## Installation
+ Unzip WowbraryForWordpress.zip into your Wordpress plugin directory (`wp-content/plugins`).
+ Log into your Wordpress installation and visit the Plugins screen.
+ Find the Wowbrary plugin in the list and click **Activate Plugin** to activate it.

## Configuration
+ Visit the Wobrary Settings Screen (Settings &#8594; Wowbrary).
+ Enter your Wowbrary library number, cover provider type, provider account, and, if using a provider that requires it, your cover provider password.
+ Click "Save Changes". You can now start using the Wowbrary plugin!

## Usage
+ Use Wordpress's visual editor to add and edit Wowbrary widgets. You may also add `[wowbrary]` shortcodes by hand.
+ Most of the arguments to the `[wowbrary]` shortcode are the same as the query parameters for the Wowbrary widget. For
further documentation [log in to the Wowbrary site](http://wowbrary.org/sponsorlogin.aspx).
+ The `[wowbrary]` shortcode takes an additional argument, `container`. If this is set, the width of the Wowbrary widget will automatically be adjusted to match the width of the selected element (using css selector syntax). You may still need to set the `width` attribute (normally to the maximum expected width).
  + Example usage: `[wowbrary container="#content" width="800"]`

## License
© 2015 Forbes Library, Northampton, Massachusetts

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License, version 2, as
published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  
