/** dropdown.js ****************************************************************************************************** */
;($ => {
  let pluginName = 'dropdown'

  $.fn.extend({
    dropdown: function (options = {}, value) {
      this.each((index, el) => {
        if (typeof options === 'string') {
          $.plugin.call($(el), options, value)
        } else {
          if (!$(el).attr('applied-plugin')) {
            $.plugin.add($(el), pluginName, new Dropdown($(el), options))
          }
        }
      })
      return this
    }
  })

  class Dropdown {
    constructor ($this, options) {
      let defaultIndex = -1

      this.$dropdown = $this
      this.$button = this.$dropdown.find('.dropdown-btn')

      this.options = options
      this.placeholder = options.placeholder ? options.placeholder : this.$dropdown.data('placeholder')
      this.activeIndex = (this.options.activeIndex >= 0) ? this.options.activeIndex : defaultIndex
      this.disableIndex = this.options.disableIndex

      this.init()
    }

    init () {
      this.$button.text(this.placeholder)

      if (typeof this.activeIndex === 'number') {
        this.active(this.activeIndex)
        if (this.activeIndex > 0) {
          this.toggle(true)
          let scrollTop = this.$dropdown.find('.dropdown-list li').eq(this.activeIndex).position().top
          this.$dropdown.find('.dropdown-list').scrollTop(scrollTop)
          this.toggle(false)
        }
      }

      if (typeof this.disableIndex === 'number') {
        this.disable([this.disableIndex])
      } else if (typeof this.disableIndex === 'object') {
        this.disable(this.disableIndex)
      }

      this.$button.on('click', e => {
        if (this.$dropdown.find('.dropdown-box').hasClass('active')) {
          this.toggle(false)
        } else {
          $('.js-dropdown .dropdown-box').removeClass('active') // 전체 닫기
          this.toggle(true)
        }
      })

      this.$dropdown.find('.dropdown-list li button').on('click', e => {
        if ($(e.currentTarget).hasClass('disabled')) {
          return false
        }
        let idx = $(e.currentTarget).parent().index()
        if (idx !== this.activeIndex) {
          this.active(idx)
        }
        this.toggle(false)
      })

      this.$dropdown.find('.dropdown-btn, .dropdown-list').on('focusout', e => {
        if (e.relatedTarget === null || $(e.relatedTarget).closest('.js-dropdown').length < 1) {
          this.toggle(false)
        }
      })
    }

    toggle (isOpen) {
      if (isOpen) {
        this.$dropdown.find('.dropdown-box').addClass('active')
      } else {
        this.$dropdown.find('.dropdown-box').removeClass('active')
      }
      this.$button.attr('aria-expanded', isOpen)

      return this.$dropdown
    }

    active (idx) {
      this.$dropdown.find('.dropdown-list li').each((index, el) => {
        if (idx === index) {
          this.activeIndex = index
          $(el).addClass('active').attr('aria-selected', true)
          this.$button.text($(el).find('button').text()).addClass('active')
          this.$dropdown.triggerHandler({type: 'change', activeIndex: this.activeIndex, value: $(el).find('button').data('value')})

        } else {
          $(el).removeClass('active').attr('aria-selected', false)
        }
      })
    }

    disable (index) {
      // index[type: Number or Array]
      if (typeof (index) === 'number') {
        // Number
        this.$dropdown.find('.dropdown-list li').eq(index).addClass('disabled', true)
        this.$dropdown.find('.dropdown-list li').eq(index).find('button').prop('disabled', true)
      } else {
        // Array
        index.forEach(val => {
          this.$dropdown.find('.dropdown-list li').eq(val).addClass('disabled', true)
          this.$dropdown.find('.dropdown-list li').eq(val).find('button').prop('disabled', true)
        })
      }
    }

    clear () {
      this.$button.text(this.placeholder)
      this.$dropdown.find('.dropdown-list li').removeAttr('aria-selected').removeClass('active disabled')
      this.$dropdown.find('.dropdown-list li button').prop('disabled', false).off('click')
      this.$button.removeAttr('aria-expanded').off('click')
    }
  }
})(window.jQuery)
/** ****************************************************************************************************************** */
