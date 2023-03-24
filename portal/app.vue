<template>
  <div>
    <NuxtLayout>
      <div class="mx-auto max-w-screen-xl p-5 prose dark:prose-invert">
        <div class="flex justify-between text-sm font-light">
          <select class="select select-ghost select-sm max-w-xs font-light" v-model="colorMode.preference">
            <option disabled selected>Theme</option>
            <option v-for="theme of themes" :key="theme">{{ theme }}</option>
          </select>
          <div>
            <div v-if="isConnected" class="flex-col mx-6">
              <div>Network: {{ networkName }}</div>
              <div>Balance: {{ balance }} ETH</div>
            </div>
            <div v-else>
              <button @click="connect" class="btn">Connect Wallet</button>
            </div>
          </div>
        </div>

        <NuxtPage/>
      </div>
    </NuxtLayout>
  </div>
</template>

<script lang="ts" type="module" setup>
import Web3Modal from "web3modal"
import {BrowserProvider, ethers} from "ethers"

const colorMode = useColorMode()
const themes = [
  'system',
  'light',
  'dark',
  // 'cupcake',
  // 'bumblebee',
  // 'emerald',
  // 'corporate',
  // 'synthwave',
  // 'retro',
  'cyberpunk',
  // 'valentine',
  // 'halloween',
  // 'garden',
  // 'forest',
  // 'aqua',
  // 'lofi',
  // 'pastel',
  // 'fantasy',
  // 'wireframe',
  // 'black',
  // 'luxury',
  // 'dracula',
  // 'cmyk',
  // 'autumn',
  // 'business',
  // 'acid',
  // 'lemonade',
  // 'night',
  // 'coffee',
  // 'winter',
];

let browserProvider: null | BrowserProvider = null
const networkName = ref('')
const isConnected = ref(false)
const account = ref('')
const balance = ref('')

async function connect() {
  const web3Modal = new Web3Modal({
    providerOptions: {},
    disableInjectedProvider: false,
  })
  const provider = await web3Modal.connect()
  browserProvider = new BrowserProvider(provider)

  account.value = await (await browserProvider.getSigner()).getAddress()
  balance.value = ethers.formatEther(await browserProvider.getBalance(account.value))
  isConnected.value = provider.isConnected()
  networkName.value = (await browserProvider.getNetwork()).name
}
</script>
