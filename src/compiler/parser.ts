import { tokenise } from "./tokeniser"

export function parse(source: string) {
  console.log("Input:", source)
  console.log(tokenise(source).toString())
}