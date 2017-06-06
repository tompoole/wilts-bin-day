import { expect } from 'chai';
import { suite, test } from 'mocha-typescript'
import { humaniseDate } from '../dateHumaniser'
import * as lolex from 'lolex'

@suite class DateHumaniserTests {
    clock: lolex.Clock;
    fixedTodayDate: Date;
    
    before() {
        this.fixedTodayDate = new Date(2017, 0, 4)
        this.clock = lolex.install(this.fixedTodayDate);        
    }

    after() {
        this.clock.uninstall();
    }

    @test 'should return "today" for today\'s date'() {
        var result = humaniseDate(this.fixedTodayDate)
        expect(result).to.equal('Today');
    }

    @test 'should return "In the past" for a previous date'() {
        var dateToHumanise = new Date(2017, 0, 2);
        var result = humaniseDate(dateToHumanise);

        expect(result).to.contain('In the past');
    }

    @test 'should return "tommorow" for tomorrow\'s date'() {
        var dateToHumanise = new Date(2017, 0, 5);
        var result = humaniseDate(dateToHumanise);

        expect(result).to.contain('Tomorrow');       
    }

    @test 'should return "this <DAY>" for a date this week'() {
        var dateToHumanise = new Date(2017, 0, 6);
        var result = humaniseDate(dateToHumanise);

        expect(result).to.equal('This Friday');
    }

    @test 'should return "A week today" for a date 7 days from now'() {
        var dateToHumanise = new Date(2017, 0, 11);
        var result = humaniseDate(dateToHumanise);

        expect(result).to.equal('A week today');
    }

    @test 'should return "{DAY} {MONTHDAY}" for a date next week'() {
        var dateToHumanise = new Date(2017, 0, 12);
        var result = humaniseDate(dateToHumanise);

        expect(result).to.contain('Thursday the 12th');
    }

    @test 'should return "{DAY} {MONTHDAY} {MONTH}" for a date next month'() {
        var dateToHumanise = new Date(2017, 1, 3);
        var result = humaniseDate(dateToHumanise);

        expect(result).to.contain('Friday the 3rd of February');
    }

}
