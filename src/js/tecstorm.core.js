var TEM = {
	initUI:function(){
		tem_initUI();
	}
};

(function($) {
	$.fn.extend({
		tem_initUI:function(){
			return this.each(function(){
				if($.isFunction(tem_initUI)) tem_initUI(this);
			});
		}
	});
})(jQuery)
