import { Crc } from "../helper/Crc";
import base58 from "bs58";
import { useState, useEffect } from "react";
import EllipticCurve from "elliptic";
import { AiOutlineCopy } from "react-icons/ai";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { downloadTxt } from "../helper/downloadTxt";
import { FaFileSignature } from "react-icons/fa";
import bg from "../assets/bg.png";

const ec = new EllipticCurve.ec("secp256k1");

type Props = {};

const ForusKey = (props: Props) => {
  const notyf = new Notyf();
  const [ForusKey, setForusKey] = useState<string | any>("");
  const [, setstoredsignatureKey] = useState<string | any>("");
  const [note, setnote] = useState<boolean>(false);

  //generating the cp address and secret key
  const Generate = () => {
    try {
      let key = ec.genKeyPair();

      const signature: void = sessionStorage.setItem(
        "signature",
        key.getPrivate().toString(16)
      );
      setstoredsignatureKey(signature);

      const signatureKey = ec.keyFromPrivate(
        key.getPrivate().toString(16),
        "hex"
      );

      const publicKey = Uint8Array.from(
        signatureKey.getPublic().encodeCompressed("array")
      );

      const crc = Crc(publicKey);
      const enc: Uint8Array = new Uint8Array(publicKey.length + 2);
      enc.set(publicKey);
      enc.set(crc, publicKey.length);
      const fk: string = "Fk" + base58.encode(enc);
      sessionStorage.setItem("fk", fk);
      setForusKey(fk);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    Generate();
  }, []);

  const reveal = () => {
    setnote(true);
    setTimeout(() => {
      setnote(false);
    }, 9000);
  };

  const copy = () => {
    navigator.clipboard.writeText(ForusKey);
    notyf.success("Copied");
  };

  const load = () => {
    navigator.clipboard.writeText(ForusKey);
    downloadTxt(sessionStorage.getItem("signature"), "Forus-signature.txt");
    reveal();
  };

  return (
    <>
      <div
        style={{ backgroundImage: `url(${bg})` }}
        className="bg-cover object-scale-down border border-black rounded-md backdrop-blur-lg bg-no-repeat flex flex-col items-center p-8 rounded-t-md"
      >
        <div className="pb-6 flex flex-col space-y-4 items-center border-black  w-full">
          <h1
            className="mx-auto montserrat-heading font-[1000]
             sm:text-[2.1rem] xl:text-[2.7rem] bg-clip-text text-bgGray
              text-3xl"
          >
            {" "}
            Attain Funds
            <span
              className="hightlightText
            text-transparent sm:text-[2.6rem] xl:text-[3.1rem] bg-clip-text 
            bg-gradient-to-r from-highlight to-cyan-600
            "
            >
              {" "}
              Covertly & Securely
            </span>{" "}
            With Forus
          </h1>
          <p className="text-gray-300 text-[0.8rem] sm:text-[1.1rem]">
            never reveal the signature. Share your forus key to recieve funds.
          </p>

          {note === true && (
            <p className="montserrat-small text-bgGray  mb-4 font-semibold font-mono w-[80%]">
              Note : Guard the signature, unleash the Key. Never reveal the
              'signature' , only share your 'ForusKey' for confidential
              transactions.{" "}
            </p>
          )}
        </div>
        {/* Forus */}
        <div className="flex space-x-4">
          <div
            className="my-4 flex sm:gap-4 items-center p-2 sm:px-3 sm:mx-0 mx-3 bg-gray-500 bg-opacity-60
           rounded-md hover:shadow-sm shadow-gray-300 px-2   "
          >
            <p
              className="sm:text-[1rem] text-[0.8rem] montserrat-small font-extrabold 
            text-bgGray "
            >
              <span className="sm:text-[1.1rem] text-[0.9rem] text-white text-md font-extrabold">
                #Foruskey
              </span>{" "}
              - {ForusKey}
            </p>
          </div>
          <div className="flex items-center text-white space-x-3">
            <AiOutlineCopy
              className="cursor-copy font-bold text-2xl text-[181b1f] hover:text-highlight"
              onClick={copy}
            />
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            className="mb-4 my-2 montserrat-subtitle border-1 p-1 montserrat-subtitle border border-black
         hover:text-highlight hover:border hover:border-highlight px-6 text-center  
         highlight bg-black text-black rounded-md font-semibold transition-all ease-linear"
            onClick={Generate}
          >
            Generate
          </button>
          <div
            className="flex cursor-pointer space-x-2 mb-4 my-2 montserrat-subtitle border-1 p-1 
            montserrat-subtitle border border-highlight
            text-highlight hover:border hover:text-black px-6 text-center  
            bg-tranparent text-black rounded-md font-semibold transition-all ease-linear
            hover:bg-gradient-to-r hover:from-teal-400 hover:to-cyan-500
            "
            onClick={Generate}
          >
            <FaFileSignature
              className="font-bold text-2xl text-[181b1f]"
              onClick={load}
            />
            <span>Save</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForusKey;
