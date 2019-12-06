
/*!
 * Queiroz.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(localStorage, Queiroz) {

    /* Class Definition */

    var Settings = function() {

        /* Variables and Constants */

        var
            NAME = 'settings',
            DEFAULT = JSON.parse('__settings__'),
            KEY = {
                hideLastWeekDays: 'hideLastWeekDays'
            },
            cache = {};

        /* Private Functions */

        var
            _persistCache = function() {
                localStorage.setItem(NAME, JSON.stringify(cache));
            },
            _hideLastWeekDays = function(enable) {
                if (typeof enable === 'boolean') {
                    cache[KEY.hideLastWeekDays] = enable;
                    _persistCache();
                    return;
                }

                var value = cache[KEY.hideLastWeekDays];
                if (typeof value === 'boolean')
                    return cache[KEY.hideLastWeekDays];

                return DEFAULT._mutable_.hideLastWeekDays;
            },
            _isWorkDay = function(date) {
                var day = date.getDay();
                return DEFAULT._static_.dailyGoalMinutes[day] > 0;
            };


        // Initialize cache
        if (localStorage.hasItem(NAME)) {
            cache = JSON.parse(localStorage.getItem(NAME));
        }

        /* Public API */

        return {
            USERSCRIPT_DELAY: DEFAULT._static_.userscriptDelay,
            MAX_CONSECUTIVE_MINUTES: DEFAULT._static_.maxConsecutiveMinutes,
            MAX_DAILY_MINUTES: DEFAULT._static_.maxDailyMinutes,
            DAILY_GOAL_MINUTES: DEFAULT._static_.dailyGoalMinutes,
            INITIAL_WEEKDAY: DEFAULT._static_.initialWeekday,
            GA_TRACKING_ID: DEFAULT._static_.gaTrackingId,
            QZ_KEEPALIVE: DEFAULT._static_.qzKeepalive,
            KS_KEEPALIVE: DEFAULT._static_.ksKeepalive,
            NOTICE_RANGE_MINUTES: DEFAULT._static_.noticeRangeMinutes,
            NOTICE_ICON: DEFAULT._static_.notice_icon,
            hideLastWeekDays: _hideLastWeekDays,
            isWorkDay: _isWorkDay
        };

    }();

    /* Module Definition */

    Queiroz.module.settings = Settings;

})(localStorage, window.Queiroz);
