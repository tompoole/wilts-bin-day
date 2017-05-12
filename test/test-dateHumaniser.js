const should = require('chai').should();
const dateHumaniser  = require('../dateHumaniser');

describe('Date Humaniser', function() {
    var fixedTodayDate = new Date(2017, 0, 4);
    dateHumaniser.__nowOverride = fixedTodayDate;

    it('should return "today" for today\'s date', function() {
        var result = dateHumaniser.humaniseDate(fixedTodayDate)

        result.should.equal('Today');

    });

    it('should return "In the past" for a previous date', function() {

        var dateToHumanise = new Date(2017, 0, 2);
        var result = dateHumaniser.humaniseDate(dateToHumanise);

        result.should.contain('In the past');

    });

    it('should return "tommorow" for tomorrow\'s date', function() {
        
        var dateToHumanise = new Date(2017, 0, 5);
        var result = dateHumaniser.humaniseDate(dateToHumanise);

        result.should.contain('Tomorrow');

    });

    it('should return "this <DAY>" for a date this week', function() {
        
        var dateToHumanise = new Date(2017, 0, 6);
        var result = dateHumaniser.humaniseDate(dateToHumanise);

        result.should.equal('This Friday');
    });

    it('should return "A week today" for a date 7 days from now', function() {
        
        var dateToHumanise = new Date(2017, 0, 11);
        var result = dateHumaniser.humaniseDate(dateToHumanise);

        result.should.equal('A week today');
    });

    it('should return "{DAY} {MONTHDAY}" for a date next week', function() {
        
        var dateToHumanise = new Date(2017, 0, 12);
        var result = dateHumaniser.humaniseDate(dateToHumanise);

        result.should.equal('Thursday 12th');
    });

    it('should return "{DAY} {MONTHDAY} {MONTH}" for a date next month', function() {
        
        var dateToHumanise = new Date(2017, 1, 3);
        var result = dateHumaniser.humaniseDate(dateToHumanise);

        result.should.equal('Friday 3rd February');
    });


});