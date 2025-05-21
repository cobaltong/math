// code property of ryan goodrich
// if you see any comments, they were auto-added by chatgpt
// because i ran my code through it from time to time to fix troubles

let Variables = {
  maxNumber: 1000000, // Maximum number allowed for calculations
  maxTerms: 10, // Maximum number of terms in an expression - Note: This is not currently enforced
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
  // Handle negative numbers? For now, assume positive
  if (num < 0) num = Math.abs(num);
  for (let i = 1; i <= num; i++) {
    if (num % i === 0) {
      factors.push(i);
    }
  }
  return factors;
}

function getPrimeFactors(num) {
  let factors = [];
  // Handle negative numbers? For now, assume positive
  if (num < 0) num = Math.abs(num);
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
  if (isNaN(num1) || isNaN(num2) || num1 > Variables.maxNumber || num2 > Variables.maxNumber || num1 < 0 || num2 < 0) {
    document.getElementById('result1').innerText = "Please enter valid positive numbers (max " + Variables.maxNumber + ").";
    return;
  }
  const result = gcd(num1, num2);
  document.getElementById('result1').innerText = `GCF of ${num1} and ${num2} is ${result}`;
};

window.calculateLCM = function() {
  const num1 = parseInt(document.getElementById('num1').value);
  const num2 = parseInt(document.getElementById('num2').value);
  if (isNaN(num1) || isNaN(num2) || num1 > Variables.maxNumber || num2 > Variables.maxNumber || num1 < 0 || num2 < 0) {
    document.getElementById('result1').innerText = "Please enter valid positive numbers (max " + Variables.maxNumber + ").";
    return;
  }
  const result = lcm(num1, num2);
  document.getElementById('result1').innerText = `LCM of ${num1} and ${num2} is ${result}`;
};

window.calculateFactors = function() {
  const num = parseInt(document.getElementById('num1').value);
  if (isNaN(num) || num > Variables.maxNumber || num < 0) {
    document.getElementById('result1').innerText = "Please enter a valid positive number (max " + Variables.maxNumber + ").";
    return;
  }
  const factors = getFactors(num);
  document.getElementById('result1').innerText = `Factors of ${num} are: ${factors.join(', ')}`;
};

window.calculatePrimeFactorization = function() {
  const num = parseInt(document.getElementById('num1').value);
  if (isNaN(num) || num > Variables.maxNumber || num < 0) {
    document.getElementById('result1').innerText = "Please enter a valid positive number (max " + Variables.maxNumber + ").";
    return;
  }
  const primeFactors = getPrimeFactors(num);
  document.getElementById('result1').innerText = `Prime factorization of ${num} is: ${primeFactors.join(' × ')}`;
};

// Expression Simplification
function expandParentheses(expr) {
  // Matches coefficient (optional sign and number) immediately before a single-level parenthesis
  const parenRegex = /([+-]?(?:\d*\.?\d+|\d+)?)(\()([^()]+)\)/;
  let match;
  while ((match = expr.match(parenRegex))) {
    const [whole, coefStr, , inner] = match;
    // Determine the numeric coefficient
    let coef;
    if (!coefStr || coefStr === '+') coef = 1;
    else if (coefStr === '-') coef = -1;
    else coef = parseFloat(coefStr);
    // Split inner content into simple terms
    const innerTerms = inner
      .match(/[+-]?[0-9]*(?:\.[0-9]+)?[a-zA-Z]?(?:\^[0-9]+)?/g)
      ?.filter(Boolean) || [];
    // Multiply each inner term by coef
    let expanded = innerTerms
      .map(term => {
        const m = term.match(/^([+-]?)([0-9]*(?:\.[0-9]+)?)([a-zA-Z]?)(?:\^([0-9]+))?$/);
        if (!m) return '';
        let sign = m[1] || '+';
        let numStr = m[2], variable = m[3] || '', exp = m[4] || '';
        // Determine term's numeric part
        let tcoef = numStr ? parseFloat(numStr) : 1;
        if (sign === '-') tcoef = -tcoef;
        // Apply outer coefficient
        tcoef *= coef;
        // Build expanded term string
        let out = tcoef < 0 ? '-' : '+';
        const abs = Math.abs(tcoef);
        if (variable) {
          if (abs !== 1) out += abs;
          out += variable;
          if (exp) out += '^' + exp;
        } else {
          out += abs;
        }
        return out;
      })
      .join('');
    // Drop leading '+' if present
    if (expanded.startsWith('+')) expanded = expanded.slice(1);
    // Replace the entire parenthetical expression
    expr = expr.replace(whole, expanded);
  }
  return expr;
}

