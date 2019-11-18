/**
 * Classes containing convenient funtionality that can be mixed into any dojo
 * widget.
 * 
 * @namespace mixin
 * @instance
 */
define([
	'dojo/dom-class',
	'dojo/dom-style',
	'dojo/_base/declare',
	'dojo/_base/fx'
], function (
	domClass,
	domStyle,
	declare,
	fx
) {
	return declare(null, {
		state : false,
		/**
		 * Useful functions for showing and hiding divs. Provides fadein and fadeout
		 * animations and a set of overridable callback functions.
		 * 
		 * @classdesc A base widget with convenience methods that can be mixed in to any 
		 * dojo class. Allows widgets to be faded in and out. 
		 * 
		 * @memberof mixin
		 * @constructor ShowHideMixin
		 * @mixin
		 */
		constructor : function() {
		},
		/**
		 * Fades the widget in using a dojo animation.
		 * 
		 * @memberof mixin.ShowHideMixin
		 * @instance
		 * @public
		 */
		show: function () {
			var that = this;
			if (this.domNode) {
				if (domClass.contains(that.domNode, 'no-display')) { 
					domClass.remove(that.domNode, 'no-display');
				}
				domStyle.set(that.domNode, "opacity", "0");
				fx.fadeIn({
					node: that.domNode,
					onEnd : function() {
						if(that.onShow) {
							that.onShow();
						}
					}
				}).play();
			}
		},
		/**
		 * Callback that is executed whenever a panel is shown. Useful
		 * for tools that need to execute some code every time the ToolbarButton
		 * is clicked.
		 * 
		 * @abstract
		 * @memberof mixin.ShowHideMixin
		 * @instance
		 */
		onShow: function() {
			
		},
		/**
		 * Callback that is executed whenever a panel is hidden. Useful
		 * for tools that need to execute some code every time the ToolbarButton
		 * is clicked.
		 * 
		 * @abstract
		 * @memberof mixin.ShowHideMixin
		 * @instance
		 */
		onHide: function() {
			
		},
		
		/**
		 * Hides the widget by fading it out.
		 * 
		 * @memberof mixin.ShowHideMixin
		 * @instance
		 * @public
		 */
		hide: function () {
			var that = this;
			if (this.domNode) {
				fx.fadeOut({
					node: this.domNode,
					onEnd : function() {
						if (!domClass.contains(that.domNode, 'no-display')) { 
							domClass.add(that.domNode, 'no-display');
						}
						if(that.onHide) {
							that.onHide();
						}
					}
				}).play();
			}
		}
	});
});


