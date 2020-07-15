// Load dependencies
const assert = require('chai').assert
const dateFormat = require('../../api/lib/dateFormat');

// Test related to the dateFormat lib
describe('Lib : DateFormat', function(){

// Test the plainText function
  describe('Plain Text', function(){

    it('should transform ISO 8601 date to plain text', function(){
      // ISO 8601 date
      let newDate = "2020-07-10T13:05:21.115Z";

      // Verify that the ISO8601 date is formatted in plain text
      assert.equal(dateFormat.plaintText(newDate), "vendredi 10 juillet 2020");
    });

    it('should not transform ISO 8601 date to plain text', function(){
      // Not an ISO 8601 date
      let newDate = "10/07/2020";

      // Verify that the not ISO8601 date is not formatted in plain text
      assert.notEqual(dateFormat.plaintText(newDate), "vendredi 10 juillet 2020");
    });
  });

});