function simplifyExpr(expr) {
  // Basic cleanup
  expr = expr.replace(/\s+/g, '');
  if (expr.startsWith('+')) expr = expr.substring(1);
  // Expand any simple parentheses (distribution)
  expr = expandParentheses(expr);

  // Regex to find terms: [+-]? followed by optional number (int or float), optional variable, optional exponent
  // This regex assumes the input is expanded (no parentheses like 3(x+6))
  const terms = expr.match(/[+-]?\s*[0-9]*(?:\.[0-9]+)?[a-zA-Z]?(?:\^[0-9]+)?/g)?.filter(Boolean) || [];
  const simplified = {}; // Use an object to sum coefficients per term key

  terms.forEach(term => {
    // Updated regex to capture sign, coefficient, variable, and exponent more reliably
    const match = term.match(/^([+-]?)\s*([0-9]*(?:\.[0-9]+)?)([a-zA-Z]?)(?:\^([0-9]+))?$/);

    if (!match) {
        // If a term doesn't match the pattern, it's likely invalid or complex (like parentheses)
        // For now, we might skip it or flag an error. Given the prompt, let's try to handle it.
        // If it's just a number or variable not caught, refine the regex.
        console.warn(`Could not parse term: ${term}`);
        // Attempt a fallback for simple numbers/variables not caught by main regex
        const simpleMatch = term.match(/^([+-]?)\s*([0-9]*(?:\.[0-9]+)?)([a-zA-Z]?)$/);
        if (simpleMatch) {
             match[1] = simpleMatch[1];
             match[2] = simpleMatch[2];
             match[3] = simpleMatch[3];
             match[4] = undefined; // No exponent
        } else {
             return; // Skip terms that still can't be parsed simply
        }
    }

    let sign = match[1] || '+';
    let coefficientStr = match[2];
    const variable = match[3] || '';
    let exponent = match[4]; // Exponent is only captured if present

    // Determine coefficient value
    let coefficient;
    if (coefficientStr === '') {
      // If coefficient string is empty, it's 1 or -1 (e.g., 'x' or '-y')
      coefficient = sign === '-' ? -1 : 1;
    } else {
      coefficient = parseFloat(coefficientStr);
      if (sign === '-') coefficient *= -1;
    }

    // Determine exponent if not explicitly present
    if (exponent === undefined) {
      exponent = variable ? '1' : '0'; // Exponent is 1 if there's a variable, 0 if it's a constant
    }

    // Create a key based on variable and exponent for grouping (e.g., "x_1", "y_2", "_0" for constants)
    const key = `${variable}_${exponent}`;

    if (key in simplified) {
      simplified[key] += coefficient;
    } else {
      simplified[key] = coefficient;
    }
  });

  // Sort keys to produce a standard output order (variables descending exponent, then constants at the end)
  const sortedKeys = Object.keys(simplified).sort((a, b) => {
      const [varA, expA] = a.split('_');
      const [varB, expB] = b.split('_');

      // Constants always come last (key starts with _)
      const aIsConstant = varA === '';
      const bIsConstant = varB === '';
      if (aIsConstant && !bIsConstant) return 1;
      if (!aIsConstant && bIsConstant) return -1;

      // If both are constants, their order doesn't matter much (only one key '_0')
      if (aIsConstant && bIsConstant) return 0;

      // If both have variables, sort alphabetically by variable name
      if (varA !== varB) {
          return varA.localeCompare(varB);
      }

      // If variables are the same, sort by exponent descending (e.g., x^2 before x^1)
      return parseInt(expB) - parseInt(expA);
  });


  // Format the output string from simplified terms
  const resultTerms = sortedKeys
    .filter(key => simplified[key] !== 0) // Filter out terms that sum to zero
    .map(key => {
      const coefficient = simplified[key];
      const [variable, exponent] = key.split('_');

      // Handle constant term (variable is empty, exponent is '0')
      if (variable === '' && exponent === '0') {
          return coefficient.toString(); // Just return the number
      }

      // Handle terms with variables
      let termString = '';
      if (coefficient === 1) {
          termString = variable; // e.g., "x"
      } else if (coefficient === -1) {
          termString = '-' + variable; // e.g., "-x"
      } else {
          termString = coefficient + variable; // e.g., "3x", "-2y"
      }

      // Add exponent if it's not '1'
      if (exponent !== '1') {
          termString += '^' + exponent; // e.g., "x^2", "3y^5"
      }

      return termString;
    });

  // Join terms with " + " and clean up " + -"
  let result = resultTerms.join(' + ').replace(/\+ -/g, '- ');

  // If result is empty (all terms canceled out), return "0"
  return result || '0';
}

