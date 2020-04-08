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
    var handleChange = function(testType) {
      var didCalculate = this.calculate(testType);

      if (didCalculate) {
        this.displayCalculatorResults(testType);
      } else {
        this.clearCalculatorResults(testType);
      }
    }.bind(this);

    [CBD, THC].forEach(function(testType) {
      var inputs = this.elements[testType].inputs;

      inputs.$labelClaim.on('change', function() { handleChange(testType); });
      inputs.$testResults.forEach(function($testResult) {
        $testResult.on('change', function() { handleChange(testType); });
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
      var mean = testResults.reduce(function(acc, testResult) {
        return acc + testResult;
      }, 0) / testResults.length;

      var meanOfSquaredDifferences = testResults.reduce(function(acc, testResult) {
        return acc + Math.pow(testResult - mean, 2);
      }, 0) / testResults.length;

      this.results[testType].mean = mean.toFixed(2);
      this.results[testType].stdDev = Math.sqrt(meanOfSquaredDifferences).toFixed(2);
      this.results[testType].relStdDev = ((this.results[testType].stdDev * 100) / mean).toFixed(2);
      this.results[testType].percentVariance = ((labelClaim - mean) / labelClaim * 100).toFixed(2);

      testResults.forEach(function (testResult, index) {
        this.results[testType].testResults[index] =
          (((testResult - labelClaim) / labelClaim) * 100).toFixed(2);
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

      if (Math.abs(testResult) >= 15) {
        outputs.$testResults[index].css('color', failed);
        failedTestResultsCount += 1;
      } else {
        outputs.$testResults[index].css('color', '');
      }
    });

    outputs.$testResultCopy.show();

    if (failedTestResultsCount > 0 || this.results[testType].relStdDev >= 10) {
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
