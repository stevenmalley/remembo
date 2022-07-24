const assert = require('assert');

function sub1(n) {return n-1;}


describe("OBJECT", ()=>{
	describe(".METHOD", ()=>{
		it("description", ()=>{ // individual test
			// setup
			const expected = 2;
			const data = 3;

			// exercise
			const actual = sub1(data);

			// verify
			assert.ok(actual == expected); });});});