function evaluateExpr(expr) {
  // Basic check to prevent arbitrary code execution
  // This is a simplified approach and can be bypassed with complex expressions.
  // For a robust solution, a proper parser is needed.

  // Check for variable assignment syntax
  let xValue = null;
  const assignmentSeparator = expr.indexOf('&');

  if (assignmentSeparator > -1) {
    const assignmentPart = expr.substring(0, assignmentSeparator).trim();
    const expressionPart = expr.substring(assignmentSeparator + 1).trim();

    const assignmentMatch = assignmentPart.match(/^x\s*=\s*(-?\d*\.?\d+)$/);

    if (assignmentMatch) {
      xValue = parseFloat(assignmentMatch[1]);
      expr = expressionPart; // Use the expression part for evaluation
    } else {
       // If '&' is present but assignment format is wrong, treat as invalid
       return "Invalid format for variable assignment (use x=value&expression)";
    }
  }

  // Replace 'x' with its value if specified
  if (xValue !== null) {
      expr = expr.replace(/x/g, xValue.toString());
  }

  // Validate characters *after* potential replacement of 'x'
  let charactersToCheck = expr;
  if (xValue !== null) {
    charactersToCheck = expr; // Check the string *after* x replacement
  } else {
    // If no assignment, allow 'x' in the original expression for potential future use
    // but the regex below still restricts to just numbers and operators.
    // To properly handle 'x' *without* assignment would require more complex parsing.
    // For this prompt, we assume 'x' is only used *with* the 'x=value&' syntax.
    // The existing regex check will handle cases *without* x=value& format.
  }

  if (/^[0-9+\-*/().\s]+$/.test(charactersToCheck)) {
     try {
       const safeEval = new Function('return ' + charactersToCheck);
       const result = safeEval();

       if (!isFinite(result)) {
            return "Result is too large or too small or undefined";
       }

       return result;

     } catch (error) {
       return "Error in evaluation: " + error.message;
     }
  } else {
     return "Expression contains invalid characters or format";
  }
}

window.simplifyExpression = function() {
  const expr = document.getElementById('expression').value;
  const simplified = simplifyExpr(expr);
  document.getElementById('result2').innerText = `Simplified expression: ${simplified}`;
};

window.evaluateExpression = function() {
  const expr = document.getElementById('expression').value;
  const result = evaluateExpr(expr);
  document.getElementById('result2').innerText = `Evaluated result: ${result}`;
};

// Exponents and Roots
window.calculatePower = function() {
  const base = parseFloat(document.getElementById('base').value);
  const exponent = parseFloat(document.getElementById('exponent').value); 
  if (isNaN(base) || isNaN(exponent) || Math.abs(exponent) > Variables.maxExponent) { 
    document.getElementById('result3').innerText = "Please enter valid numbers (max exponent " + Variables.maxExponent + ").";
    return;
  }
  const result = Math.pow(base, exponent);
   if (isNaN(result)) {
       document.getElementById('result3').innerText = "Calculation error (e.g., negative base with non-integer exponent)";
   } else if (!isFinite(result)) {
       document.getElementById('result3').innerText = "Result is too large or too small";
   }
   else {
      document.getElementById('result3').innerText = `${base}^${exponent} = ${result}`;
   }
};

