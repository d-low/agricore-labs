(function() {
  var $ = window.$ || jQuery;
  var CBD = 'cbd';
  var THC = 'thc';
  var passed = '#339966';
  var failed = '#ff0000';

  function initElements() {
    return {
      inputs: {
        $labelClaim: null,
        $testResults: [],
      },
      outputs: {
        $mean: null,
        $stdDev: null,
        $relStdDev: null,
        $testResults: [],
        $testResultCopy: null,
        $testResultSuccess: null,
        $testResultFailure: null,
        $testResultSuccessDetails: null,
        $testResultFailureDetails: null,
      },
    };
  }

  function initResults() {
    return {
      mean: undefined,
      percentVariance: undefined,
      relStdDev: undefined,
      stdDev: undefined,
      testResults: [undefined, undefined, undefined, undefined],
    };
  }

  function getValue($el) {
    var value = $el.val();

    if (value && !isNaN(Number(value))) {
      return Number(value);
    }

    return undefined;
  }

  function toTwoSigFigs(num) {
    try {
      if (num === 0) {
        return '0.00';
      }

      var numAsString = num.toString();

      // Positive or negative number with no decimal places
      if (numAsString.match(/^\d+$/) || numAsString.match(/^-\d+$/)) {
        return numAsString + '.00';
      }

      // Postitive or negative number with decimal place
      if (numAsString.match(/^.+\.\d$/)) {
        return numAsString + '0';
      }

      // Positive or negative number with two or more decimal places
      return numAsString.match(/^.+\.\d\d/)[0];
    } catch(exp) {
      return String(num);
    }
  }

  /**
   * @description Scroll to requested element using an easing transition
   * and request animation frame.
   * @param $el The jQuery element on the page to scroll to.
   * @param duration Optional animation duration in seconds
   * @see http://stackoverflow.com/questions/8917921/cross-browser-javascript-not-jquery-scroll-to-top-animation#26808520
   * @see https://github.com/danro/easing-js/blob/master/easing.js
   */
  function scrollToEl($el, duration) {
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

    var $fusionHeaderWrapper = $('.fusion-header-wrapper');
    var scrollTargetY = $el.offset().top;
    var scrollY = window.pageYOffset;

    // TODO: There is an edge case where if we're at the top of the page
    // the header is not yet sticky then the fusion-is-sticky class won't
    // yet be applied so we won't end up scrolling to the properly location
    // because the fusion-is-sticky class will be added after we animate
    // the scroll position here. A good way to work around this would be to
    // check to see if the fusion-is-sticky class is present 100px into the
    // scroll and if so recalculate the scrollTargetY then!

    if ($fusionHeaderWrapper.is('.fusion-is-sticky')) {
      scrollTargetY = scrollTargetY - $('.fusion-header').height();
    }

    scrollTargetY = typeof scrollTargetY === 'undefined' ? 0 : scrollTargetY;
    duration = duration || 0.5;

    // Add animation loop
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

    // Call it once to get started
    tick();
  }

  function HomogeneityCalculator() {
    this.elements = {};
    this.elements[CBD] = initElements();
    this.elements[THC] = initElements();

    this.results = {};
    this.results[CBD] = initResults();
    this.results[THC] = initResults();
  }

  HomogeneityCalculator.prototype.init = function() {
    this.getElements();
    this.applyBehavior();
  };

  HomogeneityCalculator.prototype.getElements = function() {
    var columns = [
      { id: '#thc-column', columnName: THC },
      { id: '#cbd-column', columnName: CBD },
    ];

    columns.forEach(function(element) {
      var $column = $(element.id);
      var column = this.elements[element.columnName];

      column.inputs.$labelClaim = $column.find('.label-claim');

      for (var i = 0; i < 4; i++) {
        column.inputs.$testResults[i] = $column.find('.input-test-results .test-result-' + i);
      }

      var $calculatorResults = $column.find('.calculator-results-table');

      column.outputs.$mean = $calculatorResults.find('.mean');
      column.outputs.$stdDev = $calculatorResults.find('.std-dev');
      column.outputs.$relStdDev = $calculatorResults.find('.rel-std-dev');

      for (var i = 0; i < 4; i++) {
        column.outputs.$testResults[i] = $calculatorResults.find('.test-result-' + i);
      }

      column.outputs.$testResultCopy = $column.find('.test-result-copy');
      column.outputs.$testResultSuccess = $column.find('.test-result-success');
      column.outputs.$testResultFailure = $column.find('.test-result-failure');
      column.outputs.$testResultSuccessDetails = $column.find('.test-result-success-details');
      column.outputs.$testResultFailureDetails = $column.find('.test-result-failure-details');
    }.bind(this));
  };

  HomogeneityCalculator.prototype.applyBehavior = function() {
    var handleChange = function(testType, $el) {
      var didCalculate = this.calculate(testType);

      if (didCalculate) {
        this.displayCalculatorResults(testType);

        var column = this.elements[testType];

        if ($el && $el.get(0) === column.inputs.$testResults[3].get(0)) {
          // Scroll to the test result copy if the value of the last input was changed so that the
          // user can view the test results.
          window.setTimeout(function () {
            scrollToEl(column.outputs.$testResultCopy);
          }, 0);
        }
      } else {
        this.clearCalculatorResults(testType);
      }
    }.bind(this);

    [CBD, THC].forEach(function(testType) {
      var inputs = this.elements[testType].inputs;

      inputs.$labelClaim.on('change', function() { handleChange(testType); });

      inputs.$testResults.forEach(function($testResult) {
        $testResult.on('change', function(e) { handleChange(testType, $(e.target)); });
      });

      // When the tab key is pressed on the last input cancel the event, so that focus doesn't go
      // to the form at the bottom of the page, and trigger a blur event, so that focus is lost and
      // a change is triggered. This works to prevent the focus from jumping to the form at the
      // bottom of the page and _then_ scrolling up to the results.
      inputs.$testResults[3].on('keydown', function(e) {
        if (e.key === 'Tab' || e.keyCode === 9) {
          e.preventDefault();
          $(e.target).blur();
        }
      });
    }.bind(this));
  };

  HomogeneityCalculator.prototype.calculate = function(testType) {
    var didCalculate = false;
    var inputs = this.elements[testType].inputs;

    var labelClaim = getValue(inputs.$labelClaim);
    var testResults = inputs.$testResults.map(function($testResult) {
      return getValue($testResult);
    });

    var haveFourTestResults = testResults.every(function(testResult) {
      return testResult !== undefined;
    });

    if (labelClaim && haveFourTestResults) {
      var sampleSize = testResults.length;

      var mean = testResults.reduce(function(acc, testResult) {
        return acc + testResult;
      }, 0) / sampleSize;

      var stdDev = Math.sqrt(testResults
        .map(function(testResult) {
          return Math.pow(testResult - mean, 2);
        })
        .reduce(function(a, b) {
          return a + b;
        }) / (sampleSize - 1));

      this.results[testType].mean = toTwoSigFigs(mean);
      this.results[testType].stdDev = toTwoSigFigs(stdDev);
      this.results[testType].relStdDev = toTwoSigFigs((this.results[testType].stdDev * 100) / mean)
      this.results[testType].percentVariance = toTwoSigFigs((labelClaim - mean) / labelClaim * 100);

      testResults.forEach(function (testResult, index) {
        this.results[testType].testResults[index] =
          toTwoSigFigs((((testResult - labelClaim) / labelClaim) * 100));
      }.bind(this));

      didCalculate = true;
    }

    return didCalculate;
  };

  HomogeneityCalculator.prototype.displayCalculatorResults = function(testType) {
    var outputs = this.elements[testType].outputs;

    outputs.$mean.text(this.results[testType].mean);
    outputs.$stdDev.text(this.results[testType].stdDev);
    outputs.$relStdDev.text(this.results[testType].relStdDev + '%');

    if (this.results[testType].relStdDev >= 10) {
      outputs.$relStdDev.css('color', failed);
    } else {
      outputs.$relStdDev.css('color', '');
    }

    var failedTestResultsCount = 0;

    this.results[testType].testResults.forEach(function(testResult, index) {
      outputs.$testResults[index].text(testResult + '%');

      if (Math.abs(testResult) > 15) {
        outputs.$testResults[index].css('color', failed);
        failedTestResultsCount += 1;
      } else {
        outputs.$testResults[index].css('color', '');
      }
    });

    outputs.$testResultCopy.show();

    if (failedTestResultsCount > 0 || this.results[testType].relStdDev > 10) {
      outputs.$testResultFailure.show();
      outputs.$testResultFailureDetails.show();
      outputs.$testResultSuccess.hide();
      outputs.$testResultSuccessDetails.hide();
    } else {
      outputs.$testResultFailure.hide();
      outputs.$testResultFailureDetails.hide();
      outputs.$testResultSuccess.show();
      outputs.$testResultSuccessDetails.show();
    }
  };

  HomogeneityCalculator.prototype.clearCalculatorResults = function(testType) {
    var na = '--';
    var outputs = this.elements[testType].outputs;

    outputs.$mean.text(na);
    outputs.$stdDev.css('color', '');
    outputs.$stdDev.text(na);
    outputs.$relStdDev.css('color', '');
    outputs.$relStdDev.text(na);

    outputs.$testResults.forEach(function($testResult) {
      $testResult.text(na);
      $testResult.css('color', '');
    });

    outputs.$testResultCopy.hide();
    outputs.$testResultFailure.hide();
    outputs.$testResultFailureDetails.hide();
    outputs.$testResultSuccess.hide();
    outputs.$testResultSuccessDetails.hide();
  };

  $(document).ready(function() {
    if (window.location.href.match('homogeneity-calculator')) {
      window.HomogeneityCalculator = window.HomogeneityCalculator || new HomogeneityCalculator();
      window.HomogeneityCalculator.init();
    }
  });
})();
