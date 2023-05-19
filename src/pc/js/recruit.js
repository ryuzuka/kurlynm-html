/** recruit.js ******************************************************************************************************* */
;($ => {
  // before unload
  window.onbeforeunload = () => window.scrollTo(0, 0)
  window.KurlyNextmile.Recruit = () => {
    let $slide = $('.recruit_slide')
    let scrollY = 0
    let scrollZone = 'top'
    let isScroll = false
    let wheelDir = null
    let slideIndex = -1
    let scrollPoint = [
      parseInt($('.recruit-section').offset().top),
      parseInt($('.recruit_slide').offset().top),
      parseInt($('.welfare').offset().top),
      parseInt($('.step').offset().top)
    ]

    let _this = {
      onWheel (isOn) {
        $(window).off('wheel')[isOn ? 'on' : 'off']('wheel', eventHandler.wheel)
      },
      onScroll (isOn) {
        $(window).off('scroll')[isOn ? 'on' : 'off']('scroll', eventHandler.scroll)
      },
      onSlideMouseDown (isOn) {
        $slide.find('.slick-slide')[isOn ? 'on' : 'off']('mousedown', eventHandler.mousedown)
      },
      lockScroll (isLock) {
        $.preventScroll(isLock)
        $.blockBodyScroll(isLock)
        if (isLock) {
          _this.onScroll(false)
          _this.scroll(scrollPoint[0], () => _this.onWheel(true))
        } else {
          _this.onWheel(false)
          setTimeout(() => _this.onScroll(true), 1)
        }
        slideIndex = -1
        _this.active(slideIndex)
      },
      scroll (scrollY, completeFunc) {
        $('html, body').stop().animate({scrollTop: scrollY}, 500, completeFunc)
      },
      active (idx) {
        $slide.find('.slick-slide').each((index, el) => {
          $(el)[idx === index ? 'addClass' : 'removeClass']('active')
        })
      }
    }

    let eventHandler = {
      scroll (e) {
        wheelDir = scrollY < e.currentTarget.scrollY ? 1 : -1
        scrollY = e.currentTarget.scrollY

        if (scrollZone === 'top' && wheelDir === 1) {
          if (scrollY > scrollPoint[0]) {
            _this.lockScroll(true)
            _this.active(slideIndex)
            slideIndex = 0
          }
        }
      },
      wheel (e) {
        if (e.originalEvent.deltaY < 0) {
          /** up */
          if (slideIndex < 1) {
            scrollZone = 'top'
            _this.lockScroll(false)
          } else {
            slideIndex--
            slide.slick('slickGoTo', slideIndex)
            _this.active(slideIndex)
          }
        } else {
          /** down */
          if (slideIndex < 2) {
            slideIndex++
            slide.slick('slickGoTo', slideIndex)
            _this.active(slideIndex)
          } else {
            isScroll = true
            scrollZone = 'bottom'
            _this.lockScroll(false)
            _this.onSlideMouseDown(false)
            setTimeout(() => _this.onScroll(false), 1)
          }
        }
      },
      mousedown (e) {
        e.stopPropagation()
      }
    }

    _this.onScroll(true)
    let slide = $slide.slick({
      infinite: false,
      arrows: false,
      draggable: true,
      dots: true
    }).on('beforeChange afterChange', e => {
      if (isScroll) return

      if (e.type === 'beforeChange') {
        _this.onWheel(false)

      } else if (e.type === 'afterChange') {
        slideIndex = e.target.slick.currentSlide
        setTimeout(() => _this.onWheel(true), 500)
      }
    })
    _this.onSlideMouseDown(true)


    return _this
  }
})(window.jQuery)
/** ***************************************************************************************************************** */