window.calculateRoot = function() {
  const base = parseFloat(document.getElementById('base').value);
  const root = parseFloat(document.getElementById('exponent').value); 
  if (isNaN(base) || isNaN(root) || root === 0 || Math.abs(root) > Variables.maxExponent) {
    document.getElementById('result3').innerText = "Please enter valid numbers (root cannot be 0, max root index " + Variables.maxExponent + ").";
    return;
  }
  if (base < 0 && root % 2 === 0) {
       document.getElementById('result3').innerText = "Cannot calculate even root of a negative number (for real numbers).";
       return;
  }
  const result = Math.pow(base, 1 / root);
  if (isNaN(result)) {
       document.getElementById('result3').innerText = "Calculation error.";
   } else if (!isFinite(result)) {
       document.getElementById('result3').innerText = "Result is too large or too small";
   }
  else {
    document.getElementById('result3').innerText = `${root}th root of ${base} = ${result}`;
  }
};

// Radicals functions
function findSquareRoot(number) {
  if (number < 0) return "Cannot calculate square root of a negative number (for real numbers)";
  return Math.sqrt(number);
}

function simplifyRadical(number) {
  // Handle negative numbers (for now, assume real numbers)
  if (number < 0) {
    return { coefficient: 1, radicand: number, error: "Cannot simplify negative radicand (for real numbers)" };
  }
   if (number === 0) return { coefficient: 0, radicand: 0 };
   if (number === 1) return { coefficient: 1, radicand: 1 };


  // Find the largest perfect square factor
  let coefficient = 1;
  let radicand = number;

  // Start checking from 2 up to the square root of the number
  for (let i = 2; i * i <= radicand; i++) {
    while (radicand % (i * i) === 0) {
      coefficient *= i;
      radicand /= (i * i);
    }
  }

  return { coefficient, radicand };
}

function multiplyRadicals(a, b) {
   if (a < 0 || b < 0) {
       return { error: "Cannot calculate with negative numbers (for real numbers)"};
   }
   if (a === 0 || b === 0) return simplifyRadical(0);
  return simplifyRadical(a * b);
}

