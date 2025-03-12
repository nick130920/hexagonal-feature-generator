export function processTemplate(
    template: string,
    packageName: string,
    entityName: string,
    attributes: Array<{ type: string; name: string }>
): string {
    const isGraphQL = template.includes('type Query') || template.includes('schema');
    const fields = isGraphQL
        ? attributes.map(attr => `    ${attr.name}: ${mapJavaTypeToGraphQLType(attr.type)}`).join('\n')
        : attributes.map(attr => `    private ${attr.type} ${attr.name};`).join('\n');
    const setters = attributes.map(attr => {
        const capName = attr.name.charAt(0).toUpperCase() + attr.name.slice(1);
        return `        entity.set${capName}(request.get${capName}());`;
    }).join('\n');
    return template
        .replace(/\${PACKAGE}/g, packageName)
        .replace(/\${FEATURE}/g, entityName)
        .replace(/\${FEATURE_LOWER}/g, entityName.toLowerCase())
        .replace(/\${FEATURE_PLURAL}/g, pluralize(entityName.toLowerCase()))
        .replace(/\${FEATURE_PLURAL_CAPITAL}/g, pluralize(entityName))
        .replace(/\${FIELDS}/g, fields)
        .replace(/\${SETTERS}/g, setters);
}

function mapJavaTypeToGraphQLType(javaType: string): string {
    switch (javaType.toLowerCase()) {
        case 'string': return 'String';
        case 'int':
        case 'integer':
        case 'long': return 'Int';
        case 'double':
        case 'float': return 'Float';
        case 'boolean': return 'Boolean';
        default: return 'String';
    }
}

function pluralize(word: string): string {
    const irregularPlurals: { [key: string]: string } = {
        child: "children",
        person: "people",
        mouse: "mice",
        goose: "geese",
        tooth: "teeth",
        foot: "feet",
        man: "men",
        woman: "women",
        sheep: "sheep",
        fish: "fish",
        deer: "deer",
        series: "series",
        species: "species",
        genus: "genera",
        medium: "media"
    };
    if (irregularPlurals[word]) {
        return irregularPlurals[word];
    }
    const pluralRules: Array<[RegExp, string]> = [
        [/ss$/, 'sses'],
        [/[sxz]$|ch$|sh$/, 'es'],
        [/[aeiou]y$/i, 'ies'],
        [/f$|fe$/, 'ves'],
        [/[^aeiou]o$/, 'es'],
        [/$/, 's']
    ];
    for (const [rule, suffix] of pluralRules) {
        if (rule.test(word)) {
            return word.replace(rule, suffix);
        }
    }
    return word + 's';
}
