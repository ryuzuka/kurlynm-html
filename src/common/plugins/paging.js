/** paging.js ********************************************************************************************************** */
;($ => {
  let pluginName = 'paging'

  $.fn.extend({
    paging: function (options = {}, value) {
      this.each((index, el) => {
        if (typeof options === 'string') {
          $.plugin.call($(el), options, value)
        } else {
          if (!$(el).attr('applied-plugin')) {
            $.plugin.add($(el), pluginName, new Paging($(el), options))
          }
        }
      })
      return this
    }
  })

  class Paging {
    constructor ($this, options) {
      this.$paging = $this
      this.$pagingList = this.$paging.find('.paging-list')

      this.options = options
      this.offset = options.offset || 0 // 현재 페이지 index
      this.limit = options.limit || 10 // 화면에 보여지는 리스트 갯수
      this.total = options.total // 전체 리스트 갯수
      this.totalPage = Math.ceil(this.total / this.limit) // 전체 페이지 갯수
      this.pagingLength = options.pagingLength || 10 // 화면에 보여지는 paging button 갯수
      this.pagingGroupLength = Math.ceil(this.totalPage / this.pagingLength)

      this.pagingGroup = []
      this.groupIndex = 0

      this.init()
    }

    init () {
      this.$paging.find('.paging-prev, .paging-next, .paging-first, .paging-last').on('click', e => {
        let {className} = e.currentTarget
        let _curIdx = 0
        if (className.indexOf('prev') > 0) {
          this.groupIndex--
          let pagingLength = this.pagingGroup[this.groupIndex].length
          _curIdx = this.pagingGroup[this.groupIndex][pagingLength - 1].pagingIndex
        } else if (className.indexOf('next') > 0) {
          this.groupIndex++
          _curIdx = this.pagingGroup[this.groupIndex][0].pagingIndex
        }
        if (className.indexOf('first') > 0) {
          this.groupIndex = 0
          _curIdx = 0
        } else if (className.indexOf('last') > 0) {
          this.groupIndex = this.pagingGroup.length - 1
          _curIdx = this.totalPage - 1
        }
        this.draw(this.groupIndex)
        this.activePaging(_curIdx)
      })

      this.set(this.offset)
    }

    setPagingGroup (curIdx) {
      this.pagingGroup = []
      for (let i = 0; i < this.pagingGroupLength; ++i) {
        this.pagingGroup[i] = []

        let _length = this.pagingLength
        if (this.totalPage - i * this.pagingLength < this.pagingLength) {
          _length = this.totalPage - i * this.pagingLength
        }
        for (let j = 0; j < _length; ++j) {
          this.pagingGroup[i][j] = {
            index: j,
            text: this.pagingLength * i + j + 1,
            current: false,
            pagingIndex: this.pagingLength * i + j
          }
          if (curIdx === this.pagingLength * i + j) {
            this.groupIndex = i
            this.pagingGroup[i][j].current = true
          }
        }
      }
    }

    draw (groupIdx) {
      let _pagingHTML = ''
      this.pagingGroup[groupIdx].forEach(value => {
        _pagingHTML += `<a href="#" data-index="${value.pagingIndex}">${value.text}</a>`
      })
      this.$pagingList.find('a').off('click')
      this.$pagingList.html('').html(_pagingHTML)
      this.$pagingList.find('a').on('click', e => {
        e.preventDefault()
        let idx = $(e.target).data('index')
        if (idx !== this.offset) {
          this.activePaging(idx)
        }
      })
    }

    activePaging (curIdx) {
      this.offset = curIdx || 0
      let _activeIdx = curIdx - this.pagingLength * this.groupIndex
      let _pagingGroup = this.pagingGroup[this.groupIndex]

      this.$paging.find('.paging-prev, .paging-next, .paging-first, .paging-last').prop('disabled', false)
      if (this.groupIndex === 0) {
        this.$paging.find('.paging-prev').prop('disabled', true)
        if (this.offset === 0) {
          this.$paging.find('.paging-first').prop('disabled', true)
        }
        if (this.totalPage === this.pagingGroup[this.groupIndex].length) {
          this.$paging.find('.paging-next').prop('disabled', true)
        } else if (this.totalPage === 1) {
          this.$paging.find('.paging-last').prop('disabled', true)
        }
        if (this.pagingGroup.length === 1 && _activeIdx === _pagingGroup.length - 1) {
          this.$paging.find('.paging-last').prop('disabled', true)
        }
      } else if (this.groupIndex === this.pagingGroup.length - 1) {
        this.$paging.find('.paging-next').prop('disabled', true)
        if (_activeIdx === _pagingGroup.length - 1) {
          this.$paging.find('.paging-last').prop('disabled', true)
        }
      }

      _pagingGroup.forEach((value, index) => {
        if (_activeIdx === index) {
          _pagingGroup[index].current = true
          this.$pagingList.find('a').eq(index).attr('aria-current', 'page').addClass('active')
        } else {
          _pagingGroup[index].current = false
          this.$pagingList.find('a').eq(index).removeAttr('aria-current').removeClass('active')
        }
      })
      this.$paging.triggerHandler({type: 'change', offset: this.offset, total: this.totalPage})
    }

    set (curIdx) {
      this.setPagingGroup(curIdx)
      this.draw(this.groupIndex)
      this.activePaging(curIdx)
    }

    clear () {
      this.offset = 0
      this.options = {}
      this.pagingGroup = []
      this.$paging.find('button, a').off()
    }
  }
})(window.jQuery)
/** ***************************************************************************************************************** */
