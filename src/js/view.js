
/*!
 * Queiroz.js: view.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(document, Queiroz) {

    /* Modules */

    var
        Settings = Queiroz.settings,
        mod      = Queiroz.module,
        Snippet  = mod.snippet,
        TimeOn   = mod.timeon,
        Notice   = mod.notice;

    /* Class Definition */

    var View = function() {

        /* Constants */

        var
            Selector = {
                HEAD: 'head',
                BODY: 'body',
                COLUMN_DAY: '.DiaApontamento',
                CHECKPOINT: '.FilledSlot span',
                DATE: '[id^=hiddenDiaApont]',
                HEADER: '#SemanaApontamentos div',
                HEADER_DAY: '.weekDayTextSize',
                TIME_IN: '.TimeIN,.TimeINVisualizacao',
                FOOTER: 'footer .LabelEmpresa',
                TOOGLE: '.HfIsFolga',
                QUEIROZ: '*[class*=qz-]'
            };

        /* Private Functions */

        var
            _asyncReflow = function(task) {
                setTimeout(task, 25);
            },
            _get = function(selector, target) {
                return (target || document).querySelector(selector);
            },
            _getAll = function(selector, target) {
                return (target || document).querySelectorAll(selector);
            },
            _append = function(selector, html, callback) {
              _asyncReflow(function() {
                  var element = _get(selector);

                  if (typeof html === 'string') {
                      var container = document.createElement('DIV');
                      container.innerHTML = html;
                      html = container.firstChild;
                  }

                  element.appendChild(html);

                  if (callback)
                    callback();
              });
          },
          _appendTo = function(target, element) {
              var filledSlotOut = target.parentNode;
              filledSlotOut.parentNode.insertBefore(element, filledSlotOut.nextSibling);
          },
          _getDisplayedDays = function() {
              var
                  days = [],
                  eColumns = _getAll(Selector.COLUMN_DAY);

              eColumns.forEach(function(eDay) {
                  days.push(_get(Selector.DATE, eDay).value);
              });

              return days; // [dd_mm_yyyy,dd_mm_yyyy,...]
          },
          _injectTimes = function(MockTime) {
              var eColumns = _getAll(Selector.COLUMN_DAY);

              eColumns.forEach(function(eDay) {
                  var eDate = _get(Selector.DATE, eDay).value;
                  if (MockTime.has(eDate)) {
                      var
                          eCheckpoints = _getAll(Selector.CHECKPOINT, eDay),
                          length = eCheckpoints.length;

                      MockTime.get(eDate).forEach(function(time, index) {
                          var
                              pair = (length + (index+1)) % 2 == 0,
                              direction = pair ? 'OUT' : 'IN', // 1=IN, 2=OUT, 3=IN, 4=OUT...
                              options = {
                                  'key': eDate,
                                  'mockTime': time,
                                  'direction': direction,
                                  'remove': MockTime.remove,
                                  'finally': function() {
                                      Queiroz.reload();
                                  }
                              };

                          eDay.appendChild(Snippet.buildMockTime(options));
                      });
                  }
              });
          };

        /* Public Functions */

        return {
            read: function() {
                var
                    data = {},
                    days = [],
                    eColumns = _getAll(Selector.COLUMN_DAY);

                eColumns.forEach(function(eDay) {
                    var
                        day = {
                            date: _get(Selector.DATE, eDay).value,
                            periods: []
                        },
                        eCheckpoints = _getAll(Selector.CHECKPOINT, eDay);

                    eCheckpoints.forEach(function(eTime) {
                        var
                            _classes = eTime.classList.value,
                            _time = eTime.textContent,
                            _periods = day.periods;

                        if (/TimeIN/.test(_classes)) {
                            _periods.push({in:_time, out:false});
                        } else
                            if (/TimeOUT/.test(_classes)) {
                                var _last = _periods.last();
                                if (_last && _last.out == false) {
                                    _last.out = _time;
                                } else {
                                    _periods.push({in:false, out:_time});
                                }
                            }
                    });
                    days.push(day);
                });
                data.days = days;
                return data;
            },
            removeUnusedDays: function(data) {
                var
                    targetIndex = 0,
                    days = data.days;
                days.forEach(function(day, index) {
                    if (day.date.getDay() === Settings.INITIAL_WEEKDAY)
                        targetIndex = index;
                });
                data.days = days.slice(targetIndex);

                var eColumns = _getAll(Selector.COLUMN_DAY);
                eColumns.forEach(function(eDay) {
                    var remove = true;
                    data.days.forEach(function(day) {
                        var eDate = _get(Selector.DATE, eDay).value;
                        if (day.date.getDateAsKairos() == eDate)
                            remove = false;
                    });
                    if (remove)
                        eDay.remove();
                });
            },
            render: function(data) {
                var eColumns = _getAll(Selector.COLUMN_DAY);
                data.days.forEach(function(day) {
                    eColumns.forEach(function(eDay) {
                        var eDate = _get(Selector.DATE, eDay).value;
                        if (day.date.getDateAsKairos() == eDate) {
                            if (day.timeOn) {
                                eDay.appendChild(TimeOn.buildBox(day.timeOn));
                            }
                            if (day.periods.length) {
                                var isWorkDay = Settings.WORK_DAYS.contains(day.date.getDay());
                                day.periods.forEach(function(time, index) {
                                    if (!!time.out || (time.out == false && day.date.isToday()))
                                        eDay.appendChild(Snippet.laborTimePerShift(time.shift, (!!time.out), (index+1)));
                                });
                                if (isWorkDay) {
                                    eDay.appendChild(Snippet.dailyGoal(day.goal));
                                }
                                eDay.appendChild(Snippet.laborTimePerDay(day.worked, TimeOn));
                                if (isWorkDay) {
                                    eDay.appendChild(Snippet.balanceTimePerDay(day.balance, false));
                                }
                                if (day.date.isToday() == false || isWorkDay == false) {
                                    eDay.appendChild(Snippet.balanceTimePerDay(day.totalBalance, true));
                                }
                                day.periods.forEach(function(time, index) {
                                    if (time.out == false && day.date.isToday()) {
                                        if (time.leaveMaxConcec)
                                            eDay.appendChild(Snippet.todayTimeToLeave(time.leaveMaxConcec, false, data.maxConsecutive));
                                        if (isWorkDay && time.leave)
                                            eDay.appendChild(Snippet.todayTimeToLeave(time.leave, false, day.goal));
                                        if (time.leaveMaxDaily)
                                            eDay.appendChild(Snippet.todayTimeToLeave(time.leaveMaxDaily, false, data.maxDaily));
                                        if (isWorkDay && time.balancedLeave)
                                            eDay.appendChild(Snippet.todayTimeToLeave(time.balancedLeave, true));
                                    }
                                });
                            }
                        }
                    });
                });

                var header = Snippet.header();
                header.appendChild(Snippet.headerWeeklyGoal(data.weeklyGoal));
                header.appendChild(Snippet.headerLaborTime(data.worked));
                header.appendChild(Snippet.headerBalanceTime(data.weeklyBalance));
                header.appendChild(Snippet.headerNoticeStatus(Notice));
                View.appendToHeader(header);
            },
            isLoaded: function() {
                return _get(Selector.COLUMN_DAY);
            },
            getAllColumnDay: function() {
                return _getAll(Selector.COLUMN_DAY);
            },
            getAllCheckpoint: function(target) {
                return _getAll(Selector.CHECKPOINT, target);
            },
            getDateFromTargetAsString: function(target) {
                return _get(Selector.DATE, target).value;
            },
            getAllTimeIn: function(target) {
                return _getAll(Selector.TIME_IN, target);
            },
            getAllQueirozElements: function() {
                return _getAll(Selector.QUEIROZ);
            },
            getHeadersDay: function(target) {
                return _getAll(Selector.HEADER_DAY, target);
            },
            appendToHead: function(html) {
                _append(Selector.HEAD, html);
            },
            appendToBody: function(html, callback) {
                _append(Selector.BODY, html, callback);
            },
            appendToHeader: function(html) {
                _append(Selector.HEADER, html);
            },
            appendToFooter: function(text) {
                var footerContent = _get(Selector.FOOTER).textContent;
                if (footerContent && footerContent.contains(text) == false)
                    _get(Selector.FOOTER).textContent += " | " + text;
            },
            appendToggle: function(target, eToggle) {
                _get(Selector.TOOGLE, target).parentElement.appendChild(eToggle);
            },
            getDisplayedDays: _getDisplayedDays,
            injectTimes: _injectTimes
        };
    }();

    /* Module Definition */

    Queiroz.module.view = View;

})(document, Queiroz);
