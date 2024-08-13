import { promisify } from "util"

/**
 * Calculates the sum of two numbers.
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The sum of the two numbers.
 */
function addNumbers(a, b) {
    return a + b;
}

/**
 * Calculates the sum of two numbers asynchronous.
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The sum of the two numbers.
 * @async
 */
const addNumbersAsync = promisify(addNumbers)

export { addNumbers, addNumbersAsync }

/*
   JSDoc
   https://jsdoc.app/

   npm run jsdoc src
*/