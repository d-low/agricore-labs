var calculator = {
  TEST_TYPES: {
    'POTENCY': 'POTENCY',
    'TERPENES': 'TERPENES',
    'SOLVENTS': 'SOLVENTS',
    'MICROBIALS': 'MICROBIALS',
    'WATER ACTIVITY': 'WATER ACTIVITY',
    'PH': 'PH',
    'DENSITY': 'DENSITY',
    'PESTICIDES': 'PESTICIDES',
    'HEAVY METALS': 'HEAVY METALS',
    'MYCOTOXINS': 'MYCOTOXINS'
  },

  SUBMISSION_TIMES: {
    'BEFORE 10:30AM': 'BEFORE 10:30AM',
    'AFTER 10:30AM': 'AFTER 10:30AM'
  },

  TURN_AROUND_TIMES: {
    'STANDARD': 'STANDARD',
    'NEXT DAY': 'NEXT DAY',
    'SAME DAY': 'SAME DAY'
  },

  TEST_DURATION: {
    'POTENCY': {
      'BEFORE 10:30AM': {
        'STANDARD': 4,
        'NEXT DAY': 1,
        'SAME DAY': 0,
      },
      'AFTER 10:30AM': {
        'STANDARD': 5,
        'NEXT DAY': 2,
        'SAME DAY': 1,
      },
    },
    'SOLVENTS': {
      'BEFORE 10:30AM': {
        'STANDARD': 4,
        'NEXT DAY': 1,
        'SAME DAY': 0,
      },
      'AFTER 10:30AM': {
        'STANDARD': 5,
        'NEXT DAY': 2,
        'SAME DAY': 1,
      },
    },
    'WATER ACTIVITY': {
      'BEFORE 10:30AM': {
        'STANDARD': 4,
        'NEXT DAY': 1,
        'SAME DAY': 0,
      },
      'AFTER 10:30AM': {
        'STANDARD': 5,
        'NEXT DAY': 2,
        'SAME DAY': 1,
      },
    },
    'PH': {
      'BEFORE 10:30AM': {
        'STANDARD': 4,
        'NEXT DAY': 1,
        'SAME DAY': 0,
      },
      'AFTER 10:30AM': {
        'STANDARD': 5,
        'NEXT DAY': 2,
        'SAME DAY': 1,
      },
    },
    'DENSITY': {
      'BEFORE 10:30AM': {
        'STANDARD': 4,
        'NEXT DAY': 1,
        'SAME DAY': 0,
      },
      'AFTER 10:30AM': {
        'STANDARD': 5,
        'NEXT DAY': 2,
        'SAME DAY': 1,
      },
    },
    'TERPENES': {
      'BEFORE 10:30AM': {
        'STANDARD': 5,
      },
      'AFTER 10:30AM': {
        'STANDARD': 6,
      },
    },
    'MICROBIALS': {
      'BEFORE 10:30AM': {
        'STANDARD': 4,
      },
      'AFTER 10:30AM': {
        'STANDARD': 5,
      },
    },
    'PESTICIDES': {
      'BEFORE 10:30AM': {
        'STANDARD': 5,
      },
      'AFTER 10:30AM': {
        'STANDARD': 6,
      },
    },
    'HEAVY METALS': {
      'BEFORE 10:30AM': {
        'STANDARD': 5,
      },
      'AFTER 10:30AM': {
        'STANDARD': 6,
      },
    },
  },

  testType: null,
  dropOffDate: null,
  submissionTime: null,
  turnAroundTime: null,

  calculate: function() {
    if (!this.canCalculate(true)) {
      return;
    }

    var msPerDay = 24 * 60 * 60 * 1000;
    var year = this.dropOffDate.getFullYear();
    var month = this.dropOffDate.getMonth();
    var day = this.dropOffDate.getDate();

    var dropOffDayNormalized = new Date(year, month, day);
    var testDuration = this.TEST_DURATION[this.testType][this.submissionTime][this.turnAroundTime];
    var resultsDate = new Date(dropOffDayNormalized.getTime());

    if (this.testType === this.TEST_TYPES.MICROBIALS) {
      // Microbial tests special case

      var testDurations = [
        undefined, // No drop off on Sunday
        { 'BEFORE 10:30AM': 4, 'AFTER 10:30AM': 5 },
        { 'BEFORE 10:30AM': 4, 'AFTER 10:30AM': 5 },
        { 'BEFORE 10:30AM': 4, 'AFTER 10:30AM': 5 },
        { 'BEFORE 10:30AM': 4, 'AFTER 10:30AM': 5 },
        { 'BEFORE 10:30AM': 4, 'AFTER 10:30AM': 7 },
        undefined // No drop off on Saturday
      ];

      var dayOfWeek = dropOffDayNormalized.getDay();
      var msPerTest = testDurations[dayOfWeek][this.submissionTime] * msPerDay;
      resultsDate = new Date(resultsDate.getTime() + msPerTest);

      return resultsDate;
    } else {
      while (testDuration) {
        resultsDate = new Date(resultsDate.getTime() + msPerDay);

        if (resultsDate.getDay() !== 0 && resultsDate.getDay() !== 6) {
          // All other tests do not occur over the weekend so do not decrement the
          // test duration if the result date is a Saturday or Sunday
          testDuration = testDuration - 1;
        }
      }

      return this.getNextDayOfWeek(resultsDate);
    }
  },

  canCalculate: function(throwError) {
    var canCalculate = true;
    var errorMesg = '';

    if (!this.testType ||
        Object.keys(this.TEST_TYPES).indexOf(this.testType) === -1) {
      errorMesg = 'Please specify a test type.';
    }
    else if (!this.dropOffDate ||
             this.dropOffDate instanceof Date === false) {
      errorMesg = 'Please specify a drop off date.';
    }
    else if (this.submissionTime &&
             Object.keys(
              this.SUBMISSION_TIMES
             ).indexOf(this.submissionTime) === -1) {
      errorMesg = 'Please specify a submission time.';
    }
    else if (this.turnAroundTime &&
             Object.keys(
              this.TURN_AROUND_TIMES
             ).indexOf(this.turnAroundTime) === -1) {
      errorMesg = 'Please specify a turn around time.';
    }

    if (errorMesg) {
      canCalculate = false;
    }

    if (errorMesg && throwError) {
      throw new Error(errorMesg);
    }

    return canCalculate;
  },

  canSelectTurnAroundTime: function() {
    switch (this.testType) {
      case this.TEST_TYPES['HEAVY METALS']:
      case this.TEST_TYPES.MICROBIALS:
      case this.TEST_TYPES.PESTICIDES:
      case this.TEST_TYPES.TERPENES:
        return false;

      default:
        return true;
    }
  },

  getNextDayOfWeek: function(resultsDate) {
    if (resultsDate.getDay() === 6) {
      return new Date(resultsDate.getTime() + (2 * 24 * 60 * 60 * 1000));
    } else if (resultsDate.getDay() === 0) {
      return new Date(resultsDate.getTime() + (1 * 24 * 60 * 60 * 1000));
    }
    return resultsDate;
  }
};

