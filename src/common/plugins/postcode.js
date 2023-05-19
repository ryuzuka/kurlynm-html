/** postcode.js ********************************************************************************************************** */
;($ => {
  let pluginName = 'postcode'

  $.fn.extend({
    postcode (options = {}, value) {
      this.each((index, el) => {
        if (typeof options === 'string') {
          $.plugin.call($(el), options, value)
        } else {
          if (!$(el).attr('applied-plugin')) {
            $.plugin.add($(el), pluginName, new Postcode($(el), options))
          }
        }
      })
      return this
    }
  })

  class Postcode {
    constructor ($this, options) {
      this.$postcode = $this
      this.$searchBtn = this.$postcode.find('.btn-search')
      this.$result = this.$postcode.find('.result input')
      this.$detail = this.$postcode.find('.detail input')

      this.options = options

      this.$searchBtn.parent().on('click', () => this.search())
    }

    search () {
      let _this = this
      let width = 400
      let height = 500

      new daum.Postcode({
        oncomplete (data) {
          let address = ''
          if (data['userSelectedType'] === 'R') {
            address = data['roadAddress']
            address += data['buildingName'] ? ` (${data['buildingName']})` : ''
            // 도로명
          } else if (data['userSelectedType'] === 'J') {
            address = data['jibunAddress']
            // 지명
          }
          _this.$result.val(address)
        },
        onclose (state) {
          if (state === 'COMPLETE_CLOSE') {
            _this.$detail.focus()
            _this.$postcode.triggerHandler({type: 'complete-close', result: _this.$result.val()})
          } else if (state === 'FORCE_CLOSE') {
            _this.$postcode.triggerHandler({type: 'force-close'})
          }
        },
        width: width,
        height: height
      }).open({
        left: (window.screen.width - width) / 2,
        top: (window.screen.height - height) / 2
      })
    }
  }
})(window.jQuery)
/** ****************************************************************************************************************** */
