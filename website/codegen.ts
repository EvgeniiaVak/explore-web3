import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/graphql/generated/schema.graphql",
  generates: {
    "./src/graphql/generated/": {
      documents: "../../**/*.graphql",
      preset: "client",
      plugins: []
    }
  }
};

export default config;
