export const toPascalCase = (str) =>
    str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
        .join("");

export const dateToMonthYear = (dateInput) => {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const date = new Date(dateInput);
    return `${months[date.getMonth()]} ${date.getFullYear()}`
}