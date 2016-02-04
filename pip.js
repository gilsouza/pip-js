/*
 *  jquery-boilerplate - v3.5.0
 *  A jump-start for jQuery plugins development.
 *  http://jqueryboilerplate.com
 *
 *  Made by Zeno Rocha
 *  Under MIT License
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "pip",
			defaults = {
				location: "default",
				src: "http://10.4.250.43:3000/vm",
				size: null, // {height: px, width px}
				ratio: 0.30,
				opacity: 0.5
			};

		// The actual plugin constructor
		function Plugin ( element, options ) {
				this.element = element;
				this.$element = $(element);
				this.$frame = null;
				// jQuery has an extend method which merges the contents of two or
				// more objects, storing the result in the first object. The first object
				// is generally empty as we don't want to alter the default options for
				// future instances of the plugin
				this.settings = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;
				this._metters = {};
				this._position = {
					left: 0,
					top: 0
				};
				this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend(Plugin.prototype, {
				init: function () {
						// Place initialization logic here
						// You already have access to the DOM element and
						// the options via the instance, e.g. this.element
						// and this.settings
						// you can add more functions like the one below and
						// call them like the example bellow

						//tamanho de window
						//calcula tamnho de pip, usando ratio por padrao
						//calcular posicao default 
						this.updateMetters();

						//assinar eventos de mudança de window
						this.bindEvents();

						this.attachPip();

						//usar propiedades de enfeite e efeitos - talvez usar classe css
						//atualiza? (update / redraw) 
				},
				attachPip: function() {
					var _this = this,
						newFrame = $('<iframe id= "pipFrame"></iframe>');

					newFrame.attr('src', _this._defaults.src);
					newFrame.attr('style', 'left:' + _this._position.left + 'px;top:' + _this._position.top + 'px;position:fixed;height:' + _this._defaults.size.height + 'px;width:' + _this._defaults.size.width + 'px;opacity:' + _this._defaults.opacity);

 					_this.$element.append(newFrame);
					_this.$frame = newFrame;
				}, 
				updatePosition: function() {
					//TODO: pensar em propriedade para localizacao
					var _this = this;

					if (_this._defaults.location === "default") {
						_this._position.left = _this._metters.innerWidth - _this._defaults.size.width - 10;
						_this._position.top = _this._metters.innerHeight - _this._defaults.size.height - 10;
					}

					console.log("updatePosition");
					console.dir(_this._position);
					console.dir(_this.$frame);

					if (_this.$frame) {
						_this.$frame.stop().animate({
							top: _this._position.top,
							left: _this._position.left,
							width: _this._defaults.size.width,
							height: _this._defaults.size.height,
						});
					}
				},
				metterPip: function() {
					var _this = this;

					if (!_this._defaults.size) {
						_this._defaults.size = {};
					}

					_this._defaults.size.height = _this._metters.innerHeight * _this._defaults.ratio;
					_this._defaults.size.width = _this._metters.innerWidth * _this._defaults.ratio;

					console.log("metterPip");
					console.dir(_this._defaults.size);
				},
				updateMetters: function() {
					var _this = this;

					_this._metters.outerHeight = window.outerHeight;
					_this._metters.outerWidth = window.outerWidth;
					_this._metters.innerHeight = window.innerHeight;
					_this._metters.innerWidth = window.innerWidth;
					_this._metters.screen = window.screen;

					console.dir(_this._metters);					

					_this.metterPip();
					_this.updatePosition();
				},
				bindEvents: function() {
					var _this = this;
					$(window).on('resize', function() {
						_this.updateMetters();
					});
				}
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
				return this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});
		};

})( jQuery, window, document );