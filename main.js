let Variables = {
  maxNumber: 1000000, // Maximum number allowed for calculations
  maxTerms: 10, // Maximum number of terms in an expression
  maxExponent: 10 // Maximum exponent allowed
};

// GCF, LCM, Factors, and Prime Factorization
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function getFactors(num) {
  let factors = [];
  for (let i = 1; i <= num; i++) {
    if (num % i === 0) {
      factors.push(i);
    }
  }
  return factors;
}

function getPrimeFactors(num) {
  let factors = [];
  let divisor = 2;
  while (num > 1) {
    if (num % divisor === 0) {
      factors.push(divisor);
      num /= divisor;
    } else {
      divisor++;
    }
  }
  return factors;
}

window.calculateGCF = function() {
  const num1 = parseInt(document.getElementById('num1').value);
  const num2 = parseInt(document.getElementById('num2').value);
  if (isNaN(num1) || isNaN(num2) || num1 > Variables.maxNumber || num2 > Variables.maxNumber) {
    document.getElementById('result1').innerText = "Please enter valid numbers (max " + Variables.maxNumber + ").";
    return;
  }
  const result = gcd(num1, num2);
  document.getElementById('result1').innerText = `GCF of ${num1} and ${num2} is ${result}`;
};

window.calculateLCM = function() {
  const num1 = parseInt(document.getElementById('num1').value);
  const num2 = parseInt(document.getElementById('num2').value);
  if (isNaN(num1) || isNaN(num2) || num1 > Variables.maxNumber || num2 > Variables.maxNumber) {
    document.getElementById('result1').innerText = "Please enter valid numbers (max " + Variables.maxNumber + ").";
    return;
  }
  const result = lcm(num1, num2);
  document.getElementById('result1').innerText = `LCM of ${num1} and ${num2} is ${result}`;
};

window.calculateFactors = function() {
  const num = parseInt(document.getElementById('num1').value);
  if (isNaN(num) || num > Variables.maxNumber) {
    document.getElementById('result1').innerText = "Please enter a valid number (max " + Variables.maxNumber + ").";
    return;
  }
  const factors = getFactors(num);
  document.getElementById('result1').innerText = `Factors of ${num} are: ${factors.join(', ')}`;
};

window.calculatePrimeFactorization = function() {
  const num = parseInt(document.getElementById('num1').value);
  if (isNaN(num) || num > Variables.maxNumber) {
    document.getElementById('result1').innerText = "Please enter a valid number (max " + Variables.maxNumber + ").";
    return;
  }
  const primeFactors = getPrimeFactors(num);
  document.getElementById('result1').innerText = `Prime factorization of ${num} is: ${primeFactors.join(' × ')}`;
};

function simplifyExpr(expr) {
  expr = expr.replace(/\s+/g, '');
  // simplify equations. finally fixed this after procrastinating for MONTHS lmfao
  const terms = expr.match(/[+-]?[0-9]*[a-zA-Z]?(?:\^[0-9]+)?/g).filter(Boolean);
  const simplified = {};
  
  terms.forEach(term => {
    // Updated regex to capture coefficient, variable, and exponent
    const match = term.match(/([+-]?[0-9]*)([a-zA-Z]?)(?:\^([0-9]+))?/);
    let coefficient = match[1];
    
    // Better coefficient handling
    if (coefficient === '') coefficient = '1';
    else if (coefficient === '+') coefficient = '1';
    else if (coefficient === '-') coefficient = '-1';
    
    coefficient = parseInt(coefficient);
    
    const variable = match[2];
    const exponent = match[3] ? match[3] : (variable ? '1' : '0');
    const key = variable + (exponent !== '1' ? '^' + exponent : '');
    
    if (key in simplified) {
      simplified[key] += coefficient;
    } else {
      simplified[key] = coefficient;
    }
  });
  
  // Better output formatting
  return Object.entries(simplified)
    .filter(([key, coefficient]) => coefficient !== 0)
    .map(([key, coefficient]) => {
      if (key === '') return coefficient.toString();
      if (coefficient === 1) return key;
      if (coefficient === -1) return '-' + key;
      return coefficient + key;
    })
    .join(' + ')
    .replace(/\+ -/g, '- ') || '0';
}

function evaluateExpr(expr) {
  return eval(expr);
}

window.simplifyExpression = function() {
  const expr = document.getElementById('expression').value;
  const simplified = simplifyExpr(expr);
  document.getElementById('result2').innerText = `Simplified expression: ${simplified}`;
};

window.evaluateExpression = function() {
  const expr = document.getElementById('expression').value;
  try {
    const result = evaluateExpr(expr);
    document.getElementById('result2').innerText = `Evaluated result: ${result}`;
  } catch (error) {
    document.getElementById('result2').innerText = "Invalid expression";
  }
};

