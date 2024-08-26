$(document).ready(function () {
  // Helpers
  var helpers = {
    getNumOfPages: function (array, perPage) {
      return Math.ceil(array.length / perPage);
    },
    getPage: function (array, page, perPage) {
      var paginatedArray = [];
      var startIndex = perPage * (page - 1);
      var endIndex = startIndex + perPage;
      if (endIndex > array.length) endIndex = array.length;
      if (startIndex > array.length) return [];
      for (var i = startIndex; i < endIndex; i++) {
        paginatedArray.push(array[i]);
      }
      return paginatedArray;
    },
    stringToDate: function (date) {
      var day = date.split('.')[0];
      var month = date.split('.')[1];
      if (+month !== 0) month -= 1;
      var year = date.split('.')[2];
      return new Date(year, month, day);
    },
    isToday: function (date) {
      var newDate = this.stringToDate(date);
      var today = new Date();
      return (
        today.getDate() == newDate.getDate() &&
        today.getMonth() == newDate.getMonth() &&
        today.getFullYear() == newDate.getFullYear()
      );
    },
    isTomorrow: function (date) {
      var newDate = this.stringToDate(date);
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return (
        newDate.getDate() == tomorrow.getDate() &&
        newDate.getMonth() == tomorrow.getMonth() &&
        newDate.getFullYear() == tomorrow.getFullYear()
      );
    },
    getDayShortName: function (date) {
      var date = this.stringToDate(date);
      return date.toLocaleDateString('cs', { weekday: 'long' }).substring(0, 2);
    },
    generateDaysAheadFromNow: function (daysAhead) {
      var now = new Date();
      var days = [];
      for (var i = 0; i < daysAhead; i++) {
        var dayDate = new Date(now);
        dayDate.setDate(dayDate.getDate() + i);

        var day = dayDate.getDate();
        var month = dayDate.getMonth() + 1;
        var year = dayDate.getFullYear();
        var date = day + '.' + month + '.';
        var formattedDateWithYear = date + year;

        var dateWithYear = (function () {
          var formattedMonth = month;
          var formattedDay = day;
          if (month < 10) formattedMonth = '0' + month;
          if (day < 10) formattedDay = '0' + day;
          return year + '-' + formattedMonth + '-' + formattedDay;
        })();

        if (this.isToday(formattedDateWithYear)) {
          days.push({ date: dateWithYear, formattedDate: 'Dnes ' + date });
        } else if (this.isTomorrow(formattedDateWithYear)) {
          days.push({ date: dateWithYear, formattedDate: 'Zítra ' + date });
        } else {
          var dayShortName = this.getDayShortName(formattedDateWithYear);
          days.push({
            date: dateWithYear,
            formattedDate: dayShortName.charAt(0).toUpperCase() + dayShortName.slice(1) + ' ' + date,
          });
        }
      }
      return days;
    },
    getMinutes: function (time) {
      var values = time.split(':');
      var hours = values[0];
      var minutes = values[1];
      if (hours.split('')[0] === '0') {
        hours = hours.split('')[1];
      }
      if (minutes.split('')[0] === '0') {
        minutes = minutes.split('')[1];
      }
      return +hours * 60 + +minutes;
    },
    isBetweenTimes: function (startTime, endTime, time) {
      return this.getMinutes(startTime) <= this.getMinutes(time) && this.getMinutes(time) <= this.getMinutes(endTime);
    },
    isBetweenTimesExcludingStart: function (startTime, endTime, time) {
      return this.getMinutes(startTime) < this.getMinutes(time) && this.getMinutes(time) <= this.getMinutes(endTime);
    }
  };

  // Queries
  var timedOrderPanelBtn = '[data-open-panel="js-timed-orders-panel"]';
  var timedOrderNotification = '[data-id="timed-order-notification"]';
  var timedOrderDayHiddenInput = 'input[name="timed-order-selected-day"]';
  var timedOrderTimeHiddenInput = 'input[name="timed-order-selected-time"]';
  var timedOrderWrapper = '[data-id="timed-order-wrapper"]';
  var timedOrderDayWrapper = '[data-id="timed-order-day-wrapper"]';
  var timedOrderDayRow = '[data-id="day-select-row"]';
  var timedOrderPrevDayBtn = '.btn[data-target="prev"]';
  var timedOrderNextDayBtn = '.btn[data-target="next"]';
  var timedOrderTimesContainer = '[data-id="time-select-container"]';
  var deliveryTypeSelection = '.delivery-type-selection';

  // Templates
  var TemplateDay = $('[data-template="day"]', timedOrderWrapper).clone(true).removeAttr('data-template');
  var TemplateTime = $('[data-template="time"]', timedOrderWrapper).clone(true).removeAttr('data-template');

  // Events
  $(timedOrderWrapper).on('initialize', function () {
    //called when delivery type changed

    console.error("$(timedOrderWrapper).on('initialize' CALLED");
    // 1.) Check if Timed Order is available and save data to wrapper
    $(timedOrderDayHiddenInput).val('');
    $(timedOrderTimeHiddenInput).val('');
    $(timedOrderNotification).hide();

    $(timedOrderWrapper).trigger('loadDays');

    // 2.) Render days and empty times
    if ($(timedOrderDayWrapper).data('days')) {
      $(timedOrderDayRow, timedOrderWrapper).trigger('renderDays');
      $(timedOrderTimesContainer).empty();
    }
  });

  $(timedOrderWrapper).on('loadDays', function () {
    $(timedOrderDayWrapper).removeData('days');
    var DeliveryMethod = StoreManager.getEntity('DeliveryMethod').find(function (deliveryMethod) {
      return deliveryMethod.ID === +$(deliveryTypeSelection).val();
    });
    var TimedOrderSettings = undefined;
    if (DeliveryMethod.TimedOrderSettings && DeliveryMethod.TimedOrderSettings !== null) {
      TimedOrderSettings = DeliveryMethod.TimedOrderSettings;
    } else {
      $(timedOrderDayWrapper).hide();
      $(timedOrderTimesContainer).text(lang.ERROR_TIMED_ORDER_NOT_VALID_FOR_DELIVERY);
      return;
    }

    $(timedOrderDayWrapper).show();
    var days = helpers.generateDaysAheadFromNow(TimedOrderSettings.DaysAhead);
    $(timedOrderDayWrapper).data('days', days);
    $(timedOrderDayWrapper).data('page', 1);
    $(timedOrderDayWrapper).data('numOfPages', helpers.getNumOfPages(days, 2));
  });

  $(timedOrderDayRow, timedOrderWrapper).on('renderDays', function () {
    var days = $(timedOrderDayWrapper, timedOrderWrapper).data('days');
    var page = $(timedOrderDayWrapper, timedOrderWrapper).data('page');
    var numOfPages = $(timedOrderDayWrapper).data('numOfPages');
    
    if(!days || !page){
      console.error("TimedOrder: NO DAYS");
      return;
    }
    
    var daySelection = helpers.getPage(days, page, 2);

    $(timedOrderDayRow, timedOrderWrapper).empty();

    if (page > 1) {
      $(timedOrderPrevDayBtn, timedOrderWrapper).removeClass('disabled');
    } else {
      $(timedOrderPrevDayBtn, timedOrderWrapper).addClass('disabled');
    }

    if (page < numOfPages) {
      $(timedOrderNextDayBtn, timedOrderWrapper).removeClass('disabled');
    } else {
      $(timedOrderNextDayBtn, timedOrderWrapper).addClass('disabled');
    }

    daySelection.forEach(function (day) {
      var templateDay = TemplateDay.clone();
      $(templateDay).attr('data-date', day.date);
      $(templateDay).first().text(day.formattedDate);
      $(timedOrderDayRow, timedOrderWrapper).append(templateDay);
    });
    $(timedOrderDayRow, timedOrderWrapper).children().first().trigger('click');
  });

    $(timedOrderDayRow, timedOrderWrapper).on('click', '.day', function () {
    //ignore already selected day
    if ($(this).attr('data-date') === $(timedOrderDayHiddenInput).val()) return;

    var date = $(this).attr('data-date');
    $(timedOrderDayRow, timedOrderWrapper)
      .children()
      .each(function () {
        $(this).removeClass('active');
      });
    $(this).addClass('active');
    $(timedOrderTimesContainer).trigger('renderTimes', { date });
    $(timedOrderDayHiddenInput).val(date);
    $(timedOrderTimeHiddenInput).val('');
    $(timedOrderTimeHiddenInput).trigger('change');
    $(timedOrderNotification).hide();
  });

  $(timedOrderPrevDayBtn, timedOrderWrapper).on('click', function () {
    var page = $(timedOrderDayWrapper).data('page');
    if (page - 1 < 1) return;

    $(timedOrderDayWrapper).data('page', page - 1);
    $(timedOrderTimesContainer).empty();
    $(timedOrderDayHiddenInput).val('');
    $(timedOrderTimeHiddenInput).val('');
    $(timedOrderNotification).hide();
    $(timedOrderDayRow, timedOrderWrapper).trigger('renderDays');
  });

  $(timedOrderNextDayBtn, timedOrderWrapper).on('click', function () {
    var page = $(timedOrderDayWrapper).data('page');
    var numOfPages = $(timedOrderDayWrapper).data('numOfPages');
    if (page + 1 > numOfPages) return;

    $(timedOrderDayWrapper, timedOrderWrapper).data('page', page + 1);
    $(timedOrderTimesContainer, timedOrderWrapper).empty();
    $(timedOrderDayHiddenInput).val('');
    $(timedOrderTimeHiddenInput).val('');
    $(timedOrderNotification).hide();
    $(timedOrderDayRow, timedOrderWrapper).trigger('renderDays');
  });

  $(timedOrderTimesContainer, timedOrderWrapper).on('renderTimes', function (_, data) {
    console.error("renderTimes CALLED");

    let selectedDate = $(timedOrderDayRow + " .day.active", timedOrderWrapper).attr("data-date");
    let selectedTime = $(".time-select.active", timedOrderTimesContainer).attr("data-time");
    

    if (!data.date) return;
    var Order = CashOrder.getOrder();
    /*
    // Delivery ID is outdated if used from Order
    var deliveryID = Order.DeliveryID;
    if (deliveryID === -1) {
      deliveryID = +$(deliveryTypeSelection).val();
    }*/
    var deliveryID = $(deliveryTypeSelection).val();

    var Lon = Order.GPSLon;
    var Lat = Order.GPSLat;
    // Get times from API
    $.ajax({
      url: CashAPI.getTimedOrderTimes(deliveryID, data.date, Lon, Lat),
      beforeSend: function () {
        $(timedOrderTimesContainer).text('Načítání...');
      },
      success: function (res) {
        if (!('Data' in res) || res.Data.length < 1) {
          $(timedOrderTimesContainer).text(lang.ERROR_TIMED_ORDER_NO_TIME_AVAILABLE);
          return;
        }
        var times = res.Data;
        var dayOfWeek = new Date($(timedOrderDayHiddenInput).val()).getDay();
        var openingHours = StoreManager.getEntity('OpeningHours').filter(function (openHours) {
          if (!('DayOfWeek' in openHours)) return;
          if (openHours.DayOfWeek !== dayOfWeek) return;
          return {
            TimeFrom: openHours.TimeFrom,
            TimeTo: openHours.TimeTo,
          };
        });
        $(timedOrderTimesContainer).empty();
        times.forEach(function (time) {
          var Time = time.Time;
          var Capacity = time.Capacity;
          var OriginalCapacity = time.OriginalCapacity;
          var TimeAhead = 25;

          var isOpened = openingHours.some(function (hourInterval) {
            return helpers.isBetweenTimesExcludingStart(hourInterval.TimeFrom, hourInterval.TimeTo, Time);
          });
          if (!isOpened) return;

          var orderDate = new Date(data.date + 'T' + time.Time);
          var now = new Date();

          var diff = orderDate - now;
          var minutes = Math.floor(diff / 1000 / 60);

          if (minutes < TimeAhead) return;
          var templateTime = TemplateTime.clone();
          $(templateTime).first().text(Time).attr('data-time', Time);
          if (Capacity < 1) {
            $(templateTime).addClass('disabled');
          }

          if(Time == data.time){
            $(templateTime).addClass('active');
          }

          var span = document.createElement('span');
          $(span).addClass('availability');

          var getUsedCapacity = function (OriginalCapacity, Capacity) {
            if (Capacity < 0) {
              return OriginalCapacity + Math.abs(Capacity);
            } else if (Capacity === 0) {
              return OriginalCapacity;
            } else {
              return OriginalCapacity - Capacity;
            }
          };

          if (Capacity < 1) {
            $(span).text(lang.TIMED_ORDER_PREPEND_NOT_AVAILABLE + ' (' + getUsedCapacity(OriginalCapacity, Capacity) + '/' + OriginalCapacity + ')');
          } else {
            $(span).text('(' + getUsedCapacity(OriginalCapacity, Capacity) + '/' + OriginalCapacity + ')');
          }
          $(templateTime).append(span);
          if (time.Eco) {
            $(templateTime).addClass('eco');
          }
          $(timedOrderTimesContainer).append(templateTime);
        });
        if ('callback' in data) {
          data.callback();
        }
      },
      error: function () {
        $(timedOrderTimesContainer).text(lang.ERROR_TIMED_ORDER_LOAD_FAILED);
      },
    });
  });

  $(timedOrderTimesContainer, timedOrderWrapper).on('click', '.time-select', function () {
    var time = $(this).attr('data-time');
    if (!time) return;

    var active = $(this).hasClass('active');
    var disabled = $(this).hasClass('disabled');
    if (disabled && !active) {
      alert(lang.ERROR_TIMED_ORDER_SELECTED_TIME_FULL);
    }

    if (active) {
      $(timedOrderTimesContainer)
        .children()
        .each(function () {
          $(this).removeClass('active');
        });
      $(timedOrderTimeHiddenInput).val('');
      $(timedOrderNotification).hide();
    } else {
      $(timedOrderTimesContainer)
        .children()
        .each(function () {
          $(this).removeClass('active');
        });
      $(this).addClass('active');
      $(timedOrderTimeHiddenInput).val(time);
      $(timedOrderNotification).show();
    }
    $(timedOrderTimeHiddenInput).trigger('change');
  });

  /*
  $(deliveryTypeSelection).on('change', function () {
    $(timedOrderWrapper).trigger('initialize');
  });
  */

  $(timedOrderPanelBtn).on('click', function () {
    //this will render always
    let actualOrderTime = $(timedOrderTimeHiddenInput).val();
    let actualOrderDate = $(timedOrderDayHiddenInput).val();

    var data = {
      date: actualOrderDate,
      time: actualOrderTime
    };

    $(timedOrderTimesContainer, timedOrderWrapper).trigger('renderTimes', data);
    
    /*
    if (!$(timedOrderTimeHiddenInput).val()) {
      var data = {
        date: $(timedOrderDayHiddenInput).val(),
      };
      $(timedOrderTimesContainer, timedOrderWrapper).trigger('renderTimes', data);
    }
    */
  });

  // Script
  StoreManager.registerReadyCallback(function () {
    /*
    $(timedOrderPanelBtn).on('click.initialize', function () {
      if (!Array.isArray($(timedOrderDayWrapper).data('days'))) {
        $(timedOrderWrapper).trigger('initialize');
      }

      CashOrderView.OrderViewCallbacks.register('NEW_ORDER', function () {
        $(timedOrderDayHiddenInput).val('');
        $(timedOrderTimeHiddenInput).val('');
        $(timedOrderNotification).hide();
        $(timedOrderDayRow, timedOrderWrapper).trigger('renderDays');
      });

      $(timedOrderPanelBtn).off('click.initialize');
    });
    */

    let handleOrder = function (Order) {
      
      if (!Array.isArray($(timedOrderDayWrapper).data('days'))) {
        $(timedOrderWrapper).trigger('loadDays');
      }

      if (!Order.TimedOrder || (Order.TimedOrder && !Order.TimedOrder.TimedOrder)) {
        $(timedOrderDayHiddenInput).val('');
        $(timedOrderTimeHiddenInput).val('');
        $(timedOrderNotification).hide();
        $(timedOrderDayWrapper, timedOrderWrapper).data('page', 1);
        $(timedOrderDayRow, timedOrderWrapper).trigger('renderDays');
        return;
      }

      var Time = Order.TimedOrder.Time;
      var Date = Order.TimedOrder.Date;

      var days = $(timedOrderDayWrapper).data('days');
      var dayIndex = null;
      days.forEach(function (day, index) {
        if (day.date === Date) {
          dayIndex = index;
          return;
        }
      });
      if (dayIndex === null || dayIndex === undefined) return;
      var page = Math.ceil((dayIndex + 1) / 2);
      $(timedOrderDayWrapper, timedOrderWrapper).data('page', page);
      $(timedOrderDayRow, timedOrderWrapper).trigger('renderDays');
      $(timedOrderDayHiddenInput).val('');
      $('[data-date="' + Date + '"]', timedOrderWrapper + ' ' + timedOrderDayRow).trigger('click');
      var callback = function () {
        var time = Time.split(':');
        time = time[0] + ':' + time[1];
        if (Time && $('[data-time="' + time + '"]', timedOrderTimesContainer)) {
          $('[data-time="' + time + '"]', timedOrderTimesContainer).addClass('active');
          $(timedOrderNotification).show();
          $(timedOrderTimeHiddenInput).val(time);
        }
      };
      $(timedOrderTimesContainer).trigger('renderTimes', { date: Date, callback });
    };

    CashOrderView.OrderViewCallbacks.register('ORDER_FORM_LOADED', handleOrder);
    CashOrderView.OrderViewCallbacks.register('NEW_ORDER', handleOrder);

    CashOrder.OrderCallback.register('ORDER_DELIVERY_CHANGE', (o) => {
      $(timedOrderWrapper).trigger('initialize');
    });


    
  });
});
