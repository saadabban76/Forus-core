import NavBar from "./NavBar";
import Foruskey from "./Foruskey";
import Instruction from "./Instruction";
import Trx from "./Trx";
import React, { createContext, useState, useEffect } from "react";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import abi from "../artifacts/contracts/Logs.sol/Logs.json";
import { ethers } from "ethers";

type Props = {};

interface ContextValue {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean | any>>;
  connectWallet(): void;
  contractAddress: string;
  chainname: string;
  sumof: string | any;
  setsumof: React.Dispatch<React.SetStateAction<string | any>>;
  sumofAddress: string | any;
  setsumofAddress: React.Dispatch<React.SetStateAction<string | any>>;
  validateChain(): void;
}

export const AppContext = createContext<ContextValue | any>(null);
const Cryptia = (props: Props) => {
  const notyf = new Notyf();

  const [show, setShow] = useState<boolean>(true);
  const [, setwallet] = useState<boolean>(false);
  const [sumof, setsumof] = useState<string | any>("");
  const [sumofAddress, setsumofAddress] = useState<string | any>("");
  const [chainname, setchainname] = useState<string | any>("");

  let contractAddress: string = "0x60BA717Dd36b84557E46690c6163De5dbDc6F6bb";
  let apothemcontractAddress: string = "0x5c75A721154B03C8cAA8Beaab9803b1c214D2a3b";

  const { ethereum }: any = window;

  const CHAIN_NAMES: any = {
    '1': 'Mainnet',
    '5': 'Goerli',
    '11155111': 'Sepolia',
    '51': 'Apothem'

    // Add more chain IDs and names as needed
  };

  const fetchChainName = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const network = await provider.getNetwork();
    setchainname(CHAIN_NAMES[network.chainId.toString()] || 'Unsupprted❌');
    // console.log("network", chainName)

  }

  useEffect(() => {


    const fetchData = async () => {
      const provider = new ethers.providers.Web3Provider(ethereum);
      console.log(chainname)

      let contract :any;
      if (chainname === 'Sepolia') {
        contract = new ethers.Contract(contractAddress, abi.abi, provider);
        console.log(contract);
      }
      if (chainname === 'Apothem'){
        contract = new ethers.Contract(apothemcontractAddress, abi.abi, provider);
        console.log('hello')
        console.log(contract);
      }


      const limit = await contract.getTotalAddresses();
      const totalFunds = await contract.getTotalVolume();
      setsumof(limit.toString());
      setsumofAddress(totalFunds / 10 ** 18);
    };
    fetchData();
  }, [show]);

  const accountChecker = async () => {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    sessionStorage.setItem("address", accounts[0]);
  };

  const validateChain = async () => {
    const chainId = await ethereum.request({ method: "eth_chainId" });
    console.log(chainId)

    if (chainId !== "0xaa36a7" && chainId !== "0x33") {
      notyf.error("unSupported Chain");
      return;
    }
  };

  useEffect(() => {
    validateChain();
    fetchChainName()
  }, []);

  if (ethereum) {
    ethereum.on("accountsChanged", (address: any) => {
      sessionStorage.setItem("address", address);
      window.location.reload();
    });

    ethereum.on("chainChanged" || "accountsChanged", (chId: any) => {
      accountChecker();
      window.location.reload();
      if (chId !== "0xaa36a7" && chId !== "0x33") {
        notyf.error("unSupported Chain");
        return;
      }
    });
  } else {
    notyf.error("Plz install metamask");
  }

  const connectWallet = async (): Promise<void> => {
    if (ethereum === undefined) {
      notyf.error("Plz install metamask");
      return;
    }
    fetchChainName()

    try {

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      sessionStorage.setItem("address", accounts[0]);
      validateChain();

      setwallet(true);
    } catch (e: any) {
      notyf.error(e);
    }
  };

  const ContextValue: ContextValue = {
    show,
    setShow,
    connectWallet,
    contractAddress,
    sumof,
    setsumof,
    sumofAddress,
    setsumofAddress,
    validateChain,
    chainname,
  };

  return (
    <AppContext.Provider value={ContextValue}>
      <div className="bg-[#000000]  min-h-[100vh] max-h-max">
        <NavBar />
        <div
          className="md:w-[90%] max-w-[1220px] mx-auto
                  py-8 p-4"
        >
          <Foruskey />
          <div className="flex flex-col-reverse space-y-4 sm:flex-row justify-between p-3 py-16 ">
            <Instruction />
            <Trx />
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default Cryptia;
