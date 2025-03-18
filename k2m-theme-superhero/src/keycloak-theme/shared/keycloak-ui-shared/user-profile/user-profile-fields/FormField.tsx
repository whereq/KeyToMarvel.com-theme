import { useMemo } from "react";
import { FieldPath } from "react-hook-form";
import { LocaleSelector } from "../LocaleSelector";
import { UserFormFields, fieldName } from "../utils";
import { FIELDS } from "./FieldMappings";
import { FormFieldProps } from "./Types";
import { determineInputType, isMultiValue } from "./userProfileFieldsUtils";


const FormField = ({
  t,
  form,
  renderer,
  supportedLocales,
  currentLocale,
  attribute,
}: FormFieldProps) => {
  const value = form.watch(
    fieldName(attribute.name) as FieldPath<UserFormFields>,
  );
  const inputType = useMemo(() => determineInputType(attribute), [attribute]);

  const Component =
    attribute.multivalued ||
    (isMultiValue(value) && attribute.annotations?.inputType === undefined)
      ? FIELDS["multi-input"]
      : FIELDS[inputType];

  if (attribute.name === "locale")
    return (
      <LocaleSelector
        form={form}
        supportedLocales={supportedLocales}
        currentLocale={currentLocale}
        t={t}
        attribute={attribute}
      />
    );
  return (
    <Component
      t={t}
      form={form}
      inputType={inputType}
      attribute={attribute}
      renderer={renderer}
    />
  );
};

export { FormField };