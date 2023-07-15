Run NFT Ticket Check
1. Install node and npm
   `npm install --save`
2. Install MetaMask plugin

3. Create new Account and add mumbai polygon network to MetaMask

4. Polygon mumbai faucet to earn polygon 

5. Copy private key of Account to paste private at file hardhat.config.js

6. Deploy Smart Contract

`npx hardhat run scripts/deploy.js --network mumbai`

7. Copy two contract address: nftadress, nftmarketplaceaddress to paste at file config.js. projAddress is your address account.

8. run frontend 

`npm run dev`