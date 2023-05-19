/** KurlyNextmile.js ******************************************************************************************************** */
;($ => {
  const KurlyNextmile = {
    DATE_FORMAT: 'YYYY-MM-DD',
    DEVICE: navigator.userAgent
  }
  window.KurlyNextmile = $.extend(window.KurlyNextmile || {}, KurlyNextmile)

  // pinch zoom prevent
  document.addEventListener('touchmove', e => {
    if (e.scale !== 1 && e.scale !== undefined) {
      e.preventDefault()
    }
  }, {passive: false})

  // double tab prevent
  let lastTouchEnd = 0
  document.documentElement.addEventListener('touchend', e => {
    let now = new Date().getTime()
    if (now - lastTouchEnd <= 200) {
      e.preventDefault()
    }
    lastTouchEnd = now
  }, {passive: false})

  $.extend({
    depth1Index: -1,
    depth2Index: -1,
    utils: {
      cookie: {
        get (key) {
          /**
           * get cookie
           * @param   {String}  key
           */
          var value = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
          return value ? decodeURIComponent(value[2]) : null;
        },
        set (key, value, day) {
          /**
           * set cookie
           * @param   {String}  key
           * @param   {*}       value
           * @param   {Number}  expire     day = 1
           */
          const expired = new Date();
          expired.setTime(expired.getTime() + day * 24 * 60 * 60 * 1000);
          document.cookie = key + '=' + encodeURIComponent(value) + ';expires=' + expired.toUTCString() + ';path=/';
        },
        clear (key) {
          /**
           * delete cookie
           * @param   {String}  key
           */
          document.cookie = key + '=; expires=Thu, 01 Jan 1999 00:00:00 GMT;'
        }
      },
      storage: {
        get (storageType, key) {
          /**
           * get SessionStorage
           * @param   {String}  storage
           * @param   {String}  key
           */
          let value = (storageType === 'local') ? window.localStorage.getItem(key) : window.sessionStorage.getItem(key)
          let now = new Date().getTime()

          if (value) {
            value = JSON.parse(value)

            if (value.expires === -1 || value.expires >= now) {
              if (value.json) {
                value = JSON.parse(value.origin)
              } else {
                value = value.origin
              }
            } else {
              this.remove(storageType, key)
              value = undefined
            }
          } else {
            value = undefined
          }

          return value
        },
        set (storageType, key, value, expireMinutes) {
          /**
           * set storage
           * @param   {String}  storage
           * @param   {String}  key
           * @param   {*}       value
           * @param   {Number}  expireMinutes   30 sec = 0.5
           */
          let storage = storageType === 'local' ? window.localStorage : window.sessionStorage
          let json = false

          if (expireMinutes) {
            let today = new Date()
            today.setSeconds(today.getSeconds() + expireMinutes * 60)
            expireMinutes = today.getTime()
          }

          if (typeof value === 'object') {
            value = JSON.stringify(value)
            json = true
          }

          storage['setItem'](
            key,
            JSON.stringify({
              expires: expireMinutes || -1,
              origin: value,
              json: json
            })
          )
        },
        remove (storageType, key) {
          /**
           * remove storage
           * @param   {String}  storage
           * @param   {String}  key
           */
          let storage = storageType === 'local' ? window.localStorage : window.sessionStorage
          storage['removeItem'](key)
        },
        clear (storageType) {
          /**
           * clear storage
           * @param   {String}  storage
           * @param   {String}  key
           */
          let storage = storageType === 'local' ? window.localStorage : window.sessionStorage
          storage['clear']()
        }
      },
      validate: {
        email (email) {
          let exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/
          if (exptext.test(email)==false) {
            //이메일 형식이 알파벳+숫자@알파벳+숫자.알파벳+숫자 형식이 아닐경우
            alert("이메일형식이 올바르지 않습니다.")
            return false
          }
          return true
        }
      },
      isMobile () {
        let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)
        if (!isMobile && navigator.userAgent.indexOf('Safari') > -1) {
          if (navigator.maxTouchPoints > 0) {
            isMobile = true
          }
        }
        return isMobile
      },
      isLandscape () {
        /**
         * 가로모드 인지 체크하여 반환
         * @return   {Boolean}
         */
        return window.innerWidth > window.innerHeight
      },
      urlParam (name) {
        /**
         * url parameter
         * @param   {String}  name
         *
         */
        let results = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.href)
        if (results==null) {
          return null
        } else {
          return results[1] || 0
        }
      },
      commaNumberFormat (number) {
        /**
         * 1,234,567
         * @param   {String}  number
         * @return  {String}
         */
        let regexp = /\B(?=(\d{3})+(?!\d))/g
        return number.toString().replace(regexp, ',')
      },
      telNumberFormat (number) {
        /**
         * 00-000-0000, 000-0000-0000
         * @param   {String}  number
         * @return  {String}
         */
        return number
          .replace(/[^0-9]/g, '')
          .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, '$1-$2-$3')
          .replace('--', '-')
      }
    }
  })
})(window.jQuery)
/** ***************************************************************************************************************** */
