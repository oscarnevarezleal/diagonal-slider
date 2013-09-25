// Generated by CoffeeScript 1.6.3
(function() {
  var Canvas, Css3Support, DiagonalSlider, _ANGLE_TEXT, _COS, _PERCENT_DISTRIBUTION_ANGLE, _PERCENT_DISTRIBUTION_CLIP, _PERCENT_DISTRIBUTION_CONT, _RADIAN, _SIN;

  _ANGLE_TEXT = -55;

  _PERCENT_DISTRIBUTION_ANGLE = 25;

  _PERCENT_DISTRIBUTION_CLIP = 0.25;

  _PERCENT_DISTRIBUTION_CONT = 1 - _PERCENT_DISTRIBUTION_CLIP * 2;

  _RADIAN = 180 / Math.PI;

  _SIN = Math['sin'];

  _COS = Math['cos'];

  Css3Support = (function() {
    Css3Support.prototype.vendors = ['-webkit-', '-o-', '-ms-', '-moz-', ''];

    /* Css3 quick support check*/


    function Css3Support() {
      var p;
      p = document.createElement('p');
      this.testElement = p;
      document.body.insertBefore(this.testElement, null);
    }

    Css3Support.prototype.supports = function(key) {
      var e, v, _i, _len, _ref;
      _ref = this.vendors;
      for (e = _i = 0, _len = _ref.length; _i < _len; e = ++_i) {
        v = _ref[e];
        if (window.getComputedStyle(this.testElement).getPropertyValue(v + key)) {
          return {
            vendor: v,
            property: v + key
          };
        }
      }
      return false;
    };

    Css3Support.prototype.getCssPropertyVendor = function(baseProperty, value) {
      var e, i, v, _i, _len, _ref;
      i = {};
      _ref = this.vendors;
      for (e = _i = 0, _len = _ref.length; _i < _len; e = ++_i) {
        v = _ref[e];
        i[v + baseProperty] = value;
      }
      return i;
    };

    return Css3Support;

  })();

  Canvas = (function() {
    function Canvas(w, h, img) {
      if (img == null) {
        img = null;
      }
      this.canvas = document.createElement('canvas');
      this.canvas.width = w;
      this.canvas.height = h;
      this.context = this.canvas.getContext('2d');
      if (img !== null) {
        this.context.drawImage(img, 0, 0);
      }
    }

    Canvas.prototype.w = function() {
      return this.canvas.width;
    };

    Canvas.prototype.h = function() {
      return this.canvas.height;
    };

    Canvas.prototype.getContext = function() {
      return this.context;
    };

    Canvas.prototype.getImage = function(format) {
      if (format == null) {
        format = 'image/png';
      }
      return this.canvas.toDataURL(format);
    };

    Canvas.prototype.imageToDataUrl = function(image, w, h) {
      var n;
      if (w == null) {
        w = image.width;
      }
      if (h == null) {
        h = image.height;
      }
      n = new Canvas(w, h, image);
      return n.getImage();
    };

    Canvas.prototype.canvasApply = function(obj) {
      (function(context) {
        var e, i, _results;
        _results = [];
        for (e in obj) {
          i = obj[e];
          _results.push(context[e] = i);
        }
        return _results;
      })(this.context);
      return this;
    };

    Canvas.prototype.drawTitle = function(text, bold, font, size, x, y) {
      var metric, tx, ty;
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      metric = this.context.measureText(text, bold, font, size);
      this.context.save();
      if (true) {
        tx = x - (metric.width / 2);
        ty = y + size;
        this.context.translate(tx, ty);
        this.context.rotate(_ANGLE_TEXT * Math.PI / 180);
        this.context.translate(-tx, -ty);
      }
      this.context.fillText(text, x, y);
      this.context.restore();
      return this;
    };

    Canvas.prototype.clipImageInDiagonal = function(imageElement, mode, bothSides) {
      var clipPathPoints, p, p0, p1, wside, _i, _len;
      if (mode == null) {
        mode = 45;
      }
      if (bothSides == null) {
        bothSides = false;
      }
      p0 = {
        x: 0,
        y: this.h()
      };
      p1 = {
        x: this.w(),
        y: 0
      };
      this.context.save();
      this.context.beginPath();
      if (mode === 'trapecy') {
        p0 = {
          x: 0,
          y: 0
        };
        p1 = {
          x: Math.abs(this.w() * _SIN(_PERCENT_DISTRIBUTION_ANGLE)),
          y: Math.abs(this.h() * _COS(_PERCENT_DISTRIBUTION_ANGLE))
        };
        wside = _PERCENT_DISTRIBUTION_CLIP * this.w();
        /*
        				@context.moveTo(0, 0)
        				@context.lineTo(wside, 0)
        				@context.lineTo(@w(), 0)
        				@context.lineTo(@w()-wside, @h())
        				@context.lineTo(0, @h())
        				@context.lineTo(wside, 0)
        */

        clipPathPoints = [[p1.x, 0], [this.w(), 0], [this.w() - p1.x, this.h()], [0, this.h()], [p1.x, 0]];
        this.context.moveTo(0, 0);
        for (_i = 0, _len = clipPathPoints.length; _i < _len; _i++) {
          p = clipPathPoints[_i];
          this.context.lineTo(p[0], p[1]);
        }
        console.log('clipPathPoints', p1, clipPathPoints);
      }
      if (mode === 45) {
        this.context.moveTo(p0.x, p0.y);
        this.context.lineTo(p1.x, p1.y);
        this.context.lineTo(0, 0);
      }
      this.context.closePath();
      this.context.save();
      this.context.clip();
      this.context.drawImage(imageElement, 0, 0);
      this.context.restore();
      return this;
    };

    return Canvas;

  })();

  DiagonalSlider = (function() {
    DiagonalSlider.prototype.canvas = null;

    DiagonalSlider.prototype.defaults = {
      slideOpening: 'full',
      width: 960,
      height: 300,
      angleClip: _PERCENT_DISTRIBUTION_ANGLE,
      opening: 'auto',
      fontSize: '32px',
      fontFamily: 'Arial',
      fontColor: '#FFFFFF'
    };

    DiagonalSlider.prototype.backToOrigen = function(callback) {
      var self;
      self = this;
      self.slides.removeClass('active').each(function(i) {
        var slide, transform, tx, ty;
        slide = $(this);
        tx = slide.data('origen_x');
        ty = 0;
        transform = self.css3.supports('transform') ? self.css3.getCssPropertyVendor('transform', "translate(" + tx + "px, " + ty + ", 0 )") : {
          left: tx
        };
        return slide.stop(false, false).css(transform);
      });
      if (callback) {
        callback.apply(this, null);
      }
      return this;
    };

    DiagonalSlider.prototype.handleClickEvent = function(event, index, ref) {
      var current, img, init_x, opening, prev, reference, self, slice;
      self = this;
      if (this.scope.data('currentIndex') === index) {
        this.scope.data('currentIndex', 0);
        this.backToOrigen(null);
        return false;
      }
      this.slides.removeClass('active');
      opening = this.defaults.opening;
      current = this.slides.eq(index);
      if (self.defaults.slideOpening === 'full') {
        prev = this.slides.eq(index);
        prev.addClass('active').css('left', 0).css('background', prev.data('background-css-origin'));
        slice = this.slides.not(prev);
      } else {
        slice = this.slides.filter(':gt(' + (index - 1) + ')');
        prev = slice.first().addClass('active');
      }
      img = prev.find('img');
      reference = img.attr('data-ref');
      if (reference.indexOf('.') > -1 || reference.indexOf('#') > -1) {
        prev.find('.diagonal').append($(reference));
      } else {
        prev.find('.diagonal').load(reference);
      }
      init_x = parseInt(prev.css('left')) + prev.width() * _PERCENT_DISTRIBUTION_CLIP;
      this.backToOrigen(function() {
        var animateTransition, css3supports;
        css3supports = self.css3.supports('transform');
        animateTransition = function(i) {
          var dhis, outsideViewport, transform, tx, ty;
          dhis = $(this);
          outsideViewport = (i > index ? 1 : -1) * 3 * dhis.width();
          tx = self.defaults.slideOpening === 'full' ? outsideViewport : init_x + (i * opening);
          ty = 0;
          transform = css3supports ? self.css3.getCssPropertyVendor('transform', "translate3d(" + tx + "px, " + ty + ", 0 )") : {
            left: tx
          };
          dhis.addClass('animate');
          dhis.css(transform);
          return self.scope.trigger('dslider-change', [null]);
        };
        slice.filter(':gt(' + index + ')').each(animateTransition);
        slice.filter(':lt(' + index + ')').each(animateTransition);
        this.scope.data('currentIndex', index);
        return self.scope.trigger('dslider-before-change', [null]);
      });
      return true;
    };

    function DiagonalSlider(scope, options) {
      var css3, defaults, holder, labelOpts, opening, self, sliderHeight, sliderWidth, slides, slidesCount, transform, wtotal, zin;
      this.scope = scope;
      self = this;
      self.css3 = new Css3Support();
      defaults = self.defaults = $.extend(this.defaults, options);
      holder = $('ul,ol', this.scope);
      this.slides = slides = holder.children();
      slidesCount = slides.size();
      sliderWidth = defaults.width;
      sliderHeight = defaults.height;
      if (self.defaults.opening === 'auto') {
        self.defaults.opening = sliderWidth / slidesCount;
      }
      opening = defaults.opening;
      wtotal = 0;
      this.scope.css({
        width: sliderWidth,
        height: sliderHeight
      }).data('currentIndex', 0);
      holder.addClass('clearfix');
      slides.css('width', sliderWidth);
      zin = 100 + slidesCount;
      labelOpts = {
        font: 'normal ' + defaults.fontSize + ' ' + defaults.fontFamily,
        fillStyle: defaults.fontColor
      };
      css3 = new Css3Support();
      transform = css3.supports('transform');
      slides.each(function(index, el) {
        var alt, clone, dcanvas, dh, dl, dw, fs, hasSettedLeftProp, i, image, imagej, items, me, origen_x, tleft, tproperty, transformDegs, tstyle, _i, _len, _ref;
        me = $(this);
        dw = me.width();
        dh = me.height();
        clone = $('<div></div>').addClass('diagonal');
        imagej = me.find('img').height(sliderHeight);
        image = imagej.get(0);
        dcanvas = new Canvas(image.width, image.height, image);
        imagej.hide().load(function() {
          var backgroundCss, dataUrl, dis, justImage, tiltCss;
          dis = $(this);
          justImage = dcanvas.imageToDataUrl(this);
          dcanvas.clipImageInDiagonal(image, 'trapecy', index > 1);
          dataUrl = dcanvas.getImage();
          console.log('ready and set');
          tiltCss = 'transparent url(' + dataUrl + ') no-repeat center top';
          backgroundCss = 'url(' + this.src + ')';
          clone.insertAfter(this).css({
            background: tiltCss,
            height: dis.height(),
            width: dis.width()
          });
          me.data('background-origin', this.src);
          return me.data('background-css-origin', backgroundCss);
        });
        if (transform && index > 0) {
          transformDegs = 'rotate(' + self.defaults.angleClip + 'deg)';
          tstyle = transform.vendor + 'transform-style';
          tproperty = transform.property;
          dl = $('<div></div>').addClass('rubber');
          dl.css(tproperty, transformDegs).css(tstyle, 'preserve-3d').css({
            height: sliderHeight * 1.5,
            width: opening * 0.7,
            position: 'absolute',
            zIndex: index + 3 + 100,
            top: -50,
            cursor: 'pointer'
          });
          if (index > 0) {
            dl.css({
              left: (dw * _PERCENT_DISTRIBUTION_CLIP) - opening
            });
          } else {
            dl.css({
              left: dw * _PERCENT_DISTRIBUTION_CLIP
            });
          }
          dl.bind('mouseover', function(event) {
            return me.toggleClass('d-hover');
          }).click(function(event) {
            event.preventDefault();
            event.stopPropagation();
            slides.removeClass('active');
            me.toggleClass('active');
            return self.handleClickEvent.apply(self, [event, index, me]);
          });
          me.append(dl);
        } else {
          items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
          _ref = items.length;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            dl = $('<div></div>');
            dl.css({
              width: opening,
              height: items.length / sliderHeight
            });
            me.append(dl);
          }
        }
        if (index === 0) {
          origen_x = -(dw * _PERCENT_DISTRIBUTION_CLIP);
          me.addClass('first').data('origen_x', origen_x).css('left', origen_x + 'px');
          hasSettedLeftProp = true;
        }
        if (index === slidesCount - 1) {
          me.addClass('last');
        }
        wtotal += dw;
        fs = parseInt(defaults.fontSize);
        if ((alt = imagej.attr('alt')) !== null) {
          dcanvas.canvasApply(labelOpts).drawTitle(alt, 'normal', defaults.fontFamily, fs, (dw * _PERCENT_DISTRIBUTION_CLIP) - fs, sliderHeight);
        }
        if (!hasSettedLeftProp) {
          tleft = index * opening;
          me.data('origen_x', tleft).css('left', tleft + 'px');
        }
        return me.css('cursor', 'pointer').css('z-index', index + 1 + 100).click(function(event) {
          slides.removeClass('active');
          me.toggleClass('active');
          return self.handleClickEvent.apply(self, [event, index, me]);
        });
      });
      holder.css({
        width: wtotal + 'px'
      });
    }

    return DiagonalSlider;

  })();

  if (typeof this.$(!void 0)) {
    $.fn.diagonalSlider = function(options) {
      var isMethodCall, selection;
      if (options == null) {
        options = {};
      }
      selection = $(this);
      isMethodCall = typeof options === "string";
      selection.each(function() {
        var instance, me;
        me = $(this).addClass('dslider');
        instance = new DiagonalSlider(me, options);
        me.data('diagonalSlider', instance);
        return me;
      });
      return selection;
    };
  }

  this.CCanvas = Canvas;

}).call(this);
