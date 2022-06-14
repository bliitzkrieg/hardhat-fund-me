const { network } = require("hardhat");
const {
    networkConfig,
    developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = await network.config.chainId;

    let ethusdPriceFeedAddress;
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethusdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethusdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
    }
    console.log(ethusdPriceFeedAddress);
    const args = [ethusdPriceFeedAddress];
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args,
        log: true,
        waitConfirmation: network.config.blockConfirmations || 1,
    });

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args);
    }
    log("----------------------------------------------------");
};

module.exports.tags = ["all", "fundme"];
