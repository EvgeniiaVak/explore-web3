// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  typescript: {
    typeCheck: true,
  },
  modules: ["@nuxtjs/apollo", "@nuxtjs/tailwindcss", "@nuxtjs/color-mode"],
  colorMode: {
    preference: "cyberpunk", // default value of $colorMode.preference
    fallback: "dark",
    dataValue: "theme", // activate data-theme in <html> tag
    classSuffix: "",
  },
  apollo: {
    clients: {
      default: {
        httpEndpoint:
          "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
      },
    },
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith("py-"),
    },
  },
});
