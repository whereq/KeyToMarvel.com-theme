import { UserProfileAttributeMetadata } from "@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata";
import { InputType } from "./Types";
import { FIELDS } from "./FieldMappings";
import { isRootAttribute } from "../utils";

const DEFAULT_INPUT_TYPE = "text" satisfies InputType;

function determineInputType(
  attribute: UserProfileAttributeMetadata,
): InputType {
  // Always treat the root attributes as a text field.
  if (isRootAttribute(attribute.name)) {
    return "text";
  }

  const inputType = attribute.annotations?.inputType;

  // if we have an valid input type use that to render
  if (isValidInputType(inputType)) {
    return inputType;
  }

  // In all other cases use the default
  return DEFAULT_INPUT_TYPE;
}

const isValidInputType = (value: unknown): value is InputType =>
  typeof value === "string" && value in FIELDS;

const isMultiValue = (value: unknown): boolean =>
  Array.isArray(value) && value.length > 1;

export { determineInputType, isValidInputType, isMultiValue };