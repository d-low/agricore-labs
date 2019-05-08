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

  PICKUP_DAY: {
    'MICROBIAL': {
      'BEFORE 10:30AM': {
        1: {
          'FOUR DAY' : 4
        },
        2: {
          'FOUR DAY' : 5
        },
        3: {
          'FOUR DAY' : 6
        },
        4: {
          'FOUR DAY' : 0
        },
        5: {
          'FOUR DAY' : 1
        }
      }, // end MICROBIAL - BEFORE 10:30AM
      'AFTER 10:30AM': {
        1: {
          'FOUR DAY' : 5
        },
        2: {
          'FOUR DAY' : 6
        },
        3: {
          'FOUR DAY' : 0
        },
        4: {
          'FOUR DAY' : 1
        },
        5: {
          'FOUR DAY' : 4
        }
      }, // end MICROBIAL - AFTER 10:30AM
    }, // end MICROBIAL
    'PESTICIDES': {
      'BEFORE 10:30AM': {
        1: {
          'TWO DAY' : 3,
          'NEXT DAY' : 2,
          'SAME DAY': 1
        },
        2: {
          'TWO DAY' : 4,
          'NEXT DAY' : 3,
          'SAME DAY': 2
        },
        3: {
          'TWO DAY' : 5,
          'NEXT DAY' : 4,
          'SAME DAY': 3
        },
        4: {
          'TWO DAY' : 1,
          'NEXT DAY' : 5,
          'SAME DAY': 4
        },
        5: {
          'TWO DAY' : 2,
          'NEXT DAY' : 1,
          'SAME DAY': 5
        }
      }, // end PESTICIDES - BEFORE 10:30AM
      'AFTER 10:30AM': {
        1: {
          'TWO DAY' : 4,
          'NEXT DAY' : 3,
          'SAME DAY': 2
        },
        2: {
          'TWO DAY' : 5,
          'NEXT DAY' : 4,
          'SAME DAY': 3
        },
        3: {
          'TWO DAY' : 1,
          'NEXT DAY' : 5,
          'SAME DAY': 4
        },
        4: {
          'TWO DAY' : 2,
          'NEXT DAY' : 1,
          'SAME DAY': 5
        },
        5: {
          'TWO DAY' : 3,
          'NEXT DAY' : 2,
          'SAME DAY': 1
        }
      }, // end PESTICIDES - AFTER 10:30AM
    }, // end PESTICIDES
    'POTENCY': {
      'BEFORE 10:30AM': {
        1: {
          'TWO DAY' : 3,
          'NEXT DAY' : 2,
          'SAME DAY': 1
        },
        2: {
          'TWO DAY' : 4,
          'NEXT DAY' : 3,
          'SAME DAY': 2
        },
        3: {
          'TWO DAY' : 5,
          'NEXT DAY' : 4,
          'SAME DAY': 3
        },
        4: {
          'TWO DAY' : 1,
          'NEXT DAY' : 5,
          'SAME DAY': 4
        },
        5: {
          'TWO DAY' : 2,
          'NEXT DAY' : 1,
          'SAME DAY': 5
        }
      }, // end POTENCY - BEFORE 10:30AM
      'AFTER 10:30AM': {
        1: {
          'TWO DAY' : 4,
          'NEXT DAY' : 3,
          'SAME DAY': 2
        },
        2: {
          'TWO DAY' : 5,
          'NEXT DAY' : 4,
          'SAME DAY': 3
        },
        3: {
          'TWO DAY' : 1,
          'NEXT DAY' : 5,
          'SAME DAY': 4
        },
        4: {
          'TWO DAY' : 2,
          'NEXT DAY' : 1,
          'SAME DAY': 5
        },
        5: {
          'TWO DAY' : 3,
          'NEXT DAY' : 2,
          'SAME DAY': 1
        }
      }, // end POTENCY - AFTER 10:30AM

    }, // end POTENCY
    'RESIDUAL': {
      'BEFORE 10:30AM': {
        1: {
          'TWO DAY' : 3,
          'NEXT DAY' : 2
        },
        2: {
          'TWO DAY' : 4,
          'NEXT DAY' : 3
        },
        3: {
          'TWO DAY' : 5,
          'NEXT DAY' : 4
        },
        4: {
          'TWO DAY' : 1,
          'NEXT DAY' : 5
        },
        5: {
          'TWO DAY' : 2,
          'NEXT DAY' : 1
        }
      }, // end RESIDUAL - BEFORE 10:30AM
      'AFTER 10:30AM': {
        1: {
          'TWO DAY' : 4,
          'NEXT DAY' : 3
        },
        2: {
          'TWO DAY' : 5,
          'NEXT DAY' : 4
        },
        3: {
          'TWO DAY' : 1,
          'NEXT DAY' : 5
        },
        4: {
          'TWO DAY' : 2,
          'NEXT DAY' : 1
        },
        5: {
          'TWO DAY' : 3,
          'NEXT DAY' : 2
        }
      }, // end RESIDUAL - AFTER 10:30AM
    } // end RESIDUAL
  }, // end PICKUP_DAY lookup table

  testType: null,
  dropOffDate: null,
  submissionTime: null,
  turnAroundTime: null,

  /**
   * @description Use pickup day look up table to find the day of the week
   * that the test will be ready. If the day of the week that the test will
   * be ready is less than the current day of the week then it'll be ready
   * next week.
   */
  calculate: function() {
    if (!this.canCalculate(true)) {
      return;
    }

    var resultsDate = null;
    var dropOffDayOfWeek = this.dropOffDate.getDay();
    var pickUpDay = this.PICKUP_DAY[this.testType][this.submissionTime][dropOffDayOfWeek][this.turnAroundTime];

    if (pickUpDay < dropOffDayOfWeek) {
      resultsDate = this.getNextDayOfWeek(this.dropOffDate, pickUpDay);
    }
    else {
      resultsDate =  new Date(
        this.dropOffDate.getTime() + ((pickUpDay - dropOffDayOfWeek) * 86400000)
      );
    }

    return resultsDate;
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
    return (this.testType === this.TEST_TYPES.POTENCY || this.testType === this.TEST_TYPES.PESTICIDES);
  },

  /**
   * @see http://codereview.stackexchange.com/questions/33527/find-next-occurring-friday-or-any-dayofweek
   */
  getNextDayOfWeek: function(date, dayOfWeek) {
    var resultDate = new Date(date.getTime());
    resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
    return resultDate;
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

    /*
    var enterActions = jQuery('a[title="ENTER"]').closest('.fusion-fullwidth');
    var enterSeparator = enterActions.prev();
    var enterHeader = enterSeparator.prev();

    this.enter.push(
      enterActions, enterSeparator, enterHeader
    );

    this.enter.forEach(function(el) {
      el.hide();
    });
    */
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

    var newTestType = jQuery(e.target).closest('a.nectar-button').find('span').text();

    this.selectTestType(newTestType);

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

    this.scrollToEl(this.turnAroundTime);
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
    // TODO: Continue here on Wednesday night. Where will the pickup date be
    // displayed? In the Agricor site it is displayed in a modal, but there
    // doesn't appear to be a modal in Botanacor.
    // this.showPickUpDate();
  },

  selectTurnAroundTime: function(newTurnAroundTime) {
    if (calculator.turnAroundTime) {
      this.turnAroundTimeButtons[calculator.turnAroundTime].removeClass('selected');
    }

    this.turnAroundTimeButtons[newTurnAroundTime].addClass('selected');
    calculator.turnAroundTime = newTurnAroundTime;
  },

  showPickUpDate: function() {
    this.enterButton.trigger('click');
  },

  enter_click: function() {
    var header = jQuery('.turn-time p:first span');
    var body = jQuery('.turn-time p:last span');

    try {
      var readyOnDate = calculator.calculate();

      header.html('Your expected turn-time');
      body.html([
        'Your',
        calculator.testType.toLowerCase(),
        'results will be available by end of day on:',
        '<br />',
        '<strong class="pick-up-date">',
          jQuery.datepicker.formatDate('DD MM d, yy', readyOnDate),
        '</strong>'
      ].join(' '));
    }
    catch (exp) {
      header.html('Error calculating turn-time!');
      body.html(exp.message);
    }
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
  }
};

jQuery(document).ready(function() {
  calculatorBehavior.init();
});
