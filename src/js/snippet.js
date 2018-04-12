
/*!
 * Queiroz.js: snippet.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(document, Queiroz) {

    /* Modules */

    var
      Strings = Queiroz.module.strings,
      Style = Queiroz.module.style;

    /* Class Definition */

    var Snippet = function() {

        /* Constants */

        var
            TagName = {
                BR: 'br',
                DIV: 'div',
                P: 'p',
                SPAN: 'span',
                STYLE: 'style',
                STRONG: 'strong',
                BUTTON: 'button',
                SMALL: 'small',
                TABLE: 'table',
                THEAD: 'thead',
                TBODY: 'tbody',
                TH: 'th',
                TR: 'tr',
                TD: 'td'
            };

        var
            _buildTag = function(name, clazz, text) {
                var element = document.createElement(name);
                if (clazz) {
                    element.className = clazz;
                }
                if (text) {
                    element.innerHTML = text;
                }
                return element;
            },
            _buildBox = function(opt) {
                var box = _buildTag(TagName.DIV, 'qz-box qz-box-muted qz-text-center');
                var helpText = _buildTag(TagName.DIV, 'qz-help-text', Strings(opt.helpText));
                var humanTime = _buildTag(TagName.STRONG, 'qz-box-content '+opt.contentClass, opt.humanTime);
                box.appendChild(helpText);
                box.appendChild(humanTime);
                if (opt.inlineText) box.className += ' qz-box-inline';
                return box;
            },
            _buildEditableTimeOnBox = function(options) {
                options.init();

                var box = _buildTag(TagName.DIV, 'qz-box qz-box-muted qz-text-center js-has-edit-box');
                var helpText = _buildTag(TagName.DIV, 'qz-help-text', options.helpText);
                var upHour = _buildTag(TagName.SPAN,'qz-fa fa fa-chevron-up');
                var upMin = _buildTag(TagName.SPAN,'qz-fa fa fa-chevron-up');
                var eTime = _buildTag(TagName.STRONG, 'qz-box-content js-time-edit-box', '00:00');
                var downHour = _buildTag(TagName.SPAN,'qz-fa fa fa-chevron-down');
                var downMin = _buildTag(TagName.SPAN,'qz-fa fa fa-chevron-down');
                var cancel = _buildTag(TagName.SPAN,'qz-fa qz-fa-sw fa fa-times');
                var save = _buildTag(TagName.SPAN,'qz-fa qz-fa-se qz-text-green fa fa-floppy-o');

                upHour.onclick = function() {
                    var eTime = this.parentElement.querySelector('.js-time-edit-box');
                    var time = eTime.textContent.split(':');
                    var hour = parseInt(time[0]);
                    if (hour == 23) hour = 0;
                    else hour+=1;
                    eTime.textContent = hour.padStart(2) + ':' + time[1];
                };
                downHour.onclick = function() {
                    var eTime = this.parentElement.querySelector('.js-time-edit-box');
                    var time = eTime.textContent.split(':');
                    var hour = parseInt(time[0]);
                    if (hour == 0) hour = 23;
                    else hour-=1;
                    eTime.textContent = hour.padStart(2) + ':' + time[1];
                };
                upMin.onclick = function() {
                    var eTime = this.parentElement.querySelector('.js-time-edit-box');
                    var time = eTime.textContent.split(':');
                    var min = parseInt(time[1]);
                    if (min == 59) min = 0;
                    else min+=1;
                    eTime.textContent = time[0] + ':' + min.padStart(2);
                };
                downMin.onclick = function() {
                    var eTime = this.parentElement.querySelector('.js-time-edit-box');
                    var time = eTime.textContent.split(':');
                    var min = parseInt(time[1]);
                    if (min == 0) min = 59;
                    else min-=1;
                    eTime.textContent = time[0] + ':' + min.padStart(2);
                };
                cancel.onclick = function() {
                    options.finally();
                    this.parentElement.remove();
                };
                save.onclick = function() {
                    options.finally();
                    var eDay = this.parentElement.parentElement;
                    var eDate = eDay.querySelector('[id^=hiddenDiaApont]').value;
                    var eTime = eDay.querySelector('.js-time-edit-box').textContent;
                    options.save(eDate, eTime);
                };

                box.appendChild(helpText);
                box.appendChild(upHour);
                box.appendChild(upMin);
                box.appendChild(_buildTag(TagName.BR));
                box.appendChild(eTime);
                box.appendChild(_buildTag(TagName.BR));
                box.appendChild(downHour);
                box.appendChild(downMin);
                box.appendChild(cancel);
                box.appendChild(save);
                return box;
            },
            _buildMockTime = function(options) {
                var
                    div = _buildTag(TagName.DIV, 'FilledSlot qz-text-primary'),
                    spanTime = _buildTag(TagName.SPAN, 'Time'+options.direction, options.mockTime),
                    spanRemove = _buildTag(TagName.SPAN,'qz-fa qz-fa-se fa fa-times');

                div.data('data-key', options.key);
                div.data('data-mocktime', options.mockTime);

                spanRemove.onclick = function() {
                    var
                        e = this.parentElement,
                        eDate = e.data('data-key'),
                        mockTime = e.data('data-mocktime');

                    options.remove(eDate, mockTime);
                    options.finally();
                };

                div.appendChild(spanTime);
                div.appendChild(spanRemove);
                return div;
            };

        /* Public Functions */

        return {
            style: function() {
                return _buildTag(TagName.STYLE, 'qz-style', Style.CSS);
            },
            header: function() {
                return _buildTag(TagName.P, 'qz-box-head');
            },
            buildToggleForDayOff: function(key) {
                return _buildTag(TagName.SPAN, 'fa fa-toggle-'+key+' qz-toggle');
            },
            buildDayOptions: function(TimeOn, MockTime) {
                var dropdown = _buildTag(TagName.DIV, 'qz-dropdown');
                var icon = _buildTag(TagName.SPAN, 'fa fa-bars qz-text-teal');
                var content = _buildTag(TagName.DIV, 'qz-dropdown-content');
                var addTimeOn = _buildTag(TagName.P, 'qz-text-left', ':: Abonar Falta');
                var addMockTime = _buildTag(TagName.P, 'qz-text-left', ':: Mock Time');

                addTimeOn.onclick = function() {
                    var eDay = this.parentElement.parentElement.parentElement.parentElement;
                    if (eDay.querySelector('.js-has-edit-box'))
                        return;

                    window.scrollTo(0, 300);
                    setTimeout(function() {
                        var options = {
                            'helpText': Strings('timeOn'),
                            'init': TimeOn.activate,
                            'finally': TimeOn.deactivate,
                            'save': function(eDate, eTime) {
                                if (TimeOn.add(eDate, eTime))
                                    Queiroz.reload();
                            }
                        };
                        eDay.appendChild(_buildEditableTimeOnBox(options));
                    }, 250);
                };

                addMockTime.onclick = function() {
                    var eDay = this.parentElement.parentElement.parentElement.parentElement;
                    if (eDay.querySelector('.js-has-edit-box'))
                        return;

                    window.scrollTo(0, 300);
                    setTimeout(function() {
                        var options = {
                            'helpText': Strings('mockTime'),
                            'init': MockTime.activate,
                            'finally': MockTime.deactivate,
                            'save': function(eDate, eTime) {
                                if (MockTime.add(eDate, eTime))
                                    Queiroz.reload();
                            }
                        };
                        eDay.appendChild(_buildEditableTimeOnBox(options));
                    }, 250);
                };

                dropdown.appendChild(icon);
                dropdown.appendChild(content);
                content.appendChild(addTimeOn);
                content.appendChild(addMockTime);
                return dropdown;
            },
            headerBeta: function() {
                var box = _buildBox({
                    helpText: 'config',
                    humanTime: '',
                    contentClass: 'fa fa-flask qz-text-golden',
                    inlineText: true
                });
                box.className += ' qz-box-compact';
                box.onclick = function() {
                    Queiroz.beta();
                }
                return box;
            },
            headerWeeklyGoal: function(weeklyGoal) {
                return _buildBox({
                    helpText: 'weeklyGoal',
                    humanTime: weeklyGoal,
                    contentClass: 'qz-text-black',
                    inlineText: true
                });
            },
            headerLaborTime: function(laborTime) {
                return _buildBox({
                    helpText: 'labor',
                    humanTime: laborTime,
                    contentClass: 'qz-text-green',
                    inlineText: true
                });
            },
            headerBalanceTime: function(balanceTime) {
                return _buildBox({
                    helpText: (balanceTime.contains('+') ? 'extra' : 'pending'),
                    humanTime: balanceTime,
                    contentClass: 'qz-text-' + (balanceTime.contains('+') ? 'green' : 'primary'),
                    inlineText: true
                });
            },
            headerNoticeStatus: function(Notice) {
                var box = _buildBox({
                    helpText: 'notice',
                    humanTime: Notice.isGranted() ? 'ON' : 'OFF',
                    contentClass: 'qz-text-' + (Notice.isGranted() ? 'green' : 'primary'),
                    inlineText: true
                });
                box.onclick = function() {
                    if (Notice.isGranted() == false)
                        Notice.requestPermission();
                }
                return box;
            },
            balanceTimePerDay: function(balanceTime, total) {
                return _buildBox({
                    helpText: (total ? 'totalB' : 'b') + 'alance',
                    humanTime: balanceTime,
                    contentClass: 'qz-text-'+ (total ? 'purple' : 'teal')
                });
            },
            dailyGoal: function(dailyGoal) {
                return _buildBox({
                    helpText: 'dailyGoal',
                    humanTime: dailyGoal,
                    contentClass: 'qz-text-black'
                });
            },
            laborTimePerDay: function(laborTime) {
                return _buildBox({
                    helpText: 'labor',
                    humanTime: laborTime,
                    contentClass: 'qz-text-green'
                });
            },
            laborTimePerShift: function(laborTime, finished, number) {
                var box = _buildBox({
                    helpText: (finished ? 'shift' : 'working'),
                    humanTime: laborTime,
                    contentClass: (finished ? '' : 'qz-text-golden')
                });
                if (finished) {
                    var help = box.querySelector('.qz-help-text');
                    var text = help.textContent.replace('_n_', number);
                    help.textContent = text;
                }
                return box;
            },
            todayTimeToLeave: function(timeToLeave, balanced, basedOn) {
                var box = _buildBox({
                    helpText: 'exit' + (balanced ? '+' : ''),
                    humanTime: timeToLeave,
                    contentClass: 'qz-text-primary'
                });
                if (balanced == false) {
                    var help = box.querySelector('.qz-help-text');
                    var text = help.textContent.replace('_s_', basedOn);
                    help.textContent = text;
                }
                return box;
            },
            buildTimeOnBox: function(TimeOn, humanTime) {
                var box = _buildBox({
                    helpText: 'timeOn',
                    humanTime: humanTime,
                    contentClass: 'qz-text-orange'
                });
                var remove = _buildTag(TagName.SPAN,'qz-fa qz-fa-sw fa fa-times');
                remove.onclick = function() {
                    var eDay = this.parentElement.parentElement;
                    var eDate = eDay.querySelector('[id^=hiddenDiaApont]').value;
                    TimeOn.remove(eDate);
                    Queiroz.reload();
                };
                box.appendChild(remove);
                return box;
            },
            buildMockTime: _buildMockTime
        };
    }();

    /* Module Definition */

    Queiroz.module.snippet = Snippet;

})(document, Queiroz);
