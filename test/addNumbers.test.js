import { addNumbers, addNumbersAsync, addNumAsync, banner, bye } from "../src/addNumber"

beforeAll(() => {
    // Clears the database and adds some testing data.
    // Jest will wait for this promise to resolve before running tests.
    banner()
  });

afterAll(() => {
    bye()
  });

describe('addNumbers', () => {
  test("adds 1 + 1 to equal 3", () => {
    expect(addNumbers(1, 2)).toBe(3)
  })
})

describe('addNumbersAsync', () => {
  test("adds 1 + 1 to equal 3", () => {
    expect(addNumbersAsync(1, 2)).resolves.toBe(3);
  })

  /*
   In JavaScript, you can determine if an object is a Promise by checking if it has a then() method. Since Promises in JavaScript have a then() method, this can be used as a heuristic to identify whether an object is a Promise or not.

   function isPromise(obj) {
        return obj && typeof obj.then === 'function';
   }
*/
  test("adds 1 + 1 to equal 3", () => {
    const obj = addNumAsync(1, 2)
    expect(typeof obj.then).toBe('function')
    expect(obj).resolves.toBe(3);
  })
})

describe('my concurremt', () => {

  test.concurrent('addition of 2 numbers', async () => {
    expect(5 + 3).toBe(8);
  });
  
  test.concurrent('subtraction 2 numbers', async () => {
    expect(5 - 3).toBe(2);
  });

});

describe('my each', () => {
  test.each([
    [1, 1, 2],
    [1, 2, 3],
    [2, 1, 3],
  ])('.add(%i, %i)', (a, b, expected) => {
    expect(a + b).toBe(expected);
  });

  test.each([
    {a: 1, b: 1, expected: 2},
    {a: 1, b: 2, expected: 3},
    {a: 2, b: 1, expected: 3},
  ])('.add($a, $b)', ({a, b, expected}) => {
    expect(a + b).toBe(expected);
  });
})

describe('my todo', () => {
  test.todo('add should be associative');
})

/*
   JavaScript Testing with Jest – Crash Course
   https://youtu.be/IPiUDhwnZxA

   Getting `TypeError: jest.fn is not a function`
   https://stackoverflow.com/questions/46086970/getting-typeerror-jest-fn-is-not-a-function

   How can I test that a function has not been called?
   https://stackoverflow.com/questions/24282390/how-can-i-test-that-a-function-has-not-been-called

   npm test -t num

   JSDoc
   https://jsdoc.app/

   npm run jsdoc src

   Text Art
   https://fsymbols.com/text-art/
*/