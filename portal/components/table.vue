<template>
  <div class="overflow-x-auto">
    <table class="table table-compact w-full">
      <!-- head -->
      <thead>
      <tr>
        <th>#</th>
        <th v-for="h in headers">{{ h }}</th>
      </tr>
      </thead>
      <tbody>
      <!-- rows -->
      <tr v-for="(row, index) in rows">
        <th>{{ index + 1 }}</th>
        <td v-for="h in headers">
          <template v-if="h==='pool'"><a
              :href="row.link">{{ row[h] }}</a>
          </template>
          <template v-else>{{ row[h] }}</template>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    required: true,
  },
})
</script>