// Exponents and Roots
window.calculatePower = function() {
  const base = parseFloat(document.getElementById('base').value);
  const exponent = parseInt(document.getElementById('exponent').value);
  if (isNaN(base) || isNaN(exponent) || exponent > Variables.maxExponent) {
    document.getElementById('result3').innerText = "Please enter valid numbers (max exponent " + Variables.maxExponent + ").";
    return;
  }
  const result = Math.pow(base, exponent);
  document.getElementById('result3').innerText = `${base}^${exponent} = ${result}`;
};

window.calculateRoot = function() {
  const base = parseFloat(document.getElementById('base').value);
  const root = parseInt(document.getElementById('exponent').value);
  if (isNaN(base) || isNaN(root) || root > Variables.maxExponent) {
    document.getElementById('result3').innerText = "Please enter valid numbers (max root " + Variables.maxExponent + ").";
    return;
  }
  const result = Math.pow(base, 1 / root);
  document.getElementById('result3').innerText = `${root}th root of ${base} = ${result}`;
};

// Radicals functions
function findSquareRoot(number) {
  return Math.sqrt(number);
}

function simplifyRadical(number) {
  // Find the largest perfect square factor
  let coefficient = 1;
  let radicand = number;
  
  for (let i = 2; i*i <= number; i++) {
    while (radicand % (i*i) === 0) {
      coefficient *= i;
      radicand /= (i*i);
    }
  }
  
  return { coefficient, radicand };
}

function multiplyRadicals(a, b) {
  return simplifyRadical(a * b);
}

function addSubtractRadicals(a, b, operation) {
  const simplifiedA = simplifyRadical(a);
  const simplifiedB = simplifyRadical(b);
  
  if (simplifiedA.radicand === simplifiedB.radicand) {
    const newCoefficient = operation === 'add' 
      ? simplifiedA.coefficient + simplifiedB.coefficient 
      : simplifiedA.coefficient - simplifiedB.coefficient;
    
    return { 
      coefficient: newCoefficient, 
      radicand: simplifiedA.radicand,
      canCombine: true 
    };
  } else {
    return {
      a: simplifiedA,
      b: simplifiedB,
      canCombine: false
    };
  }
}

function divideRadicals(a, b) {
  if (b === 0) return "Cannot divide by zero";
  return simplifyRadical(a / b);
}

window.calculateRadicals = function() {
  const radical1 = parseFloat(document.getElementById('radical1').value);
  const radical2 = parseFloat(document.getElementById('radical2').value);
  const operation = document.getElementById('radicalOperation').value;
  const resultElement = document.getElementById('result4');
  
  if (isNaN(radical1)) {
    resultElement.innerText = "Please enter a valid number for the first radical";
    return;
  }
  
  let result;
  switch (operation) {
    case 'squareRoot':
      if (radical1 < 0) {
        resultElement.innerText = "Cannot calculate square root of a negative number";
        return;
      }
      result = findSquareRoot(radical1);
      resultElement.innerText = `Square root of ${radical1} = ${result}`;
      break;
      
    case 'simplify':
      if (radical1 < 0) {
        resultElement.innerText = "Cannot simplify radical of a negative number";
        return;
      }
      result = simplifyRadical(radical1);
      if (result.coefficient === 1) {
        resultElement.innerText = `√${radical1} = √${result.radicand}`;
      } else {
        resultElement.innerText = `√${radical1} = ${result.coefficient}√${result.radicand}`;
      }
      break;
      
    case 'multiply':
      if (isNaN(radical2)) {
        resultElement.innerText = "Please enter a valid number for the second radical";
        return;
      }
      if (radical1 < 0 || radical2 < 0) {
        resultElement.innerText = "Cannot calculate with negative numbers";
        return;
      }
      result = multiplyRadicals(radical1, radical2);
      resultElement.innerText = `√${radical1} × √${radical2} = √${radical1 * radical2} = ${result.coefficient}√${result.radicand}`;
      break;
      
    case 'add':
    case 'subtract':
      if (isNaN(radical2)) {
        resultElement.innerText = "Please enter a valid number for the second radical";
        return;
      }
      if (radical1 < 0 || radical2 < 0) {
        resultElement.innerText = "Cannot calculate with negative numbers";
        return;
      }
      result = addSubtractRadicals(radical1, radical2, operation);
      const opSymbol = operation === 'add' ? '+' : '-';
      if (result.canCombine) {
        if (result.coefficient === 0) {
          resultElement.innerText = `√${radical1} ${opSymbol} √${radical2} = 0`;
        } else if (result.radicand === 1) {
          resultElement.innerText = `√${radical1} ${opSymbol} √${radical2} = ${result.coefficient}`;
        } else {
          resultElement.innerText = `√${radical1} ${opSymbol} √${radical2} = ${result.coefficient}√${result.radicand}`;
        }
      } else {
        resultElement.innerText = `√${radical1} ${opSymbol} √${radical2} cannot be combined further`;
      }
      break;
      
    case 'divide':
      if (isNaN(radical2)) {
        resultElement.innerText = "Please enter a valid number for the second radical";
        return;
      }
      if (radical2 === 0) {
        resultElement.innerText = "Cannot divide by zero";
        return;
      }
      if (radical1 < 0 || radical2 < 0) {
        resultElement.innerText = "Cannot calculate with negative numbers";
        return;
      }
      result = divideRadicals(radical1, radical2);
      resultElement.innerText = `√${radical1} ÷ √${radical2} = √${radical1 / radical2} = ${result.coefficient}√${result.radicand}`;
      break;
  }
};

