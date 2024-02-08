export interface Variable {
  name: string;
  value: string;
  id: string;
}

export function getVariableString(variables: Variable[]): string {
  if (variables.length === 0) return "";
  let result: string = " Data: ";
  for (let i = 0; i < variables.length; i++) {
    if (
      variables[i].name.replaceAll(" ", "") !== "" &&
      variables[i].value.replaceAll(" ", "") !== ""
    )
      result += `[${variables[i].name}]=${variables[i].value}; `;
  }
  return result;
}
