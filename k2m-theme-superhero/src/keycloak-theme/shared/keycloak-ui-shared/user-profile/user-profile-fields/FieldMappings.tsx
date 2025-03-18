import { JSX } from "react";
import { MultiInputComponent } from "../MultiInputComponent";
import { OptionComponent } from "../OptionsComponent";
import { SelectComponent } from "../SelectComponent";
import { TextAreaComponent } from "../TextAreaComponent";
import { TextComponent } from "../TextComponent";
import { InputType, UserProfileFieldProps } from "./Types";

export const FIELDS: {
  [type in InputType]: (props: UserProfileFieldProps) => JSX.Element;
} = {
  text: TextComponent,
  textarea: TextAreaComponent,
  select: SelectComponent,
  "select-radiobuttons": OptionComponent,
  multiselect: SelectComponent,
  "multiselect-checkboxes": OptionComponent,
  "html5-email": TextComponent,
  "html5-tel": TextComponent,
  "html5-url": TextComponent,
  "html5-number": TextComponent,
  "html5-range": TextComponent,
  "html5-datetime-local": TextComponent,
  "html5-date": TextComponent,
  "html5-month": TextComponent,
  "html5-time": TextComponent,
  "multi-input": MultiInputComponent,
} as const;