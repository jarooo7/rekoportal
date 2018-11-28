export function getFormatedDate(date: Date): string {
    const stringDate = `${date.getFullYear()}-${returnTwoChar(date.getMonth() + 1)}-${returnTwoChar(date.getDate())}`;
    const hours = `${returnTwoChar(date.getHours())}:${returnTwoChar(date.getMinutes())}`;
    return `${stringDate}_${hours}`;
}

  function returnTwoChar(value: number): string {
    return `0${value.toString()}`.slice(-2);
}
