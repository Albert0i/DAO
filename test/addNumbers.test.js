import { addNumbers } from "../src/addNumber"

test("adds 1 + 1 to equal 3", () => {
    expect(addNumbers(1, 2)).toBe(3)
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

   npm run jsdoc src/addNumber.js
   
*/