/**
 * @description Control UI/UX depending on which type of test is selected.
 */
var calculatorBehavior = {

  // ----------------------------------------------------------------------
  // Data Members
  // ----------------------------------------------------------------------

  dropOffDate: null,
  dropOffTime: null,
  turnAroundTime: [],
  enter: [],
  testTypeButtons: {},
  submissionTimeButtons: {},
  turnAroundTimeButtons: {},
  enterButton: null,


  // ----------------------------------------------------------------------
  // Initialization Methods
  // ----------------------------------------------------------------------

  init: function() {
    if (window.location.href.match('turn-time-calculator')) {
      this.addStyles();
      this.bindEvents();
      this.getStepElements();
    }
  },

  /**
   * @description Add styles dynamically so that only one JS file needs to
   * be uploaded to the server to support the custom UI elements.
   */
  addStyles: function() {
    jQuery('body').append([
      '<style id="calculator-styles" type="text/css">',
        '.nectar-button.selected { ',
          'background-color: #00ab8e !important;',
          'border-color: #00ab8e !important;',
        '}',
        '.nectar-button.selected span {',
          'color: white;',
        '}',
        '.drop-off-date {',
          'height: max-content;',
        '}',
        '.drop-off-date .ui-datepicker {',
          'background-color: white;',
          'border-radius: 0;',
          'margin: 0 auto;',
          'min-width: 320px;',
          'padding: 0;',
          'vertical-align: top;',
          'width: 33%;',
        '}',
        '.drop-off-date .ui-widget-header {',
          'background-color: #00ab8e;',
          'background-image: none;',
          'border: 0 none;',
          'border-radius: 0;',
          'color: white;',
          'padding: 18px 13px 18px 13px;',
        '}',
        '.drop-off-date .ui-widget-header .ui-state-hover {',
          'background-color: inherit;',
          'background-image: none;',
          'border: 0 none;',
          'cursor: pointer;',
          'font-weight: normal;',
        '}',
        '.drop-off-date .ui-widget-header a {',
          'color: inherit;',
        '}',
        '.drop-off-date .ui-datepicker .ui-datepicker-prev,',
        '.drop-off-date .ui-datepicker .ui-datepicker-next {',
          'height: 92%;',
        '}',
        '.drop-off-date .ui-widget-header .ui-icon {',
          'background-image: none;',
          'font-size: 1.4em;',
          'height: 1.8em;',
          'margin-top: -1em;',
          'text-indent: unset;',
          'width: 1.8em;',
        '}',
        '.drop-off-date .ui-datepicker table {',
          'background-color: inherit;',
        '}',
        '.drop-off-date .ui-datepicker th {',
          'color: #797d86;',
        '}',
        '.drop-off-date .ui-datepicker td span, ',
        '.drop-off-date .ui-datepicker td a {',
          'text-align: center;',
        '}',
        '.drop-off-date .ui-widget-content .ui-state-default {',
          'background-color: inherit;',
          'background-image: none;',
          'color: #a4aaaa;',
        '}',
        '.drop-off-date .ui-widget-content .ui-state-active {',
          'background-color: #00ab8e;',
          'border-radius: 50%;',
          'border-color: #00ab8e;',
          'color: white;',
        '}',
        '.drop-off-date .ui-widget-content .ui-state-hover {',
          'border: 0 none;',
        '}',
        // '.pick-up-date {',
        //   'color: #1a80b6;',
        //   'font-size: 26px;',
        //   'font-weight: bold;',
        // '}',
      '</style>'
    ].join(' '));
  },

  /**
   * @description Get test type buttons and bind onclick handlers
   */
  bindEvents: function() {
    for (var testType in calculator.TEST_TYPES) {
      var span = jQuery('a.nectar-button span:contains(' + testType + ')')
      this.testTypeButtons[testType] = span.closest('a.nectar-button');

      this.testTypeButtons[testType].on(
        'click',
        this.testTypeButton_click.bind(this)
      );
    }

    jQuery('#drop-off-date').datepicker({
      beforeShowDay: jQuery.datepicker.noWeekends,
      nextText: '&rsaquo;',
      onSelect: this.dropOffDate_select.bind(this),
      prevText: '&lsaquo;',
      showOtherMonths: true,
      selectOtherMonths: true
    });

    for (var submissionTime in calculator.SUBMISSION_TIMES) {
      var selector = 'a.nectar-button span:contains("' + submissionTime + ' (MST)")';
      this.submissionTimeButtons[submissionTime] = jQuery(selector).closest('a');

      this.submissionTimeButtons[submissionTime].on(
        'click',
        this.submissionTimeButton_click.bind(this)
      );
    }

    for (var turnAroundTime in calculator.TURN_AROUND_TIMES) {
      var selector = 'a.nectar-button span:contains("' + turnAroundTime + '")';
      this.turnAroundTimeButtons[turnAroundTime] = jQuery(selector).closest('a');

      this.turnAroundTimeButtons[turnAroundTime].on(
        'click',
        this.turnAroundTimeButton_click.bind(this)
      );
    }

    /*
    this.enterButton = jQuery('a[title="ENTER"]');
    this.enterButton.on('click', jQuery.proxy(this.enter_click, this));
    */
  },

  /**
   * @description Get the drop off date, drop off time and turn around time
   * elements
   */
  getStepElements: function() {
    this.dropOffDate = jQuery('#drop-off-date').closest('.wpb_wrapper');
    this.dropOffTime = jQuery('h2:contains("Step 3")').closest('.wpb_wrapper');
    this.turnAroundTime = jQuery('h2:contains("Step 4")').closest('.wpb_wrapper');
  },


  // ----------------------------------------------------------------------
  // Event Handlers
  // ----------------------------------------------------------------------

  /**
   * @description When selecting a test type we first unselect the
   * previously selected test type, select the new one, and scroll to the
   * next step.
   */
  testTypeButton_click: function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var errorMesg;
    var newTestType = jQuery(e.target).closest('a.nectar-button').find('span').text();

    switch (newTestType) {
      case calculator.TEST_TYPES.MYCOTOXINS:
        errorMesg = 'Mycotoxin Testing is coming soon.';
        break;

      default:
        break;
    }

    if (errorMesg) {
      var body =  '<p class="resultsDialog__bodyCopy">' + errorMesg + '</p>';
      this.showDialog(body);
      return;
    }

    this.selectTestType(newTestType);
    this.toggleSteps();
    this.scrollToEl(this.dropOffDate);
  },

  /**
   * @description Unselect the previously selected test type and select the
   * new one.
   */
  selectTestType: function(newTestType) {
    if (calculator.testType) {
      this.testTypeButtons[calculator.testType].removeClass('selected');
    }

    this.testTypeButtons[newTestType].addClass('selected');
    calculator.testType = newTestType;
  },

  /**
   * Show/hide step 4 depending on the selected test type.
   */
  toggleSteps: function() {
    if (calculator.canSelectTurnAroundTime()) {
      this.turnAroundTime.show();
    }
    else {
      this.turnAroundTime.hide();
      calculator.turnAroundTime = calculator.TURN_AROUND_TIMES.STANDARD;
    }
  },

  dropOffDate_select: function() {
    calculator.dropOffDate = jQuery('#drop-off-date').datepicker('getDate');
    this.scrollToEl(this.dropOffTime);
  },

  submissionTimeButton_click: function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var newSubmissionTime = jQuery(e.target)
      .closest('.nectar-button')
      .find('span')
      .text().replace(' (MST)', '');

    this.selectSubmissionTime(newSubmissionTime);

    if (calculator.canSelectTurnAroundTime()) {
      this.scrollToEl(this.turnAroundTime);
    }
    else {
      this.showPickUpDate();
    }
  },

  selectSubmissionTime: function(newSubmissionTime) {
    if (calculator.submissionTime) {
      this.submissionTimeButtons[calculator.submissionTime].removeClass('selected');
    }

    this.submissionTimeButtons[newSubmissionTime].addClass('selected');
    calculator.submissionTime = newSubmissionTime;
  },

  turnAroundTimeButton_click: function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var newTurnAroundTime = jQuery(e.target).closest('.nectar-button').find('span').text();

    this.selectTurnAroundTime(newTurnAroundTime);

    this.showPickUpDate();
  },

  selectTurnAroundTime: function(newTurnAroundTime) {
    if (calculator.turnAroundTime) {
      this.turnAroundTimeButtons[calculator.turnAroundTime].removeClass('selected');
    }

    this.turnAroundTimeButtons[newTurnAroundTime].addClass('selected');
    calculator.turnAroundTime = newTurnAroundTime;
  },

  showPickUpDate: function() {
    var body = '';

    try {
      var readyOnDate = calculator.calculate();

      body = [
        '<p class="resultsDialog__bodyCopy resultsDialog__bodyLargeCopy">Your expected turn-time</p>',
        '<p class="resultsDialog__bodyCopy">',
          'Your ' + calculator.testType.toLowerCase() + ' results will be available by end of day on:',
          '<br />',
          '<strong class="resultsDialog__bodyStrong">',
            jQuery.datepicker.formatDate('DD MM d, yy', readyOnDate),
          '</strong>',
        '</p>',
      ].join('');
    }
    catch (exp) {
      body = [
        '<p class="resultsDialog__bodyCopy resultsDialog__bodyLargeCopy">',
          'Error calculating turn-time',
        '</p>',
        '<p class="resultsDialog__bodyCopy">',
          exp.message,
        '</p>'
      ].join('');
    }

    this.showDialog(body);
  },


  // ----------------------------------------------------------------------
  // Miscellaneous Methods
  // ----------------------------------------------------------------------

  /**
   * @description Scroll to requested element using an easing transition
   * and request animation frame.
   * @param el The element on the page to scroll to.
   * @param duration Optional animation duration in seconds
   * @see http://stackoverflow.com/questions/8917921/cross-browser-javascript-not-jquery-scroll-to-top-animation#26808520
   * @see https://github.com/danro/easing-js/blob/master/easing.js
   */
  scrollToEl: function(el, duration) {
    var currentTime = 0;
    var easingEquations = {
      easeOutSine: function(pos) {
        return Math.sin(pos * (Math.PI / 2));
      },
      easeInOutSine: function(pos) {
        return (-0.5 * (Math.cos(Math.PI * pos) - 1));
      },
      easeInOutQuint: function(pos) {
        if ((pos /= 0.5) < 1) {
          return 0.5 * Math.pow(pos, 5);
        }

        return 0.5 * (Math.pow((pos - 2), 5) + 2);
      }
    };

    var headerOuterHeight = jQuery('#header-outer').outerHeight();
    var scrollTargetY = el.offset().top - headerOuterHeight;
    var scrollY = window.pageYOffset;

    scrollTargetY = typeof scrollTargetY === 'undefined' ? 0 : scrollTargetY;
    duration = duration || 0.5;

    // add animation loop
    function tick() {
      currentTime += 1 / 60;

      var p = currentTime / duration;
      var t = easingEquations['easeOutSine'](p);

      if (p < 1) {
        window.requestAnimationFrame(tick);
        window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
      }
      else {
        window.scrollTo(0, scrollTargetY);
      }
    }

    // call it once to get started
    tick();
  },

  showDialog(body) {
    var $dialog = jQuery([
      '<div class="resultsDialog slideUp">',
        '<header class="resultsDialog__header">',
          '<button class="resultsDialog__headerCloseButton">x</button>',
        '</header>',
        '<div class="resultsDialog__body">' + body + '</div>',
      '</div>',
    ].join(''));

    var $dialogContainer = jQuery('<div class="resultsDialogContainer fadeOut"></div>');
    $dialogContainer.append($dialog);

    jQuery('body').append($dialogContainer);

    function closeResultsDialog(e) {
      var $target = jQuery(e.target);

      if (!$target.hasClass('resultsDialog__headerCloseButton') &&
          !$target.hasClass('resultsDialogContainer')) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      jQuery('html').removeClass('noscroll');
      jQuery('body').removeClass('noscroll');

      $dialog.addClass('slideUp');

      window.setTimeout(function() {
        $dialogContainer.addClass('fadeOut');
      }, 500);

      window.setTimeout(function() {
        $dialogContainer.remove();
      }, 750);
    }

    // Close the dialog when clicking on the button or smoke
    jQuery('.resultsDialog__headerCloseButton').one('click', closeResultsDialog);
    jQuery($dialogContainer).one('click', closeResultsDialog);

    // Show the dialog
    window.setTimeout(function() {
      jQuery('html').addClass('noscroll');
      jQuery('body').addClass('noscroll');

      $dialogContainer.removeClass('fadeOut');

      window.setTimeout(function() {
        $dialog.removeClass('slideUp');
      }, 250);
    }, 0);
  }
};

jQuery(document).ready(function() {
  calculatorBehavior.init();
});
