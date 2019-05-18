
/*!
 * Queiroz.js: snippet.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(document, Queiroz) {

    /* Modules */

    var
        mod      = Queiroz.module,
        Settings = mod.settings,
        Kairos   = mod.kairos,
        Strings  = mod.strings,
        Style    = mod.style;

    /* Class Definition */

    var Snippet = function() {

        /* Constants */

        var
            TagName = {
                BR: 'br',
                DIV: 'div',
                A: 'a',
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
                TD: 'td',
                INPUT: 'input'
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
            _buildEditableBox = function(options) {
                options.init();

                var box = _buildTag(TagName.DIV, 'qz-box qz-box-muted qz-text-center js-has-edit-box');
                var helpText = _buildTag(TagName.DIV, 'qz-help-text', options.helpText);
                var divInput = _buildTag(TagName.DIV);
                var inputTime = _buildTag(TagName.INPUT, 'qz-input-time js-input-time');
                var cancel = _buildTag(TagName.SPAN,'qz-fa qz-fa-sw fa fa-times');
                var save = _buildTag(TagName.SPAN,'qz-fa qz-fa-se qz-text-green fa fa-floppy-o');

                inputTime.setAttribute('maxlength',5);
                inputTime.setAttribute('placeholder','00:00');

                inputTime.onkeyup = function() {
                    var _in = this.value;

                    this.classList.remove("qz-input-error");

                    if (/^[0-9:]*$/.test(_in) == false)
                        this.classList.add("qz-input-error");

                    if (_in.length == 3)
                        if (/^\d{3}$/.test(_in))
                            this.value = _in[0] + _in[1] + ":" + _in[2];
                };

                cancel.onclick = function() {
                    options.finally();
                    this.parentElement.remove();
                };
                save.onclick = function() {
                    var eDay = this.parentElement.parentElement;
                    var eTime = eDay.querySelector('.js-input-time');

                    var vTime = eTime.value;
                    if (/\d{2}:\d{2}/.test(vTime) == false) {
                        eTime.classList.add("qz-input-error");
                        return;
                    }

                    options.finally();
                    var vDate = eDay.querySelector('[id^=hiddenDiaApont]').value;
                    options.save(vDate, vTime);
                };

                box.appendChild(helpText);
                divInput.appendChild(inputTime);
                box.appendChild(divInput);
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
            },
            _buildHeaderMenuBox = function() {
                var box = _buildTag(TagName.DIV, 'qz-box qz-box-icon qz-box-inline qz-dropdown', Strings('menuIcon'));
                var menu = _buildTag(TagName.DIV, 'qz-dropdown-content qz-menu');

                // hideLastWeekDays
                var hideLastWeekDays = _buildTag(TagName.P, 'qz-text-left', Strings('menuItemHideLastWeekDays'));
                hideLastWeekDays.onclick = function() {
                    var state = Settings.hideLastWeekDays();
                    Settings.hideLastWeekDays(!state);
                    Kairos.reload();
                };
                var state = Settings.hideLastWeekDays() ? 'on' : 'off';
                var enable = _buildTag(TagName.SPAN, 'fa fa-toggle-'+state+' qz-menu-item-icon');
                hideLastWeekDays.appendChild(enable);
                menu.appendChild(hideLastWeekDays);
                // end hideLastWeekDays

                // about
                var about = _buildTag(TagName.P, 'qz-text-left');
                var linkGitHub = _buildTag(TagName.A, 'qz-menu-item-anchor', Strings('menuItemAbout'));
                linkGitHub.href = 'https://github.com/viniciusknob/queiroz.js';
                linkGitHub.target = '_blank';
                about.onclick = function() {
                    linkGitHub.click();
                };
                about.appendChild(linkGitHub);
                menu.appendChild(about);
                // end about

                box.appendChild(menu);
                return box;
            };

        /* Public Functions */

        return {
            style: function() {
                return _buildTag(TagName.STYLE, 'qz-style', Style.CSS);
            },
            header: function() {
                return _buildTag(TagName.DIV, 'qz-box-head');
            },
            buildToggleForDayOff: function(key) {
                return _buildTag(TagName.SPAN, 'fa fa-toggle-'+key+' qz-toggle');
            },
            buildDayOptions: function(TimeOn, MockTime) {
                var dropdown = _buildTag(TagName.DIV, 'qz-dropdown qz-column-menu');
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
                        eDay.appendChild(_buildEditableBox(options));
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
                        eDay.appendChild(_buildEditableBox(options));
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
            dailyGoal: function(dailyGoal, DailyGoal) {
                var box = _buildBox({
                    helpText: 'dailyGoal',
                    humanTime: dailyGoal,
                    contentClass: 'qz-text-black qz-box-with-fa-se'
                });
                var edit = _buildTag(TagName.SPAN,'qz-fa qz-fa-se2 fa fa-edit');

                edit.onclick = function() {
                  var eDay = this.parentElement.parentElement;
                  if (eDay.querySelector('.js-has-edit-box'))
                      return;

                  window.scrollTo(0, 300);
                  setTimeout(function() {
                      var options = {
                          'helpText': Strings('dailyGoal'),
                          'init': DailyGoal.activate,
                          'finally': DailyGoal.deactivate,
                          'save': function(eDate, eTime) {
                              if (DailyGoal.add(eDate, eTime))
                                  Queiroz.reload();
                          }
                      };
                      eDay.appendChild(_buildEditableBox(options));
                  }, 250);
                };

                box.appendChild(edit);
                return box;
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
            buildMockTime: _buildMockTime,
            buildHeaderMenuBox: _buildHeaderMenuBox
        };
    }();

    /* Module Definition */

    Queiroz.module.snippet = Snippet;

})(document, Queiroz);
