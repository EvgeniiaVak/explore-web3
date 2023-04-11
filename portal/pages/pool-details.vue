<template>
  <py-script>
    print('Hello, World!')
  </py-script>
</template>

<script type="module" lang="ts" async>
useHead({
  link: [{ rel: "stylesheet", href: "https://pyscript.net/latest/pyscript.css" }],
  script: [{ defer: true, src: "https://pyscript.net/latest/pyscript.js" }]
});
</script>
