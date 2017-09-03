
/*!
 * Queiroz.js: view.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(document, Queiroz) {

    /* Modules */

    var Settings = Queiroz.settings,
        Snippet  = Queiroz.module.snippet;

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
            showResult: function(data) {
                var eColumns = _getAll(Selector.COLUMN_DAY);
                data.days.forEach(function(day) {
                    eColumns.forEach(function(eDay) {
                        var eDate = _get(Selector.DATE, eDay).value;
                        if (day.date.getDateAsKairos() == eDate) {
                            if (day.periods.length) {
                                day.periods.forEach(function(time, index) {
                                    eDay.appendChild(Snippet.laborTimePerShift(time.shift, (!!time.out), (index+1)));
                                });
                                eDay.appendChild(Snippet.dailyGoal(day.goal));
                                eDay.appendChild(Snippet.laborTimePerDay(day.worked));
                                eDay.appendChild(Snippet.balanceTimePerDay(day.balance));
                                day.periods.forEach(function(time, index) {
                                    if (time.out == false) {
                                        eDay.appendChild(Snippet.todayTimeToLeave(time.leave, false));
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
                header.appendChild(Snippet.headerBalanceTime(data.weeklyBalance, true));
                header.appendChild(Snippet.headerBalanceTime(data.dailyBalance, false));
                View.appendToHeader(header);
            },
            isLoaded: function() {
                return _get(Selector.CHECKPOINT);
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
            }
        };
    }();

    /* Module Definition */

    Queiroz.module.view = View;

})(document, Queiroz);
