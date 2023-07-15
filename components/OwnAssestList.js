import React from "react";
import Web3Modal from "web3modal";
import { nftaddress, nftmarketaddress, projAddress } from "../config";
import UserCard from "./UserCard";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getItems();
    setIsLoading(false);
  }, []);

  const getItems = async () => {
    try {
      const web3Modal = new Web3Modal(projAddress);
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const marketContract = new ethers.Contract(
        nftmarketaddress,
        NFTMarket.abi,
        signer
      );
      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);

      var listItem = await marketContract.fetchPurchasedNFTs();
      var data = [];
      var item = null;
      console.log('so luong item asset list', listItem.length)
      //console.log('nft contract:', item[1])
      for(var i=0;i<listItem.length; i++){
        item = await marketContract.getItemFollowId(listItem[i].toNumber());
        console.log(ethers.utils.formatUnits(item[6].toString(),"ether"));
        data.push({
          itemId: 1,
          nftContract: item[1], 
          tokenId: item[2].toNumber(), 
          seller: item[3], 
          owner: item[4], 
          category: item[5], 
          price: ethers.utils.formatUnits(item[6].toString(),"ether"),
          isSold: item[7]
        })
      }

      // console.log(data);

      let newItems = await Promise.all(
        data.map(async (d) => {
          const tokenUri = await tokenContract.tokenURI(d.tokenId);
          const meta = await axios.get(tokenUri);
          const price = d.price;

          return {
            price,
            tokenId: d.tokenId,
            seller: d.seller,
            owner: d.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
          };
        })
      );
      console.log(newItems);

      setItems(newItems);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {items.length &&
        items.map((item, key) => <UserCard key={key} data={item} />)}
    </div>
  );
};

export default ItemList;
