module.exports = {
  meta: {
    type: 'problem', // This rule identifies code that will cause an error
    docs: {
      description:
        "Ensure all exported functions are async if the file contains 'use server'",
      category: 'Best Practices',
      recommended: false,
    },
    schema: [], // No options
  },
  create(context) {
    let containsUseServer = false;

    return {
      Program(node) {
        const sourceCode = context.getSourceCode();
        const text = sourceCode.getText();
        containsUseServer = text.includes('use server');
      },
      ExportNamedDeclaration(node) {
        if (!containsUseServer) return;

        if (
          node.declaration &&
          node.declaration.type === 'FunctionDeclaration' &&
          !node.declaration.async
        ) {
          context.report({
            node: node.declaration,
            message:
              "Exported functions must be async if the file contains 'use server'.",
          });
        }
      },
      ExportDefaultDeclaration(node) {
        if (!containsUseServer) return;

        if (
          node.declaration.type === 'FunctionDeclaration' &&
          !node.declaration.async
        ) {
          context.report({
            node: node.declaration,
            message:
              "Exported functions must be async if the file contains 'use server'.",
          });
        }
      },
    };
  },
};
