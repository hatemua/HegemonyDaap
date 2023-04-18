import React, { useState,useEffect } from 'react';
import axios from "axios"
import { useHistory } from "react-router-dom";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { connectWallet,getCurrentWalletConnected,mintNFT,mintNFTWC } from "./interact.js";
import { providers } from "ethers";
 
import  './mintCSS.css'
const _lang="fr";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "40%",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);
function Mint(props)  {
	
const [walletAddress, setWallet] = useState("");
const [status, setStatus] = useState("");
const [name, setName] = useState("");
const [description, setDescription] = useState("");
const [url, setURL] = useState("");
const [amount, setAmount] = useState(0);
const [open, setOpen] = useState(false);
const [WorM, setWorM] = useState("");
const [connector, setConnector] = useState(null);
const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);

 useEffect(() => { 
 async function fetchData() {
      const {address, status} = await getCurrentWalletConnected();
	  //setWorM("Metamask");
	   setWallet(address);
    setStatus(status); 
    addWalletListener();
    if (address != "")
    {
      setWorM("Metamask");
    }

  }
  
  fetchData();

        }, []);
const history = useHistory();

 const connectWalletPressed = async () => { //TODO: implement
     console.log("ok");
	 const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
    if (walletResponse.address != "")
    {
      setWorM("Metamask");
    }
	setOpen(false);
  };
 const connectWalletProcess = async () => { //TODO: implement
 
	console.log("ok");
		
	const connectorV = new WalletConnect({
  bridge: "https://bridge.walletconnect.org", // Required
  qrcodeModal: QRCodeModal,
    });
	 if (!connectorV.connected) {
		  // create new session
		  connectorV.createSession();
			connectorV.on("connect", (error, payload) => {
		  if (error) {
			throw error;
		  }
		   
		  // Get provided accounts and chainId
		  const { accounts, chainId } = payload.params[0];
		  setWorM("WC");
		  setWallet(accounts);
		 });
		 }
     setConnector(connectorV);
 
 };
 const connectWalletPressedWC = async () => { //TODO: implement
     	handleClose();
		const a= await connectWalletProcess();
		
    };

    /*setStatus(walletResponse.status);
    setWallet(walletResponse.address);*/
	//console.log(walletResponse);
	
  

  const addWalletListener = () => {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        setWallet(accounts[0]);
        console.log(accounts[0]);

        setWorM("Metamask");
        setStatus("Write a message in the text-field above.");
      } else {
        setWallet("");
        setStatus("Connect to Metamask using the top right button.");
      }
    });
  } 
  
  
  else {
    setStatus(
      <p>
        {" "}
        ??{" "}
        <a target="_blank" href="https://metamask.io/download.html">
          You must install Metamask, a virtual Ethereum wallet, in your
          browser.
        </a>
      </p>
    );
  
}
}
  const onMintPressed = async () => { //TODO: implement
    console.log("ok");
    console.log(WorM);
	if (WorM == "")
	{
		alert("You are not connected to any wallet");
	
	}
	else if (!isNaN(+amount) && parseInt(amount)>0)
	{
		if (WorM == "Metamask")
		{
    const { status } = await mintNFT(amount);
		
    setStatus(status);
		}
		else
		{
		 const { status } = await mintNFTWC(connector,String(walletAddress),amount);
		
    setStatus(status);
		
		}
	}
	else
	{
	alert("amount not valid");
	}
  };



return (
	 <>
	  <div className="main" style={{backgroundImage: "url(/container.jpeg)",

  height: "100vh",

  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}}>

       

            <div className="container" 
//              style={{backgroundImage: "url(/container.jpeg)",

// height: "100%",

// backgroundPosition: "center",
// backgroundRepeat: "no-repeat",
// display: "flex",
// alignItems: "center",
// justifyContent: "center"}}
> 
                <div className="signin-content">
				     
                    <div className="signin-image">
						<Button variant="contained" onClick={handleOpen} >{walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}</Button> 
		
                        <figure><img src="/preview.gif" alt="sing up image" /></figure>
                    </div>
					
                    <div className="signin-form">
						
                        {/* <h2 className="text">PixelPepe</h2> */}
                        <figure><img src="/logo.png" alt="sing up image" /></figure>
                            <div className="form-group">
                                <label for="your_name"><i className="zmdi zmdi-account material-icons-name"></i></label>
                  <div className="nft-number">
                    <button
                      className="increment-btn"
                      disabled={amount === 0}
                      onClick={() => {
                        setAmount((currentvalue) => currentvalue - 1);
                      }}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      name="your_name"
                      id="your_name"
                      disabled={true}
                      placeholder="Number of NFT"
                      value={amount !== 0 ? amount : ""}
                    />
                    <button
                      className="increment-btn"
                      onClick={() => {
                        setAmount((currentvalue) => currentvalue + 1);
                      }}
                    >
                      +
                    </button>
                  </div>                            
							</div>
                <h4 class="text" style={{color:"white"}}>10 / 4321</h4>                           
                            <div onClick={async () => {await onMintPressed();}}
                            style={{backgroundImage: "url(/btnMint.gif)",

height: 200,

backgroundPosition: "center",
backgroundRepeat: "no-repeat",
display: "flex",
alignItems: "center",
justifyContent: "center"}}>
                            </div>
                        
                    </div>
                </div>
            </div>
		<Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
			<Stack direction="row" spacing={2} style={{justifyContent: "space-around"}}>
				<img src="metamask.png" style={{width:"20%",height:"20%"}} onClick={async () => {await connectWalletPressed();}}/>
				<img src="WalletConnect.png" style={{width:"20%",height:"20%"}} onClick={async () => {await connectWalletPressedWC();}}/>
			</Stack>
        </Box>
      </Modal>
    </div>
	 </>

)

}


export default Mint;