// One-step equation solver
function solveOneStepEquation(equation, operation) {
  // Parse the equation in the form "ax + b = c" or "x + b = c" or "ax = c"
  let leftSide, rightSide, variable, coefficient, constant;
  
  // Split by equals sign
  const parts = equation.split('=');
  if (parts.length !== 2) {
    return "Invalid equation format. Use format like 'ax + b = c'";
  }
  
  leftSide = parts[0].trim();
  rightSide = parts[1].trim();
  
  // Extract variable (assume it's 'x' for simplicity)
  if (!leftSide.includes('x')) {
    return "Equation must contain variable 'x' on the left side";
  }
  
  let solution;
  
  switch(operation) {
    case 'addition':
      // Form: x + b = c
      if (leftSide.includes('+')) {
        const terms = leftSide.split('+');
        if (terms[0].trim() === 'x') {
          constant = parseFloat(terms[1].trim());
          rightSide = parseFloat(rightSide);
          solution = rightSide - constant;
        } else if (terms[1].trim() === 'x') {
          constant = parseFloat(terms[0].trim());
          rightSide = parseFloat(rightSide);
          solution = rightSide - constant;
        } else {
          return "For addition, use format 'x + b = c' or 'b + x = c'";
        }
      } else {
        return "Addition equation must contain '+'";
      }
      break;
      
    case 'subtraction':
      // Forms: x - b = c or b - x = c
      if (leftSide.includes('-')) {
        const terms = leftSide.split('-');
        if (terms[0].trim() === 'x') {
          constant = parseFloat(terms[1].trim());
          rightSide = parseFloat(rightSide);
          solution = rightSide + constant;
        } else if (terms[1].trim() === 'x') {
          constant = parseFloat(terms[0].trim());
          rightSide = parseFloat(rightSide);
          solution = constant - rightSide;
        } else {
          return "For subtraction, use format 'x - b = c' or 'b - x = c'";
        }
      } else {
        return "Subtraction equation must contain '-'";
      }
      break;
      
    case 'multiplication':
      // Form: ax = c
      if (!leftSide.includes('+') && !leftSide.includes('-')) {
        if (leftSide === 'x') {
          solution = parseFloat(rightSide);
        } else {
          coefficient = parseFloat(leftSide.replace('x', ''));
          rightSide = parseFloat(rightSide);
          if (coefficient === 0) {
            return "Coefficient cannot be zero";
          }
          solution = rightSide / coefficient;
        }
      } else {
        return "For multiplication, use format 'ax = c'";
      }
      break;
      
    case 'division':
      // Form: x/a = c
      if (leftSide.includes('/')) {
        const terms = leftSide.split('/');
        if (terms[0].trim() === 'x') {
          constant = parseFloat(terms[1].trim());
          rightSide = parseFloat(rightSide);
          if (constant === 0) {
            return "Cannot divide by zero";
          }
          solution = rightSide * constant;
        } else {
          return "For division, use format 'x/a = c'";
        }
      } else {
        return "Division equation must contain '/'";
      }
      break;
      
    default:
      return "Please select a valid operation";
  }
  
  return `x = ${solution}`;
}

window.solveEquation = function() {
  const equation = document.getElementById('equation').value;
  const operation = document.getElementById('equationType').value;
  
  if (!equation) {
    document.getElementById('result5').innerText = "Please enter an equation";
    return;
  }
  
  const result = solveOneStepEquation(equation, operation);
  document.getElementById('result5').innerText = result;
};

// Add event listener for iframe error handling
window.addEventListener("error", (event) => {
  console.log("ERROR EVENT", event);
  window.parent.postMessage({
      type: "IFRAME_ERROR_EVENT",
      message: event.message,
      filename: event.filename,
      error: event.error,
      lineno: event.lineno,
      colno: event.colno,
    },
    "*"
  );
});

window.addEventListener('unhandledrejection', (event) => {
  window.parent.postMessage(
    {
      type: 'IFRAME_UNHANDLED_REJECTION_EVENT',
      message: event.reason?.message || String(event.reason),
      stack: event.reason?.stack || null,
      reason: event.reason,
    },
    '*'
  );
});

// Add link click handling
document.addEventListener('DOMContentLoaded', function() {
  const targetNode = document.body;
  const config = {
    childList: true,
    subtree: true,
  };
  const callback = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.tagName === 'A') {
            node.addEventListener('click', (evt) => {
              evt.preventDefault();
              window.parent.postMessage({
                type: 'REQ_REDIRECT_EVENT',
                href: node.href,
                target: node.target,
              }, '*')
            })
          }
        })
      }
    }
  };
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);

  // Dark mode toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  darkModeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
  });
});
