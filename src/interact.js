import { useEffect, useState } from "react";

import { contractABI } from './abi';
import { EventAbi } from './EventAbi';
const alchemyKey="https://eth-mainnet.alchemyapi.io/v2/9YkULSmxC2HB8TD7N01E0NMceYtP9KUh";
const TestnetRPC= "https://sepolia.infura.io/v3/";
const alchemyKeyPolygon="https://polygon-mumbai.g.alchemy.com/v2/5poS7fZK0MZD8IXlCJT812ku4pwpwsHS";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const {ethers, Wallet} = require("ethers");

const web3 = createAlchemyWeb3(alchemyKey);
const web3Poly = createAlchemyWeb3(alchemyKeyPolygon);
const contractAddress = "0x31E2B813E3EAc9B96746771Ed975D9bCc671fd27";
const EventcontractAddress = "0x643A113A4FE9C003966B4D2Fecd195828BA4f20C";

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "Write a message in the text-field above.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};


export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "Write a message in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "" + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            {" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const mintNFT = async(amount) => {
 //error handling
  const provider= new ethers.providers.JsonRpcProvider(TestnetRPC);
	   const gasPrice = await provider.getFeeData();
  const val= Number(amount * 0.1 * 1e18).toString(16);
  const nftContract = await new web3.eth.Contract(contractABI, contractAddress,amount);
    //set up your Ethereum transaction
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        maxPriorityFeePerGas: web3.utils.toHex(
          Number(gasPrice.maxPriorityFeePerGas) * 50
        ),
        maxFeePerGas: null,
        gas: ethers.BigNumber.from(400000).toHexString(),
		value: "0x" + val,
        'data': nftContract.methods.mint(amount).encodeABI() //make call to NFT smart contract 
		//Web3.utils.toBN(Web3.utils.toWei(val, "ether")).toString(16)
    };
    console.log(transactionParameters)
    //sign transaction via Metamask
    try {
        const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
        // console.log(txHash);
        return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }
}
export const mintNFTWC = async(connector,account,amount) => {
 //error handling
  	const provider= new ethers.providers.JsonRpcProvider(TestnetRPC);
	   const gasPrice = await provider.getFeeData();

  const val= Number(amount * 0.1 * 1e18).toString(16);
  const nftContract = await new web3.eth.Contract(contractABI, contractAddress,amount);
    //set up your Ethereum transaction
    const tx = {
        to: contractAddress, // Required except during contract publications.
        from: account, // must match user's active address.
        maxPriorityFeePerGas: web3.utils.toHex(
          Number(gasPrice.maxPriorityFeePerGas) 
        ),
        maxFeePerGas: null,
        gas: ethers.BigNumber.from(400000).toHexString(),

       
		value: "0x" + val,
        'data': nftContract.methods.mint(amount).encodeABI() //make call to NFT smart contract 
		//Web3.utils.toBN(Web3.utils.toWei(val, "ether")).toString(16)
    };
    //sign transaction via Metamask
    try {
        connector
  .sendTransaction(tx)
  .then((result) => {
    // Returns transaction id (hash)
	console.log(result);
	 return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + result
        }
    
  })
  .catch((error) => {
    // Error returned when rejected
    console.error(error);
  });
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }
}

export const AddEventC = async(maxParticipations,Type,description,Title) => {
 //error handling
  
  const nftContract = await new web3Poly.eth.Contract(EventAbi, EventcontractAddress);
    //set up your Ethereum transaction
    const transactionParameters = {
        to: EventcontractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        gasPrice: web3Poly.utils.toHex(web3.utils.toWei('30','gwei')),  
        gas: "0x50000",
        'data': nftContract.methods.AddEvent(maxParticipations,Type,description,Title).encodeABI() //make call to NFT smart contract 
		//Web3.utils.toBN(Web3.utils.toWei(val, "ether")).toString(16)
    };
    console.log(transactionParameters)
    //sign transaction via Metamask
    try {
        const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
        // console.log(txHash);
        return {
            success: true,
			txHash : txHash,
            status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }
}

