import './style.css'

import { injected } from '@wagmi/connectors'

const sepoliaBaseRPC = import.meta.env.VITE_RPC_BASE_SEPOLIA;
const baseRPC = import.meta.env.VITE_RPC_BASE;
const mainnetRPC = import.meta.env.VITE_RPC_MAINNET;
const sepoliaRPC = import.meta.env.VITE_RPC_SEPOLIA;

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
const nodeUrl = "http://localhost:8000/"

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

const nodeAddress = await getNodeAddress()

const pay = async () => {
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

document.getElementById('payBtn').onclick = pay
document.getElementById('connectBtn').onclick = connectWallet