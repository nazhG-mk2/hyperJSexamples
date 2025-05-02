import './style.css'

import { injected } from '@wagmi/connectors'

const sepoliaBaseRPC = import.meta.env.VITE_RPC_BASE_SEPOLIA;
const baseRPC = import.meta.env.VITE_RPC_BASE;
const mainnetRPC = import.meta.env.VITE_RPC_MAINNET;
const sepoliaRPC = import.meta.env.VITE_RPC_SEPOLIA;

const nodeUrl = import.meta.env.VITE_NODE_URL;
const aimSlot = import.meta.env.VITE_AIM_SLOT;
const hypercycle = MyLibrary.default

const startConfig = () =>
  hypercycle.setAvailableRPCs({
    sepolia: sepoliaRPC,
    mainnet: mainnetRPC,
    base: baseRPC,
    baseSepolia: sepoliaBaseRPC,
  });

startConfig()

const config = hypercycle.wagmiConfig()

let userAddress = null

async function connectWallet() {
  const result = await hypercycle.coreConnect(config, { connector: injected() })
  const { address } = await hypercycle.getCoreAccount(config)
  userAddress = address
  if (userAddress) {
    document.getElementById('connectBtn').disabled = true
    document.getElementById('connectBtn').innerText = "Connected ✅"
  }
  console.log({ userAddress })
}

const getNodeAddress = async () => {
  const { tm: { address } } = await hypercycle.getNodeInfo(
    nodeUrl,
  );
  return address
}

// balanceBtn
const getBalance = async () => {
  try {
    const balance = await hypercycle.getNodeBalance(
      nodeUrl,
      userAddress
    );
    document.getElementById('balance').innerText = `Balance: ${balance[userAddress]['HyPC']} USDC`
  } catch (error) {
    console.log(error);
  }
}

// costBtn
const getCost = async () => {
  try {
    const resp = await hypercycle.aimFetch(
      userAddress,
      nodeUrl,
      aimSlot,
      "POST",
      `/cost`,
      { "cost_only": "1" },
      '{"costs": [{"currency": "HyPC", "estimated_cost": 1}]}',
      {},
      "ethereum"
    );
    const cost = await resp.json()
    console.log({ cost });
    document.getElementById('costResult').innerText = `Cost: ${JSON.stringify(cost)}`

  } catch (error) {
    console.log(error);
  }
};

const pay = async () => {
  const nodeAddress = await getNodeAddress()
  try {
    const pay = await hypercycle.nodeDeposit(
      nodeUrl,
      userAddress,
      nodeAddress,
      5000000,
      "USDC",
      "Sepolia"
    );
    console.log({ pay });

  } catch (error) {
    console.log(error);
  }
};

document.getElementById('costBtn').onclick = getCost
document.getElementById('payBtn').onclick = pay
document.getElementById('connectBtn').onclick = connectWallet
document.getElementById('balanceBtn').onclick = getBalance