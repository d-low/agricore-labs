function toTwoSigFigs(num) {
  try {
    if (num === 0) {
      return '0.00';
    }

    var numAsString = num.toString();

    if (numAsString.match(/^\d+$/) || numAsString.match(/^-\d+$/)) {
      return numAsString + '.00';
    }

    if (numAsString.match(/^.+\.\d$/)) {
      return numAsString + '0';
    }

    return numAsString.match(/^.+\.\d\d/)[0];
  } catch(exp) {
    return String(num);
  }
}

var tests = [
  { input: -1000.12689890980809, output: '-1000.12' },
  { input: -100, output: '-100.00' },
  { input: -1.12689890980809, output: '-1.12' },
  { input: -1.12345, output: '-1.12' },
  { input: -1.1, output: '-1.10' },
  { input: -1, output: '-1.00' },
  { input: 0, output: '0.00' },
  { input: 1, output: '1.00' },
  { input: 1.12345, output: '1.12' },
  { input: 1.12689890980809, output: '1.12' },
  { input: 100, output: '100.00' },
  { input: 1000.12689890980809, output: '1000.12' },
];

tests.forEach(({ input, output }) => {
  if (toTwoSigFigs(input) !== output) {
    throw new Error(`Expected: toTwoSigFigs(${input}) === ${output}`);
  }
});
