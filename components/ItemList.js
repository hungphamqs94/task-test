import React from "react";
import Web3Modal from "web3modal";
import { nftaddress, nftmarketaddress, projAddress } from "../config";
import Card from "./Card";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
// import prisma from '../lib/prisma.ts';
import axios from "axios";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    getItems(filterCategory);
  }, [filterCategory]);

  useEffect(() => {
    getItems("All");
    setIsLoading(false);
  }, []);

  const getItemData = async () => {
    const listItem = await axios.get("http://localhost:4000/posts");
    console.log('so luong item la:'+listItem)
  };

  const getItemDataFollowCategory = async (category) => {
    const listItem = await axios.get("http://localhost:4000/post/"+category);
    console.log(listItem)
  }

  const getItems = async (category) => {
    console.log('cha le khong vao day sao the ')
    try {
      // const provider = new ethers.providers.JsonRpcProvider(projAddress);
      // await provider.ready;
      const web3Modal = new Web3Modal(projAddress);
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
      const marketContract = new ethers.Contract(
        nftmarketaddress,
        NFTMarket.abi,
        provider
      );
      let listItem;
      let data = [];
      let item;
      if (category == "All") {
        console.log('vay la khong vao day roi')
        getItemData();
        listItem = await marketContract.getMarketItems();
        console.log('so luong listItem', listItem.length)
        for(var i=0;i<listItem.length; i++){
          item = await marketContract.getItemFollowId(listItem[i].toNumber());
          console.log('vao day:', item)
          data.push({
            itemId: item[0].toNumber(), 
            nftContract: item[1], 
            tokenId: item[2].toNumber(), 
            seller: item[3], 
            owner: item[4], 
            category: item[5], 
            price: ethers.utils.formatUnits(item[6].toString(),"ether"),
            isSold: item[7]
          })
        }
      } else {
        console.log('no vao day sao troi:'+category)
        listItem = await marketContract.getItemsByCategory(category);
        getItemDataFollowCategory(category);
        for(var i=0;i<listItem.length; i++){
          item = await marketContract.getItemFollowId(listItem[i].toNumber());
          data.push({
            itemId: item[0].toNumber(), 
            nftContract: item[1], 
            tokenId: item[2].toNumber(), 
            seller: item[3], 
            owner: item[4], 
            category: item[5], 
            price: item[6].toNumber()/10^18, 
            isSold: item[7]
          })
        }
      }
      console.log('hihi:', data)
      let newItems = await Promise.all(
        data.map(async (d) => {
          console.log('gia tri token:', d.tokenId)
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
      ).catch((err) => {
        console.log(err);
      });
      setItems(newItems);
    } catch (error) {
      console.log('loi gi the:'+error);
    }
  };

  const buyNft = async (nft) => {
    try {
      const web3Modal = new Web3Modal(projAddress);
      const connection = await web3Modal.connect();
      const prov = new ethers.providers.Web3Provider(connection);

      const signer = prov.getSigner();
      const contract = new ethers.Contract(
        nftmarketaddress,
        NFTMarket.abi,
        signer
      );

      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
      const transaction = await contract.createMarketSale(
        nftaddress,
        nft.tokenId,
        {
          value: price.toString(),
        }
      );
      console.log(transaction);
      const tx = await transaction.wait();
      console.log(tx);
      getItems("All");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div style={{ width: "200px" }}>
        <label htmlFor="category">Category:</label>{" "}
        <select
          name="category"
          id="category"
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Art">Art</option>
          <option value="Graphics">Graphics</option>
          <option value="Others">Others</option>
        </select>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {!isLoading && items.length > 0 ? (
          items.map((item, key) => (
            <Card key={key} buyNft={buyNft} data={item} />
          ))
        ) : (
          <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>
        )}
      </div>
    </div>
  );
};

export default ItemList;
