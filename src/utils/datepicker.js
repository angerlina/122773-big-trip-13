import flatpickr from "flatpickr";

const dateFormat = `d/m/y H:i`;
export const getDatePicker = (element, defaultDate, changeHandler) => flatpickr(
    element,
    {
      dateFormat,
      enableTime: true,
      defaultDate,
      onChange: changeHandler
    }
);
