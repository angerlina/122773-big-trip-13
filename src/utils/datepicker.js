import flatpickr from "flatpickr";

const fateFormat = `d/m/y H:i`;
export const getDatePicker = (element, defaultDate, changeHandler) => flatpickr(
    element,
    {
      dateFormat: fateFormat,
      enableTime: true,
      defaultDate,
      onChange: changeHandler
    }
);