function addSubtractRadicals(a, b, operation) {
   if (a < 0 || b < 0) {
       return { error: "Cannot calculate with negative numbers (for real numbers)"};
   }
   if (a === 0 && b === 0) return simplifyRadical(0);
   if (a === 0) return simplifyRadical(b);
   if (b === 0) return simplifyRadical(a);


  const simplifiedA = simplifyRadical(a);
  const simplifiedB = simplifyRadical(b);

   if (simplifiedA.error || simplifiedB.error) {
       return { error: simplifiedA.error || simplifiedB.error };
   }

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
  if (b === 0) return { error: "Cannot divide by zero" };
  if (a < 0 || b < 0) {
    return { error: "Cannot calculate with negative numbers (for real numbers)" };
  }
  if (a === 0) return simplifyRadical(0);

   // Simplify (√a) / (√b) = √(a/b)
   // Check if a/b is a perfect square or can be simplified
   const divisionResult = a / b;
   if (divisionResult < 0) { // Should not happen with positive a, b but good check
       return { error: "Cannot divide such that radicand is negative" };
   }
   return simplifyRadical(divisionResult);
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
      result = simplifyRadical(radical1);
      if (result.error) {
          resultElement.innerText = result.error;
      } else if (result.coefficient === 0) {
           resultElement.innerText = `√${radical1} = 0`;
      }
       else if (result.radicand === 1) { // If perfect square
        resultElement.innerText = `√${radical1} = ${result.coefficient}`;
      } else if (result.coefficient === 1) { // If not simplifyable further (coefficient 1)
        resultElement.innerText = `√${radical1} = √${result.radicand}`;
      } else { // If simplified radical (coefficient > 1)
        resultElement.innerText = `√${radical1} = ${result.coefficient}√${result.radicand}`;
      }
      break;

    case 'simplify':
      result = simplifyRadical(radical1);
      if (result.error) {
          resultElement.innerText = result.error;
      } else if (result.coefficient === 0) {
           resultElement.innerText = `√${radical1} = 0`;
      }
       else if (result.radicand === 1) {
        resultElement.innerText = `√${radical1} = ${result.coefficient}`;
      } else if (result.coefficient === 1) {
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
      result = multiplyRadicals(radical1, radical2);
       if (result.error) {
          resultElement.innerText = result.error;
      } else if (result.coefficient === 0) {
           resultElement.innerText = `√${radical1} × √${radical2} = √${radical1 * radical2} = 0`;
      } else if (result.radicand === 1) {
        resultElement.innerText = `√${radical1} × √${radical2} = √${radical1 * radical2} = ${result.coefficient}`;
      } else if (result.coefficient === 1) {
        resultElement.innerText = `√${radical1} × √${radical2} = √${radical1 * radical2} = √${result.radicand}`;
      } else {
        resultElement.innerText = `√${radical1} × √${radical2} = √${radical1 * radical2} = ${result.coefficient}√${result.radicand}`;
      }
      break;

    case 'add':
    case 'subtract':
      if (isNaN(radical2)) {
        resultElement.innerText = "Please enter a valid number for the second radical";
        return;
      }
      result = addSubtractRadicals(radical1, radical2, operation);
      const opSymbol = operation === 'add' ? '+' : '-';
      if (result.canCombine) {
        if (result.coefficient === 0) {
          resultElement.innerText = `√${radical1} ${opSymbol} √${radical2} = 0`;
        } else if (result.radicand === 1) {
          resultElement.innerText = `√${radical1} ${opSymbol} √${radical2} = ${result.coefficient}`;
        } else if (result.coefficient === 1) {
          resultElement.innerText = `√${radical1} ${opSymbol} √${radical2} = √${result.radicand}`;
        } else if (result.coefficient === -1) {
          resultElement.innerText = `√${radical1} ${opSymbol} √${radical2} = -√${result.radicand}`;
        } else {
          resultElement.innerText = `√${radical1} ${opSymbol} √${radical2} = ${result.coefficient}√${result.radicand}`;
        }
      } else {
        const simpA = simplifyRadical(radical1);
        const simpB = simplifyRadical(radical2);
        let strA = (simpA.coefficient === 1 ? '' : simpA.coefficient) + (simpA.radicand === 1 ? '' : `√${simpA.radicand}`);
        let strB = (simpB.coefficient === 1 ? '' : simpB.coefficient) + (simpB.radicand === 1 ? '' : `√${simpB.radicand}`);
        if (strA === '') strA = simpA.radicand; // Case where radicand is 1, coefficient is 1
        if (strB === '') strB = simpB.radicand; // Case where radicand is 1, coefficient is 1

        resultElement.innerText = `${strA} ${opSymbol} ${strB} cannot be combined further`;
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
        resultElement.innerText = "Cannot calculate with negative numbers (for real numbers)";
        return;
      }
      result = divideRadicals(radical1, radical2);
      if (result.error) {
          resultElement.innerText = result.error;
      } else if (result.coefficient === 0) {
           resultElement.innerText = `√${radical1} ÷ √${radical2} = 0`;
      } else if (result.radicand === 1) {
        resultElement.innerText = `√${radical1} ÷ √${radical2} = √${radical1 / radical2} = ${result.coefficient}`;
      } else if (result.coefficient === 1) {
        resultElement.innerText = `√${radical1} ÷ √${radical2} = √${radical1 / radical2} = √${result.radicand}`;
      } else {
        resultElement.innerText = `√${radical1} ÷ √${radical2} = √${radical1 / radical2} = ${result.coefficient}√${result.radicand}`;
      }
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

  try {
    // Evaluate the right side in case it's an expression
    const c = evaluateExpr(rightSide);
    if (isNaN(c)) return "Invalid number on the right side";

    switch (operation) {
      case 'addition':
        // Form: x + b = c
        // Handle 'b + x = c' and 'x + b = c'
        const addMatch = leftSide.match(/^(\s*\d*\.?\d*\s*)?x\s*\+\s*(\s*\d*\.?\d*\s*)$/); // x + b
        const addMatchReverse = leftSide.match(/^(\s*\d*\.?\d*\s*)\+\s*(\s*\d*\.?\d*\s*)?x$/); // b + x

        if (addMatch) {
          constant = parseFloat(addMatch[2]);
          solution = c - constant;
        } else if (addMatchReverse) {
          constant = parseFloat(addMatchReverse[1]);
          solution = c - constant;
        } else {
          return "For addition, use format 'x + b = c' or 'b + x = c'";
        }
        break;

      case 'subtraction':
        // Forms: x - b = c or b - x = c
        const subMatch = leftSide.match(/^(\s*\d*\.?\d*\s*)?x\s*-\s*(\s*\d*\.?\d*\s*)$/); // x - b
        const subMatchReverse = leftSide.match(/^(\s*\d*\.?\d*\s*)-\s*(\s*\d*\.?\d*\s*)?x$/); // b - x

        if (subMatch) {
          constant = parseFloat(subMatch[2]);
          solution = c + constant;
        } else if (subMatchReverse) {
          constant = parseFloat(subMatchReverse[1]);
          solution = constant - c;
        } else {
          return "For subtraction, use format 'x - b = c' or 'b - x = c'";
        }
        break;

      case 'multiplication':
        // Form: ax = c
        const multMatch = leftSide.match(/^(\s*[+-]?\s*\d*\.?\d*)\s*x$/); // ax
        const multMatchSimple = leftSide.trim(); // x

        if (multMatch) {
          coefficient = parseFloat(multMatch[1]);
          if (coefficient === 0) {
            return "Coefficient cannot be zero";
          }
          solution = c / coefficient;
        } else if (multMatchSimple === 'x') {
          solution = c;
        } else {
          return "For multiplication, use format 'ax = c'";
        }
        break;

      case 'division':
        // Form: x/a = c
        const divMatch = leftSide.match(/^x\s*\/\s*(\s*\d*\.?\d*\s*)$/); // x/a

        if (divMatch) {
          constant = parseFloat(divMatch[1]);
          if (constant === 0) {
            return "Cannot divide by zero";
          }
          solution = c * constant;
        } else {
          return "For division, use format 'x/a = c'";
        }
        break;

      default:
        return "Please select a valid operation";
    }

    return `x = ${solution}`;
  } catch (error) {
    return "Error parsing equation or calculating result.";
  }
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

// Circle Calculations
window.calculateCircleProperties = function() {
  const inputValue = parseFloat(document.getElementById('circleInput').value);
  const inputType = document.getElementById('circleInputType').value;
  const roundingOption = document.getElementById('circleRounding').value; 
  const resultElement = document.getElementById('result6');

  if (isNaN(inputValue) || inputValue < 0) {
    resultElement.innerText = "Please enter a valid positive number.";
    return;
  }

  let radius, diameter, area, circumference;
  const pi = Math.PI;
  
  let decimalPlaces;
  switch(roundingOption) {
      case 'tenth':
          decimalPlaces = 1;
          break;
      case 'hundredth':
          decimalPlaces = 2;
          break;
      case 'none':
      default:
          decimalPlaces = 4; 
          break;
  }


  switch (inputType) {
    case 'radius':
      radius = inputValue;
      diameter = 2 * radius;
      area = pi * Math.pow(radius, 2);
      circumference = 2 * pi * radius;
      break;
    case 'diameter':
      diameter = inputValue;
      radius = diameter / 2;
      area = pi * Math.pow(radius, 2);
      circumference = pi * diameter;
      break;
    case 'area':
      area = inputValue;
      if (area < 0) {
          resultElement.innerText = "Area cannot be negative.";
          return;
      }
      radius = Math.sqrt(area / pi);
      diameter = 2 * radius;
      circumference = 2 * pi * radius;
      break;
    case 'circumference':
      circumference = inputValue;
       if (circumference < 0) {
          resultElement.innerText = "Circumference cannot be negative.";
          return;
      }
      radius = circumference / (2 * pi);
      diameter = circumference / pi;
      area = pi * Math.pow(radius, 2);
      break;
    default:
      resultElement.innerText = "Invalid input type selected.";
      return;
  }

  resultElement.innerHTML = `
    Based on the input (${inputValue} as ${inputType}):<br>
    Radius: ${radius.toFixed(decimalPlaces)}<br>
    Diameter: ${diameter.toFixed(decimalPlaces)}<br>
    Area: ${area.toFixed(decimalPlaces)}<br>
    Circumference: ${circumference.toFixed(decimalPlaces)}
  `;
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
