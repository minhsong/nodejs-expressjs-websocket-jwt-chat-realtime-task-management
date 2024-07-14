import React, { useEffect, useRef } from "react";
import { useController } from "react-hook-form";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";

const PhoneInput = ({ name, control }) => {
  const inputRef = useRef(null);
  const { field, fieldState } = useController({
    name,
    control,
    rules: { required: "Phone number is required" },
  });

  useEffect(() => {
    const iti = intlTelInput(inputRef.current, {
      containerClass: "w-full",
      initialCountry: "auto",
      geoIpLookup: (callback) => {
        fetch("https://ipinfo.io")
          .then((response) => response.json())
          .then((data) => {
            const countryCode = data.country;
            callback(countryCode);
          })
          .catch(() => {
            callback("us");
          });
      },
      utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    });

    inputRef.current.addEventListener("blur", () => {
      field.onChange(inputRef.current.value);
    });

    return () => {
      iti.destroy();
    };
  }, [field]);

  return (
    <div>
      <input
        className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        ref={inputRef}
        name={name}
        defaultValue={field.value}
        onBlur={field.onBlur}
      />
    </div>
  );
};

export default PhoneInput;
