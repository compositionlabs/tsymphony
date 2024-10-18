function createSchemaFromInterface(interfaceObj, schemaTitle) {
    var schema = {
        properties: {},
        required: [],
        title: schemaTitle,
        type: "object"
    };
    for (var key in interfaceObj) {
        if (Object.prototype.hasOwnProperty.call(interfaceObj, key)) {
            var value = interfaceObj[key];
            var fieldType = void 0;
            // Map TypeScript types to JSON Schema types
            switch (typeof value) {
                case 'string':
                    fieldType = 'string';
                    break;
                case 'number':
                    fieldType = 'integer';
                    break;
                case 'boolean':
                    fieldType = 'boolean';
                    break;
                default:
                    fieldType = 'string'; // Default to string for unknown types
            }
            schema.properties[key] = {
                type: fieldType,
                title: key.replace(/_/g, ' ').replace(/\b\w/g, function (char) { return char.toUpperCase(); })
            };
            // Check if the property is optional
            if (value !== undefined) {
                schema.required.push(key);
            }
        }
    }
    return schema;
}
var example = {
    ticker: "AAPL",
    benchmark_eps: 5.0
};
var schema = createSchemaFromInterface(example, "comparative_analysis_earnings_v2");
console.log(schema);
