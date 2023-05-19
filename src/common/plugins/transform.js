/** transform.js ********************************************************************************************************** */
;($ => {
  $.fn.extend({
    transform: function (options) {
      /**
       * transform
       * @params	{Object}
       * 				  ex) transform: {transform: 'translate(100px, 100px) scaleX(1) scaleY(1)'}
       * 				  ex) transition: '0s ease 0s'
       * @event		transition-end
       *
       */

      let {transform} = options
      let {transition} = options

      this.css({'transform': transform, 'transition': transition})
      this.css({'WebkitTransform': transform, 'WebkitTransition': transition})
      this.css({'MozTransform': transform, 'MozTransition': transition})
      this.css({'msTransform': transform, 'msTransition': transition})
      this.css({'OTransform': transform, 'OTransition': transition})
      this.one('transitionend webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd', e => {
        this.triggerHandler({type: 'transition-end'})
      })

      return this
    }
  })
})(window.jQuery)
/** ****************************************************************************************************************** */
