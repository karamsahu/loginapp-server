var add = require("../app")

//create test suite

describe('Calculator functional test', () =>{
    it('calculatest sum of two number', () =>{
        expect(add(3,2)).toEqual(5);
    })
});