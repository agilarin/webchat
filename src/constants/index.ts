import {FieldValues} from "react-hook-form";


export const FORM_REGISTER_OPTIONS = {
  EMAIL: {
    required: true,
    pattern: {
      value: /\S+@\S+\.\S+/,
      message: "Invalid email address",
    }
  },
  USERNAME: {
    required: true,
    minLength: 5
  },
  PASSWORD: {
    required: true,
    minLength: 8,
  },
  CONFIRM_PASSWORD: {
    required: true,
    minLength: 8,
    validate: (value: string, formValues: FieldValues) => {
      if (formValues.password != value) {
        return "Your passwords do no match";
      }
    },
  },
}

