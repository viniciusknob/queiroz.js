
/*!
 * Queiroz.js: snippet.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(window, document, Queiroz) {

    /* Modules */

    var
        mod      = Queiroz.module,
        Settings = mod.settings,
        Kairos   = mod.kairos, // TODO remove, snippet should to create elements only
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
                var helpText = _buildTag(TagName.DIV, 'qz-help-text', Strings(options.helpText));
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
                var enable = _buildTag(TagName.SPAN, 'fa fa-toggle-'+state+' qz-menu-item-icon-rg');
                hideLastWeekDays.appendChild(enable);
                menu.appendChild(hideLastWeekDays);
                // end hideLastWeekDays

                // support
                var itemSupport = _buildTag(TagName.P, 'qz-text-left');
                var linkSupport = _buildTag(TagName.A, 'qz-menu-item-anchor');
                linkSupport.href = 'https://github.com/viniciusknob/queiroz.js/blob/master/SUPPORT.md'; // TODO settings?
                linkSupport.target = '_blank';
                var iconSupport = _buildTag(TagName.SPAN, 'fa fa-heart qz-menu-item-icon');
                var labelSupport = _buildTag(TagName.SPAN, '', Strings('menuItemSupport'));
                itemSupport.appendChild(iconSupport);
                itemSupport.appendChild(labelSupport);
                linkSupport.appendChild(itemSupport);
                menu.appendChild(linkSupport);
                // end support

                // about
                var itemAbout = _buildTag(TagName.P, 'qz-text-left');
                var linkGitHub = _buildTag(TagName.A, 'qz-menu-item-anchor');
                linkGitHub.href = 'https://github.com/viniciusknob/queiroz.js'; // TODO settings?
                linkGitHub.target = '_blank';
                var labelAbout = _buildTag(TagName.SPAN, '', Strings('menuItemAbout'));
                itemAbout.appendChild(labelAbout);
                linkGitHub.appendChild(itemAbout);
                menu.appendChild(linkGitHub);
                // end about

                box.appendChild(menu);
                return box;
            },
            _buildReportTable = function(month) {
                var table = _buildTag(TagName.TABLE, 'qz-table');
                
                var thead = _buildTag(TagName.THEAD);
                var trhead = _buildTag(TagName.TR);
                var thDate = _buildTag(TagName.TH);
                var thWorked = _buildTag(TagName.TH);

                thDate.textContent = 'Data';
                thWorked.textContent = 'Realizado';
                
                trhead.appendChild(thDate);
                trhead.appendChild(thWorked);
                
                thead.appendChild(trhead);
                table.appendChild(thead);
                
                var tbody = _buildTag(TagName.TBODY);
                
                var options = {weekday:'short', day: '2-digit', month: 'short', year: 'numeric'};

                month.weeks.forEach(week => {
                    week.days.forEach(day => {
                        var tr = _buildTag(TagName.TR);

                        if (day.periods.length === 0)
                            tr.classList.add('qz-text-grey');

                        if (day.off)
                            tr.classList.add('qz-text-line-through');

                        var tdDate = _buildTag(TagName.TD);
                        var tdWorked = _buildTag(TagName.TD);
    
                        tdDate.textContent = day.date.toLocaleDateString('pt-BR', options).replace(/\./g,'');
                        tdWorked.textContent = day.worked;
                        
                        tr.appendChild(tdDate);
                        tr.appendChild(tdWorked);
                        tbody.appendChild(tr);
                    });

                    // realizado na semana
                    var tr = _buildTag(TagName.TR, 'qz-text-bold');
                    var tdDate = _buildTag(TagName.TD);
                    var tdWorked = _buildTag(TagName.TD);

                    tdDate.textContent = 'Realizado na Semana';
                    tdWorked.textContent = week.worked;
                    
                    tr.appendChild(tdDate);
                    tr.appendChild(tdWorked);
                    tbody.appendChild(tr);

                    // saldo da semana
                    tr = _buildTag(TagName.TR, 'qz-text-bold');
                    tdDate = _buildTag(TagName.TD);
                    tdWorked = _buildTag(TagName.TD);

                    tdDate.textContent = 'Saldo da Semana';
                    tdWorked.textContent = week.weeklyBalance;
                    
                    tr.appendChild(tdDate);
                    tr.appendChild(tdWorked);
                    tbody.appendChild(tr);

                    // blank line
                    tr = _buildTag(TagName.TR);
                    tdDate = _buildTag(TagName.TD);
                    tdWorked = _buildTag(TagName.TD);

                    tdDate.textContent = '';
                    tdWorked.textContent = '-';
                    
                    tr.appendChild(tdDate);
                    tr.appendChild(tdWorked);
                    tbody.appendChild(tr);
                });

                // realizado no mês
                var tr = _buildTag(TagName.TR, 'qz-text-bold');
                var tdDate = _buildTag(TagName.TD);
                var tdWorked = _buildTag(TagName.TD);

                tdDate.textContent = 'Realizado no Mês';
                tdWorked.textContent = month.worked;
                
                tr.appendChild(tdDate);
                tr.appendChild(tdWorked);
                tbody.appendChild(tr);
                
                table.appendChild(tbody);
                return table;
            };

        /* Public Functions */

        return {
            style: function() {
                return _buildTag(TagName.STYLE, 'qz-style', Style.CSS);
            },
            header: function() {
                return _buildTag(TagName.DIV, 'qz-box-head');
            },
            periodHeader: function() {
                return _buildTag(TagName.DIV, 'qz-box-period');
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
                            'helpText': 'timeOn',
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
                            'helpText': 'mockTime',
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
            buildIconRefreshModal: function() {
                return _buildTag(TagName.SPAN,'qz-fa qz-fa-sw2 fa fa-refresh qz-cursor-pointer');
            },
            buildIconOpenModal: function() {
                return _buildTag(TagName.SPAN,'qz-fa qz-fa-se2 fa fa-external-link qz-cursor-pointer');
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
            headerMonthLaborTime: function() {
                return _buildBox({
                    helpText: 'loadingMonth',
                    humanTime: '',
                    contentClass: 'fa fa-spinner fa-spin',
                    inlineText: true
                });
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
                var edit = _buildTag(TagName.SPAN,'qz-fa qz-fa-se3 fa fa-edit');

                edit.onclick = function() {
                  var eDay = this.parentElement.parentElement;
                  if (eDay.querySelector('.js-has-edit-box'))
                      return;

                  window.scrollTo(0, 300);
                  setTimeout(function() {
                      var options = {
                          'helpText': 'dailyGoal',
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
            buildHeaderMenuBox: _buildHeaderMenuBox,
            buildReportTable: _buildReportTable
        };
    }();

    /* Module Definition */

    Queiroz.module.snippet = Snippet;

})(window, document, window.Queiroz);
