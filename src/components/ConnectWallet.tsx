import { Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMetaMask } from "metamask-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CHAIN_ID, CHAIN_PARAMS } from "../const";

// async function connect() {
//   if (!window.ethereum)
//     return showNotification({
//       message: "A wallet was not detected",
//       color: "red",
//     });
//   await window.ethereum.request({ method: "eth_requestAccounts" });

//   const chainId = "0x405"; // BTT

//   if (window.ethereum.networkVersion !== chainId) {
//     try {
//       await window.ethereum.request({
//         method: "wallet_switchEthereumChain",
//         params: [{ chainId }],
//       });
//     } catch (err) {
//       // This error code indicates that the chain has not been added to MetaMask
//       if (err.code === 4902) {
//         await window.ethereum.request({
//           method: "wallet_addEthereumChain",
//           params: [
//             {
//               chainName: "BitTorrent Chain Donau",
//               chainId,
//               nativeCurrency: { name: "BTT", decimals: 18, symbol: "BTT" },
//               rpcUrls: ["https://pre-rpc.bt.io/"],
//               blockExplorerUrls: ["https://testscan.bt.io"],
//               iconUrls: ["https://static.bt.io/production/logo/1002000.png"],
//             },
//           ],
//         });
//       }
//     }
//   }
// }

export default function ConnectWallet() {
  const router = useRouter();
  const { status, connect, addChain, chainId, switchChain } = useMetaMask();

  async function handleNetworkChange() {
    await switchChain(CHAIN_ID)
      .catch(async (err) => {
        if (err.code === 4902) await addChain(CHAIN_PARAMS);
      })
      .then(() => {
        router.reload();
      });
  }

  const handleClick = () => {
    if (status === "notConnected")
      connect().then(() => {
        router.reload();
      });
  };

  useEffect(() => {
    if (status === "notConnected")
      showNotification({ message: "Metamask is not connected!", color: "red" });
    if (status === "unavailable")
      showNotification({
        message: "A wallet was not detected!",
        color: "red",
      });
  }, [status]);

  useEffect(() => {
    if (status === "connected" && chainId !== CHAIN_ID) {
      handleNetworkChange();
      showNotification({ message: "wrong network!", color: "red" });
    }
  }, [chainId]);
  return (
    <Button
      loading={status === ("initializing" || "connecting")}
      onClick={handleClick}
      variant="white"
      color={"dark"}
      radius={"xl"}
    >
      {status === "notConnected" ? "Connect" : status}
    </Button>
  );
}
