import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import React, { useEffect, useRef } from 'react';
import datePicker from '../../../../node_modules/uswds/src/js/components/date-picker';

export const DatePickerComponent = ({ errorText, label, name, onChange }) => {
  const datePickerRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    if (datePickerRef.current) {
      datePicker.on(datePickerRef.current);
    }
  }, [datePickerRef]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener('change', e => {
        onChange(e);
      });
    }
  }, [inputRef]);

  return (
    <FormGroup errorText={errorText} formGroupRef={datePickerRef}>
      <label
        className="usa-label"
        htmlFor={`${name}-date`}
        id={`${name}-date-label`}
      >
        {label}
      </label>
      <div className="usa-hint" id={`${name}-date-hint`}>
        MM/DD/YYYY
      </div>
      <div className="usa-date-picker">
        <input
          aria-describedby={`${name}-date-label ${name}-date-hint`}
          className="usa-input"
          id={`${name}-date`}
          name={`${name}-date`}
          ref={inputRef}
          type="text"
          onChange={onChange}
        />
      </div>
    </FormGroup>
  );
};
