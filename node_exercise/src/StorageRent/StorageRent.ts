
export type MonthlyRentRecord = {
    vacancy: boolean,
    rentAmount: number,
    rentDueDate: Date;
};

export type MonthlyRentRecords = Array<MonthlyRentRecord>;

/**
 * Determines the vacancy, rent amount and due date for each month in a given time window
 * '
 * @param baseMonthlyRent : The base or starting monthly rent for unit (Number)
 * @param leaseStartDate : The date that the tenant's lease starts (Date)
 * @param windowStartDate : The first date of the given time window (Date)
 * @param windowEndDate : The last date of the given time window (Date)
 * @param dayOfMonthRentDue : The day of each month on which rent is due (Number)
 * @param rentRateChangeFrequency : The frequency in months the rent is changed (Number)
 * @param rentChangeRate : The rate to increase or decrease rent, input as decimal (not %), positive for increase, negative for decrease (Number),
 * @returns Array<MonthlyRentRecord>;
 */
export function calculateMonthlyRent(baseMonthlyRent: number, leaseStartDate: Date, windowStartDate: Date,
    windowEndDate: Date, dayOfMonthRentDue: number, rentRateChangeFrequency: number, rentChangeRate: number) {

    const monthlyRentRecords: MonthlyRentRecords = [];
    const monthInterval = calculateMonthDifference(windowStartDate, windowEndDate);
    console.log("monthInterval", monthInterval);

    let currentRentAmout = baseMonthlyRent;
    const vacancy = leaseStartDate > windowStartDate;
    windowStartDate.setDate(dayOfMonthRentDue);

    const record: MonthlyRentRecord = {
        vacancy,
        rentAmount: baseMonthlyRent,
        rentDueDate: windowStartDate
    };

    monthlyRentRecords.push(record);

    for (let i = 1; i < monthInterval; i++) {

        let rentDueDate = addMonthsToDate(windowStartDate, i);
            
        const year = rentDueDate.getFullYear();
        const month = rentDueDate.getMonth();

        let vacancy = false;
        
        if (leaseStartDate > rentDueDate) {
            vacancy = true;
        }

        let rentAmount = 0;
        if (vacancy) {
            rentAmount = baseMonthlyRent < 1 ? roundToTwoDigits(calculateNewMonthlyRent(currentRentAmout, rentChangeRate)) : currentRentAmout;
        }
        else {
            rentAmount = baseMonthlyRent > 1 ? roundToTwoDigits(calculateNewMonthlyRent(currentRentAmout, rentChangeRate)) : currentRentAmout;
        }
        
        if (year == rentDueDate.getFullYear() && month == rentDueDate.getMonth()) {
            rentDueDate = leaseStartDate;
        }
        else {

            if (isGreaterThanDaysInMonth(year, month, dayOfMonthRentDue)) {
                rentDueDate = new Date(year, month, 0);
            }
        }

        const record: MonthlyRentRecord = {
            vacancy,
            rentAmount,
            rentDueDate
        };

        monthlyRentRecords.push(record);
        currentRentAmout = rentAmount;
    }


    return monthlyRentRecords;
}

function calculateMonthDifference(startDate, endDate) {
    var start = new Date(startDate);
    var end = new Date(endDate);

    var yearDiff = end.getFullYear() - start.getFullYear();
    var monthDiff = end.getMonth() - start.getMonth();

    var totalMonths = (yearDiff * 12) + monthDiff;

    return totalMonths;
}

function addMonthsToDate(date, months) {
    var newDate = new Date(date);

    var currentMonth = newDate.getMonth();
    newDate.setMonth(currentMonth + months);
    
    return newDate;
}


//Helper functions.

/**
 * Calculates the new monthly rent
 * 
 * @param baseMonthlyRent : the base amount of rent
 * @param rentChangeRate : the rate that rent my increase or decrease (positive for increase, negative for decrease)
 * @returns number
 * 
 */
function calculateNewMonthlyRent(baseMonthlyRent: number, rentChangeRate: number) {
    return baseMonthlyRent * (1 + rentChangeRate);
}

function roundToTwoDigits(number) {
    return Number(number.toFixed(2));
}

function isGreaterThanDaysInMonth(year, month, number) {
    var daysInMonth = new Date(year, month, 0).getDate();
    return number > daysInMonth;
}

/**
 * Determines if the year is a leap year
 * 
 * @param year 
 * @returns boolean
 * 
 */
function isLeapYear(year: number) {
    return (year % 4 == 0 && year % 100 != 0);
}