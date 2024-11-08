async function processTemplate(source: string) {
    const { template, script, style } = parseComponentSections(source)


    const tokens = tokenise(template)
    const ast = parse(tokens)
    const jsx = transform(ast)

    return generateComponent(jsx, script, style)
}