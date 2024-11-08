import { Token } from "./types";

export function tokenise(source: string): Token[] {
    // Pattern matching for tags, attributes, etc.

    const tagPattern = /<\/?([a-zA-Z]+)([^>]*)>/g;
    const directivePattern = /on:([a-z]+)={([^}]*)}/g;
    const classPattern = /\.[a-zA-Z0-9_-]+/;
    const idPattern = /#[a-zA-Z0-9_-]+/;

    return []
}