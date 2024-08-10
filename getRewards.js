/**
 * @file getRewards.js
 * @author Wafik Aboualim
 * @date August 8, 2024
 * @license Copyright (c) 2024 Wafik Aboualim. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 * 
 * @description This module provides functionality to fetch and process
 * rewards data for Helium hotspots. It interacts with the Helium blockchain
 * and related APIs to retrieve metadata and calculate rewards for both IoT
 * and Mobile networks.
 * 
 * @module hotspot-rewards
 * @requires @helium/lazy-distributor-sdk
 * @requires @helium/distributor-oracle
 * @requires @coral-xyz/anchor
 * @requires @solana/web3.js
 * @requires axios
 */

const { init, lazyDistributorKey } = require("@helium/lazy-distributor-sdk");
const { getCurrentRewards } = require("@helium/distributor-oracle");
const anchor = require("@coral-xyz/anchor");
const { PublicKey, Keypair } = require("@solana/web3.js");
const axios = require('axios');

// Constants
const RPC_URL = process.env.RPC_URL;
const MINTS = {
  IOT: new PublicKey(process.env.IOT_MINT),
  MOBILE: new PublicKey(process.env.MOBILE_MINT)
};

/**
 * Fetches metadata for a given hotspot address.
 * 
 * @async
 * @param {string} hotspotAddress - The address of the hotspot.
 * @returns {Promise<Object>} The metadata of the hotspot.
 * @throws {Error} If there's an error fetching the hotspot info.
 */
const getHotspotMetaData = async (hotspotAddress) => {
  const url = `https://entities.nft.helium.io/${hotspotAddress}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching hotspot info:", error);
    throw error;
  }
};

/**
 * Generates a dummy wallet for interacting with the Solana network.
 * 
 * @returns {anchor.AnchorProvider} A provider with a dummy wallet.
 */
const generateDummyWallet = () => {
  const wallet = new anchor.Wallet(Keypair.generate());
  return new anchor.AnchorProvider(
    new anchor.web3.Connection(RPC_URL),
    wallet,
    { commitment: 'confirmed' }
  );
};

/**
 * Fetches rewards for a specific mint and asset ID.
 * 
 * @async
 * @param {PublicKey} mint - The public key of the mint.
 * @param {PublicKey} assetId - The asset ID to fetch rewards for.
 * @returns {Promise<BigInt[]>} An array of reward amounts.
 */
const fetchRewardsForMint = async (mint, assetId) => {
  const dummyProvider = generateDummyWallet();
  const program = await init(dummyProvider);
  const lazyDistributorPkey = lazyDistributorKey(mint)[0];

  try {
    const accountInfo = await program.provider.connection.getAccountInfo(lazyDistributorPkey);
    if (!accountInfo) {
      console.log(`Lazy Distributor account for ${mint.toBase58()} does not exist.`);
      return [];
    }

    const rewards = await getCurrentRewards(program, lazyDistributorPkey, assetId);
    return rewards.map(reward => reward.currentRewards);
  } catch (error) {
    console.error(`Error fetching rewards for ${mint.toBase58()}:`, error);
    return [];
  }
};

/**
 * Retrieves metadata (asset_id and active status) and rewards for a specific hotspot.
 * 
 * @async
 * @param {string} hotspotId - The ID of the hotspot.
 * @returns {Promise<Object>} An object containing the asset ID, active status, and rewards for IoT and Mobile networks.
 * @throws {Error} If there's an error in processing the hotspot data or rewards.
 */
const getHotspotMetaDataAndRewards = async (hotspotId) => {
  try {
    const hotspotMetaData = await getHotspotMetaData(hotspotId);
    const assetId = new PublicKey(hotspotMetaData.asset_id);

    const rewardsPromises = Object.entries(MINTS).map(async ([name, mint]) => {
      const rewards = await fetchRewardsForMint(mint, assetId);
      return [name.toLowerCase(), rewards];
    });

    const rewardsResults = await Promise.all(rewardsPromises);

    return {
      assetId: assetId.toBase58(),
      isActive: hotspotMetaData.hotspot_infos.iot.is_active,
      rewards: Object.fromEntries(rewardsResults)
    };
  } catch (error) {
    console.error("Error in getHotspotMetaDataAndRewards:", error);
    throw error;
  }
};

module.exports = {
  getHotspotMetaDataAndRewards
};